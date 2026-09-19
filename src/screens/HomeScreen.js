import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet
} from 'react-native';
import HeaderPresentation from '../components/HeaderPresentation';
import LegalWarningCard from '../components/LegalWarningCard';
import { LockIcon, GlobeIcon, CheckmarkIcon } from '../components/Icons';
import { useLanguage } from '../context/LanguageContext';
import { analyzeText } from '../services/textAnalyzer';

export default function HomeScreen({ onNavigateToArticle, onOpenKeyboardSettings }) {
  const { t, language } = useLanguage();

  const [testText, setTestText] = useState('');
  const [isConnected, setIsConnected] = useState(false);

  // Set initial sample text according to current language
  useEffect(() => {
    if (!testText) {
      setTestText(t('sampleHaqoratText'));
    }
  }, [language]);

  const analysisResult = analyzeText(testText, language);

  const handleQuickSample = (sampleText) => {
    setTestText(sampleText);
  };

  const handleToggleConnection = () => {
    onOpenKeyboardSettings && onOpenKeyboardSettings();
    setIsConnected(prev => !prev);
  };

  return (
    <View style={styles.container}>
      {/* App Header Presentation */}
      <HeaderPresentation />

      <ScrollView
        style={styles.scrollBody}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 1. HERO CARD: KEYBOARD CONNECTION AT THE TOP */}
        <View style={styles.connectionCard}>
          {/* Top Status Badge Row */}
          <View style={styles.cardBadgeRow}>
            <TouchableOpacity
              style={[styles.statusBadge, isConnected ? styles.statusBadgeConnected : styles.statusBadgeNotConnected]}
              onPress={handleToggleConnection}
              activeOpacity={0.8}
            >
              <Text style={styles.statusBadgeText}>
                {isConnected ? t('connectStatusConnected') : t('connectStatusNotConnected')}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Full Width Title and Description Column */}
          <View style={styles.cardTitleCol}>
            <Text style={styles.connectionTitle}>{t('systemKeyboardTitle')}</Text>
            <Text style={styles.connectionSubtitle}>{t('systemKeyboardDesc')}</Text>
          </View>

          {/* Setup Steps List */}
          <View style={styles.stepsContainer}>
            <View style={styles.stepItem}>
              <View style={styles.stepNumberBadge}>
                <Text style={styles.stepNumberText}>1</Text>
              </View>
              <Text style={styles.stepText}>{t('keyboardStep1')}</Text>
            </View>

            <View style={styles.stepItem}>
              <View style={styles.stepNumberBadge}>
                <Text style={styles.stepNumberText}>2</Text>
              </View>
              <Text style={styles.stepText}>{t('keyboardStep2')}</Text>
            </View>
          </View>

          {/* Connect Button */}
          <TouchableOpacity
            style={styles.enableButton}
            onPress={onOpenKeyboardSettings}
            activeOpacity={0.85}
          >
            <Text style={styles.enableButtonText}>{t('enableKeyboardBtn')}</Text>
          </TouchableOpacity>
        </View>

        {/* 2. LIVE KEYBOARD & RED WARNING TESTER */}
        <View style={styles.testerCard}>
          <View style={styles.testerHeader}>
            <Text style={styles.testerTitle}>{t('testKeyboardTitle')}</Text>
            <Text style={styles.testerSub}>
              {t('testerSub')}
            </Text>
          </View>

          {/* Quick Presets */}
          <View style={styles.quickPresetRow}>
            <TouchableOpacity
              style={[styles.presetBtn, styles.presetBtnRed]}
              onPress={() => handleQuickSample(t('sampleHaqoratText'))}
              activeOpacity={0.8}
            >
              <Text style={styles.presetBtnTextRed}>🚨 {t('quickTestBtnHaqorat')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.presetBtn, styles.presetBtnOrange]}
              onPress={() => handleQuickSample(t('sampleTuhmatText'))}
              activeOpacity={0.8}
            >
              <Text style={styles.presetBtnTextOrange}>⚠️ {t('quickTestBtnTuhmat')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.presetBtn, styles.presetBtnDarkRed]}
              onPress={() => handleQuickSample(t('samplePoraText'))}
              activeOpacity={0.8}
            >
              <Text style={styles.presetBtnTextDarkRed}>⛔ {t('quickTestBtnPora')}</Text>
            </TouchableOpacity>
          </View>

          {/* Interactive Input Box */}
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.testInput}
              value={testText}
              onChangeText={setTestText}
              placeholder={t('testKeyboardPlaceholder')}
              placeholderTextColor="#64748B"
              multiline
            />
          </View>

          {/* RED WARNING CARD pops up when a bad word matches */}
          {analysisResult && analysisResult.hasMatch ? (
            <LegalWarningCard
              warningTitle={analysisResult.warningTitle}
              warningText={analysisResult.warningText}
              highlightedWord={analysisResult.highlightedWord}
              penaltyText={analysisResult.penaltyText}
              documentTitle={analysisResult.documentTitle + " (" + (analysisResult.articleNumber || "") + ")"}
              onPressDetails={() => onNavigateToArticle && onNavigateToArticle(analysisResult.articleId)}
            />
          ) : (
            <View style={styles.safeStatusCard}>
              <View style={styles.safeDot} />
              <Text style={styles.safeStatusText}>
                {t('safeStatusText')}
              </Text>
            </View>
          )}
        </View>

        {/* 3. FEATURE HIGHLIGHTS */}
        <View style={styles.featureBanner}>
          <View style={styles.featureItem}>
            <View style={styles.featureIconBadge}>
              <CheckmarkIcon size={14} color="#2563EB" />
            </View>
            <Text style={styles.featureText}>{t('featureUzLegislation')}</Text>
          </View>

          <View style={styles.featureItem}>
            <View style={styles.featureIconBadge}>
              <Text style={styles.symbolIcon}>⚡</Text>
            </View>
            <Text style={styles.featureText}>{t('featureFast')}</Text>
          </View>

          <View style={styles.featureItem}>
            <View style={styles.featureIconBadge}>
              <LockIcon size={14} color="#2563EB" />
            </View>
            <Text style={styles.featureText}>{t('featurePrivacy')}</Text>
          </View>

          <View style={styles.featureItem}>
            <View style={styles.featureIconBadge}>
              <Text style={styles.symbolIcon}>📡</Text>
            </View>
            <Text style={styles.featureText}>{t('featureOffline')}</Text>
          </View>

          <View style={styles.featureItem}>
            <View style={styles.featureIconBadge}>
              <GlobeIcon size={14} color="#2563EB" />
            </View>
            <Text style={styles.featureText}>{t('featureMultiLang')}</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B1728'
  },
  scrollBody: {
    flex: 1
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 110
  },
  connectionCard: {
    backgroundColor: '#0F1E33',
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: '#1E3A5F',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4
  },
  cardBadgeRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 12
  },
  cardTitleCol: {
    width: '100%',
    marginBottom: 14
  },
  connectionTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 6,
    letterSpacing: -0.3,
    lineHeight: 24
  },
  connectionSubtitle: {
    color: '#94A3B8',
    fontSize: 13,
    lineHeight: 19
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    alignSelf: 'flex-start'
  },
  statusBadgeNotConnected: {
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    borderColor: 'rgba(239, 68, 68, 0.3)'
  },
  statusBadgeConnected: {
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    borderColor: 'rgba(16, 185, 129, 0.3)'
  },
  statusBadgeText: {
    color: '#FFFFFF',
    fontSize: 11.5,
    fontWeight: '700'
  },
  stepsContainer: {
    backgroundColor: '#0B1728',
    borderRadius: 14,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#1E293B'
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4
  },
  stepNumberBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10
  },
  stepNumberText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800'
  },
  stepText: {
    color: '#CBD5E1',
    fontSize: 12.5,
    fontWeight: '600',
    flex: 1
  },
  enableButton: {
    backgroundColor: '#2563EB',
    borderRadius: 14,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4
  },
  enableButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800'
  },
  testerCard: {
    backgroundColor: '#0F1E33',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#1E3A5F'
  },
  testerHeader: {
    marginBottom: 12
  },
  testerTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4
  },
  testerSub: {
    color: '#94A3B8',
    fontSize: 12,
    lineHeight: 17
  },
  quickPresetRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12
  },
  presetBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1
  },
  presetBtnRed: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderColor: 'rgba(239, 68, 68, 0.4)'
  },
  presetBtnTextRed: {
    color: '#F87171',
    fontSize: 11.5,
    fontWeight: '700'
  },
  presetBtnOrange: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    borderColor: 'rgba(245, 158, 11, 0.4)'
  },
  presetBtnTextOrange: {
    color: '#FBBF24',
    fontSize: 11.5,
    fontWeight: '700'
  },
  presetBtnDarkRed: {
    backgroundColor: 'rgba(185, 28, 28, 0.15)',
    borderColor: 'rgba(185, 28, 28, 0.4)'
  },
  presetBtnTextDarkRed: {
    color: '#FCA5A5',
    fontSize: 11.5,
    fontWeight: '700'
  },
  inputWrapper: {
    marginBottom: 8
  },
  testInput: {
    backgroundColor: '#0B1728',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
    padding: 12,
    color: '#FFFFFF',
    fontSize: 13.5,
    minHeight: 50,
    textAlignVertical: 'top'
  },
  safeStatusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    marginTop: 6
  },
  safeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
    marginRight: 8
  },
  safeStatusText: {
    color: '#34D399',
    fontSize: 12,
    fontWeight: '600',
    flex: 1
  },
  featureBanner: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    backgroundColor: '#0F1E33',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#1E3A5F'
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
    marginVertical: 6
  },
  featureIconBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6
  },
  symbolIcon: {
    fontSize: 11
  },
  featureText: {
    color: '#CBD5E1',
    fontSize: 12,
    fontWeight: '600'
  }
});
