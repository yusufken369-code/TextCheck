import React, { useState, useEffect } from 'react';
import { View, StyleSheet, StatusBar, NativeModules, Platform, Alert, LogBox, ActivityIndicator } from 'react-native';
import HomeScreen from './screens/HomeScreen';
import LegislationScreen from './screens/LegislationScreen';
import SearchScreen from './screens/SearchScreen';
import ArticleDetailsScreen from './screens/ArticleDetailsScreen';
import SettingsScreen from './screens/SettingsScreen';
import PrivacyScreen from './screens/PrivacyScreen';
import AuthScreen from './screens/AuthScreen';
import LanguageSelectScreen from './screens/LanguageSelectScreen';
import BottomNavigation from './components/BottomNavigation';
import { LanguageProvider, useLanguage } from './context/LanguageContext';

LogBox.ignoreLogs([
  'SafeAreaView has been deprecated',
  'Cannot record touch end without a touch start',
  'AsyncStorageError',
  'Native module is null',
  'Failed to save language'
]);

function MainAppContent() {
  const { isLanguageSelected, isLoading, t } = useLanguage();
  const [currentTab, setCurrentTab] = useState('home');
  const [activeScreen, setActiveScreen] = useState('loading'); // 'loading', 'lang_select', 'auth', 'main', 'article-details', 'privacy'
  const [selectedArticleId, setSelectedArticleId] = useState('mjt-183');

  useEffect(() => {
    if (!isLoading) {
      if (!isLanguageSelected) {
        setActiveScreen('lang_select');
      } else {
        setActiveScreen('auth');
      }
    }
  }, [isLoading, isLanguageSelected]);

  const handleLanguageSelected = () => {
    setActiveScreen('auth');
  };

  const handleAuthSuccess = () => {
    setActiveScreen('main');
  };

  const handleSelectTab = (tabId) => {
    setCurrentTab(tabId);
    setActiveScreen('main');
  };

  const handleNavigateToArticle = (articleId) => {
    setSelectedArticleId(articleId || 'mjt-183');
    setActiveScreen('article-details');
  };

  const handleNavigateToPrivacy = () => {
    setActiveScreen('privacy');
  };

  const handleNavigateToAuth = () => {
    setActiveScreen('auth');
  };

  const handleNavigateToLanguageSelect = () => {
    setActiveScreen('lang_select');
  };

  const handleGoBack = () => {
    setActiveScreen('main');
  };

  const handleOpenKeyboardSettings = () => {
    if (Platform.OS === 'android' && NativeModules.KeyboardSettingsModule) {
      NativeModules.KeyboardSettingsModule.openInputMethodSettings();
    } else {
      Alert.alert(
        t('alertEnableKeyboardTitle'),
        t('alertEnableKeyboardMessage')
      );
    }
  };

  if (isLoading || activeScreen === 'loading') {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  // FIRST TIME LAUNCH: Language Selection Screen
  if (activeScreen === 'lang_select') {
    return (
      <LanguageSelectScreen onLanguageSelected={handleLanguageSelected} />
    );
  }

  // AUTHENTICATION FLOW: Login or Register
  if (activeScreen === 'auth') {
    return (
      <AuthScreen
        onGoBack={isLanguageSelected ? handleGoBack : undefined}
        onAuthSuccess={handleAuthSuccess}
      />
    );
  }

  const renderCurrentView = () => {
    if (activeScreen === 'article-details') {
      return (
        <ArticleDetailsScreen
          articleId={selectedArticleId}
          onGoBack={handleGoBack}
        />
      );
    }

    if (activeScreen === 'privacy') {
      return (
        <PrivacyScreen
          onGoBack={handleGoBack}
        />
      );
    }

    switch (currentTab) {
      case 'home':
        return (
          <HomeScreen
            onNavigateToArticle={handleNavigateToArticle}
            onOpenKeyboardSettings={handleOpenKeyboardSettings}
          />
        );

      case 'legislation':
        return (
          <LegislationScreen
            onSelectDoc={() => setActiveScreen('main')}
            onGoBack={() => setCurrentTab('home')}
          />
        );

      case 'search':
        return (
          <SearchScreen
            onSelectArticle={handleNavigateToArticle}
            onGoBack={() => setCurrentTab('home')}
          />
        );

      case 'settings':
        return (
          <SettingsScreen
            onNavigateToPrivacy={handleNavigateToPrivacy}
            onNavigateToAuth={handleNavigateToAuth}
            onNavigateToLanguageSelect={handleNavigateToLanguageSelect}
            onGoBack={() => setCurrentTab('home')}
          />
        );

      default:
        return <HomeScreen onNavigateToArticle={handleNavigateToArticle} />;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0B1728" />
      <View style={styles.body}>
        {renderCurrentView()}
      </View>
      {activeScreen === 'main' && (
        <BottomNavigation
          activeTab={currentTab}
          onSelectTab={handleSelectTab}
        />
      )}
    </View>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <MainAppContent />
    </LanguageProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B1728'
  },
  body: {
    flex: 1
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#071426',
    alignItems: 'center',
    justifyContent: 'center'
  }
});
