import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Linking, StyleSheet, Platform, StatusBar } from 'react-native';
import { LEGAL_ARTICLES } from '../database/legalDatabase';
import { DocumentIcon, ExternalLinkIcon, BackArrowIcon } from '../components/Icons';

export default function ArticleDetailsScreen({ articleId = 'mjt-183', onGoBack }) {
  const article = LEGAL_ARTICLES.find(a => a.id === articleId) || LEGAL_ARTICLES[0];

  const handleOpenLexUz = () => {
    if (article.lexUrl) {
      Linking.openURL(article.lexUrl).catch(err => console.log('Cannot open URL', err));
    }
  };

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
        <Text style={styles.screenTitle}>Maqola ma’lumoti</Text>
      </View>

      {/* Main Content Card Frame */}
      <View style={styles.cardFrame}>
        <ScrollView style={styles.scrollContent} contentContainerStyle={{ paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
          {/* Top Document Header Card */}
          <View style={styles.docHeaderCard}>
            <DocumentIcon size={22} color="#2563EB" bg="#EFF6FF" />
            <View style={styles.headerTextCol}>
              <Text style={styles.docHeaderSubtitle}>{article.documentTitle}</Text>
              <Text style={styles.docHeaderTitle}>{article.articleNumber}</Text>
            </View>
          </View>

          {/* Article Name Section */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionLabel}>Modda nomi</Text>
            <Text style={styles.articleTitleText}>{article.title}</Text>
          </View>

          {/* Article Text Section */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionLabel}>Matn</Text>
            <Text style={styles.articleBodyText}>
              {article.content}
            </Text>
          </View>

          {/* Metadata Grid */}
          <View style={styles.sectionCard}>
            <View style={styles.metaRow}>
              <Text style={styles.metaKey}>Hujjat raqami:</Text>
              <Text style={styles.metaVal}>{article.docNumber}</Text>
            </View>

            <View style={styles.metaRow}>
              <Text style={styles.metaKey}>Qabul qilingan sana:</Text>
              <Text style={styles.metaVal}>{article.adoptionDate}</Text>
            </View>

            <View style={styles.metaRow}>
              <Text style={styles.metaKey}>Kuchga kirgan sana:</Text>
              <Text style={styles.metaVal}>{article.effectiveDate}</Text>
            </View>

            <View style={[styles.metaRow, { borderBottomWidth: 0 }]}>
              <Text style={styles.metaKey}>Manba:</Text>
              <Text style={styles.metaVal}>{article.source}</Text>
            </View>
          </View>

          {/* Action Button */}
          <TouchableOpacity style={styles.lexBtn} onPress={handleOpenLexUz} activeOpacity={0.8}>
            <Text style={styles.lexBtnText}>LexUZ da ochish</Text>
            <ExternalLinkIcon size={16} color="#FFFFFF" />
          </TouchableOpacity>
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
  docHeaderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2
  },
  headerTextCol: {
    marginLeft: 12,
    flex: 1
  },
  docHeaderSubtitle: {
    color: '#64748B',
    fontSize: 11.5,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5
  },
  docHeaderTitle: {
    color: '#0F172A',
    fontSize: 16,
    fontWeight: '800',
    marginTop: 2,
    letterSpacing: -0.2
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1
  },
  sectionLabel: {
    color: '#64748B',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 6
  },
  articleTitleText: {
    color: '#0F172A',
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 21
  },
  articleBodyText: {
    color: '#334155',
    fontSize: 14,
    lineHeight: 21.5
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 7,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9'
  },
  metaKey: {
    color: '#64748B',
    fontSize: 12.5,
    fontWeight: '500'
  },
  metaVal: {
    color: '#0F172A',
    fontSize: 13,
    fontWeight: '600'
  },
  lexBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB',
    borderRadius: 12,
    height: 48,
    marginTop: 8,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4
  },
  lexBtnText: {
    color: '#FFFFFF',
    fontSize: 14.5,
    fontWeight: '700',
    marginRight: 6
  },
  externalIcon: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold'
  }
});
