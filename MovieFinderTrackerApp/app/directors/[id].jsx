import { SafeAreaView } from 'react-native-safe-area-context'
import { useState, useEffect } from 'react'
import { useLocalSearchParams, Stack } from 'expo-router'
import { Alert, View, Text, ActivityIndicator } from 'react-native'

export default function DirectorDetail() {
    const { id } = useLocalSearchParams()
    const [loading, setLoading] = useState(true)
    const [director, setDirector] = useState(null)

    const url = process.env.EXPO_PUBLIC_API_LOCAL

    useEffect(() => {
        if (!id) return
        const getDirector = async () => {
            try {
                setLoading(true)
                const URL = `${url}/api/Director/${id}`
                const response = await fetch(URL)
                if (!response.ok) {
                    throw new Error('Can not fetch director')
                }
                const data = await response.json()
                setDirector(data)
            } catch (error) {
                Alert.alert('Error', error.message)
            } finally {
                setLoading(false)
            }
        }
        getDirector()
    }, [id])

    if (loading || !director) {
        return (
            <SafeAreaView
                style={{
                    flex: 1,
                    backgroundColor: 'black',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <ActivityIndicator size="large" color="white" />
            </SafeAreaView>
        )
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'black' }}>
            <Stack.Screen
                options={{
                    title: director.name,
                    headerTintColor: 'white',
                    headerStyle: { backgroundColor: 'black' },
                }}
            />
            <View style={{ padding: 16 }}>
                <Text style={{ color: 'white', fontSize: 16, marginBottom: 8 }}>
                    ID: {director.directorId}
                </Text>
                <Text style={{ color: 'white', fontSize: 16, marginBottom: 8 }}>
                    Name: {director.name}
                </Text>
                <Text style={{ color: 'white', fontSize: 16, marginBottom: 8 }}>
                    Gender: {director.gender}
                </Text>
                <Text style={{ color: 'white', fontSize: 16, marginBottom: 8 }}>
                    Country: {director.country}
                </Text>
                <Text style={{ color: 'white', fontSize: 16, marginBottom: 8 }}>
                    Avatar URL: {director.avatar}
                </Text>
            </View>
        </SafeAreaView>
    )
}
