import 'react-native-url-polyfill/auto';
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, StatusBar, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://rbgzwffnbhuerifngyvo.supabase.co';
const SUPABASE_KEY = 'sb_publishable_kEX-Fd-AcRuOsK-uCH7EeQ_RzY4QU66';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { storage: AsyncStorage, autoRefreshToken: true, persistSession: true, detectSessionInUrl: false },
});

const uuid = () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
  const r = (Math.random() * 16) | 0;
  return (c === 'x' ? r : (r & 3) | 8).toString(16);
});

export default function App() {
  const [session, setSession] = useState(null);
  const [ready, setReady] = useState(false);
  const [banned, setBanned] = useState(false);
  const [chat, setChat] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => { setSession(data.session); setReady(true); });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) return;
    supabase.from('profiles').select('is_banned').eq('id', session.user.id).single()
      .then(({ data }) => setBanned(!!data?.is_banned));
  }, [session]);

  if (!ready) return <View style={s.c} />;
  if (!session) return <Auth />;
  const me = session.user;
  if (banned) return (
    <View style={[s.c, s.center]}>
      <Text style={s.title}>Аккаунт заблокирован</Text>
      <Btn text="Выйти" onPress={() => supabase.auth.signOut()} />
    </View>
  );
  if (chat) return <Chat me={me} chat={chat} onBack={() => setChat(null)} />;
  return <Chats me={me} onOpen={setChat} />;
}

const Btn = ({ text, onPress }) => (
  <TouchableOpacity style={s.btn} onPress={onPress}><Text style={s.btnText}>{text}</Text></TouchableOpacity>
);

function Auth() {
  const [signup, setSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const go = async () => {
    const e = email.trim();
    if (signup) {
      const { error } = await supabase.auth.signUp({ email: e, password, options: { data: { username: username.trim() } } });
      if (error) Alert.alert('Ошибка', error.message);
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email: e, password });
      if (error) Alert.alert('Ошибка', error.message);
    }
  };
  return (
    <View style={[s.c, s.center]}>
      <Text style={s.title}>MyMessenger</Text>
      {signup && <TextInput style={s.input} placeholder="Имя пользователя" placeholderTextColor="#888" autoCapitalize="none" value={username} onChangeText={setUsername} />}
      <TextInput style={s.input} placeholder="Email" placeholderTextColor="#888" autoCapitalize="none" keyboardType="email-address" value={email} onChangeText={setEmail} />
      <TextInput style={s.input} placeholder="Пароль (от 6 символов)" placeholderTextColor="#888" secureTextEntry value={password} onChangeText={setPassword} />
      <Btn text={signup ? 'Зарегистрироваться' : 'Войти'} onPress={go} />
      <TouchableOpacity onPress={() => setSignup(!signup)}>
        <Text style={s.link}>{signup ? 'Уже есть аккаунт? Войти' : 'Нет аккаунта? Регистрация'}</Text>
      </TouchableOpacity>
    </View>
  );
}

function Chats({ me, onOpen }) {
  const [list, setList] = useState([]);
  const [uname, setUname] = useState('');
  const load = async () => {
    const { data } = await supabase.from('chat_members')
      .select('chats(id,title,is_group,chat_members(profiles(id,username)))')
      .eq('user_id', me.id);
    setList((data || []).map((r) => r.chats).filter(Boolean));
  };
  useEffect(() => { load(); }, []);
  const name = (c) => c.title || (c.chat_members || []).map((m) => m.profiles).filter((p) => p && p.id !== me.id).map((p) => p.username).join(', ') || 'Чат';
  const create = async () => {
    const u = uname.trim();
    if (!u) return;
    const { data: p } = await supabase.from('profiles').select('id').eq('username', u).maybeSingle();
    if (!p) return Alert.alert('Не найдено', 'Пользователь с таким именем не найден');
    const id = uuid();
    let r = await supabase.from('chats').insert({ id, created_by: me.id });
    if (!r.error) r = await supabase.from('chat_members').insert({ chat_id: id, user_id: me.id });
    if (!r.error) r = await supabase.from('chat_members').insert({ chat_id: id, user_id: p.id });
    if (r.error) return Alert.alert('Ошибка', r.error.message);
    setUname('');
    load();
  };
  return (
    <View style={s.c}>
      <View style={s.bar}>
        <Text style={s.barTitle}>Чаты</Text>
        <TouchableOpacity onPress={() => supabase.auth.signOut()}><Text style={s.link}>Выйти</Text></TouchableOpacity>
      </View>
      <View style={s.row}>
        <TextInput style={[s.input, { flex: 1, marginBottom: 0 }]} placeholder="Имя собеседника" placeholderTextColor="#888" autoCapitalize="none" value={uname} onChangeText={setUname} />
        <TouchableOpacity style={[s.btn, { marginTop: 0, marginLeft: 8 }]} onPress={create}><Text style={s.btnText}>+</Text></TouchableOpacity>
      </View>
      <FlatList data={list} keyExtractor={(c) => c.id} onRefresh={load} refreshing={false}
        ListEmptyComponent={<Text style={s.empty}>Чатов пока нет. Введите имя пользователя и нажмите +</Text>}
        renderItem={({ item }) => (
          <TouchableOpacity style={s.item} onPress={() => onOpen({ id: item.id, name: name(item) })}>
            <Text style={s.itemText}>{name(item)}</Text>
          </TouchableOpacity>
        )} />
    </View>
  );
}

