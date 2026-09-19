import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Platform, StatusBar } from 'react-native';
import { LEGAL_ARTICLES } from '../database/legalDatabase';
import { SearchIcon, DocumentIcon, CloseIcon, BackArrowIcon } from '../components/Icons';
import { useLanguage } from '../context/LanguageContext';

export default function SearchScreen({ onSelectArticle, onGoBack }) {
  const { t } = useLanguage();
  const [query, setQuery] = useState('internet');
  const [activeTab, setActiveTab] = useState('barchasi');

  const filteredArticles = LEGAL_ARTICLES.filter(article => {
    const q = query.toLowerCase();
    const matchesQuery = article.title.toLowerCase().includes(q) ||
                         article.content.toLowerCase().includes(q) ||
                         article.documentTitle.toLowerCase().includes(q) ||
                         article.articleNumber.toLowerCase().includes(q);

    if (activeTab === 'qonunlar') {
      return matchesQuery && article.documentTitle.toLowerCase().includes('qonun');
    }
    if (activeTab === 'moddalar') {
      return matchesQuery && article.articleNumber.toLowerCase().includes('modda');
    }
    return matchesQuery;
  });

  const statusBarHeight = Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 24 : 16;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F2744" translucent />
      {/* Header */}
      <View style={[styles.topBar, { paddingTop: statusBarHeight }]}>
        <TouchableOpacity
          onPress={onGoBack}
          style={styles.backBtn}
          activeOpacity={0.7}
          hitSlop={{ top: 14, bottom: 14, left: 14, right: 14 }}
        >
          <BackArrowIcon size={20} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.screenTitle}>{t('searchTitle')}</Text>
      </View>

      {/* Main Container */}
      <View style={styles.cardFrame}>
        {/* Search Bar */}
        <View style={styles.searchBox}>
          <SearchIcon size={18} color="#667085" />
          <TextInput
            style={styles.searchInput}
            placeholder={t('searchInputPlaceholder')}
            placeholderTextColor="#98A2B3"
            value={query}
            onChangeText={setQuery}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')} style={styles.clearBtn}>
              <CloseIcon size={14} color="#667085" />
            </TouchableOpacity>
          )}
        </View>

        {/* Filter Pills */}
        <View style={styles.filterRow}>
          <TouchableOpacity
            style={[styles.filterPill, activeTab === 'barchasi' && styles.filterPillActive]}
            onPress={() => setActiveTab('barchasi')}
          >
            <Text style={[styles.filterText, activeTab === 'barchasi' && styles.filterTextActive]}>
              {t('filterAll')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterPill, activeTab === 'qonunlar' && styles.filterPillActive]}
            onPress={() => setActiveTab('qonunlar')}
          >
            <Text style={[styles.filterText, activeTab === 'qonunlar' && styles.filterTextActive]}>
              {t('filterLaws')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterPill, activeTab === 'moddalar' && styles.filterPillActive]}
            onPress={() => setActiveTab('moddalar')}
          >
            <Text style={[styles.filterText, activeTab === 'moddalar' && styles.filterTextActive]}>
              {t('filterArticles')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Results List */}
        <FlatList
          data={filteredArticles}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.resultCard}
              onPress={() => onSelectArticle && onSelectArticle(item.id)}
              activeOpacity={0.7}
            >
              <View style={styles.resultHeader}>
                <DocumentIcon size={18} color="#F57C00" bg="#FFF3E0" />
                <View style={styles.titleCol}>
                  <Text style={styles.docTitle} numberOfLines={1}>{item.documentTitle}</Text>
                  <Text style={styles.articleNum}>{item.articleNumber}</Text>
                </View>
              </View>
              <Text style={styles.articleSnippet} numberOfLines={2}>
                {item.content}
              </Text>
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
    marginBottom: 12,
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
  clearBtn: {
    padding: 4
  },
  filterRow: {
    flexDirection: 'row',
    marginBottom: 14
  },
  filterPill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    marginRight: 8
  },
  filterPillActive: {
    backgroundColor: '#2563EB'
  },
  filterText: {
    fontSize: 12.5,
    color: '#475467',
    fontWeight: '500'
  },
  filterTextActive: {
    color: '#FFFFFF',
    fontWeight: '700'
  },
  listContainer: {
    paddingBottom: 110
  },
  resultCard: {
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
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  titleCol: {
    marginLeft: 10,
    flex: 1
  },
  docTitle: {
    color: '#0F172A',
    fontSize: 13.5,
    fontWeight: '700'
  },
  articleNum: {
    color: '#64748B',
    fontSize: 11.5,
    marginTop: 1
  },
  articleSnippet: {
    color: '#334155',
    fontSize: 13,
    lineHeight: 19
  }
});
