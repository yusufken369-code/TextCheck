import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import CustomKeyboardView from '../keyboard/CustomKeyboardView';
import LegalWarningCard from './LegalWarningCard';
import { BackArrowIcon } from './Icons';
import { analyzeText } from '../services/textAnalyzer';

export default function PhoneMockupPreview({ onNavigateToArticle }) {
  const [typedText, setTypedText] = useState('Men seni internetda haqorat qilaman.');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isWarningDismissed, setIsWarningDismissed] = useState(false);

  // Debounced real-time analysis (300ms - 700ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      const result = analyzeText(typedText);
      setAnalysisResult(result);
      if (result.hasMatch) {
        setIsWarningDismissed(false);
      }
    }, 400);

    return () => clearTimeout(handler);
  }, [typedText]);

  const handleKeyPress = (char) => {
    setTypedText(prev => prev + char);
  };

  const handleBackspace = () => {
    setTypedText(prev => prev.slice(0, -1));
  };

  const handleSpace = () => {
    setTypedText(prev => prev + ' ');
  };

  const handleEnter = () => {
    // Send message logic
  };

  return (
    <View style={styles.phoneFrame}>
      {/* Top Status Bar */}
      <View style={styles.statusBar}>
        <Text style={styles.timeText}>12:30</Text>
        <View style={styles.notch} />
        <View style={styles.statusIcons}>
          <Text style={styles.signalIcon}>📶</Text>
          <Text style={styles.signalIcon}>🔋</Text>
        </View>
      </View>

      {/* Chat App Header */}
      <View style={styles.chatHeader}>
        <View style={styles.headerLeft}>
          <BackArrowIcon size={16} color="#FFFFFF" />
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>A</Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>Azizbek</Text>
            <View style={styles.onlineBadge}>
              <View style={styles.onlineDot} />
              <Text style={styles.userStatus}>online</Text>
            </View>
          </View>
        </View>
        <View style={styles.headerRight}>
          <Text style={styles.headerActionIcon}>📞</Text>
          <Text style={styles.headerActionIcon}>⋮</Text>
        </View>
      </View>

      {/* Main Chat Area */}
      <ScrollView style={styles.chatBody} contentContainerStyle={styles.chatContent}>
        {/* Sent Message Bubble */}
        <View style={styles.messageBubble}>
          <Text style={styles.messageText}>
            {typedText || 'Men seni internetda haqorat qilaman.'}
          </Text>
          <View style={styles.messageMeta}>
            <Text style={styles.messageTime}>12:30</Text>
            <Text style={styles.checkIcon}>✓✓</Text>
          </View>
        </View>

        {/* Legal Warning Card (Popping up dynamically or on match) */}
        {analysisResult && analysisResult.hasMatch && !isWarningDismissed && (
          <LegalWarningCard
            warningTitle={analysisResult.warningTitle}
            warningText={analysisResult.warningText}
            highlightedWord={analysisResult.highlightedWord}
            documentTitle={analysisResult.documentTitle}
            onPressDetails={() => onNavigateToArticle && onNavigateToArticle(analysisResult.articleId)}
            onClose={() => setIsWarningDismissed(true)}
          />
        )}
      </ScrollView>

      {/* Chat Input Bar */}
      <View style={styles.inputBar}>
        <TouchableOpacity style={styles.emojiBtn} activeOpacity={0.7}>
          <Text style={styles.emojiIcon}>😊</Text>
        </TouchableOpacity>
        
        <TextInput
          style={styles.textInput}
          value={typedText}
          onChangeText={setTypedText}
          placeholder="Xabar yozing..."
          placeholderTextColor="#94A3B8"
        />

        <TouchableOpacity style={styles.sendBtn} onPress={handleEnter} activeOpacity={0.8}>
          <Text style={styles.sendIcon}>➤</Text>
        </TouchableOpacity>
      </View>

      {/* Actual Custom System Keyboard Preview */}
      <CustomKeyboardView
        onKeyPress={handleKeyPress}
        onBackspace={handleBackspace}
        onSpace={handleSpace}
        onEnter={handleEnter}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  phoneFrame: {
    backgroundColor: '#0B1728',
    borderRadius: 28,
    borderWidth: 6,
    borderColor: '#1E293B',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8
  },
  statusBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 6,
    backgroundColor: '#0B1728'
  },
  timeText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600'
  },
  notch: {
    width: 56,
    height: 10,
    backgroundColor: '#1E293B',
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6
  },
  statusIcons: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  signalIcon: {
    color: '#94A3B8',
    fontSize: 10,
    marginLeft: 4
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0F1E33',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#1E3A5F'
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10
  },
  avatarText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14
  },
  userInfo: {
    marginLeft: 10
  },
  userName: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '700'
  },
  onlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 1
  },
  onlineDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#10B981',
    marginRight: 4
  },
  userStatus: {
    color: '#10B981',
    fontSize: 10.5,
    fontWeight: '500'
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  headerActionIcon: {
    color: '#94A3B8',
    fontSize: 15,
    marginLeft: 12
  },
  chatBody: {
    backgroundColor: '#0B1728',
    minHeight: 170,
    maxHeight: 260,
    paddingHorizontal: 12
  },
  chatContent: {
    paddingVertical: 12
  },
  messageBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#DCF8C6',
    borderRadius: 14,
    borderTopRightRadius: 3,
    paddingHorizontal: 12,
    paddingVertical: 8,
    maxWidth: '85%',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1
  },
  messageText: {
    color: '#0F172A',
    fontSize: 13.5,
    lineHeight: 18.5
  },
  messageMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginTop: 4
  },
  messageTime: {
    fontSize: 10,
    color: '#64748B',
    marginRight: 4
  },
  checkIcon: {
    fontSize: 10,
    color: '#2563EB',
    fontWeight: 'bold'
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0'
  },
  emojiBtn: {
    padding: 4
  },
  emojiIcon: {
    fontSize: 18
  },
  textInput: {
    flex: 1,
    height: 36,
    backgroundColor: '#F1F5F9',
    borderRadius: 18,
    paddingHorizontal: 14,
    fontSize: 13,
    color: '#0F172A',
    marginHorizontal: 8
  },
  sendBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center'
  },
  sendIcon: {
    color: '#FFFFFF',
    fontSize: 12,
    marginLeft: 2
  }
});
