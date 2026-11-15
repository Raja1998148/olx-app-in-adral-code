import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { useState } from 'react'
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import { supabase } from '../lib/supabase'

const blue = '#2F6BFF'

export default function Login() {
  const [mobile, setMobile] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const sendOtp = async () => {
    const digits = mobile.replace(/\D/g, '')
    if (digits.length !== 10) { setError('Enter a valid 10-digit mobile number.'); return }
    setLoading(true); setError('')
    const { error: authError } = await supabase.auth.signInWithOtp({ phone: `+91${digits}` })
    setLoading(false)
    if (authError) { setError(authError.message); return }
    router.push({ pathname: '/verify', params: { phone: `+91 ${digits.slice(0, 5)} ${digits.slice(5)}` } })
  }
  return <View style={styles.page}><Pressable style={styles.back} onPress={() => router.back()}><Ionicons name="arrow-back" size={24} color="#0F172A" /></Pressable><View style={styles.brandMark}><Ionicons name="phone-portrait-outline" size={35} color={blue} /></View><Text style={styles.title}>Welcome to bazaar.</Text><Text style={styles.subtitle}>Enter your mobile number to continue buying and selling locally.</Text><Text style={styles.label}>Mobile number</Text><View style={[styles.phoneRow, error && styles.inputError]}><View style={styles.prefix}><Text style={styles.flag}>🇮🇳</Text><Text style={styles.code}>+91</Text></View><TextInput style={styles.input} value={mobile} onChangeText={value => { setMobile(value); setError('') }} placeholder="98765 43210" placeholderTextColor="#94A3B8" keyboardType="phone-pad" maxLength={10} autoFocus /></View>{error ? <Text style={styles.error}>{error}</Text> : <Text style={styles.hint}>We'll send a one-time verification code by SMS.</Text>}<Pressable style={[styles.button, loading && styles.disabled]} onPress={sendOtp} disabled={loading}>{loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Send OTP</Text>}</Pressable><View style={styles.terms}><Ionicons name="shield-checkmark-outline" size={17} color="#64748B" /><Text style={styles.termsText}>Your number stays private and secure.</Text></View></View>
}

const styles = StyleSheet.create({ page: { flex: 1, backgroundColor: '#FFF', paddingHorizontal: 25, paddingTop: 58 }, back: { width: 44, height: 44, justifyContent: 'center' }, brandMark: { height: 72, width: 72, borderRadius: 24, backgroundColor: '#EEF3FF', alignItems: 'center', justifyContent: 'center', marginTop: 45 }, title: { marginTop: 28, fontSize: 30, fontWeight: '900', color: '#101828', letterSpacing: -.7 }, subtitle: { color: '#64748B', fontSize: 15, lineHeight: 22, marginTop: 10, maxWidth: 305 }, label: { color: '#334155', fontSize: 14, fontWeight: '800', marginTop: 36, marginBottom: 9 }, phoneRow: { height: 56, borderWidth: 1, borderColor: '#D9E1EE', borderRadius: 14, flexDirection: 'row', alignItems: 'center' }, inputError: { borderColor: '#F04438' }, prefix: { height: 32, paddingHorizontal: 13, borderRightWidth: 1, borderRightColor: '#E2E8F0', flexDirection: 'row', alignItems: 'center', gap: 7 }, flag: { fontSize: 17 }, code: { color: '#334155', fontWeight: '800', fontSize: 15 }, input: { flex: 1, paddingHorizontal: 14, fontSize: 16, color: '#0F172A', letterSpacing: 1 }, hint: { marginTop: 9, color: '#64748B', fontSize: 12 }, error: { marginTop: 9, color: '#D92D20', fontSize: 12, fontWeight: '600' }, button: { height: 56, borderRadius: 15, backgroundColor: blue, alignItems: 'center', justifyContent: 'center', marginTop: 28 }, disabled: { opacity: .7 }, buttonText: { color: '#FFF', fontSize: 16, fontWeight: '800' }, terms: { marginTop: 20, flexDirection: 'row', justifyContent: 'center', gap: 7 }, termsText: { color: '#64748B', fontSize: 12 } })
