import { Stack } from 'expo-router'
import { AuthProvider, useAuth } from '@/context/AuthContext'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { ThemeProvider, DarkTheme } from '@react-navigation/native'
import { StatusBar } from 'expo-status-bar'
import '../global.css'
import { useContext } from 'react'

const MyNavDarkTheme = {
    ...DarkTheme,
    colors: {
        ...DarkTheme.colors,
        background: '#000000',
        card: '#000000',
        text: '#ffffff',
        border: '#27272a',
    },
}

function RootStack() {
    // @ts-ignore
    const { isAuthenticated } = useAuth()

    return (
        <Stack
            screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: '#000' },
                animation: 'slide_from_right',
                animationDuration: 250,
                gestureEnabled: true,
                gestureDirection: 'horizontal',
            }}
        >
            <Stack.Protected guard={!isAuthenticated}>
                <Stack.Screen name="(auth)" options={{ animation: 'fade' }} />
            </Stack.Protected>
            <Stack.Protected guard={isAuthenticated}>
                <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
                <Stack.Screen name="movies" />
                <Stack.Screen name="directors" />
                <Stack.Screen name="casts" />
                <Stack.Screen name="lists" />
            </Stack.Protected>
        </Stack>
    )
}

export default function RootLayout() {
    return (
        <AuthProvider>
            <SafeAreaProvider style={{ backgroundColor: '#000' }}>
                <ThemeProvider value={MyNavDarkTheme}>
                    <RootStack />
                    <StatusBar style="light" backgroundColor="#000000" />
                </ThemeProvider>
            </SafeAreaProvider>
        </AuthProvider>
    )
}
