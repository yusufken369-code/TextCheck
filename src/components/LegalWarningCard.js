import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { WarningAlertIcon, DocumentIcon, CloseIcon, ChevronRightIcon } from './Icons';
import { useLanguage } from '../context/LanguageContext';

export default function LegalWarningCard({
  warningTitle,
  warningText,
  highlightedWord,
  penaltyText,
  documentTitle,
  onPressDetails,
  onClose
}) {
  const { t } = useLanguage();

  const title = warningTitle || t('legalWarningDefaultTitle');

  return (
    <View style={styles.cardContainer}>
      {/* Top row: Red alert icon + Title + Close button */}
      <View style={styles.topRow}>
        <View style={styles.titleGroup}>
          <WarningAlertIcon size={22} />
          <Text style={styles.titleText}>{title}</Text>
        </View>
        {onClose && (
          <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <CloseIcon size={14} color="#991B1B" />
          </TouchableOpacity>
        )}
      </View>

      {/* Warning Description */}
      {warningText ? (
        <Text style={styles.descriptionText}>
          {warningText}
        </Text>
      ) : null}

      {/* RED PENALTY / CONSEQUENCE BOX ("NIMA BO'LISHI") */}
      {penaltyText ? (
        <View style={styles.penaltyBox}>
          <Text style={styles.penaltyBadgeLabel}>{t('legalPenaltyLabel')}</Text>
          <Text style={styles.penaltyValueText}>{penaltyText}</Text>
        </View>
      ) : null}

      {/* Bottom section: Document reference ("QAYSI MODDA") & Batafsil action */}
      <View style={styles.bottomRow}>
        <View style={styles.docGroup}>
          <DocumentIcon size={18} color="#DC2626" bg="#FEE2E2" />
          <View style={styles.docTextCol}>
            <Text style={styles.docLabel}>{t('legalArticleLabel')}</Text>
            <Text style={styles.docName} numberOfLines={2}>{documentTitle}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.detailsBtn} onPress={onPressDetails} activeOpacity={0.75}>
          <Text style={styles.detailsBtnText}>{t('viewArticleBtn')}</Text>
          <ChevronRightIcon size={14} color="#991B1B" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#FFF5F5',
    borderRadius: 16,
    padding: 16,
    marginVertical: 12,
    borderWidth: 1.5,
    borderColor: '#F87171',
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10
  },
  titleGroup: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  titleText: {
    color: '#DC2626',
    fontSize: 15,
    fontWeight: '800',
    marginLeft: 8,
    letterSpacing: -0.2
  },
  closeBtn: {
    padding: 4
  },
  descriptionText: {
    color: '#450A0A',
    fontSize: 13.5,
    fontWeight: '600',
    lineHeight: 20,
    marginBottom: 10
  },
  penaltyBox: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1.5,
    borderColor: '#EF4444',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12
  },
  penaltyBadgeLabel: {
    color: '#991B1B',
    fontSize: 11.5,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    marginBottom: 4
  },
  penaltyValueText: {
    color: '#B91C1C',
    fontSize: 13,
    fontWeight: '800',
    lineHeight: 18
  },
  boldWord: {
    fontWeight: '800',
    color: '#DC2626',
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#FECACA',
    paddingTop: 12
  },
  docGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8
  },
  docTextCol: {
    marginLeft: 8,
    flex: 1
  },
  docLabel: {
    color: '#7F1D1D',
    fontSize: 11,
    fontWeight: '700'
  },
  docName: {
    color: '#B91C1C',
    fontSize: 13,
    fontWeight: '800'
  },
  detailsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7,
    paddingHorizontal: 10,
    backgroundColor: '#FEE2E2',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FCA5A5'
  },
  detailsBtnText: {
    color: '#991B1B',
    fontSize: 12,
    fontWeight: '800',
    marginRight: 4
  }
});
