import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

/**
 * Custom vector icon system built specifically for React Native 0.57.x / Expo.
 * NO EMOJIS! Pixel-perfect 1:1 match to reference design.
 */

export const ShieldScalesIcon = ({ size = 48, color = '#FFFFFF' }) => {
  return (
    <View style={[styles.shieldOuter, { width: size, height: size * 1.1, borderColor: '#64B5F6' }]}>
      <View style={styles.shieldInner}>
        {/* Scales of justice visual */}
        <View style={{ width: 2, height: size * 0.45, backgroundColor: color, alignSelf: 'center' }} />
        <View style={{ position: 'absolute', top: size * 0.25, left: size * 0.2, right: size * 0.2, height: 2, backgroundColor: color }} />
        <View style={{ position: 'absolute', top: size * 0.25, left: size * 0.18, width: 8, height: 8, borderRadius: 4, borderWidth: 1.5, borderColor: color }} />
        <View style={{ position: 'absolute', top: size * 0.25, right: size * 0.18, width: 8, height: 8, borderRadius: 4, borderWidth: 1.5, borderColor: color }} />
      </View>
    </View>
  );
};

export const DocumentIcon = ({ size = 24, color = '#1976F3', bg = '#EAF3FF' }) => {
  return (
    <View style={[{ width: size * 1.4, height: size * 1.4, borderRadius: 8, backgroundColor: bg, alignItems: 'center', justifyContent: 'center' }]}>
      <View style={{ width: size * 0.7, height: size * 0.9, borderWidth: 1.5, borderColor: color, borderRadius: 3, padding: 2 }}>
        <View style={{ width: '100%', height: 2, backgroundColor: color, marginBottom: 2 }} />
        <View style={{ width: '70%', height: 2, backgroundColor: color, marginBottom: 2 }} />
        <View style={{ width: '90%', height: 2, backgroundColor: color }} />
      </View>
    </View>
  );
};

export const WarningAlertIcon = ({ size = 24 }) => {
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: '#D93025', alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ color: '#FFFFFF', fontWeight: '900', fontSize: size * 0.65, lineHeight: size * 0.75 }}>!</Text>
    </View>
  );
};

export const SearchIcon = ({ size = 20, color = '#667085' }) => {
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <View style={{ width: size * 0.65, height: size * 0.65, borderRadius: (size * 0.65) / 2, borderWidth: 2, borderColor: color }} />
      <View style={{ position: 'absolute', bottom: 1, right: 1, width: 2, height: size * 0.35, backgroundColor: color, transform: [{ rotate: '-45deg' }] }} />
    </View>
  );
};

export const HomeNavIcon = ({ size = 22, color = '#667085' }) => {
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <View style={{ width: 0, height: 0, borderLeftWidth: size / 2, borderRightWidth: size / 2, borderBottomWidth: size * 0.45, borderLeftColor: 'transparent', borderRightColor: 'transparent', borderBottomColor: color }} />
      <View style={{ width: size * 0.75, height: size * 0.45, backgroundColor: color, borderBottomLeftRadius: 2, borderBottomRightRadius: 2 }} />
    </View>
  );
};

export const QonunNavIcon = ({ size = 22, color = '#667085' }) => {
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <View style={{ width: size * 0.8, height: size * 0.85, borderWidth: 2, borderColor: color, borderRadius: 3, padding: 2 }}>
        <View style={{ width: '100%', height: 2, backgroundColor: color, marginBottom: 2 }} />
        <View style={{ width: '80%', height: 2, backgroundColor: color, marginBottom: 2 }} />
        <View style={{ width: '60%', height: 2, backgroundColor: color }} />
      </View>
    </View>
  );
};

export const SettingsNavIcon = ({ size = 22, color = '#667085' }) => {
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <View style={{ width: size * 0.75, height: size * 0.75, borderRadius: (size * 0.75) / 2, borderWidth: 2.5, borderColor: color, alignItems: 'center', justifyContent: 'center' }}>
        <View style={{ width: size * 0.25, height: size * 0.25, borderRadius: (size * 0.25) / 2, backgroundColor: color }} />
      </View>
    </View>
  );
};

