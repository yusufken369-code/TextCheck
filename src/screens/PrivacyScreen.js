import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Platform, StatusBar } from 'react-native';
import { LockIcon, CheckmarkIcon, BackArrowIcon } from '../components/Icons';
import { useLanguage } from '../context/LanguageContext';

export default function PrivacyScreen({ onGoBack }) {
  const { t } = useLanguage();

  const statusBarHeight = Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 12 : 12;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0B1728" translucent />
      {/* Top Header */}
      <View style={[styles.topBar, { paddingTop: statusBarHeight }]}>
        <TouchableOpacity
          onPress={onGoBack}
          style={styles.backBtn}
          activeOpacity={0.7}
          hitSlop={{ top: 14, bottom: 14, left: 14, right: 14 }}
        >
          <BackArrowIcon size={20} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.screenTitle}>{t('privacyTitle')}</Text>
      </View>

      {/* Main Container */}
      <View style={styles.cardFrame}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Top Badge Card */}
          <View style={styles.heroSecurityCard}>
            <View style={styles.lockIconCircle}>
              <LockIcon size={28} color="#2563EB" />
            </View>
            <Text style={styles.heroTitle}>{t('privacyDescHeader')}</Text>
            <Text style={styles.heroDesc}>
              {t('privacyDescBody')}
            </Text>
          </View>

          <Text style={styles.sectionTitle}>Maxfiylik Tamoyillari</Text>

          {/* Key Principles Checklist */}
          <View style={styles.principleCard}>
            <View style={styles.checkCircle}>
              <CheckmarkIcon size={14} color="#2563EB" />
            </View>
            <View style={styles.principleTextCol}>
              <Text style={styles.principleTitle}>100% Offline Ishlash</Text>
              <Text style={styles.principleDesc}>
                Tizimda harflar va yozilgan so'zlar serverga yuborilmaydi
              </Text>
            </View>
          </View>

          <View style={styles.principleCard}>
            <View style={styles.checkCircle}>
              <CheckmarkIcon size={14} color="#2563EB" />
            </View>
            <View style={styles.principleTextCol}>
              <Text style={styles.principleTitle}>Avtomatik Himoya</Text>
              <Text style={styles.principleDesc}>
                Maxfiy parollar va shaxsiy kartalar kiritilganda klaviatura avtomatik tahlildan to'xtaydi
              </Text>
            </View>
          </View>

          <View style={styles.principleCard}>
            <View style={styles.checkCircle}>
              <CheckmarkIcon size={14} color="#2563EB" />
            </View>
            <View style={styles.principleTextCol}>
              <Text style={styles.principleTitle}>Rasmiy LexUZ Baza</Text>
              <Text style={styles.principleDesc}>
                Faqat rasmiy LexUZ bazasidagi O'zbekiston Respublikasi moddalari asosida ogohlantirish beradi
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B1728'
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingBottom: 16,
    backgroundColor: '#0B1728'
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12
  },
  screenTitle: {
    color: '#FFFFFF',
    fontSize: 19,
    fontWeight: '700',
    letterSpacing: -0.2
  },
  cardFrame: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 18,
    paddingHorizontal: 16
  },
  scrollContent: {
    paddingBottom: 110
  },
  heroSecurityCard: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2
  },
  lockIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12
  },
  heroTitle: {
    color: '#0F172A',
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 6,
    textAlign: 'center',
    letterSpacing: -0.2
  },
  heroDesc: {
    color: '#64748B',
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center'
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 10,
    marginLeft: 4
  },
  principleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1
  },
  checkCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12
  },
  principleTextCol: {
    flex: 1
  },
  principleTitle: {
    color: '#0F172A',
    fontSize: 14,
    fontWeight: '700'
  },
  principleDesc: {
    color: '#64748B',
    fontSize: 12,
    marginTop: 2,
    lineHeight: 17
  }
});
