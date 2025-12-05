import { Link, Stack, useLocalSearchParams } from 'expo-router'
import {
    Image,
    Text,
    View,
    ImageBackground,
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Alert,
    FlatList,
    TouchableOpacity,
} from 'react-native'
import AntDesign from '@expo/vector-icons/AntDesign'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6'
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import React, { useState, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import YoutubePlayer from 'react-native-youtube-iframe'
import { LinearGradient } from 'expo-linear-gradient'

export default function MovieDetail() {
    const { id } = useLocalSearchParams()
    const [loading, setLoading] = useState(true)
    const [movie, setMovie] = useState(null)
    const url = process.env.EXPO_PUBLIC_API_LOCAL

    useEffect(() => {
        if (!id) return
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
    }, [id])

    if (loading || !movie) {
        return (
            <View className="flex-1 items-center justify-center bg-black">
                <ActivityIndicator size="large" color="white" />
            </View>
        )
    }

    const runtime = movie.runtime
    const hour = Math.floor(runtime / 60)
    const minute = runtime % 60
    const length = `${hour}h ${minute}m`

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'black' }}>
            <Stack.Screen
                options={{
                    title: '',
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
                    <View className="flex-row items-end px-4 pb-8 mt-auto">
                        <View className="shadow-2xl shadow-black">
                            <Image
                                source={{ uri: movie.poster }}
                                style={{
                                    width: 120,
                                    height: 180,
                                    borderRadius: 12,
                                    borderWidth: 1,
                                    borderColor: 'rgba(255,255,255,0.1)',
                                }}
                                resizeMode="cover"
                            />
                        </View>
                        <View className="flex-1 ml-4 justify-end pb-1">
                            <Text
                                className="text-white font-bold text-2xl mb-2 shadow-black"
                                numberOfLines={2}
                            >
                                {movie.title}
                            </Text>
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
                                <View className="w-1 h-1 bg-gray-500 rounded-full mx-2" />
                                <View className="bg-gray-800 px-2 py-0.5 rounded-md border border-gray-600">
                                    <Text className="text-gray-300 text-xs font-bold uppercase">
                                        English
                                    </Text>
                                </View>
                            </View>
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
                            <View className="flex-row items-center space-x-4">
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

                {/* Action Buttons */}
                <View className="flex-row px-4 mb-5 items-center gap-4">
                    <TouchableOpacity
                        activeOpacity={0.7}
                        className="flex-1 flex-row justify-center items-center bg-gray-800/80 border border-gray-700 rounded-full py-3"
                    >
                        <FontAwesome6 name="bookmark" size={18} color="white" />
                        <Text className="text-white font-semibold text-sm ml-2">
                            Watchlist
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        activeOpacity={0.7}
                        className="flex-1 flex-row justify-center items-center bg-[#f5c518] rounded-full py-3"
                    >
                        <AntDesign name="check" size={20} color="black" />
                        <Text className="text-black font-bold text-sm ml-2">
                            Mark Watched
                        </Text>
                    </TouchableOpacity>
                </View>

                <View className="flex-1 px-4 pt-2">
                    <Text className="text-gray-400 text-base leading-6 italic mb-6 text-justify hyphens-auto">
                        "{movie.description}"
                    </Text>
                    <View>
                        <Text className="text-white text-xl mb-3 font-bold border-l-4 border-[#f5c518] pl-2">
                            Trailer
                        </Text>
                        <YoutubePlayer height={220} videoId={movie.trailer} />
                    </View>
                </View>

                <View className="flex-1 px-4 pt-4">
                    <Text className="text-white text-xl mb-3 font-bold border-l-4 border-[#f5c518] pl-2">
                        Top Casts
                    </Text>
                    <FlatList
                        data={movie.casts}
                        keyExtractor={(item) => item.castId.toString()}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        className="my-3"
                        contentContainerStyle={{
                            flexGrow: 2,
                            justifyContent: 'space-around',
                        }}
                        renderItem={({ item }) => (
                            <Link href={`/casts/${item.castId}`} asChild>
                                <TouchableOpacity>
                                    <Image
                                        source={{ uri: item.avatar }}
                                        style={{
                                            width: 80,
                                            height: 80,
                                            borderRadius: 40,
                                            borderWidth: 2,
                                            borderColor: '#737373',
                                        }}
                                        resizeMode="cover"
                                    />
                                    <Text className="text-white mt-1 w-[80px] text-center">
                                        {item.name}
                                    </Text>
                                </TouchableOpacity>
                            </Link>
                        )}
                    />
                </View>

                {movie.director && (
                    <View className="flex-1 px-4 pt-4">
                        <Text className="text-white text-xl mb-3 font-bold border-l-4 border-[#f5c518] pl-2">
                            Director
                        </Text>
                        <View className="flex-1 my-3 items-center">
                            <Link
                                href={`/directors/${movie.director.directorId}`}
                            >
                                <View>
                                    <Image
                                        source={{
                                            uri: movie.director.avatar,
                                        }}
                                        style={{
                                            width: 80,
                                            height: 80,
                                            borderRadius: 40,
                                            borderWidth: 2,
                                            borderColor: '#737373',
                                        }}
                                        resizeMode="cover"
                                    />
                                    <Text className="text-white mt-1 w-[80px] text-center">
                                        {movie.director.name}
                                    </Text>
                                </View>
                            </Link>
                        </View>
                    </View>
                )}

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
