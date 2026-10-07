import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, StatusBar, ScrollView } from 'react-native';

export default function App() {
  const [activeTab, setActiveTab] = useState('chats'); // 'chats' | 'market' | 'profile'
  const [userProfile, setUserProfile] = useState({
    number: '+880 412-9856',
    stars: 1000,
    premiumDays: 3
  });
  const [hasNumber, setHasNumber] = useState(true);

  // Функция покупки или получения номера (строго 1 раз)
  const handleGetNumber = (numType) => {
    if (hasNumber) {
      alert('⚠️ У вас уже есть активный номер. Разрешен только 1 объект на аккаунт!');
      return;
    }
    setUserProfile(prev => ({ ...prev, number: numType }));
    setHasNumber(true);
    alert(`🎉 Успешно получено: ${numType}!`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#17212b" />
      
      {/* Шапка в стиле Telegram */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          {activeTab === 'chats' && 'Gumblegram Чаты'}
          {activeTab === 'market' && 'Маркет номеров'}
          {activeTab === 'profile' && 'Профиль Gumblegram'}
        </Text>
        <View style={styles.balanceBadge}>
          <Text style={styles.balanceText}>⭐ {userProfile.stars} XTR</Text>
        </View>
      </View>

      {/* Основной контент в зависимости от вкладки */}
      <View style={styles.content}>
        {activeTab === 'chats' && (
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.chatItem}>
              <View style={styles.avatar}><Text style={styles.avatarText}>G</Text></View>
              <View style={styles.chatInfo}>
                <View style={styles.chatHeaderRow}>
                  <Text style={styles.chatName}>Gumblegram Bot</Text>
                  <Text style={styles.chatTime}>06:50</Text>
                </View>
                <Text style={styles.chatMessage} numberOfLines={1}>
                  🎉 Вам выдан номер {userProfile.number}. Добро пожаловать!
                </Text>
              </View>
            </View>

            <View style={styles.chatItem}>
              <View style={[styles.avatar, { backgroundColor: '#2b5278' }]}><Text style={styles.avatarText}>S</Text></View>
              <View style={styles.chatInfo}>
                <View style={styles.chatHeaderRow}>
                  <Text style={styles.chatName}>Служба поддержки</Text>
                  <Text style={styles.chatTime}>Вчера</Text>
                </View>
                <Text style={styles.chatMessage} numberOfLines={1}>Ваш бонус 1000 звезд и премиум успешно активны.</Text>
              </View>
            </View>
          </ScrollView>
        )}

        {activeTab === 'market' && (
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <Text style={styles.sectionTitle}>📱 Виртуальные номера и NFT</Text>
            <Text style={styles.sectionDesc}>Строго 1 бесплатный номер или покупка на аккаунт.</Text>

            <TouchableOpacity 
              style={[styles.marketCard, hasNumber && styles.disabledCard]} 
              onPress={() => handleGetNumber('+880 777-1234')}
            >
              <Text style={styles.cardTitle}>🎁 Бесплатный номер +880</Text>
              <Text style={styles.cardPrice}>Бесплатно (1 раз)</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.marketCard, hasNumber && styles.disabledCard]} 
              onPress={() => handleGetNumber('+228 999-5678')}
            >
              <Text style={styles.cardTitle}>🎁 Бесплатный номер +228</Text>
              <Text style={styles.cardPrice}>Бесплатно (1 раз)</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.marketCard} onPress={() => alert('Переход к оплате 50 звёзд через Telegram Stars')}>
              <Text style={styles.cardTitle}>📞 Премиум номер +888 (Длинный)</Text>
              <Text style={styles.cardPrice}>50 ⭐️</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.marketCard} onPress={() => alert('Переход к оплате 25 звёзд')}>
              <Text style={styles.cardTitle}>🌐 NFT Юзернейм</Text>
              <Text style={styles.cardPrice}>25 ⭐️</Text>
            </TouchableOpacity>
          </ScrollView>
        )}

        {activeTab === 'profile' && (
          <View style={styles.profileContainer}>
            <View style={styles.profileAvatar}><Text style={styles.profileAvatarText}>M</Text></View>
            <Text style={styles.profileName}>Gumblegram User</Text>
            <Text style={styles.profilePhone}>{userProfile.number}</Text>

            <View style={styles.infoBox}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Баланс звёзд:</Text>
                <Text style={styles.infoValue}>⭐ {userProfile.stars} XTR</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Премиум-статус:</Text>
                <Text style={styles.infoValue}>👑 Активен ({userProfile.premiumDays} дня)</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Активный объект:</Text>
                <Text style={styles.infoValue}>{userProfile.number}</Text>
              </View>
            </View>
          </View>
        )}
      </View>

      {/* Нижняя навигация в стиле Telegram */}
      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tabItem} onPress={() => setActiveTab('chats')}>
          <Text style={[styles.tabText, activeTab === 'chats' && styles.activeTabText]}>💬 Чаты</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => setActiveTab('market')}>
          <Text style={[styles.tabText, activeTab === 'market' && styles.activeTabText]}>📱 Номера</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => setActiveTab('profile')}>
          <Text style={[styles.tabText, activeTab === 'profile' && styles.activeTabText]}>👤 Профиль</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0e1621' },
  header: { height: 56, backgroundColor: '#17212b', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#0f141b' },
  headerTitle: { color: '#ffffff', fontSize: 18, fontWeight: 'bold' },
  balanceBadge: { backgroundColor: '#2b5278', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  balanceText: { color: '#ffffff', fontWeight: 'bold', fontSize: 13 },
  content: { flex: 1 },
  scrollContent: { padding: 10 },
  chatItem: { flexDirection: 'row', padding: 12, backgroundColor: '#17212b', borderRadius: 10, marginBottom: 8, alignItems: 'center' },
  avatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#4ea4f3', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  avatarText: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  chatInfo: { flex: 1 },
  chatHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  chatName: { color: '#ffffff', fontSize: 16, fontWeight: 'bold' },
  chatTime: { color: '#7f91a4', fontSize: 12 },
  chatMessage: { color: '#7f91a4', fontSize: 14 },
  sectionTitle: { color: '#ffffff', fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
  sectionDesc: { color: '#7f91a4', fontSize: 13, marginBottom: 15 },
  marketCard: { backgroundColor: '#17212b', padding: 16, borderRadius: 12, marginBottom: 10, borderWidth: 1, borderColor: '#2b5278' },
  disabledCard: { opacity: 0.5 },
  cardTitle: { color: '#ffffff', fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  cardPrice: { color: '#4ea4f3', fontSize: 14, fontWeight: 'bold' },
  profileContainer: { alignItems: 'center', padding: 20 },
  profileAvatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#4ea4f3', justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  profileAvatarText: { color: '#fff', fontSize: 36, fontWeight: 'bold' },
  profileName: { color: '#ffffff', fontSize: 22, fontWeight: 'bold', marginBottom: 5 },
  profilePhone: { color: '#7f91a4', fontSize: 16, marginBottom: 20 },
  infoBox: { width: '100%', backgroundColor: '#17212b', borderRadius: 12, padding: 15, borderWidth: 1, borderColor: '#2b5278' },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#0f141b' },
  infoLabel: { color: '#7f91a4', fontSize: 14 },
  infoValue: { color: '#ffffff', fontSize: 14, fontWeight: 'bold' },
  tabBar: { height: 60, backgroundColor: '#17212b', flexDirection: 'row', borderTopWidth: 1, borderTopColor: '#0f141b' },
  tabItem: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  tabText: { color: '#7f91a4', fontSize: 12, fontWeight: '600' },
  activeTabText: { color: '#4ea4f3' }
});
