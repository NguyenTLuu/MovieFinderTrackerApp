import { Stack } from 'expo-router'

export default function SettingLayout() {
    return (
        <Stack screenOptions={{ headerShown: true }}>
            <Stack.Screen name="all-my-review" />
        </Stack>
    )
}
