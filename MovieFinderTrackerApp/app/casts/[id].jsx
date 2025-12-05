import { SafeAreaView } from 'react-native-safe-area-context'
import React, { useState, useEffect } from 'react'
import { useLocalSearchParams, Stack } from 'expo-router'
import {
    Alert,
    View,
    Text,
    ActivityIndicator,
    ScrollView,
    Image,
    TouchableOpacity,
    FlatList,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import MovieCard from '../../components/MovieCard'

export default function CastDetail() {
    const { id } = useLocalSearchParams()
    const [loading, setLoading] = useState(true)
    const [cast, setCast] = useState(null)

    const [movie, setMovie] = useState([])

    const [expanded, setExpanded] = useState(false)
    const isLongText = cast?.bio.length > 150

    const toggleExpand = () => {
        setExpanded(!expanded)
    }
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
                setMovie(data.movies)
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
        <SafeAreaView className="flex-1 bg-black justify-center items-center">
            <Stack.Screen
                options={{
                    title: '',
                    headerTransparent: true,
                    headerTintColor: 'white',
                }}
            />
            <ScrollView showsVerticalScrollIndicator={false}>
                <View className="relative w-full h-[450px]">
                    <Image
                        source={{ uri: cast.avatar }}
                        className="w-full h-full"
                        resizeMode="cover"
                        blurRadius={30}
                    />
                    <View className="absolute inset-0 bg-black/40" />
                    <LinearGradient
                        colors={['transparent', '#000000']}
                        className="absolute w-full h-full"
                        start={{ x: 0.5, y: 0.3 }}
                        end={{ x: 0.5, y: 1 }}
                    />
                    <View className="absolute bottom-0 w-full items-center px-4 pb-8">
                        <View className="shadow-2xl shadow-black mb-4">
                            <Image
                                source={{ uri: cast.avatar }}
                                className="w-48 h-48 rounded-full border-2 border-neutral-500"
                                resizeMode="cover"
                            />
                        </View>

                        <Text className="text-white text-3xl font-bold text-center">
                            {cast.name}
                        </Text>

                        <View className="flex-row items-center mt-2 space-x-2">
                            <Text className="text-gray-400 text-sm font-bold uppercase tracking-wider">
                                {cast.gender === 'Male' ? 'Actor' : 'Actress'}
                            </Text>
                        </View>

                        <View className="mt-2 flex-row items-center ">
                            {cast.birthYear !== -1 && (
                                <Text className="text-neutral-400 text-base">
                                    Born: {cast.birthYear} {' • '}
                                </Text>
                            )}
                            <Text className="text-neutral-400 text-base">
                                <MaterialCommunityIcons
                                    name="map-marker-outline"
                                    size={16}
                                    color="#9ca3af"
                                />{' '}
                                {cast.country} {' • '}
                            </Text>
                            <Text className="text-neutral-400 text-base ">
                                <MaterialCommunityIcons
                                    name="gender-male-female"
                                    size={16}
                                    color="#9ca3af"
                                />{' '}
                                {cast.gender}
                            </Text>
                        </View>
                    </View>
                </View>
                <View className="px-4">
                    <Text
                        className="text-gray-400 text-base leading-6 italic mb-2 text-justify hyphens-auto"
                        numberOfLines={!isLongText || expanded ? undefined : 3}
                        ellipsizeMode="tail"
                    >
                        {cast.bio}
                    </Text>
                    {isLongText && (
                        <TouchableOpacity
                            onPress={toggleExpand}
                            className="mt-1 self-center border"
                        >
                            <Text className="text-gray-500 font-bold">
                                {expanded ? 'Show less' : 'Show more'}
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>
                <View className="mt-4 px-4">
                    <Text className="mb-4 text-white text-xl font-bold border-l-4 border-[#f5c518] pl-2">
                        Known For
                    </Text>
                    <FlatList
                        horizontal
                        contentContainerStyle={{
                            paddingHorizontal: 14,
                            gap: 12,
                        }}
                        data={movie}
                        keyExtractor={(item) => item.movieId.toString()}
                        renderItem={({ item }) => (
                            <View className="w-[140px]">
                                <MovieCard item={item} />
                            </View>
                        )}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}
