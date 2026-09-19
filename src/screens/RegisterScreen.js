import React from 'react';
import AuthScreen from './AuthScreen';

export default function RegisterScreen(props) {
  return <AuthScreen {...props} initialTab="register" />;
}
