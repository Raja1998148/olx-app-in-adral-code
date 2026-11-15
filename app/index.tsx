import AsyncStorage from '@react-native-async-storage/async-storage'
import { Ionicons } from '@expo/vector-icons'
import * as Location from 'expo-location'
import { router } from 'expo-router'
import { useEffect, useState } from 'react'
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import { supabase } from '../lib/supabase'

const blue = '#2F6BFF'
const slides = [
  { icon: 'pricetags-outline', title: 'Find great deals\nnear you', copy: 'Explore millions of pre-loved finds in your neighbourhood.' },
  { icon: 'flash-outline', title: 'Sell anything in\n60 seconds', copy: 'Snap a photo, add a price, and reach local buyers quickly.' },
  { icon: 'location-outline', title: 'Shop locally', copy: 'Choose your city to see the best deals around you.' },
] as const

export default function Welcome() {
  const [loading, setLoading] = useState(true)
  const [slide, setSlide] = useState(0)
  const [city, setCity] = useState('')
  const [manual, setManual] = useState(false)

  useEffect(() => { (async () => { const [done, session] = await Promise.all([AsyncStorage.getItem('bazaar_onboarded'), supabase.auth.getSession()]); if (done) router.replace(session.data.session ? '/(tabs)' : '/login'); else setLoading(false) })() }, [])
  const finish = async (selectedCity: string) => { await AsyncStorage.multiSet([['bazaar_onboarded', 'true'], ['bazaar_city', selectedCity]]); const { data } = await supabase.auth.getSession(); router.replace(data.session ? '/(tabs)' : '/login') }
  const useLocation = async () => { const permission = await Location.requestForegroundPermissionsAsync(); if (permission.status !== 'granted') { setManual(true); return }; const place = await Location.reverseGeocodeAsync((await Location.getCurrentPositionAsync({})).coords); await finish(place[0]?.city ?? place[0]?.subregion ?? 'Your location') }
  if (loading) return <View style={styles.splash}><Text style={styles.splashLogo}>bazaar<Text style={{ color: '#AFC5FF' }}>.</Text></Text><ActivityIndicator color="#FFF" style={{ marginTop: 20 }} /></View>
  const current = slides[slide]
  const last = slide === slides.length - 1
  return <View style={styles.page}><View style={styles.brand}><Text style={styles.logo}>bazaar<Text style={{ color: blue }}>.</Text></Text><Pressable onPress={() => finish('Bengaluru')}><Text style={styles.skip}>Skip</Text></Pressable></View><View style={styles.art}><View style={styles.orbit} /><View style={styles.iconCircle}><Ionicons name={current.icon} size={70} color={blue} /></View></View><View style={styles.copy}><View style={styles.dots}>{slides.map((_, index) => <View key={index} style={[styles.dot, index === slide && styles.activeDot]} />)}</View><Text style={styles.title}>{current.title}</Text><Text style={styles.description}>{current.copy}</Text></View>{last ? <View style={styles.locationActions}>{manual && <TextInput value={city} onChangeText={setCity} placeholder="Enter your city" placeholderTextColor="#94A3B8" style={styles.input} autoFocus />}<Pressable style={styles.primary} onPress={useLocation}><Ionicons name="navigate" size={18} color="#FFF" /><Text style={styles.primaryText}>Use my current location</Text></Pressable><Pressable style={styles.secondary} onPress={() => manual ? finish(city.trim() || 'Bengaluru') : setManual(true)}><Text style={styles.secondaryText}>{manual ? 'Continue' : 'Choose city manually'}</Text></Pressable></View> : <View style={styles.footer}><Pressable style={styles.next} onPress={() => setSlide(slide + 1)}><Text style={styles.nextText}>Continue</Text><Ionicons name="arrow-forward" color="#FFF" size={19} /></Pressable></View>}</View>
}

const styles = StyleSheet.create({ page: { flex: 1, backgroundColor: '#FFF', paddingHorizontal: 25, paddingTop: 58, paddingBottom: 38 }, splash: { flex: 1, backgroundColor: blue, alignItems: 'center', justifyContent: 'center' }, splashLogo: { color: '#FFF', fontSize: 44, fontWeight: '900', letterSpacing: -2 }, brand: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, logo: { color: '#101828', fontSize: 28, fontWeight: '900', letterSpacing: -1.5 }, skip: { color: '#64748B', fontWeight: '700', fontSize: 14 }, art: { flex: 1, minHeight: 290, alignItems: 'center', justifyContent: 'center', position: 'relative' }, orbit: { width: 235, height: 235, borderRadius: 118, backgroundColor: '#EEF3FF', position: 'absolute' }, iconCircle: { width: 150, height: 150, borderRadius: 75, backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center', shadowColor: '#2F6BFF', shadowOpacity: .16, shadowRadius: 22, elevation: 8 }, copy: { alignItems: 'center' }, dots: { flexDirection: 'row', gap: 7, marginBottom: 28 }, dot: { height: 7, width: 7, backgroundColor: '#D7E0F0', borderRadius: 7 }, activeDot: { width: 23, backgroundColor: blue }, title: { textAlign: 'center', fontSize: 29, lineHeight: 35, fontWeight: '900', color: '#101828', letterSpacing: -.7 }, description: { color: '#64748B', textAlign: 'center', fontSize: 15, lineHeight: 22, paddingHorizontal: 13, marginTop: 14 }, footer: { marginTop: 32 }, next: { backgroundColor: blue, borderRadius: 15, height: 56, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8 }, nextText: { color: '#FFF', fontSize: 16, fontWeight: '800' }, locationActions: { marginTop: 26, gap: 11 }, primary: { backgroundColor: blue, height: 56, borderRadius: 15, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', gap: 8 }, primaryText: { color: '#FFF', fontSize: 15, fontWeight: '800' }, secondary: { height: 52, borderRadius: 15, justifyContent: 'center', alignItems: 'center' }, secondaryText: { color: blue, fontSize: 15, fontWeight: '800' }, input: { height: 54, borderWidth: 1, borderColor: '#C9D6F2', borderRadius: 14, paddingHorizontal: 15, color: '#0F172A', fontSize: 15 } })
