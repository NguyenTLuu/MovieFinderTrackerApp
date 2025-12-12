import { Stack } from 'expo-router'

export default function MoviesLayout() {
    return (
        <Stack
            screenOptions={{
                contentStyle: { backgroundColor: '#000' },
            }}
        >
            <Stack.Screen
                name="[id]"
                options={{
                    title: '',
                    headerTransparent: true,
                    headerTintColor: 'white',
                }}
            />

            <Stack.Screen
                name="review"
                options={{
                    animation: 'fade',
                    animationDuration: 250,
                    headerTitle: 'Reviews',
                }}
            />
        </Stack>
    )
}
