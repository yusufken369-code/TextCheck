import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
  StatusBar,
  Modal
} from 'react-native';
import {
  GlobeIcon,
  QonunNavIcon,
  LockIcon,
  ChevronRightIcon,
  BackArrowIcon,
  UserIcon,
  CheckmarkIcon
} from '../components/Icons';
import { useLanguage } from '../context/LanguageContext';

export default function SettingsScreen({
  onNavigateToPrivacy,
  onNavigateToAuth,
  onNavigateToLanguageSelect,
  onGoBack
}) {
  const { language, setLanguage, t } = useLanguage();
  const [showLanguageModal, setShowLanguageModal] = useState(false);

  const getLanguageLabel = () => {
    switch (language) {
      case 'ru': return 'Русский язык (🇷🇺)';
      case 'en': return 'English (🇬🇧)';
      default: return 'O‘zbek tili (🇺🇿)';
    }
  };

  const handleSelectLangInModal = (langId) => {
    setLanguage(langId);
    setShowLanguageModal(false);
  };

  const handleDatabaseUpdatePress = () => {
    Alert.alert(t('lawDbTitle'), t('lawDbSub'));
  };

  const handleGuidePress = () => {
    Alert.alert(t('helpGuideTitle'), '1. Android Sozlamalar -> Tillar va kiritish\n2. Virtual klaviatura menyusini tanlang\n3. "Huquqiy Keyboard"ni yoqing.');
  };

  const handleAboutPress = () => {
    Alert.alert(t('aboutAppTitle'), 'Huquqiy Keyboard v1.0.0\nLexUZ rasmiy bazasi asosida ishlaydi.');
  };

  const statusBarHeight = Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 24 : 16;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F2744" translucent />
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
        <Text style={styles.screenTitle}>{t('settingsTitle')}</Text>
      </View>

      {/* Main Content Card Frame */}
      <View style={styles.cardFrame}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Account option: Kirish / Ro'yxatdan o'tish */}
          <TouchableOpacity style={styles.settingRow} onPress={onNavigateToAuth} activeOpacity={0.7}>
            <View style={styles.rowIconWrapper}>
              <UserIcon size={18} color="#1976F3" />
            </View>
            <View style={styles.rowTextCol}>
              <Text style={styles.rowTitle}>{t('accountLoginTitle')}</Text>
              <Text style={styles.rowSub}>{t('accountLoginSub')}</Text>
            </View>
            <ChevronRightIcon size={18} color="#98A2B3" />
          </TouchableOpacity>

          {/* Option 1: Til */}
          <TouchableOpacity
            style={styles.settingRow}
            onPress={() => setShowLanguageModal(true)}
            activeOpacity={0.7}
          >
            <View style={styles.rowIconWrapper}>
              <GlobeIcon size={18} color="#1976F3" />
            </View>
            <View style={styles.rowTextCol}>
              <Text style={styles.rowTitle}>{t('languageSettingTitle')}</Text>
              <Text style={styles.rowSub}>{getLanguageLabel()}</Text>
            </View>
            <ChevronRightIcon size={18} color="#98A2B3" />
          </TouchableOpacity>

          {/* Option 2: Qonunlar bazasi */}
          <TouchableOpacity style={styles.settingRow} onPress={handleDatabaseUpdatePress} activeOpacity={0.7}>
            <View style={styles.rowIconWrapper}>
              <QonunNavIcon size={18} color="#667085" />
            </View>
            <View style={styles.rowTextCol}>
              <Text style={styles.rowTitle}>{t('lawDbTitle')}</Text>
              <Text style={styles.rowSub}>{t('lawDbSub')}</Text>
            </View>
            <ChevronRightIcon size={18} color="#98A2B3" />
          </TouchableOpacity>

          {/* Option 3: Yordam va qo'llanma */}
          <TouchableOpacity style={styles.settingRow} onPress={handleGuidePress} activeOpacity={0.7}>
            <View style={styles.rowIconWrapper}>
              <Text style={{ fontSize: 14, color: '#667085', fontWeight: 'bold' }}>?</Text>
            </View>
            <View style={styles.rowTextCol}>
              <Text style={styles.rowTitle}>{t('helpGuideTitle')}</Text>
            </View>
            <ChevronRightIcon size={18} color="#98A2B3" />
          </TouchableOpacity>

          {/* Option 4: Maxfiylik siyosati */}
          <TouchableOpacity style={styles.settingRow} onPress={onNavigateToPrivacy} activeOpacity={0.7}>
            <View style={styles.rowIconWrapper}>
              <LockIcon size={18} color="#667085" />
            </View>
            <View style={styles.rowTextCol}>
              <Text style={styles.rowTitle}>{t('privacyPolicyTitle')}</Text>
            </View>
            <ChevronRightIcon size={18} color="#98A2B3" />
          </TouchableOpacity>

          {/* Option 5: Ilova haqida */}
          <TouchableOpacity style={styles.settingRow} onPress={handleAboutPress} activeOpacity={0.7}>
            <View style={styles.rowIconWrapper}>
              <Text style={{ fontSize: 14, color: '#667085', fontWeight: 'bold' }}>i</Text>
            </View>
            <View style={styles.rowTextCol}>
              <Text style={styles.rowTitle}>{t('aboutAppTitle')}</Text>
            </View>
            <ChevronRightIcon size={18} color="#98A2B3" />
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Language Switcher Modal */}
      <Modal
        visible={showLanguageModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowLanguageModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowLanguageModal(false)}
        >
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>{t('selectLanguageTitle')}</Text>
            
            <TouchableOpacity
              style={[styles.langModalOption, language === 'uz' && styles.langModalOptionSelected]}
              onPress={() => handleSelectLangInModal('uz')}
            >
              <Text style={styles.flagEmoji}>🇺🇿</Text>
              <Text style={styles.langModalText}>O‘zbek tili</Text>
              {language === 'uz' && <CheckmarkIcon size={16} color="#1976F3" />}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.langModalOption, language === 'ru' && styles.langModalOptionSelected]}
              onPress={() => handleSelectLangInModal('ru')}
            >
              <Text style={styles.flagEmoji}>🇷🇺</Text>
              <Text style={styles.langModalText}>Русский язык</Text>
              {language === 'ru' && <CheckmarkIcon size={16} color="#1976F3" />}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.langModalOption, language === 'en' && styles.langModalOptionSelected]}
              onPress={() => handleSelectLangInModal('en')}
            >
              <Text style={styles.flagEmoji}>🇬🇧</Text>
              <Text style={styles.langModalText}>English</Text>
              {language === 'en' && <CheckmarkIcon size={16} color="#1976F3" />}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.closeModalBtn}
              onPress={() => setShowLanguageModal(false)}
            >
              <Text style={styles.closeModalText}>OK</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
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
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 8,
    marginLeft: 4
  },
  settingCard: {
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
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2
  },
  settingIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14
  },
  settingContent: {
    flex: 1,
    marginRight: 8
  },
  settingTitle: {
    color: '#0F172A',
    fontSize: 14.5,
    fontWeight: '600'
  },
  settingSubtitle: {
    color: '#64748B',
    fontSize: 12,
    marginTop: 2
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(7, 20, 38, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  modalContent: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#0B1728',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#1E3A5F',
    padding: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10
  },
  modalTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center'
  },
  langOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0F1E33',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#1E3A5F'
  },
  langOptionActive: {
    borderColor: '#2563EB',
    backgroundColor: '#0F274D'
  },
  langOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  flagEmoji: {
    fontSize: 20,
    marginRight: 10
  },
  langOptionText: {
    color: '#CBD5E1',
    fontSize: 14.5,
    fontWeight: '600'
  },
  langOptionTextActive: {
    color: '#FFFFFF',
    fontWeight: '700'
  },
  modalCloseBtn: {
    marginTop: 10,
    backgroundColor: '#2563EB',
    borderRadius: 12,
    height: 46,
    alignItems: 'center',
    justifyContent: 'center'
  },
  modalCloseBtnText: {
    color: '#FFFFFF',
    fontSize: 14.5,
    fontWeight: '700'
  },
  settingRow: {
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
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2
  },
  rowIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14
  },
  rowTextCol: {
    flex: 1,
    marginRight: 8
  },
  rowTitle: {
    color: '#0F172A',
    fontSize: 14.5,
    fontWeight: '600'
  },
  rowSub: {
    color: '#64748B',
    fontSize: 12,
    marginTop: 2
  },
  modalContainer: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#0B1728',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#1E3A5F',
    padding: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10
  },
  langModalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0F1E33',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#1E3A5F'
  },
  langModalOptionSelected: {
    borderColor: '#2563EB',
    backgroundColor: '#0F274D'
  },
  langModalText: {
    color: '#CBD5E1',
    fontSize: 14.5,
    fontWeight: '600'
  },
  closeModalBtn: {
    marginTop: 10,
    backgroundColor: '#2563EB',
    borderRadius: 12,
    height: 46,
    alignItems: 'center',
    justifyContent: 'center'
  },
  closeModalText: {
    color: '#FFFFFF',
    fontSize: 14.5,
    fontWeight: '700'
  }
});
