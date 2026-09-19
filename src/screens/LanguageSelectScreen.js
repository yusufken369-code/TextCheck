import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  ScrollView,
  Platform
} from 'react-native';
import { ShieldScalesLogo, CheckmarkIcon } from '../components/Icons';
import { useLanguage } from '../context/LanguageContext';

export default function LanguageSelectScreen({ onLanguageSelected }) {
  const { language, setLanguage, completeInitialLanguageSelect, t } = useLanguage();
  const [selectedLang, setSelectedLang] = useState(language || 'uz');

  const languages = [
    {
      id: 'uz',
      flag: '🇺🇿',
      titleKey: 'langUzTitle',
      subKey: 'langUzSub'
    },
    {
      id: 'ru',
      flag: '🇷🇺',
      titleKey: 'langRuTitle',
      subKey: 'langRuSub'
    },
    {
      id: 'en',
      flag: '🇬🇧',
      titleKey: 'langEnTitle',
      subKey: 'langEnSub'
    }
  ];

  const handleSelect = (langId) => {
    setSelectedLang(langId);
    setLanguage(langId);
  };

  const handleContinue = () => {
    completeInitialLanguageSelect(selectedLang);
    if (onLanguageSelected) {
      onLanguageSelected(selectedLang);
    }
  };

  const statusBarPadding = Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 12 : 16;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#071426" translucent />
      
      {/* Background Watermark */}
      <View style={styles.watermarkPattern} pointerEvents="none">
        <View style={styles.watermarkLineVertical} />
        <View style={styles.watermarkLineHorizontal} />
      </View>

      <ScrollView
        style={styles.scrollBody}
        contentContainerStyle={[styles.content, { paddingTop: statusBarPadding }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.mainWrapper}>
          {/* Top Branding Section */}
          <View style={styles.brandingHeader}>
            <View style={styles.logoBadge}>
              <ShieldScalesLogo size={76} />
            </View>

            <Text style={styles.headerTitle}>{t('selectLanguageTitle')}</Text>
            <Text style={styles.headerSubtitle}>{t('selectLanguageSubtitle')}</Text>
          </View>

          {/* Language Selection Cards List */}
          <View style={styles.cardsContainer}>
            {languages.map((lang) => {
              const isSelected = selectedLang === lang.id;
              return (
                <TouchableOpacity
                  key={lang.id}
                  style={[
                    styles.langCard,
                    isSelected && styles.langCardSelected
                  ]}
                  onPress={() => handleSelect(lang.id)}
                  activeOpacity={0.85}
                >
                  {/* Flag / Icon Circle */}
                  <View
                    style={[
                      styles.flagCircle,
                      isSelected && styles.flagCircleSelected
                    ]}
                  >
                    <Text style={styles.flagEmoji}>{lang.flag}</Text>
                  </View>

                  {/* Title & Subtitle */}
                  <View style={styles.langTextCol}>
                    <Text
                      style={[
                        styles.langTitle,
                        isSelected && styles.langTitleSelected
                      ]}
                    >
                      {t(lang.titleKey)}
                    </Text>
                    <Text
                      style={[
                        styles.langSub,
                        isSelected && styles.langSubSelected
                      ]}
                    >
                      {t(lang.subKey)}
                    </Text>
                  </View>

                  {/* Selection Radio / Checkmark Badge */}
                  <View
                    style={[
                      styles.radioCircle,
                      isSelected && styles.radioCircleSelected
                    ]}
                  >
                    {isSelected && <CheckmarkIcon size={14} color="#FFFFFF" />}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Bottom Continue Action Button - Spaced comfortably above system nav bar */}
        <View style={styles.footerAction}>
          <TouchableOpacity
            style={styles.continueBtn}
            onPress={handleContinue}
            activeOpacity={0.85}
          >
            <Text style={styles.continueBtnText}>{t('continue')}</Text>
            <Text style={styles.arrowIcon}>→</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#071426'
  },
  watermarkPattern: {
    position: 'absolute',
    top: 30,
    right: 20,
    opacity: 0.05
  },
  watermarkLineVertical: {
    width: 2,
    height: 140,
    backgroundColor: '#2563EB'
  },
  watermarkLineHorizontal: {
    position: 'absolute',
    top: 50,
    left: -50,
    width: 100,
    height: 2,
    backgroundColor: '#2563EB'
  },
  scrollBody: {
    flex: 1
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 22,
    paddingBottom: Platform.OS === 'android' ? 44 : 30,
    justifyContent: 'space-between'
  },
  mainWrapper: {
    width: '100%'
  },
  brandingHeader: {
    alignItems: 'center',
    marginTop: 14,
    marginBottom: 20
  },
  logoBadge: {
    marginBottom: 16,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 6
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 25,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: -0.3
  },
  headerSubtitle: {
    color: '#94A3B8',
    fontSize: 13.5,
    fontWeight: '400',
    textAlign: 'center',
    marginTop: 8,
    maxWidth: 280,
    lineHeight: 20
  },
  cardsContainer: {
    width: '100%',
    marginVertical: 10
  },
  langCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F1E33',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#1E3A5F',
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3
  },
  langCardSelected: {
    borderColor: '#2563EB',
    backgroundColor: '#0F274D',
    shadowColor: '#2563EB',
    shadowOpacity: 0.3
  },
  flagCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#14273E',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    borderWidth: 1,
    borderColor: '#1E385B'
  },
  flagCircleSelected: {
    backgroundColor: '#1D4ED8',
    borderColor: '#3B82F6'
  },
  flagEmoji: {
    fontSize: 22
  },
  langTextCol: {
    flex: 1,
    marginRight: 10
  },
  langTitle: {
    color: '#E2E8F0',
    fontSize: 16.5,
    fontWeight: '700'
  },
  langTitleSelected: {
    color: '#FFFFFF'
  },
  langSub: {
    color: '#64748B',
    fontSize: 12,
    marginTop: 2
  },
  langSubSelected: {
    color: '#93C5FD'
  },
  radioCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#334155',
    backgroundColor: '#071426',
    alignItems: 'center',
    justifyContent: 'center'
  },
  radioCircleSelected: {
    borderColor: '#2563EB',
    backgroundColor: '#2563EB'
  },
  footerAction: {
    width: '100%',
    marginTop: 16,
    marginBottom: Platform.OS === 'android' ? 20 : 10
  },
  continueBtn: {
    flexDirection: 'row',
    backgroundColor: '#2563EB',
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6
  },
  continueBtnText: {
    color: '#FFFFFF',
    fontSize: 15.5,
    fontWeight: '700',
    marginRight: 8
  },
  arrowIcon: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: 'bold'
  }
});