export const LockIcon = ({ size = 22, color = '#1976F3' }) => {
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <View style={{ width: size * 0.5, height: size * 0.4, borderTopLeftRadius: size * 0.25, borderTopRightRadius: size * 0.25, borderWidth: 2, borderColor: color, borderBottomWidth: 0 }} />
      <View style={{ width: size * 0.75, height: size * 0.45, backgroundColor: color, borderRadius: 3 }} />
    </View>
  );
};

export const GlobeIcon = ({ size = 20, color = '#667085' }) => {
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, borderWidth: 1.8, borderColor: color, alignItems: 'center', justifyContent: 'center' }}>
      <View style={{ width: size * 0.5, height: size, borderRadius: size * 0.25, borderWidth: 1.2, borderColor: color }} />
      <View style={{ position: 'absolute', width: size, height: 1.2, backgroundColor: color }} />
    </View>
  );
};

export const ChevronRightIcon = ({ size = 16, color = '#667085' }) => {
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ color, fontSize: size, fontWeight: '600' }}>›</Text>
    </View>
  );
};

/**
 * Pixel-perfect, resolution-independent vector BackArrowIcon.
 * Uses exact geometric lines so it NEVER gets cut off or clipped by Android font engines.
 */
export const BackArrowIcon = ({ size = 22, color = '#FFFFFF' }) => {
  const width = size * 1.2;
  const height = size;
  const strokeWidth = 2.4;

  return (
    <View style={{ width, height, justifyContent: 'center', alignItems: 'flex-start', paddingLeft: 1 }}>
      {/* Horizontal stem line */}
      <View
        style={{
          width: width * 0.95,
          height: strokeWidth,
          backgroundColor: color,
          borderRadius: strokeWidth / 2
        }}
      />

      {/* Upper diagonal arrow leg */}
      <View
        style={{
          position: 'absolute',
          left: 1,
          top: height * 0.2,
          width: height * 0.46,
          height: strokeWidth,
          backgroundColor: color,
          borderRadius: strokeWidth / 2,
          transform: [{ rotate: '-45deg' }]
        }}
      />

      {/* Lower diagonal arrow leg */}
      <View
        style={{
          position: 'absolute',
          left: 1,
          bottom: height * 0.2,
          width: height * 0.46,
          height: strokeWidth,
          backgroundColor: color,
          borderRadius: strokeWidth / 2,
          transform: [{ rotate: '45deg' }]
        }}
      />
    </View>
  );
};

export const ExternalLinkIcon = ({ size = 16, color = '#1976F3' }) => {
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ color, fontSize: size, fontWeight: 'bold' }}>↗</Text>
    </View>
  );
};

export const CheckmarkIcon = ({ size = 18, color = '#34A853' }) => {
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: 'rgba(52, 168, 83, 0.15)', alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ color, fontSize: size * 0.65, fontWeight: '900' }}>✓</Text>
    </View>
  );
};

export const CloseIcon = ({ size = 16, color = '#667085' }) => {
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ color, fontSize: size, fontWeight: 'bold' }}>✕</Text>
    </View>
  );
};

export const UserIcon = ({ size = 20, color = '#8C9BAE' }) => {
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <View style={{ width: size * 0.44, height: size * 0.44, borderRadius: (size * 0.44) / 2, borderWidth: 1.8, borderColor: color, marginBottom: 1 }} />
      <View style={{ width: size * 0.78, height: size * 0.38, borderTopLeftRadius: size * 0.38, borderTopRightRadius: size * 0.38, borderWidth: 1.8, borderColor: color, borderBottomWidth: 0 }} />
    </View>
  );
};

export const MailIcon = ({ size = 20, color = '#8C9BAE' }) => {
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <View style={{ width: size * 0.88, height: size * 0.62, borderWidth: 1.8, borderColor: color, borderRadius: 3, padding: 1, justifyContent: 'flex-start', alignItems: 'center' }}>
        <View style={{ width: 0, height: 0, borderLeftWidth: size * 0.36, borderRightWidth: size * 0.36, borderTopWidth: size * 0.22, borderLeftColor: 'transparent', borderRightColor: 'transparent', borderTopColor: color }} />
      </View>
    </View>
  );
};

