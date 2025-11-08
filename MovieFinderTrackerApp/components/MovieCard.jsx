import {Link} from 'expo-router';
import {Image, Text, View, TouchableOpacity} from 'react-native';
import {MaterialCommunityIcons} from "@expo/vector-icons";
import React from "react";

export default function MovieCard({item}) {
    return (

        <Link href={`movies/${item.movieId}`} asChild className=" w-[30%] bg-[#75746b] rounded-lg">
            <TouchableOpacity>
                <Image source={{uri: item.poster}}
                       className="w-full h-32"
                       resizeMode="stretch"
                />
                <View className="px-2 pb-1 flex-col s">
                    <Text className="text-white font-bold">
                        <MaterialCommunityIcons name="star" color="#f0e66e" size={16}/> {item.rating}</Text>
                    <Text className="text-white font-bold" >{item.title}</Text>

                </View>
            </TouchableOpacity>
        </Link>
    )
}
