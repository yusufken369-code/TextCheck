import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { HomeNavIcon, QonunNavIcon, SearchIcon, SettingsNavIcon } from './Icons';
import { useLanguage } from '../context/LanguageContext';

export default function BottomNavigation({ activeTab, onSelectTab }) {
  const { t } = useLanguage();

  const tabs = [
    { id: 'home', label: t('tabHome'), icon: HomeNavIcon },
    { id: 'legislation', label: t('tabLegislation'), icon: QonunNavIcon },
    { id: 'search', label: t('tabSearch'), icon: SearchIcon },
    { id: 'settings', label: t('tabSettings'), icon: SettingsNavIcon }
  ];

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const color = isActive ? '#3B82F6' : '#94A3B8';
          const IconComponent = tab.icon;

          return (
            <TouchableOpacity
              key={tab.id}
              style={styles.tabButton}
              onPress={() => onSelectTab(tab.id)}
              activeOpacity={0.7}
              hitSlop={{ top: 8, bottom: 8, left: 6, right: 6 }}
            >
              <View style={[styles.iconWrapper, isActive && styles.activeIconWrapper]}>
                <IconComponent size={20} color={color} />
              </View>
              <Text style={[styles.tabLabel, { color }, isActive && styles.activeTabLabel]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: Platform.OS === 'android' ? 24 : 16,
    left: 16,
    right: 16,
    zIndex: 9999
  },
  container: {
    flexDirection: 'row',
    backgroundColor: '#0B1728',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#1E3A5F',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 8,
    elevation: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4
  },
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 5,
    borderRadius: 14
  },
  activeIconWrapper: {
    backgroundColor: 'rgba(59, 130, 246, 0.16)'
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 3,
    textAlign: 'center',
    letterSpacing: -0.1
  },
  activeTabLabel: {
    fontWeight: '700',
    color: '#60A5FA'
  }
});
