import React from 'react';
import { View, Text } from 'react-native';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from '@rneui/base';

export default function CoachAccountScreen() {
  const { userData, logout } = useAuth();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Coach Account</Text>
      {userData && (
        <Button onPress={logout}>Logout</Button>
      )}
    </View>
  );
}