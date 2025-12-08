import { Stack, useLocalSearchParams } from 'expo-router'
import { View, Text, FlatList, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAuth } from '../../context/AuthContext'
import MovieCard from '../../components/MovieCard' // Tái sử dụng MovieCard

export default function ListDetail() {
    const { id, name } = useLocalSearchParams()
    const { user } = useAuth()
    const [movies, setMovies] = useState([])
    const [filterMovies, setFilterMovies] = useState([])
    const [loading, setLoading] = useState(true)
    const url = process.env.EXPO_PUBLIC_API_LOCAL

    useEffect(() => {
        const fetchMoviesInList = async () => {
            try {
                const response = await fetch(
                    `${url}/api/UserMovie/list/${id}`,
                    {
                        headers: { Authorization: `Bearer ${user.token}` },
                    }
                )
                const data = await response.json()
                setMovies(data)
                setFilterMovies(data)
            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false)
            }
        }
        fetchMoviesInList()
    }, [id, user])

    if (loading) {
        return (
            <View className="flex-1 bg-black justify-center items-center">
                <ActivityIndicator size="large" color="#f5c518" />
            </View>
        )
    }

    return (
        <SafeAreaView className="flex-1 bg-black" edges={['bottom']}>
            <Stack.Screen
                options={{
                    title: name || 'List Detail',
                    headerStyle: { backgroundColor: 'black' },
                    headerTitleStyle: { fontWeight: 'bold' },
                }}
            />
            <View className="flex-row px-4">
                <Text className="text-white font-bold text-lg">
                    Current Show:{' '}
                </Text>
                <View className="px-4 justify-center items-center bg-[#f5c518] rounded-full ">
                    <Text className="text-black font-bold text-base">
                        {movies.length}
                    </Text>
                </View>
            </View>
            <FlatList
                data={filterMovies}
                keyExtractor={(item) => item.movieId.toString()}
                numColumns={3}
                contentContainerStyle={{
                    paddingHorizontal: 10,
                    paddingVertical: 20,
                }}
                columnWrapperStyle={{
                    justifyContent: 'flex-start',
                    gap: 10,
                    marginBottom: 5,
                }}
                renderItem={({ item }) => (
                    <View className="w-[31%]">
                        <MovieCard item={item} />
                    </View>
                )}
                ListEmptyComponent={
                    <View className="items-center mt-20">
                        <Text className="text-gray-500 text-lg">
                            No movies in this list yet.
                        </Text>
                    </View>
                }
            />
        </SafeAreaView>
    )
}
