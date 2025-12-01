import { Stack, Link, useLocalSearchParams } from 'expo-router'
import {
    Image,
    Text,
    View,
    ImageBackground,
    ActivityIndicator,
    ScrollView,
    InteractionManager,
    StyleSheet,
    Alert,
    FlatList,
    TouchableOpacity,
} from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import React, { useState, useEffect, useCallback } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import YoutubePlayer from 'react-native-youtube-iframe'
import { LinearGradient } from 'expo-linear-gradient'

export default function MovieDetail() {
    const { id } = useLocalSearchParams()
    const [loading, setLoading] = useState(true)
    const [movie, setMovie] = useState(null)
    const myApiUrl = process.env.EXPO_PUBLIC_APP_API_URL
    const url = process.env.EXPO_PUBLIC_API_LOCAL

    const [playing, setPlaying] = useState(false)

    useEffect(() => {
        if (!id) return
        InteractionManager.runAfterInteractions(() => {
            const fetchMovie = async () => {
                try {
                    setLoading(true)
                    const URL = `${url}/api/movie/${id}`
                    const response = await fetch(URL)
                    const data = await response.json()
                    setMovie(data)
                } catch (error) {
                    console.log(error)
                } finally {
                    setLoading(false)
                }
            }
            fetchMovie()
        })
    }, [id])

    if (loading || !movie) {
        return (
            <SafeAreaView className="flex-1 bg-black">
                <ActivityIndicator size="large" color="#ffffff" />
            </SafeAreaView>
        )
    }

    let runtime = movie.runtime
    let hour = Math.floor(runtime / 60)
    let minute = runtime % 60
    let length = `${hour}h ${minute}m`
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'black' }}>
            <Stack.Screen
                options={{
                    title: '', // Ẩn title trên header để đẹp hơn
                    headerTransparent: true,
                    headerTintColor: 'white',
                }}
            />
            <ScrollView showsVerticalScrollIndicator={false}>
                <ImageBackground
                    source={{ uri: movie.backdrop }}
                    resizeMode="cover"
                    style={{ width: '100%', minHeight: 450 }}
                >
                    <LinearGradient
                        colors={['transparent', 'rgba(0,0,0,0.3)', '#000000']}
                        className="absolute w-full h-full"
                        start={{ x: 0.5, y: 0 }}
                        end={{ x: 0.5, y: 1 }}
                    />

                    {/* Container chính nằm đè lên phần dưới của backdrop */}
                    <View className="flex-row items-end px-4 pb-8 mt-auto">
                        {/* 1. POSTER (Có thêm shadow) */}
                        <View className="shadow-2xl shadow-black">
                            <Image
                                source={{ uri: movie.poster }}
                                style={{
                                    width: 120, // Thu nhỏ poster một chút để nhường chỗ
                                    height: 180,
                                    borderRadius: 12,
                                    borderWidth: 1,
                                    borderColor: 'rgba(255,255,255,0.1)',
                                }}
                                resizeMode="cover"
                            />
                        </View>

                        {/* 2. INFO SECTION (Bên phải Poster) */}
                        <View className="flex-1 ml-4 justify-end pb-1">
                            {/* A. TITLE (Đưa lên đây để gắn liền với thông tin) */}
                            <Text
                                className="text-white font-bold text-2xl mb-2 shadow-black"
                                numberOfLines={2}
                            >
                                {movie.title}
                            </Text>

                            {/* B. RATING ROW */}
                            <View className="flex-row items-center mb-3">
                                <MaterialCommunityIcons
                                    name="star"
                                    size={20}
                                    color="#FFD700"
                                />
                                <Text className="text-yellow-400 font-bold text-lg ml-1">
                                    {movie.rating.toFixed(1)}
                                </Text>
                                <Text className="text-gray-400 text-xs ml-1 mt-1">
                                    / 10
                                </Text>

                                {/* Dấu chấm ngăn cách */}
                                <View className="w-1 h-1 bg-gray-500 rounded-full mx-2" />

                                {/* Language Badge */}
                                <View className="bg-gray-800 px-2 py-0.5 rounded-md border border-gray-600">
                                    <Text className="text-gray-300 text-xs font-bold uppercase">
                                        English
                                    </Text>
                                </View>
                            </View>

                            {/* C. GENRES (Dạng thẻ/Badge) */}
                            <View className="flex-row flex-wrap mb-3">
                                {movie.genreNames
                                    ?.slice(0, 3)
                                    .map((genre, index) => (
                                        <View
                                            key={index}
                                            className="bg-white/20 px-3 py-1 rounded-full mr-2 mb-1 backdrop-blur-md"
                                        >
                                            <Text className="text-white text-xs font-medium">
                                                {genre}
                                            </Text>
                                        </View>
                                    ))}
                            </View>

                            {/* D. META INFO ROW (Year, Runtime, Country) */}
                            <View className="flex-row items-center space-x-4">
                                {/* Year */}
                                <View className="flex-row items-center">
                                    <MaterialCommunityIcons
                                        name="calendar-blank"
                                        size={16}
                                        color="#9ca3af"
                                    />
                                    <Text className="text-gray-300 text-sm ml-1">
                                        {movie.releaseYear}
                                    </Text>
                                </View>

                                {/* Runtime */}
                                <View className="flex-row items-center ml-3">
                                    <MaterialCommunityIcons
                                        name="clock-outline"
                                        size={16}
                                        color="#9ca3af"
                                    />
                                    <Text className="text-gray-300 text-sm ml-1">
                                        {length}
                                    </Text>
                                </View>

                                {/* Country (Optional) */}
                                <View className="flex-row items-center ml-3">
                                    <MaterialCommunityIcons
                                        name="map-marker-outline"
                                        size={16}
                                        color="#9ca3af"
                                    />
                                    <Text className="text-gray-300 text-sm ml-1">
                                        USA
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </ImageBackground>

                {/* 3. PHẦN DESCRIPTION & OTHER SECTIONS */}
                <View className="flex-1 px-4 pt-2">
                    <Text className="text-gray-400 text-base leading-6 italic mb-6">
                        "{movie.description}"
                    </Text>

                    {/* ... Giữ nguyên phần YoutubePlayer, Casts, Director ... */}
                    <View>
                        <Text className="text-white text-xl mb-3 font-bold border-l-4 border-red-600 pl-2">
                            Trailer
                        </Text>
                        <YoutubePlayer
                            height={220}
                            videoId={movie.trailer}
                            // bỏ className border cũ nhìn cho hiện đại hơn
                        />
                    </View>

                    {/* ... Các phần Cast/Director giữ nguyên logic ... */}
                    {/* ... */}
                </View>

                {/* Padding bottom để không bị cấn đáy */}
                <View className="h-20" />
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
})
