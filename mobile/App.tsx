import React, { useEffect } from 'react'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import RootNavigator from './navigation/RootNavigator'

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor="#1f2937" />
      <RootNavigator />
    </SafeAreaProvider>
  )
}
