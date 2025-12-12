import React, { useCallback, useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAuth } from '../../context/AuthContext'
import { ActivityIndicator, Alert, FlatList, Text, View } from 'react-native'
import { useFocusEffect, Stack } from 'expo-router'
import MyReviewCard from '../../components/MyReviewCard'

export default function AllMyReview() {
    const [myReview, setMyReview] = useState([])
    const [loading, setLoading] = useState(false)
    const { user } = useAuth()

    const url = process.env.EXPO_PUBLIC_API_LOCAL

    useFocusEffect(
        useCallback(() => {
            fetchMyReview()
        }, [user])
    )

    const fetchMyReview = async () => {
        setLoading(true)
        try {
            const response = await fetch(`${url}/api/review/my-reviews`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
            })
            const data = await response.json()
            console.log(data)
            if (!response.ok) {
                throw new Error('Fail to get reviews')
            }
            setMyReview(data)
        } catch (error) {
            Alert.alert(error.message)
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    if (loading || !myReview) {
        return (
            <View className="flex-1 items-center justify-center bg-black">
                <ActivityIndicator size="large" color="white" />
            </View>
        )
    }

    return (
        <SafeAreaView className="bg-black px-4 ">
            <Stack.Screen
                options={{
                    title: 'My Reviews',
                    headerTintColor: 'white',
                    headerShown: true,
                }}
            />
            <View className="flex justify-center ">
                <FlatList
                    data={myReview}
                    keyExtractor={(item) => item.reviewId}
                    renderItem={({ item }) => (
                        <MyReviewCard
                            rating={item.rating}
                            date={item.createdAt}
                            content={item.content}
                            poster={item.moviePoster}
                            title={item.movieTitle}
                        />
                    )}
                />
            </View>
        </SafeAreaView>
    )
}
