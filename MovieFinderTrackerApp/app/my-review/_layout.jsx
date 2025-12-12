import { Stack } from 'expo-router'

export default function MyReviewLayout() {
    return (
        <Stack screenOptions={{ headerShown: true }}>
            <Stack.Screen name="all-my-review" />
        </Stack>
    )
}
