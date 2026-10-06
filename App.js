import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, StatusBar, Alert } from 'react-native';

export default function App() {
  const [isLogin, setIsLogin] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);

  // Демо-данные профиля после входа (в будущем связываются с Supabase)
  const [userProfile, setUserProfile] = useState({
    number: '+880 412-9856',
    stars: 1000,
    premiumDays: 3
  });

  const handleAuth = () => {
    if (!username || !password) {
      Alert.alert('Ошибка', 'Заполните все поля!');
      return;
    }
    setLoggedIn(true);
  };

  if (loggedIn) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
        <View style={styles.header}>
          <Text style={styles.brand}>Gumblegram</Text>
          <Text style={styles.subtitle}>Экосистема премиум номеров</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>👤 Ваш профиль</Text>
          <Text style={styles.infoText}>📱 Номер: <Text style={styles.highlight}>{userProfile.number}</Text></Text>
          <Text style={styles.infoText}>⭐ Баланс звёзд: <Text style={styles.highlight}>{userProfile.stars} XTR</Text></Text>
          <Text style={styles.infoText}>👑 Премиум активен: <Text style={styles.highlight}>{userProfile.premiumDays} дня</Text></Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>🎁 Бонусы системы</Text>
          <Text style={styles.descText}>Вам начислено 1000 звезд и премиум-статус за регистрацию в Gumblegram.</Text>
        </View>

        <TouchableOpacity style={styles.buttonOut} onPress={() => setLoggedIn(false)}>
          <Text style={styles.buttonText}>Выйти из аккаунта</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
      <View style={styles.authContainer}>
        <Text style={styles.logo}>Gumblegram</Text>
        <Text style={styles.tagline}>Виртуальные номера и премиум статусы</Text>

        <TextInput
          style={styles.input}
          placeholder="Имя пользователя"
          placeholderTextColor="#64748b"
          value={username}
          onChangeText={setUsername}
        />
        
        {!isLogin && (
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#64748b"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
        )}

        <TextInput
          style={styles.input}
          placeholder="Пароль"
          placeholderTextColor="#64748b"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.button} onPress={handleAuth}>
          <Text style={styles.buttonText}>{isLogin ? 'Войти' : 'Зарегистрироваться'}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setIsLogin(!isLogin)} style={styles.switchBtn}>
          <Text style={styles.switchText}>
            {isLogin ? 'Нет аккаунта? Зарегистрироваться' : 'Уже есть аккаунт? Войти'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a', padding: 20 },
  authContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%' },
  logo: { fontSize: 32, fontWeight: 'bold', color: '#38bdf8', marginBottom: 5 },
  tagline: { fontSize: 14, color: '#94a3b8', marginBottom: 30, textAlign: 'center' },
  header: { alignItems: 'center', marginVertical: 20 },
  brand: { fontSize: 26, fontWeight: 'bold', color: '#38bdf8' },
  subtitle: { fontSize: 12, color: '#64748b' },
  input: { width: '100%', height: 50, backgroundColor: '#1e293b', borderRadius: 10, paddingHorizontal: 15, color: '#fff', marginBottom: 15, borderWidth: 1, borderColor: '#334155' },
  button: { width: '100%', height: 50, backgroundColor: '#0ea5e9', justifyContent: 'center', alignItems: 'center', borderRadius: 10, marginTop: 10 },
  buttonOut: { width: '100%', height: 50, backgroundColor: '#ef4444', justifyContent: 'center', alignItems: 'center', borderRadius: 10, marginTop: 'auto' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  switchBtn: { marginTop: 20 },
  switchText: { color: '#38bdf8', fontSize: 14 },
  card: { backgroundColor: '#1e293b', borderRadius: 12, padding: 20, marginBottom: 15, borderWidth: 1, borderColor: '#334155', width: '100%' },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#f8fafc', marginBottom: 10 },
  infoText: { fontSize: 16, color: '#cbd5e1', marginVertical: 4 },
  highlight: { color: '#38bdf8', fontWeight: 'bold' },
  descText: { fontSize: 14, color: '#94a3b8', lineHeight: 20 }
});