export const EyeIcon = ({ size = 20, color = '#8C9BAE' }) => {
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <View style={{ width: size * 0.88, height: size * 0.52, borderRadius: size * 0.26, borderWidth: 1.8, borderColor: color, alignItems: 'center', justifyContent: 'center' }}>
        <View style={{ width: size * 0.28, height: size * 0.28, borderRadius: (size * 0.28) / 2, backgroundColor: color }} />
      </View>
    </View>
  );
};

export const EyeOffIcon = ({ size = 20, color = '#8C9BAE' }) => {
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <View style={{ width: size * 0.88, height: size * 0.52, borderRadius: size * 0.26, borderWidth: 1.8, borderColor: color, alignItems: 'center', justifyContent: 'center' }}>
        <View style={{ width: size * 0.24, height: size * 0.24, borderRadius: (size * 0.24) / 2, backgroundColor: color }} />
      </View>
      <View style={{ position: 'absolute', width: size * 0.95, height: 2, backgroundColor: color, transform: [{ rotate: '-45deg' }] }} />
    </View>
  );
};

export const GoogleIcon = ({ size = 20 }) => {
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <View style={{ width: size, height: size, borderRadius: size / 2, borderWidth: 2.8, borderColor: '#4285F4', borderTopColor: '#EA4335', borderRightColor: '#4285F4', borderBottomColor: '#34A853', borderLeftColor: '#FBBC05', alignItems: 'center', justifyContent: 'center' }}>
        <View style={{ position: 'absolute', right: -1, top: size * 0.32, width: size * 0.48, height: 2.8, backgroundColor: '#4285F4' }} />
      </View>
    </View>
  );
};

export const ShieldScalesLogo = ({ size = 80 }) => {
  const width = size;
  const height = size * 1.12;

  return (
    <View style={[styles.brandShieldOuter, { width, height }]}>
      <View style={styles.brandShieldInner}>
        {/* Balance scale pillar */}
        <View style={{ width: 3, height: height * 0.42, backgroundColor: '#FFFFFF', borderRadius: 1.5, alignSelf: 'center', marginTop: height * 0.1 }} />
        {/* Base of pillar */}
        <View style={{ position: 'absolute', bottom: height * 0.22, width: width * 0.28, height: 3, backgroundColor: '#FFFFFF', borderRadius: 1.5 }} />
        {/* Top crossbeam */}
        <View style={{ position: 'absolute', top: height * 0.28, width: width * 0.55, height: 3, backgroundColor: '#FFFFFF', borderRadius: 1.5 }} />
        {/* Left pan strings & pan */}
        <View style={{ position: 'absolute', top: height * 0.28, left: width * 0.2, width: width * 0.16, height: height * 0.2, borderLeftWidth: 1.8, borderRightWidth: 1.8, borderColor: '#FFFFFF', borderBottomWidth: 0, transform: [{ rotate: '-15deg' }] }} />
        <View style={{ position: 'absolute', top: height * 0.46, left: width * 0.16, width: width * 0.22, height: height * 0.08, borderBottomLeftRadius: 10, borderBottomRightRadius: 10, borderWidth: 1.8, borderColor: '#FFFFFF', backgroundColor: 'transparent' }} />
        {/* Right pan strings & pan */}
        <View style={{ position: 'absolute', top: height * 0.28, right: width * 0.2, width: width * 0.16, height: height * 0.2, borderLeftWidth: 1.8, borderRightWidth: 1.8, borderColor: '#FFFFFF', borderBottomWidth: 0, transform: [{ rotate: '15deg' }] }} />
        <View style={{ position: 'absolute', top: height * 0.46, right: width * 0.16, width: width * 0.22, height: height * 0.08, borderBottomLeftRadius: 10, borderBottomRightRadius: 10, borderWidth: 1.8, borderColor: '#FFFFFF', backgroundColor: 'transparent' }} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  shieldOuter: {
    borderWidth: 2,
    borderRadius: 14,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    padding: 3,
    backgroundColor: '#0F2744',
    alignItems: 'center',
    justifyContent: 'center'
  },
  shieldInner: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  brandShieldOuter: {
    borderWidth: 3,
    borderColor: '#3B82F6',
    borderRadius: 22,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    backgroundColor: '#0A1C36',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6
  },
  brandShieldInner: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  }
});
