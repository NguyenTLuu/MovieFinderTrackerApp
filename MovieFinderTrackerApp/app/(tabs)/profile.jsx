import {
    View,
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
    Alert,
    Modal,
} from 'react-native'
import React, { useCallback, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAuth } from '../../context/AuthContext'
import { MaterialCommunityIcons } from '@expo/vector-icons'

import { useFocusEffect, useRouter } from 'expo-router'
import { ConfirmModal } from '../../components/ConfirmModal'

const ProfileMenuItem = ({
    icon,
    title,
    subtitle,
    onPress,
    isDestructive = false,
    showChevron = true,
}) => (
    <TouchableOpacity
        onPress={onPress}
        className="flex-row items-center py-4 border-b border-gray-800 active:bg-gray-900"
    >
        <View
            className={`w-10 h-10 rounded-full items-center justify-center ${isDestructive ? 'bg-red-900/20' : 'bg-gray-800'}`}
        >
            <MaterialCommunityIcons
                name={icon}
                size={20}
                color={isDestructive ? '#ef4444' : '#f5c518'}
            />
        </View>
        <View className="flex-1 ml-4">
            <Text
                className={`text-base font-semibold ${isDestructive ? 'text-red-500' : 'text-white'}`}
            >
                {title}
            </Text>
            {subtitle && (
                <Text className="text-gray-500 text-xs mt-0.5">{subtitle}</Text>
            )}
        </View>
        {showChevron && (
            <MaterialCommunityIcons
                name="chevron-right"
                size={24}
                color="#4b5563"
            />
        )}
    </TouchableOpacity>
)

export default function Profile() {
    const { signOut, user, systemListIds } = useAuth()
    const router = useRouter()

    const [logoutModalVisible, setLogoutModalVisible] = useState(false)

    const [movieInWatched, setMovieInWatched] = useState(0)
    const [totalReview, setTotalReview] = useState(0)
    const [totalList, setTotalList] = useState(0)

    const url = process.env.EXPO_PUBLIC_API_LOCAL

    const defaultAvatar =
        'https://i.pinimg.com/736x/0d/64/98/0d64989794b1a4c9d89bff571d3d5842.jpg'

    const fetchInitalData = async () => {
        try {
            const [watchedCount, reviewCount, listCount] = await Promise.all([
                fetch(`${url}/api/usermovie/list/${systemListIds.watchedId}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${user.token}`,
                    },
                }),
                fetch(`${url}/api/review/my-reviews`, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${user.token}`,
                    },
                }),
                fetch(`${url}/api/customlist`, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${user.token}`,
                    },
                }),
            ])

            if (!watchedCount.ok || !reviewCount.ok || !listCount.ok) {
                throw new Error('Fail to fetch initial data')
            }

            const dataWatchedCount = await watchedCount.json()
            const dataReviewCount = await reviewCount.json()
            const dataListCount = await listCount.json()

            setMovieInWatched(dataWatchedCount.length)
            setTotalReview(dataReviewCount.length)
            setTotalList(dataListCount.length)
        } catch (err) {
            Alert.alert('Error', err.message)
        }
    }

    useFocusEffect(
        useCallback(() => {
            fetchInitalData()
        }, [user])
    )

    return (
        <SafeAreaView className="flex-1 bg-black">
            <ScrollView showsVerticalScrollIndicator={false} className="px-5">
                {/* 1. HEADER PROFILE */}
                <View className="items-center mt-6 mb-8">
                    <View className="relative">
                        <Image
                            source={{ uri: user?.avatar || defaultAvatar }}
                            className="w-28 h-28 rounded-full border-4 border-[#1f2937]"
                        />
                    </View>

                    <Text className="text-white text-2xl font-bold mt-4">
                        {user.fullname}
                    </Text>
                    <Text className="text-gray-400 text-base">
                        @{user?.username}
                    </Text>

                    {/* Role Badge */}
                    <View className="mt-2 bg-gray-800 px-3 py-1 rounded-full border border-gray-700">
                        <Text className="text-[#f5c518] text-xs font-bold uppercase tracking-wider">
                            {user?.role}
                        </Text>
                    </View>
                </View>

                <View className="flex-row justify-between bg-[#1a1a1a] p-4 rounded-2xl mb-8 border border-gray-800">
                    <View className="items-center flex-1 border-r border-gray-700">
                        <Text className="text-white text-xl font-bold">
                            {movieInWatched}
                        </Text>
                        <Text className="text-gray-500 text-xs mt-1">
                            Watched
                        </Text>
                    </View>
                    <View className="items-center flex-1 border-r border-gray-700">
                        <Text className="text-white text-xl font-bold">
                            {totalReview}
                        </Text>
                        <Text className="text-gray-500 text-xs mt-1">
                            Reviews
                        </Text>
                    </View>
                    <View className="items-center flex-1">
                        <Text className="text-white text-xl font-bold">
                            {totalList}
                        </Text>
                        <Text className="text-gray-500 text-xs mt-1">
                            Lists
                        </Text>
                    </View>
                </View>

                <Text className="text-gray-500 font-bold mb-3 uppercase text-xs tracking-widest">
                    Review
                </Text>
                <View className="bg-[#1a1a1a] rounded-2xl px-4 mb-6 border border-gray-800">
                    <ProfileMenuItem
                        icon="pencil-circle-outline"
                        title="My Reviews"
                        onPress={() => router.push('/my-review/all-my-review')}
                    />
                </View>

                <Text className="text-gray-500 font-bold mb-3 uppercase text-xs tracking-widest">
                    Account Settings
                </Text>

                <View className="bg-[#1a1a1a] rounded-2xl px-4 mb-6 border border-gray-800">
                    <ProfileMenuItem
                        icon="account-outline"
                        title="Edit Profile"
                        subtitle="Change avatar, name..."
                        onPress={() => router.push('/setting/edit-profile')}
                    />
                    <ProfileMenuItem
                        icon="shield-lock-outline"
                        title="Change Password"
                        onPress={() => router.push('/setting/change-password')}
                    />
                </View>

                <Text className="text-gray-500 font-bold mb-3 uppercase text-xs tracking-widest">
                    More
                </Text>

                <View className="bg-[#1a1a1a] rounded-2xl px-4 mb-10 border border-gray-800">
                    <ProfileMenuItem
                        icon="logout"
                        title="Log Out"
                        isDestructive={true}
                        showChevron={false}
                        onPress={() => setLogoutModalVisible(true)}
                    />
                </View>
            </ScrollView>

            <ConfirmModal
                title="Log Out"
                message="Are you sure you want to log out?"
                visible={logoutModalVisible}
                onClose={() => setLogoutModalVisible(false)}
                onConfirm={signOut}
                applyBtnName="Log Out"
            />
        </SafeAreaView>
    )
}
