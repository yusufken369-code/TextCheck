import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { GlobeIcon, SettingsNavIcon, QonunNavIcon } from '../components/Icons';

export default function CustomKeyboardView({ onKeyPress, onBackspace, onSpace, onEnter, onLanguageChange }) {
  const [activeLang, setActiveLang] = useState('Ўз');
  const [isShiftActive, setIsShiftActive] = useState(false);
  const [isSymbolMode, setIsSymbolMode] = useState(false);

  const row1Letters = isShiftActive ? ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'] : ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'];
  const row2Letters = isShiftActive ? ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'] : ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'];
  const row3Letters = isShiftActive ? ['Z', 'X', 'C', 'V', 'B', 'N', 'M'] : ['z', 'x', 'c', 'v', 'b', 'n', 'm'];
  
  const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
  const symbolsRow1 = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
  const symbolsRow2 = ['@', '#', '$', '%', '&', '-', '+', '(', ')', '/'];
  const symbolsRow3 = ['*', '"', '\'', ':', ';', '!', '?'];

  const handleLangSelect = (lang) => {
    setActiveLang(lang);
    if (onLanguageChange) onLanguageChange(lang);
  };

  const handleCharPress = (char) => {
    onKeyPress(char);
    if (isShiftActive) setIsShiftActive(false);
  };

  return (
    <View style={styles.keyboardContainer}>
      {/* Top Toolbar */}
      <View style={styles.toolbar}>
        {/* Language selector buttons */}
        <View style={styles.langContainer}>
          <TouchableOpacity
            style={[styles.langBadge, activeLang === 'Ўз' && styles.langBadgeActive]}
            onPress={() => handleLangSelect('Ўз')}
            activeOpacity={0.7}
          >
            <View style={styles.flagDot} />
            <Text style={[styles.langText, activeLang === 'Ўз' && styles.langTextActive]}>Ўз</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.langBadge, activeLang === 'Рус' && styles.langBadgeActive]}
            onPress={() => handleLangSelect('Рус')}
            activeOpacity={0.7}
          >
            <Text style={[styles.langText, activeLang === 'Рус' && styles.langTextActive]}>Рус</Text>
          </TouchableOpacity>
        </View>

        {/* Right utility buttons */}
        <View style={styles.utilityGroup}>
          <TouchableOpacity style={styles.iconBtn} activeOpacity={0.7}>
            <QonunNavIcon size={16} color="#94A3B8" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn} activeOpacity={0.7}>
            <SettingsNavIcon size={16} color="#94A3B8" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Keys Rows */}
      <View style={styles.keysSection}>
        {/* Row 1 */}
        <View style={styles.row}>
          {(!isSymbolMode ? row1Letters : symbolsRow1).map((keyChar, idx) => (
            <TouchableOpacity key={idx} style={styles.key} onPress={() => handleCharPress(keyChar)} activeOpacity={0.65}>
              {!isSymbolMode && <Text style={styles.subNum}>{numbers[idx]}</Text>}
              <Text style={styles.keyText}>{keyChar}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Row 2 */}
        <View style={[styles.row, { paddingHorizontal: 10 }]}>
          {(!isSymbolMode ? row2Letters : symbolsRow2).map((keyChar, idx) => (
            <TouchableOpacity key={idx} style={styles.key} onPress={() => handleCharPress(keyChar)} activeOpacity={0.65}>
              <Text style={styles.keyText}>{keyChar}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Row 3: Shift - Letters/Symbols - Backspace */}
        <View style={styles.row}>
          <TouchableOpacity
            style={[styles.key, styles.specialKey, isShiftActive && styles.specialKeyActive]}
            onPress={() => setIsShiftActive(!isShiftActive)}
            activeOpacity={0.65}
          >
            <Text style={[styles.specialKeyText, isShiftActive && { color: '#FFFFFF' }]}>⇧</Text>
          </TouchableOpacity>

          {(!isSymbolMode ? row3Letters : symbolsRow3).map((keyChar, idx) => (
            <TouchableOpacity key={idx} style={styles.key} onPress={() => handleCharPress(keyChar)} activeOpacity={0.65}>
              <Text style={styles.keyText}>{keyChar}</Text>
            </TouchableOpacity>
          ))}

          <TouchableOpacity style={[styles.key, styles.specialKey]} onPress={onBackspace} activeOpacity={0.65}>
            <Text style={styles.specialKeyText}>⌫</Text>
          </TouchableOpacity>
        </View>

        {/* Row 4: ?123 - Globe - Spacebar - . - Enter */}
        <View style={styles.row}>
          <TouchableOpacity
            style={[styles.key, styles.specialKey, { flex: 1.3 }]}
            onPress={() => setIsSymbolMode(!isSymbolMode)}
            activeOpacity={0.65}
          >
            <Text style={styles.specialKeyText}>{isSymbolMode ? 'ABC' : '?123'}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.key, styles.specialKey, { flex: 1 }]} onPress={() => handleLangSelect(activeLang === 'Ўз' ? 'Рус' : 'Ўз')} activeOpacity={0.65}>
            <GlobeIcon size={16} color="#CBD5E1" />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.key, styles.spaceKey]} onPress={onSpace} activeOpacity={0.65}>
            <Text style={styles.spaceText}>O‘zbekcha</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.key, styles.specialKey, { flex: 0.8 }]} onPress={() => handleCharPress('.')} activeOpacity={0.65}>
            <Text style={styles.keyText}>.</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.key, styles.enterKey]} onPress={onEnter} activeOpacity={0.75}>
            <Text style={styles.enterKeyText}>↵</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  keyboardContainer: {
    backgroundColor: '#0F1E33',
    paddingBottom: 8,
    borderTopWidth: 1,
    borderTopColor: '#1E3A5F'
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 6
  },
  langContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  langBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6
  },
  langBadgeActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.14)'
  },
  flagDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#2563EB',
    marginRight: 5
  },
  langText: {
    color: '#94A3B8',
    fontSize: 12.5,
    fontWeight: '600'
  },
  langTextActive: {
    color: '#FFFFFF',
    fontWeight: '700'
  },
  utilityGroup: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  iconBtn: {
    padding: 6,
    marginLeft: 4
  },
  keysSection: {
    paddingHorizontal: 3
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 3
  },
  key: {
    flex: 1,
    height: 42,
    backgroundColor: '#1C324E',
    borderRadius: 7,
    marginHorizontal: 2.5,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 1,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)'
  },
  subNum: {
    position: 'absolute',
    top: 2,
    right: 4,
    fontSize: 9,
    color: '#64748B'
  },
  keyText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '500'
  },
  specialKey: {
    backgroundColor: '#14273E'
  },
  specialKeyActive: {
    backgroundColor: '#2563EB',
    borderColor: '#3B82F6'
  },
  specialKeyText: {
    color: '#94A3B8',
    fontSize: 15,
    fontWeight: '700'
  },
  spaceKey: {
    flex: 4,
    backgroundColor: '#1C324E'
  },
  spaceText: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '500'
  },
  enterKey: {
    flex: 1.4,
    backgroundColor: '#2563EB',
    borderColor: '#3B82F6'
  },
  enterKeyText: {
    color: '#FFFFFF',
    fontSize: 19,
    fontWeight: '700'
  }
});
