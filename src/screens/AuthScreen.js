import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import {
  ShieldScalesLogo,
  UserIcon,
  MailIcon,
  LockIcon,
  EyeIcon,
  EyeOffIcon,
  GoogleIcon,
  BackArrowIcon
} from '../components/Icons';
import { useLanguage } from '../context/LanguageContext';
import supabase from '../services/supabaseClient';

export default function AuthScreen({ initialTab = 'login', onAuthSuccess, onGoBack }) {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState(initialTab); // 'login' | 'register'
  const [loading, setLoading] = useState(false);

  // Form State - Login
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Form State - Register
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegConfirmPassword, setShowRegConfirmPassword] = useState(false);

  // Validation Errors
  const [usernameError, setUsernameError] = useState('');
  const [passwordMatchError, setPasswordMatchError] = useState('');
  const [loginError, setLoginError] = useState('');

  // Handle Tab Switch
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setUsernameError('');
    setPasswordMatchError('');
    setLoginError('');
  };

  // Handle Login Submit
  const handleLoginSubmit = async () => {
    setLoginError('');
    if (!loginIdentifier.trim()) {
      setLoginError(t('identifierRequired'));
      return;
    }
    if (!loginPassword) {
      setLoginError(t('passwordRequired'));
      return;
    }

    setLoading(true);
    try {
      // Determine if identifier is email or username
      const emailToUse = loginIdentifier.includes('@')
        ? loginIdentifier.trim()
        : `${loginIdentifier.trim()}@huquqiy.uz`;

      const { data, error } = await supabase.auth.signInWithPassword({
        email: emailToUse,
        password: loginPassword,
      });

      setLoading(false);

      if (error) {
        setLoginError(error.message || t('loginErrorMsg') || 'Tizimga kirishda xatolik yuz berdi');
        return;
      }

      Alert.alert(t('loginButton'), t('loginSuccessMsg'));
      if (onAuthSuccess) {
        onAuthSuccess({ identifier: loginIdentifier, user: data?.user });
      }
    } catch (err) {
      setLoading(false);
      setLoginError(err.message || 'Xatolik yuz berdi');
    }
  };

  // Handle Register Submit
  const handleRegisterSubmit = async () => {
    let hasError = false;
    setUsernameError('');
    setPasswordMatchError('');

    if (!regUsername.trim()) {
      setUsernameError(t('usernameRequired'));
      hasError = true;
    }

    if (regUsername.trim().toLowerCase() === 'admin' || regUsername.trim().toLowerCase() === 'user') {
      setUsernameError(t('usernameTaken'));
      hasError = true;
    }

    if (regPassword !== regConfirmPassword) {
      setPasswordMatchError(t('passwordsMismatch'));
      hasError = true;
    }

    if (hasError) return;

    setLoading(true);
    try {
      const emailToUse = regEmail.trim() || `${regUsername.trim()}@huquqiy.uz`;

      const { data, error } = await supabase.auth.signUp({
        email: emailToUse,
        password: regPassword,
        options: {
          data: {
            username: regUsername.trim()
          }
        }
      });

      setLoading(false);

      if (error) {
        Alert.alert('Ro‘yxatdan o‘tishda xatolik', error.message);
        return;
      }

      Alert.alert(t('registerButton'), t('registerSuccessMsg'));
      if (onAuthSuccess) {
        onAuthSuccess({ username: regUsername, email: regEmail, user: data?.user });
      }
    } catch (err) {
      setLoading(false);
      Alert.alert('Xatolik', err.message);
    }
  };

  const handleGoogleAuth = () => {
    Alert.alert('Google Authentication', t('googleLogin'));
  };

  const handleForgotPassword = () => {
    Alert.alert(t('forgotPassword'), t('forgotPassword'));
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Back button if header navigation is provided */}
        {onGoBack && (
          <TouchableOpacity style={styles.backBtn} onPress={onGoBack} activeOpacity={0.7}>
            <BackArrowIcon size={20} color="#FFFFFF" />
          </TouchableOpacity>
        )}

        {/* Top Watermark Background Visual */}
        <View style={styles.watermarkScales} pointerEvents="none">
          <View style={styles.watermarkLineVertical} />
          <View style={styles.watermarkLineHorizontal} />
        </View>

        {/* Top App Branding */}
        <View style={styles.brandingHeader}>
          <ShieldScalesLogo size={76} />
          <Text style={styles.appTitle}>Huquqiy Keyboard</Text>
          <Text style={styles.appSubtitle}>
            {t('appSubtitle')}
          </Text>
        </View>

        {/* Authentication Container Card */}
        <View style={styles.authCard}>
          {/* Tab Selector at top of Card */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[
                styles.tabButton,
                activeTab === 'login' && styles.activeTabButton
              ]}
              onPress={() => handleTabChange('login')}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === 'login' && styles.activeTabText
                ]}
              >
                {t('loginTab')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.tabButton,
                activeTab === 'register' && styles.activeTabButton
              ]}
              onPress={() => handleTabChange('register')}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === 'register' && styles.activeTabText
                ]}
              >
                {t('registerTab')}
              </Text>
            </TouchableOpacity>
          </View>

          {/* LOGIN SCREEN FORM */}
          {activeTab === 'login' ? (
            <View style={styles.formContent}>
              {/* Username or Email Input */}
              <View style={styles.inputGroup}>
                <View style={styles.inputWrapper}>
                  <View style={styles.inputLeftIcon}>
                    <UserIcon size={20} color="#8C9BAE" />
                  </View>
                  <TextInput
                    style={styles.textInput}
                    placeholder={t('loginIdentifierPlaceholder')}
                    placeholderTextColor="#506580"
                    value={loginIdentifier}
                    onChangeText={setLoginIdentifier}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
              </View>

              {/* Password Input */}
              <View style={styles.inputGroup}>
                <View style={styles.inputWrapper}>
                  <View style={styles.inputLeftIcon}>
                    <LockIcon size={20} color="#8C9BAE" />
                  </View>
                  <TextInput
                    style={styles.textInput}
                    placeholder={t('passwordPlaceholder')}
                    placeholderTextColor="#506580"
                    secureTextEntry={!showLoginPassword}
                    value={loginPassword}
                    onChangeText={setLoginPassword}
                  />
                  <TouchableOpacity
                    style={styles.eyeToggleBtn}
                    onPress={() => setShowLoginPassword(!showLoginPassword)}
                    activeOpacity={0.7}
                  >
                    {showLoginPassword ? (
                      <EyeIcon size={20} color="#8C9BAE" />
                    ) : (
                      <EyeOffIcon size={20} color="#8C9BAE" />
                    )}
                  </TouchableOpacity>
                </View>
              </View>

              {loginError ? (
                <Text style={styles.errorText}>{loginError}</Text>
              ) : null}

              {/* Remember Me & Forgot Password Row */}
              <View style={styles.optionsRow}>
                <TouchableOpacity
                  style={styles.rememberRow}
                  onPress={() => setRememberMe(!rememberMe)}
                  activeOpacity={0.8}
                >
                  <View
                    style={[
                      styles.checkbox,
                      rememberMe && styles.checkboxChecked
                    ]}
                  >
                    {rememberMe && <Text style={styles.checkmarkText}>✓</Text>}
                  </View>
                  <Text style={styles.rememberText}>{t('rememberMe')}</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={handleForgotPassword} activeOpacity={0.7}>
                  <Text style={styles.forgotText}>{t('forgotPassword')}</Text>
                </TouchableOpacity>
              </View>

              {/* Primary Login Button */}
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={handleLoginSubmit}
                activeOpacity={0.85}
              >
                <Text style={styles.primaryButtonText}>{t('loginButton')}</Text>
              </TouchableOpacity>

              {/* Divider */}
              <View style={styles.dividerRow}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>{t('orDivider')}</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* Google Login Button */}
              <TouchableOpacity
                style={styles.googleButton}
                onPress={handleGoogleAuth}
                activeOpacity={0.85}
              >
                <View style={styles.googleIconWrapper}>
                  <GoogleIcon size={18} />
                </View>
                <Text style={styles.googleButtonText}>{t('googleLogin')}</Text>
              </TouchableOpacity>

              {/* Switch to Registration Link */}
              <View style={styles.bottomLinkRow}>
                <Text style={styles.bottomLinkSub}>{t('noAccount')} </Text>
                <TouchableOpacity onPress={() => handleTabChange('register')} activeOpacity={0.7}>
                  <Text style={styles.bottomLinkAction}>{t('registerButton')}</Text>
                </TouchableOpacity>
              </View>

              {/* Skip auth button */}
              <TouchableOpacity
                style={styles.skipBtn}
                onPress={() => onAuthSuccess && onAuthSuccess({ isGuest: true })}
                activeOpacity={0.7}
              >
                <Text style={styles.skipBtnText}>{t('skipAuth')} →</Text>
              </TouchableOpacity>
            </View>
          ) : (
            /* REGISTRATION SCREEN FORM */
            <View style={styles.formContent}>
              {/* Username Input */}
              <View style={styles.inputGroup}>
                <View
                  style={[
                    styles.inputWrapper,
                    !!usernameError && styles.inputWrapperError
                  ]}
                >
                  <View style={styles.inputLeftIcon}>
                    <UserIcon size={20} color={usernameError ? '#EF4444' : '#8C9BAE'} />
                  </View>
                  <TextInput
                    style={[
                      styles.textInput,
                      !!usernameError && styles.textInputError
                    ]}
                    placeholder={t('usernamePlaceholder')}
                    placeholderTextColor={usernameError ? '#F87171' : '#506580'}
                    value={regUsername}
                    onChangeText={(text) => {
                      setRegUsername(text);
                      if (usernameError) setUsernameError('');
                    }}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
                {!!usernameError && (
                  <Text style={styles.fieldErrorText}>{usernameError}</Text>
                )}
              </View>

              {/* Email Input (Optional) */}
              <View style={styles.inputGroup}>
                <View style={styles.inputWrapper}>
                  <View style={styles.inputLeftIcon}>
                    <MailIcon size={20} color="#8C9BAE" />
                  </View>
                  <TextInput
                    style={styles.textInput}
                    placeholder={t('emailPlaceholder')}
                    placeholderTextColor="#506580"
                    value={regEmail}
                    onChangeText={setRegEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
              </View>

              {/* Password Input */}
              <View style={styles.inputGroup}>
                <View style={styles.inputWrapper}>
                  <View style={styles.inputLeftIcon}>
                    <LockIcon size={20} color="#8C9BAE" />
                  </View>
                  <TextInput
                    style={styles.textInput}
                    placeholder={t('passwordPlaceholder')}
                    placeholderTextColor="#506580"
                    secureTextEntry={!showRegPassword}
                    value={regPassword}
                    onChangeText={setRegPassword}
                  />
                  <TouchableOpacity
                    style={styles.eyeToggleBtn}
                    onPress={() => setShowRegPassword(!showRegPassword)}
                    activeOpacity={0.7}
                  >
                    {showRegPassword ? (
                      <EyeIcon size={20} color="#8C9BAE" />
                    ) : (
                      <EyeOffIcon size={20} color="#8C9BAE" />
                    )}
                  </TouchableOpacity>
                </View>
              </View>

              {/* Confirm Password Input */}
              <View style={styles.inputGroup}>
                <View
                  style={[
                    styles.inputWrapper,
                    !!passwordMatchError && styles.inputWrapperError
                  ]}
                >
                  <View style={styles.inputLeftIcon}>
                    <LockIcon size={20} color={passwordMatchError ? '#EF4444' : '#8C9BAE'} />
                  </View>
                  <TextInput
                    style={styles.textInput}
                    placeholder={t('confirmPasswordPlaceholder')}
                    placeholderTextColor="#506580"
                    secureTextEntry={!showRegConfirmPassword}
                    value={regConfirmPassword}
                    onChangeText={(text) => {
                      setRegConfirmPassword(text);
                      if (passwordMatchError) setPasswordMatchError('');
                    }}
                  />
                  <TouchableOpacity
                    style={styles.eyeToggleBtn}
                    onPress={() => setShowRegConfirmPassword(!showRegConfirmPassword)}
                    activeOpacity={0.7}
                  >
                    {showRegConfirmPassword ? (
                      <EyeIcon size={20} color="#8C9BAE" />
                    ) : (
                      <EyeOffIcon size={20} color="#8C9BAE" />
                    )}
                  </TouchableOpacity>
                </View>
                {!!passwordMatchError && (
                  <Text style={styles.fieldErrorText}>{passwordMatchError}</Text>
                )}
              </View>

              {/* Primary Register Button */}
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={handleRegisterSubmit}
                activeOpacity={0.85}
              >
                <Text style={styles.primaryButtonText}>{t('registerButton')}</Text>
              </TouchableOpacity>

              {/* Divider */}
              <View style={styles.dividerRow}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>{t('orDivider')}</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* Google Register Button */}
              <TouchableOpacity
                style={styles.googleButton}
                onPress={handleGoogleAuth}
                activeOpacity={0.85}
              >
                <View style={styles.googleIconWrapper}>
                  <GoogleIcon size={18} />
                </View>
                <Text style={styles.googleButtonText}>{t('googleRegister')}</Text>
              </TouchableOpacity>

              {/* Switch to Login Link */}
              <View style={styles.bottomLinkRow}>
                <Text style={styles.bottomLinkSub}>{t('haveAccount')} </Text>
                <TouchableOpacity onPress={() => handleTabChange('login')} activeOpacity={0.7}>
                  <Text style={styles.bottomLinkAction}>{t('loginTab')}</Text>
                </TouchableOpacity>
              </View>

              {/* Skip auth button */}
              <TouchableOpacity
                style={styles.skipBtn}
                onPress={() => onAuthSuccess && onAuthSuccess({ isGuest: true })}
                activeOpacity={0.7}
              >
                <Text style={styles.skipBtnText}>{t('skipAuth')} →</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#071426'
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 36,
    paddingBottom: 40,
    alignItems: 'center'
  },
  backBtn: {
    position: 'absolute',
    top: 16,
    left: 16,
    zIndex: 10,
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.08)'
  },
  watermarkScales: {
    position: 'absolute',
    top: 20,
    right: 20,
    opacity: 0.06
  },
  watermarkLineVertical: {
    width: 2,
    height: 120,
    backgroundColor: '#2563EB'
  },
  watermarkLineHorizontal: {
    position: 'absolute',
    top: 40,
    left: -40,
    width: 82,
    height: 2,
    backgroundColor: '#2563EB'
  },
  brandingHeader: {
    alignItems: 'center',
    marginBottom: 24
  },
  appTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '800',
    marginTop: 16,
    letterSpacing: -0.3
  },
  appSubtitle: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '400',
    textAlign: 'center',
    marginTop: 6,
    maxWidth: 270,
    lineHeight: 18
  },
  authCard: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#0F1E33',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#1E3A5F',
    padding: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 8
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#071527',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#1E385B'
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8
  },
  activeTabButton: {
    backgroundColor: '#2563EB'
  },
  tabText: {
    color: '#8C9BAE',
    fontSize: 14,
    fontWeight: '500'
  },
  activeTabText: {
    color: '#FFFFFF',
    fontWeight: '700'
  },
  formContent: {
    width: '100%'
  },
  inputGroup: {
    marginBottom: 14
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#071527',
    borderWidth: 1,
    borderColor: '#1E385B',
    borderRadius: 12,
    height: 48,
    paddingHorizontal: 14
  },
  inputWrapperError: {
    borderColor: '#EF4444',
    borderWidth: 1.2
  },
  inputLeftIcon: {
    marginRight: 10,
    width: 22,
    alignItems: 'center'
  },
  textInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 14,
    height: '100%'
  },
  textInputError: {
    color: '#F87171'
  },
  eyeToggleBtn: {
    padding: 6,
    marginLeft: 6
  },
  fieldErrorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
    fontWeight: '500'
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginBottom: 10,
    textAlign: 'center'
  },
  optionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    marginTop: 2
  },
  rememberRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#1E385B',
    backgroundColor: '#071527',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8
  },
  checkboxChecked: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB'
  },
  checkmarkText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
    lineHeight: 14
  },
  rememberText: {
    color: '#CBD5E1',
    fontSize: 13,
    fontWeight: '400'
  },
  forgotText: {
    color: '#60A5FA',
    fontSize: 13,
    fontWeight: '600'
  },
  primaryButton: {
    backgroundColor: '#2563EB',
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700'
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 18
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#1E385B'
  },
  dividerText: {
    color: '#64748B',
    fontSize: 13,
    marginHorizontal: 12,
    fontWeight: '400'
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1E385B',
    backgroundColor: 'transparent'
  },
  googleIconWrapper: {
    marginRight: 10
  },
  googleButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600'
  },
  bottomLinkRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22
  },
  bottomLinkSub: {
    color: '#94A3B8',
    fontSize: 13
  },
  bottomLinkAction: {
    color: '#60A5FA',
    fontSize: 13,
    fontWeight: '700'
  },
  skipBtn: {
    marginTop: 18,
    alignItems: 'center',
    paddingVertical: 8
  },
  skipBtnText: {
    color: '#64748B',
    fontSize: 13,
    fontWeight: '500'
  }
});
