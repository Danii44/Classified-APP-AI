import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'

export default function CreateListingScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Post New Ad</Text>
      </View>

      <View style={styles.content}>
        <Ionicons name="duplicate-outline" size={64} color="#60A5FA" />
        <Text style={styles.featureTitle}>Coming Soon</Text>
        <Text style={styles.description}>Use the web app to create listings for now</Text>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
  header: {
    padding: 16,
    backgroundColor: '#1f2937',
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  featureTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    marginTop: 16,
  },
  description: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 8,
  },
})
