import React from 'react';
import { View, Text, StyleSheet, StatusBar, Platform } from 'react-native';
import { ShieldScalesLogo } from './Icons';
import { useLanguage } from '../context/LanguageContext';

export default function HeaderPresentation() {
  const { t } = useLanguage();
  const statusBarHeight = Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 12 : 12;

  return (
    <View style={[styles.headerWrapper, { paddingTop: statusBarHeight + 12 }]}>
      <View style={styles.topContainer}>
        {/* Left Side: Brand Logo & Title */}
        <View style={styles.brandRow}>
          <ShieldScalesLogo size={46} />
          <View style={styles.titleCol}>
            <View style={styles.titleBadgeRow}>
              <Text style={styles.appTitle} numberOfLines={1}>
                Huquqiy Keyboard
              </Text>
              <View style={styles.v1Badge}>
                <Text style={styles.v1BadgeText}>v1.0</Text>
              </View>
            </View>
            <Text style={styles.appSubtitle} numberOfLines={2}>
              {t('appSubtitle')}
            </Text>
          </View>
        </View>

        {/* Right Slogan Banner / Tagline */}
        <View style={styles.sloganCard}>
          <View style={styles.sloganDot} />
          <Text style={styles.sloganText}>
            {t('sloganText')}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerWrapper: {
    backgroundColor: '#0B1728',
    paddingHorizontal: 20,
    paddingBottom: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#1E3A5F',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4
  },
  topContainer: {
    flexDirection: 'column'
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12
  },
  titleCol: {
    marginLeft: 14,
    flex: 1,
    justifyContent: 'center'
  },
  titleBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'nowrap'
  },
  appTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.3,
    marginRight: 8
  },
  v1Badge: {
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.4)',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6
  },
  v1BadgeText: {
    color: '#60A5FA',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.2
  },
  appSubtitle: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '400',
    marginTop: 2,
    lineHeight: 16
  },
  sloganCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 30, 52, 0.8)',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#1E3A5F'
  },
  sloganDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#10B981',
    marginRight: 10
  },
  sloganText: {
    color: '#CBD5E1',
    fontSize: 12,
    fontWeight: '500',
    flex: 1,
    lineHeight: 16
  }
});
