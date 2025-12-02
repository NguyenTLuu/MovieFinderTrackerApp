import { Link } from 'expo-router'
import { Image, Text, View, TouchableOpacity } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import React from 'react'

export default function MovieCard({ item }) {
    return (
        <Link
            href={`movies/${item.movieId}`}
            asChild
            className=" flex-1 w-full mb-4"
        >
            <TouchableOpacity>
                <View className="relative">
                    <Image
                        source={{ uri: item.poster }}
                        className="w-full aspect-[2/3] rounded-lg"
                        resizeMode="cover"
                    />
                    <View className="absolute top-2 right-2 bg-black/60 px-2 py-1 rounded-md flex-row items-center backdrop-blur-md">
                        <MaterialCommunityIcons
                            name="star"
                            color="#f5c518"
                            size={16}
                        />
                        <Text className="text-white text-xs font-bold ml-1">
                            {item.rating.toFixed(1)}
                        </Text>
                    </View>
                </View>

                <View className="mb-2 flex-col ">
                    <View className="mt-2">
                        <Text
                            className="text-white text-sm font-semibold ml-1"
                            numberOfLines={2}
                        >
                            {item.title}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        </Link>
    )
}
