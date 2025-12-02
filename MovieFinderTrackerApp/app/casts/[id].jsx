import { SafeAreaView } from 'react-native-safe-area-context'
import { useState, useEffect } from 'react'
import { useLocalSearchParams, Stack } from 'expo-router'
import { Alert, View, Text, ActivityIndicator } from 'react-native'

export default function CastDetail() {
    const { id } = useLocalSearchParams()
    const [loading, setLoading] = useState(true)
    const [cast, setCast] = useState(null)

    const url = process.env.EXPO_PUBLIC_API_LOCAL

    useEffect(() => {
        if (!id) {
            return
        }

        const getCast = async () => {
            try {
                setLoading(true)
                const URL = `${url}/api/Casts/${id}`
                const response = await fetch(URL)
                if (!response.ok) {
                    throw new Error('Can not fetch cast')
                }

                const data = await response.json()
                setCast(data)
            } catch (error) {
                Alert.alert('Error', error.message)
            } finally {
                setLoading(false)
            }
        }
        getCast()
    }, [id])

    if (loading || !cast) {
        return (
            <SafeAreaView className="flex-1 items-center justify-center bg-black">
                <ActivityIndicator size="large" color="white" />
            </SafeAreaView>
        )
    }

    return (
        <SafeAreaView className="flex-1 justify-center bg-black">
            <View>
                <Text className="color-white font-bold text-2xl">
                    {cast.castId}
                </Text>
                <Text className="color-white font-bold text-2xl">
                    {cast.name}
                </Text>
                <Text className="color-white font-bold text-2xl">
                    {cast.country}
                </Text>
                <Text className="color-white font-bold text-2xl">
                    {cast.gender}
                </Text>
                <Text className="color-white font-bold text-2xl">
                    {cast.birthYear}
                </Text>
                <Text className="color-white font-bold text-2xl">
                    {cast.avatar}
                </Text>
            </View>
        </SafeAreaView>
    )
}
