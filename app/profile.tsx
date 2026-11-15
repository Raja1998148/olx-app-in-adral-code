import AsyncStorage from '@react-native-async-storage/async-storage'
import { Ionicons } from '@expo/vector-icons'
import * as ImagePicker from 'expo-image-picker'
import { router } from 'expo-router'
import { useEffect, useState } from 'react'
import { ActivityIndicator, Alert, Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import { supabase } from '../lib/supabase'

const blue = '#2F6BFF'

export default function ProfileSetup() {
  const [name, setName] = useState('')
  const [city, setCity] = useState('')
  const [photoUri, setPhotoUri] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  useEffect(() => { AsyncStorage.getItem('bazaar_city').then(value => setCity(value ?? '')) }, [])
  const choosePhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsEditing: true, aspect: [1, 1], quality: .8 })
    if (!result.canceled) setPhotoUri(result.assets[0].uri)
  }
  const uploadPhoto = async (userId: string) => {
    if (!photoUri) return null
    const response = await fetch(photoUri)
    const arrayBuffer = await response.arrayBuffer()
    const path = `${userId}/avatar-${Date.now()}.jpg`
    const { error: uploadError } = await supabase.storage.from('avatars').upload(path, arrayBuffer, { contentType: 'image/jpeg', upsert: true })
    if (uploadError) throw uploadError
    return supabase.storage.from('avatars').getPublicUrl(path).data.publicUrl
  }
  const saveProfile = async (skip = false) => {
    setLoading(true); setError('')
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.replace('/login'); return }
    try {
      const avatarUrl = skip ? null : await uploadPhoto(user.id)
      const { error: profileError } = await supabase.from('profiles').upsert({ id: user.id, full_name: skip ? '' : name.trim(), city: skip ? city || null : city.trim(), avatar_url: avatarUrl, phone: user.phone ?? null })
      if (profileError) throw profileError
      await AsyncStorage.setItem('bazaar_profile_complete', 'true')
      router.replace('/(tabs)')
    } catch (saveError) { setError(saveError instanceof Error ? saveError.message : 'We could not save your profile. Please try again.') } finally { setLoading(false) }
  }
  return <View style={styles.page}><View style={styles.top}><Text style={styles.logo}>bazaar<Text style={{ color: blue }}>.</Text></Text><Text style={styles.step}>1 of 1</Text></View><Text style={styles.title}>Set up your profile</Text><Text style={styles.subtitle}>A few details help buyers and sellers know who they're chatting with.</Text><Pressable style={styles.photo} onPress={choosePhoto}>{photoUri ? <Image source={{ uri: photoUri }} style={styles.photoImage} /> : <Ionicons name="person-outline" size={42} color="#7697ED" />}<View style={styles.camera}><Ionicons name="camera" size={17} color="#FFF" /></View></Pressable><Text style={styles.photoHint}>Add a profile photo</Text><Text style={styles.label}>Full name</Text><TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Enter your name" placeholderTextColor="#94A3B8" autoCapitalize="words" /><Text style={styles.label}>City</Text><View style={styles.cityRow}><Ionicons name="location-outline" size={19} color={blue} /><TextInput style={styles.cityInput} value={city} onChangeText={setCity} placeholder="Choose your city" placeholderTextColor="#94A3B8" autoCapitalize="words" /></View>{error ? <Text style={styles.error}>{error}</Text> : null}<Pressable style={[styles.button, loading && styles.disabled]} onPress={() => saveProfile()} disabled={loading}>{loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Save and continue</Text>}</Pressable><Pressable style={styles.skip} onPress={() => saveProfile(true)} disabled={loading}><Text style={styles.skipText}>Skip for now</Text></Pressable></View>
}

const styles = StyleSheet.create({ page: { flex: 1, backgroundColor: '#FFF', paddingHorizontal: 25, paddingTop: 58 }, top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, logo: { color: '#101828', fontSize: 28, fontWeight: '900', letterSpacing: -1.5 }, step: { color: '#94A3B8', fontWeight: '700', fontSize: 12 }, title: { color: '#101828', fontSize: 29, fontWeight: '900', letterSpacing: -.7, marginTop: 46 }, subtitle: { color: '#64748B', fontSize: 15, lineHeight: 22, marginTop: 10 }, photo: { width: 112, height: 112, borderRadius: 56, backgroundColor: '#EEF3FF', alignSelf: 'center', marginTop: 30, alignItems: 'center', justifyContent: 'center', overflow: 'visible' }, photoImage: { width: 112, height: 112, borderRadius: 56 }, camera: { position: 'absolute', right: -2, bottom: 1, width: 34, height: 34, backgroundColor: blue, borderRadius: 17, borderWidth: 3, borderColor: '#FFF', alignItems: 'center', justifyContent: 'center' }, photoHint: { textAlign: 'center', color: blue, fontWeight: '800', fontSize: 13, marginTop: 10 }, label: { color: '#334155', fontWeight: '800', fontSize: 14, marginTop: 25, marginBottom: 8 }, input: { height: 54, borderRadius: 13, borderWidth: 1, borderColor: '#D9E1EE', color: '#0F172A', fontSize: 15, paddingHorizontal: 14 }, cityRow: { height: 54, borderRadius: 13, borderWidth: 1, borderColor: '#D9E1EE', flexDirection: 'row', alignItems: 'center', paddingLeft: 14 }, cityInput: { flex: 1, height: '100%', paddingHorizontal: 10, color: '#0F172A', fontSize: 15 }, error: { color: '#D92D20', fontSize: 12, fontWeight: '600', marginTop: 10 }, button: { height: 56, borderRadius: 15, backgroundColor: blue, marginTop: 29, justifyContent: 'center', alignItems: 'center' }, buttonText: { color: '#FFF', fontSize: 16, fontWeight: '800' }, disabled: { opacity: .7 }, skip: { height: 50, justifyContent: 'center', alignItems: 'center' }, skipText: { color: blue, fontSize: 14, fontWeight: '800' } })