function Chat({ me, chat, onBack }) {
  const [msgs, setMsgs] = useState([]);
  const [text, setText] = useState('');
  useEffect(() => {
    supabase.from('messages').select('*').eq('chat_id', chat.id)
      .order('created_at', { ascending: false }).limit(100)
      .then(({ data }) => setMsgs(data || []));
    const ch = supabase.channel('chat-' + chat.id)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: 'chat_id=eq.' + chat.id },
        (p) => setMsgs((m) => (m.some((x) => x.id === p.new.id) ? m : [p.new, ...m])))
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [chat.id]);
  const send = async () => {
    const t = text.trim();
    if (!t) return;
    setText('');
    const { error } = await supabase.from('messages').insert({ chat_id: chat.id, sender_id: me.id, content: t });
    if (error) Alert.alert('Ошибка', error.message);
  };
  return (
    <KeyboardAvoidingView style={s.c} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={s.bar}>
        <TouchableOpacity onPress={onBack}><Text style={s.link}>← Назад</Text></TouchableOpacity>
        <Text style={s.barTitle}>{chat.name}</Text>
        <View style={{ width: 60 }} />
      </View>
      <FlatList inverted data={msgs} keyExtractor={(m) => String(m.id)} contentContainerStyle={{ padding: 10 }}
        renderItem={({ item }) => (
          <View style={[s.msg, item.sender_id === me.id ? s.mine : s.theirs]}>
            <Text style={s.msgText}>{item.content}</Text>
          </View>
        )} />
      <View style={s.row}>
        <TextInput style={[s.input, { flex: 1, marginBottom: 0 }]} placeholder="Сообщение" placeholderTextColor="#888" value={text} onChangeText={setText} />
        <TouchableOpacity style={[s.btn, { marginTop: 0, marginLeft: 8 }]} onPress={send}><Text style={s.btnText}>➤</Text></TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  c: { flex: 1, backgroundColor: '#17212b', paddingTop: StatusBar.currentHeight || 40 },
  center: { justifyContent: 'center', padding: 24 },
  title: { color: '#fff', fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 24 },
  input: { backgroundColor: '#242f3d', color: '#fff', borderRadius: 10, padding: 12, marginBottom: 12 },
  btn: { backgroundColor: '#2b8fd9', borderRadius: 10, paddingVertical: 12, paddingHorizontal: 18, alignItems: 'center', marginTop: 4 },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  link: { color: '#6ab3f3', textAlign: 'center', marginTop: 14, fontSize: 15 },
  bar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 14, paddingBottom: 10 },
  barTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  row: { flexDirection: 'row', alignItems: 'center', padding: 10 },
  item: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#0e1621' },
  itemText: { color: '#fff', fontSize: 17 },
  empty: { color: '#888', textAlign: 'center', marginTop: 40, paddingHorizontal: 30 },
  msg: { maxWidth: '80%', padding: 10, borderRadius: 12, marginVertical: 3 },
  mine: { alignSelf: 'flex-end', backgroundColor: '#2b5278' },
  theirs: { alignSelf: 'flex-start', backgroundColor: '#182533' },
  msgText: { color: '#fff', fontSize: 16 },
});
