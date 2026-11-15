import { Ionicons } from '@expo/vector-icons'
import { Tabs } from 'expo-router'
import { Platform } from 'react-native'

const tabIcons: Record<string, keyof typeof Ionicons.glyphMap> = {
  index: 'home-outline',
  chats: 'chatbubble-ellipses-outline',
  sell: 'add-circle',
  ads: 'pricetag-outline',
  account: 'person-outline',
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#2F6BFF',
        tabBarInactiveTintColor: '#94A3B8',
        tabBarStyle: {
          height: Platform.OS === 'ios' ? 84 : 68,
          paddingTop: 8,
          borderTopColor: '#E8ECF3',
          backgroundColor: '#FFFFFF',
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        tabBarIcon: ({ color, focused }) => (
          <Ionicons
            name={route.name === 'sell' ? 'add-circle' : tabIcons[route.name]}
            size={route.name === 'sell' ? 30 : 22}
            color={color}
          />
        ),
      })}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="chats" options={{ title: 'Chats' }} />
      <Tabs.Screen name="sell" options={{ title: 'Sell' }} />
      <Tabs.Screen name="ads" options={{ title: 'My Ads' }} />
      <Tabs.Screen name="account" options={{ title: 'Account' }} />
    </Tabs>
  )
}
