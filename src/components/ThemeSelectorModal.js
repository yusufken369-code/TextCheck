import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  NativeModules,
  Dimensions
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ShieldIcon, BookIcon, SettingsIcon, CheckmarkIcon } from './Icons';
import { useLanguage } from '../context/LanguageContext';

const { width } = Dimensions.get('window');
const THEME_STORAGE_KEY = 'selected_keyboard_theme';

export const THEMES = [
  {
    id: 'dark',
    titleKey: 'themeDarkTitle',
    title: '1. Zamonaviy (Dark)',
    bgStyle: { backgroundColor: '#111827' },
    keyboardBg: '#161F2E',
    topBarBg: '#1E293B',
    searchBg: 'rgba(255, 255, 255, 0.08)',
    searchTextColor: '#94A3B8',
    keyBg: '#233044',
    keyTextColor: '#FFFFFF',
    specialKeyBg: '#1A2433',
    actionKeyBg: '#0066FF',
    actionTextColor: '#FFFFFF',
    borderColor: 'rgba(0, 102, 255, 0.3)'
  },
  {
    id: 'light',
    titleKey: 'themeLightTitle',
    title: '2. Minimal (Light)',
    bgStyle: { backgroundColor: '#E4EEF8' },
    keyboardBg: '#EDF4FC',
    topBarBg: '#DBE7F5',
    searchBg: '#FFFFFF',
    searchTextColor: '#64748B',
    keyBg: '#FFFFFF',
    keyTextColor: '#1E293B',
    specialKeyBg: '#C5DCFA',
    actionKeyBg: '#0066FF',
    actionTextColor: '#FFFFFF',
    borderColor: 'rgba(255, 255, 255, 0.8)'
  },
  {
    id: 'gradient',
    titleKey: 'themeGradientTitle',
    title: '3. Gradient (Premium)',
    bgStyle: { backgroundColor: '#311054' },
    keyboardBg: '#4A1C80',
    topBarBg: 'rgba(255, 255, 255, 0.12)',
    searchBg: 'rgba(255, 255, 255, 0.18)',
    searchTextColor: '#E9D5FF',
    keyBg: 'rgba(255, 255, 255, 0.22)',
    keyTextColor: '#FFFFFF',
    specialKeyBg: 'rgba(255, 255, 255, 0.15)',
    actionKeyBg: '#9333EA',
    actionTextColor: '#FFFFFF',
    borderColor: '#C084FC'
  },
  {
    id: 'law',
    titleKey: 'themeLawTitle',
    title: '4. Premium (Law Style)',
    bgStyle: { backgroundColor: '#1C130E' },
    keyboardBg: '#2B1C13',
    topBarBg: '#20150E',
    searchBg: 'rgba(234, 179, 8, 0.12)',
    searchTextColor: '#FDE68A',
    keyBg: '#3D2A1D',
    keyTextColor: '#FDE68A',
    specialKeyBg: '#271910',
    actionKeyBg: '#D97706',
    actionTextColor: '#FFFFFF',
    borderColor: '#D97706'
  }
];

