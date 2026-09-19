import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Platform, StatusBar } from 'react-native';
import { LEGAL_DOCUMENTS } from '../database/legalDatabase';
import { SearchIcon, DocumentIcon, ChevronRightIcon, BackArrowIcon } from '../components/Icons';
import { useLanguage } from '../context/LanguageContext';

export default function LegislationScreen({ onSelectDoc, onGoBack }) {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDocs = LEGAL_DOCUMENTS.filter(doc =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const statusBarHeight = Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 24 : 16;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F2744" translucent />
      {/* Top Bar */}
      <View style={[styles.topBar, { paddingTop: statusBarHeight }]}>
        <TouchableOpacity
          onPress={onGoBack}
          style={styles.backBtn}
          activeOpacity={0.7}
          hitSlop={{ top: 14, bottom: 14, left: 14, right: 14 }}
        >
          <BackArrowIcon size={20} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.screenTitle}>{t('legislationTitle')}</Text>
      </View>

      {/* Main Content Card Frame */}
      <View style={styles.cardFrame}>
        {/* Search Input */}
        <View style={styles.searchBox}>
          <SearchIcon size={18} color="#667085" />
          <TextInput
            style={styles.searchInput}
            placeholder={t('searchDocPlaceholder')}
            placeholderTextColor="#98A2B3"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Legal Documents List */}
        <FlatList
          data={filteredDocs}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.docCard}
              onPress={() => onSelectDoc && onSelectDoc(item.id)}
              activeOpacity={0.7}
            >
              <View style={styles.docIconWrapper}>
                <DocumentIcon size={20} color={item.iconColor} bg={item.iconBg} />
              </View>

              <View style={styles.docInfo}>
                <Text style={styles.docTitle} numberOfLines={2}>
                  {item.title}
                </Text>
                <Text style={styles.docCount}>{item.articleCount} {t('articlesCountSuffix')}</Text>
              </View>

              <ChevronRightIcon size={18} color="#98A2B3" />
            </TouchableOpacity>
          )}
        />
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
    paddingTop: 16,
    paddingHorizontal: 16
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 14,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#0F172A',
    marginLeft: 10
  },
  listContainer: {
    paddingBottom: 110
  },
  docCard: {
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
  docIconWrapper: {
    marginRight: 12
  },
  docInfo: {
    flex: 1,
    marginRight: 8
  },
  docTitle: {
    color: '#0F172A',
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 19.5
  },
  docCount: {
    color: '#64748B',
    fontSize: 12,
    marginTop: 3
  }
});
