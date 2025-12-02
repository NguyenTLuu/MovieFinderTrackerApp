import { Text, View, ActivityIndicator, FlatList, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import MovieCard from '@/components/MovieCard'

export default function HomeScreen() {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    // const myApiUrl = process.env.EXPO_PUBLIC_APP_API_URL
    const url = process.env.EXPO_PUBLIC_API_LOCAL

    useEffect(() => {
        fetch(`${url}/api/Movie`)
            .then((res) => res.json())
            .then((data) => {
                setData(data)
                setLoading(false)
            })
            .catch((err) => {
                console.error(err)
                setLoading(false)
                console.log(`${url}/api/Movie`)
            })
    }, [])
    if (loading) {
        return (
            <View className="flex-1 items-center justify-center bg-black">
                <ActivityIndicator size="large" color="white" />
            </View>
        )
    }

    return (
        <SafeAreaView className="flex-1 bg-black">
            <View className="flex-1 mt-5">
                <Text className="text-white font-bold text-[30px] py-5 pl-3">
                    Trending Movies
                </Text>
                <FlatList
                    data={data}
                    keyExtractor={(item) => item.movieId.toString()}
                    numColumns={3}
                    renderItem={({ item }) => {
                        return (
                            <View className="w-[31%]">
                                <MovieCard item={item} />
                            </View>
                        )
                    }}
                    columnWrapperStyle={{
                        justifyContent: 'flex-start',
                        gap: 10,
                        paddingRight: 5,
                        marginBottom: 10,
                    }}
                />
            </View>
        </SafeAreaView>
    )
}
