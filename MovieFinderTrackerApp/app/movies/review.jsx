import ReviewCard from '../../components/ReviewCard'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Alert, FlatList, Text, View } from 'react-native'
import { useLocalSearchParams } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function ReviewDetail() {
    const { id } = useLocalSearchParams()
    const [review, setReview] = useState([])
    const [loading, setLoading] = useState(false)
    const [avgRating, setAvgRating] = useState(0)

    const url = process.env.EXPO_PUBLIC_API_LOCAL

    useEffect(() => {
        const fetchReview = async () => {
            setLoading(true)
            try {
                const response = await fetch(`${url}/api/review/movie/${id}`)
                const data = await response.json()
                if (!response.ok) {
                    throw new Error('Can not get review data')
                }
                setReview(data)

                // Calculate avg user rating
                if (data.length > 0) {
                    const totalRating = data.reduce(
                        (sum, item) => sum + item.rating,
                        0
                    )
                    const avg = totalRating / data.length
                    setAvgRating(avg.toFixed(1))
                } else {
                    setAvgRating(0)
                }
            } catch (error) {
                Alert.alert(error.message)
            } finally {
                setLoading(false)
            }
        }
        fetchReview()
    }, [id])

    if (loading || !review) {
        return (
            <View className="flex-1 items-center justify-center bg-black">
                <ActivityIndicator size="large" color="white" />
            </View>
        )
    }
    return (
        <SafeAreaView className="bg-black justify-center px-3">
            {review.length > 0 && (
                <View className="flex-row items-center gap-3 mb-4">
                    <Text className="text-white text-xl font-bold">
                        Average user rating
                    </Text>
                    <View className="bg-[#f5c518] rounded-full px-3">
                        <Text className="text-black text-xl font-bold">
                            {avgRating}
                        </Text>
                    </View>
                </View>
            )}
            <FlatList
                data={review}
                showVer
                keyExtractor={(item) => item.reviewId}
                renderItem={({ item }) => (
                    <ReviewCard
                        rating={item.rating}
                        date={item.createdAt}
                        userName={item.userName}
                        content={item.content}
                        poster={item.moviePoster}
                        avatar={item.userAvatar}
                    />
                )}
                ListEmptyComponent={
                    <View className="justify-center items-center border-white">
                        <Text className="text-gray-400 text-xl">
                            No review yet
                        </Text>
                    </View>
                }
            />
        </SafeAreaView>
    )
}
