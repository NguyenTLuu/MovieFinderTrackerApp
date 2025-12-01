import {
    DarkTheme,
    DefaultTheme,
    ThemeProvider,
} from '@react-navigation/native'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import 'react-native-reanimated'
import '../global.css'

import { useColorScheme } from '@/hooks/use-color-scheme'
import { SafeAreaProvider } from 'react-native-safe-area-context'

export const unstable_settings = {
    anchor: '(tabs)',
}

export default function RootLayout() {
    const colorScheme = useColorScheme()
    const theme = colorScheme === 'dark' ? DarkTheme : DefaultTheme
    return (
        <SafeAreaProvider>
            <ThemeProvider value={theme}>
                <Stack
                    screenOptions={{
                        contentStyle: { backgroundColor: '#000' },
                    }}
                >
                    <Stack.Screen
                        name="(tabs)"
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="movies"
                        options={{ headerShown: false }}
                    />
                </Stack>
                <StatusBar style="auto" />
            </ThemeProvider>
        </SafeAreaProvider>
    )
}
