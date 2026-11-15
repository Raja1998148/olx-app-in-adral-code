import { Ionicons } from '@expo/vector-icons'
import { router, useLocalSearchParams } from 'expo-router'
import { useEffect, useRef, useState } from 'react'
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import { supabase } from '../lib/supabase'

const blue = '#2F6BFF'

export default function Verify() {
  const { phone = '' } = useLocalSearchParams<{ phone: string }>()
  const [code, setCode] = useState('')
  const [seconds, setSeconds] = useState(30)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const hiddenInput = useRef<TextInput>(null)
  useEffect(() => { if (!seconds) return; const timer = setTimeout(() => setSeconds(seconds - 1), 1000); return () => clearTimeout(timer) }, [seconds])
  const verify = async (value: string) => { if (value.length !== 6) return; setLoading(true); setError(''); const cleanPhone = phone.replace(/\s/g, ''); const { error: verifyError } = await supabase.auth.verifyOtp({ phone: cleanPhone, token: value, type: 'sms' }); setLoading(false); if (verifyError) { setError('That code is incorrect or has expired. Please try again.'); return }; router.replace('/(tabs)') }
  const updateCode = (value: string) => { const digits = value.replace(/\D/g, '').slice(0, 6); setCode(digits); setError(''); if (digits.length === 6) verify(digits) }
  const resend = async () => { const cleanPhone = phone.replace(/\s/g, ''); await supabase.auth.signInWithOtp({ phone: cleanPhone }); setSeconds(30); setError('') }
  return <View style={styles.page}><Pressable style={styles.back} onPress={() => router.back()}><Ionicons name="arrow-back" size={24} color="#0F172A" /></Pressable><View style={styles.icon}><Ionicons name="chatbubble-ellipses-outline" size={35} color={blue} /></View><Text style={styles.title}>Verify your number</Text><Text style={styles.subtitle}>We've sent a 6-digit code to</Text><Text style={styles.phone}>{phone}</Text><Pressable onPress={() => hiddenInput.current?.focus()} style={styles.otpRow}>{Array.from({ length: 6 }).map((_, index) => <View key={index} style={[styles.box, error && styles.boxError, code.length === index && styles.boxFocused]}><Text style={styles.digit}>{code[index] ?? ''}</Text></View>)}</Pressable><TextInput ref={hiddenInput} value={code} onChangeText={updateCode} keyboardType="number-pad" textContentType="oneTimeCode" autoComplete="sms-otp" maxLength={6} style={styles.hiddenInput} autoFocus />{loading && <ActivityIndicator color={blue} style={{ marginTop: 18 }} />}{error ? <Text style={styles.error}>{error}</Text> : <Text style={styles.autoFill}>Your code will fill automatically when the SMS arrives.</Text>}<View style={styles.resend}><Text style={styles.resendNote}>Didn't get the code?</Text>{seconds > 0 ? <Text style={styles.timer}> Resend in 0:{seconds.toString().padStart(2, '0')}</Text> : <Pressable onPress={resend}><Text style={styles.resendButton}> Resend code</Text></Pressable>}</View></View>
}

const styles = StyleSheet.create({ page: { flex: 1, backgroundColor: '#FFF', paddingHorizontal: 25, paddingTop: 58 }, back: { width: 44, height: 44, justifyContent: 'center' }, icon: { width: 72, height: 72, borderRadius: 24, backgroundColor: '#EEF3FF', alignItems: 'center', justifyContent: 'center', marginTop: 45 }, title: { marginTop: 28, color: '#101828', fontSize: 30, fontWeight: '900', letterSpacing: -.7 }, subtitle: { color: '#64748B', fontSize: 15, marginTop: 10 }, phone: { fontSize: 15, fontWeight: '800', color: '#334155', marginTop: 4 }, otpRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 38 }, box: { width: 45, height: 55, borderWidth: 1.5, borderColor: '#D9E1EE', borderRadius: 12, alignItems: 'center', justifyContent: 'center' }, boxFocused: { borderColor: blue, backgroundColor: '#F7F9FF' }, boxError: { borderColor: '#F04438' }, digit: { color: '#0F172A', fontWeight: '800', fontSize: 22 }, hiddenInput: { position: 'absolute', width: 1, height: 1, opacity: 0 }, autoFill: { color: '#64748B', fontSize: 12, lineHeight: 18, textAlign: 'center', marginTop: 18, paddingHorizontal: 25 }, error: { color: '#D92D20', fontSize: 13, fontWeight: '700', textAlign: 'center', marginTop: 18, lineHeight: 19 }, resend: { flexDirection: 'row', justifyContent: 'center', marginTop: 32 }, resendNote: { color: '#64748B', fontSize: 13 }, timer: { color: '#64748B', fontSize: 13, fontWeight: '700' }, resendButton: { color: blue, fontSize: 13, fontWeight: '800' } })