export default function ThemeSelectorModal({ visible, onClose, onSelectTheme }) {
  const { t, language } = useLanguage();
  const [activeTheme, setActiveTheme] = useState('dark');

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const storedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (storedTheme) {
        setActiveTheme(storedTheme);
      } else if (NativeModules.KeyboardSettingsModule?.getTheme) {
        const nativeTheme = await NativeModules.KeyboardSettingsModule.getTheme();
        if (nativeTheme) setActiveTheme(nativeTheme);
      }
    } catch (e) {
      console.log('Error loading theme:', e);
    }
  };

  const handleSelect = async (themeId) => {
    setActiveTheme(themeId);
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, themeId);
      if (NativeModules.KeyboardSettingsModule?.saveTheme) {
        NativeModules.KeyboardSettingsModule.saveTheme(themeId);
      }
    } catch (e) {
      console.log('Error saving theme:', e);
    }
    if (onSelectTheme) onSelectTheme(themeId);
  };

  const spacebarLabel = language === 'ru' ? 'Русский' : (language === 'en' ? 'English' : 'O‘zbekcha');

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.logoBadge}>
              <ShieldIcon size={18} color="#2563EB" />
            </View>
            <View>
              <Text style={styles.headerTitle}>Huquqiy Keyboard</Text>
              <Text style={styles.headerSub}>{t('themeModalHeaderSub')}</Text>
            </View>
          </View>
          <Text style={styles.headerRightText}>{t('themeModalHeaderRight')}</Text>
        </View>

        {/* Modal Section Title */}
        <View style={styles.sectionBanner}>
          <Text style={styles.sectionTitle}>{t('themeModalTitle')}</Text>
          <Text style={styles.sectionSubtitle}>
            {t('themeModalSubtitle')}
          </Text>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollList}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.gridContainer}>
            {THEMES.map((theme) => {
              const isSelected = activeTheme === theme.id;
              return (
                <TouchableOpacity
                  key={theme.id}
                  style={[
                    styles.themeCard,
                    isSelected && { borderColor: '#2563EB', borderWidth: 2.5 }
                  ]}
                  activeOpacity={0.9}
                  onPress={() => handleSelect(theme.id)}
                >
                  {/* Selected Indicator Badge */}
                  {isSelected && (
                    <View style={styles.selectedBadge}>
                      <CheckmarkIcon size={12} color="#FFFFFF" />
                      <Text style={styles.selectedBadgeText}>{t('themeSelectedBadge')}</Text>
                    </View>
                  )}

                  {/* Keyboard Mockup Preview matching 1:1 */}
                  <View style={[styles.mockupContainer, theme.bgStyle]}>
                    <View style={[styles.keyboardFrame, { backgroundColor: theme.keyboardBg, borderColor: theme.borderColor }]}>
                      
                      {/* Keyboard Top Toolbar */}
                      <View style={[styles.keyboardTopBar, { backgroundColor: theme.topBarBg }]}>
                        <View style={styles.topBarLeft}>
                          <ShieldIcon size={12} color={theme.id === 'law' ? '#D97706' : (theme.id === 'light' ? '#0066FF' : '#60A5FA')} />
                          <View style={[styles.searchInputMock, { backgroundColor: theme.searchBg }]}>
                            <Text style={[styles.searchTextMock, { color: theme.searchTextColor }]} numberOfLines={1}>
                              {t('themeMockInputPlaceholder')}
                            </Text>
                          </View>
                        </View>
                        <View style={styles.topBarRightIcons}>
                          <Text style={{ fontSize: 10 }}>📖</Text>
                          <Text style={{ fontSize: 10, marginHorizontal: 3 }}>🛡️</Text>
                          <Text style={{ fontSize: 10 }}>⚙️</Text>
                        </View>
                      </View>

                      {/* Row 1 Keys */}
                      <View style={styles.previewRow}>
                        {['Q','W','E','R','T','Y','U','I','O','P','Ğ','Ü'].map((k) => (
                          <View key={k} style={[styles.miniKey, { backgroundColor: theme.keyBg }]}>
                            <Text style={[styles.miniKeyText, { color: theme.keyTextColor }]}>{k}</Text>
                          </View>
                        ))}
                      </View>

                      {/* Row 2 Keys */}
                      <View style={styles.previewRow}>
                        {['A','S','D','F','G','H','J','K','L','Ş','İ'].map((k) => (
                          <View key={k} style={[styles.miniKey, { backgroundColor: theme.keyBg }]}>
                            <Text style={[styles.miniKeyText, { color: theme.keyTextColor }]}>{k}</Text>
                          </View>
                        ))}
                      </View>

                      {/* Row 3 Keys */}
                      <View style={styles.previewRow}>
                        <View style={[styles.miniKey, styles.miniKeySpecial, { backgroundColor: theme.specialKeyBg }]}>
                          <Text style={[styles.miniKeyText, { color: theme.keyTextColor }]}>⇧</Text>
                        </View>
                        {['Z','X','C','V','B','N','M','Ç','Ö'].map((k) => (
                          <View key={k} style={[styles.miniKey, { backgroundColor: theme.keyBg }]}>
                            <Text style={[styles.miniKeyText, { color: theme.keyTextColor }]}>{k}</Text>
                          </View>
                        ))}
                        <View style={[styles.miniKey, styles.miniKeySpecial, { backgroundColor: theme.specialKeyBg }]}>
                          <Text style={[styles.miniKeyText, { color: theme.keyTextColor }]}>⌫</Text>
                        </View>
                      </View>

                      {/* Row 4 Bottom Keys */}
                      <View style={styles.previewRow}>
                        <View style={[styles.miniKey, styles.miniKeyNum, { backgroundColor: theme.specialKeyBg }]}>
                          <Text style={[styles.miniKeyText, { color: theme.keyTextColor }]}>123</Text>
                        </View>
                        <View style={[styles.miniKey, styles.miniKeyNum, { backgroundColor: theme.specialKeyBg }]}>
                          <Text style={{ fontSize: 8 }}>😁</Text>
                        </View>
                        <View style={[styles.miniKey, styles.miniKeySpace, { backgroundColor: theme.keyBg }]}>
                          <Text style={[styles.miniKeyText, { color: theme.keyTextColor, fontSize: 7 }]}>{spacebarLabel}</Text>
                        </View>
                        <View style={[styles.miniKey, { backgroundColor: theme.keyBg }]}>
                          <Text style={[styles.miniKeyText, { color: theme.keyTextColor }]}>.</Text>
                        </View>
                        <View style={[styles.miniKey, styles.miniKeyEnter, { backgroundColor: theme.actionKeyBg }]}>
                          <Text style={[styles.miniKeyText, { color: theme.actionTextColor }]}>↵</Text>
                        </View>
                      </View>

                    </View>
                  </View>

                  {/* Title Label Below Preview */}
                  <View style={styles.cardFooter}>
                    <Text style={[styles.cardTitle, isSelected && { color: '#2563EB', fontWeight: '800' }]}>
                      {t(theme.titleKey) || theme.title}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>

        {/* Bottom Close Button */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={onClose}
            activeOpacity={0.85}
          >
            <Text style={styles.closeBtnText}>{t('themeCloseBtn')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B1728'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B'
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  logoBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(37, 99, 235, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800'
  },
  headerSub: {
    color: '#94A3B8',
    fontSize: 11
  },
  headerRightText: {
    color: '#64748B',
    fontSize: 11,
    fontWeight: '600'
  },
  sectionBanner: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#0F1E33',
    borderBottomWidth: 1,
    borderBottomColor: '#1E3A5F'
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 4
  },
  sectionSubtitle: {
    color: '#94A3B8',
    fontSize: 12.5
  },
  scrollList: {
    padding: 14,
    paddingBottom: 30
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  themeCard: {
    width: (width - 40) / 2,
    backgroundColor: '#0F1E33',
    borderRadius: 14,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#1E3A5F',
    position: 'relative'
  },
  selectedBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 10,
    backgroundColor: '#2563EB',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10
  },
  selectedBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
    marginLeft: 4
  },
  mockupContainer: {
    height: 125,
    padding: 6,
    justifyContent: 'center',
    alignItems: 'center'
  },
  keyboardFrame: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
    padding: 4,
    borderWidth: 1,
    justifyContent: 'space-between'
  },
  keyboardTopBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 6,
    paddingHorizontal: 4,
    paddingVertical: 2,
    marginBottom: 3
  },
  topBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },
  searchInputMock: {
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 2,
    marginLeft: 4,
    flex: 1
  },
  searchTextMock: {
    fontSize: 7.5,
    fontWeight: '600'
  },
  topBarRightIcons: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  previewRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 1
  },
  miniKey: {
    flex: 1,
    height: 16,
    marginHorizontal: 1,
    borderRadius: 3,
    alignItems: 'center',
    justifyContent: 'center'
  },
  miniKeySpecial: {
    flex: 1.2
  },
  miniKeyNum: {
    flex: 1.2
  },
  miniKeySpace: {
    flex: 4
  },
  miniKeyEnter: {
    flex: 1.4
  },
  miniKeyText: {
    fontSize: 7.5,
    fontWeight: '700'
  },
  cardFooter: {
    padding: 10,
    backgroundColor: '#0B1728',
    alignItems: 'center'
  },
  cardTitle: {
    color: '#CBD5E1',
    fontSize: 12.5,
    fontWeight: '700'
  },
  footer: {
    padding: 14,
    backgroundColor: '#0F1E33',
    borderTopWidth: 1,
    borderTopColor: '#1E3A5F'
  },
  closeBtn: {
    backgroundColor: '#2563EB',
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center'
  },
  closeBtnText: {
    color: '#FFFFFF',
    fontSize: 14.5,
    fontWeight: '800'
  }
});
