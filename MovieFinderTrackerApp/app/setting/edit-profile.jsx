import React, { useEffect, useState } from 'react'
import {
    Alert,
    TextInput,
    TouchableOpacity,
    View,
    Image,
    ActivityIndicator,
    Text,
} from 'react-native'
import { router, Stack } from 'expo-router'
import { useAuth } from '../../context/AuthContext'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import * as ImagePicker from 'expo-image-picker'

export default function EditProfile() {
    const { user, signIn } = useAuth()
    const url = process.env.EXPO_PUBLIC_API_LOCAL

    const [loading, setLoading] = useState(false)
    const [updating, setUpdating] = useState(false)

    const [fullName, setFullName] = useState('')
    const [avatarUri, setAvatarUri] = useState(null)
    useEffect(() => {
        const fetchUser = async () => {
            setLoading(true)
            try {
                const response = await fetch(`${url}/api/user/profile`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                })

                const data = await response.json()
                if (!response.ok) {
                    throw new Error(data)
                }
                setFullName(data.fullName)
            } catch (error) {
                Alert.alert(error.message)
            } finally {
                setLoading(false)
            }
        }

        fetchUser()
    }, [])

    const pickImage = async () => {
        const { status } =
            await ImagePicker.requestMediaLibraryPermissionsAsync()
        if (status !== 'granted') {
            Alert.alert(
                'Sorry, we need camera roll permissions to make this work!'
            )
            return
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        })

        if (!result.canceled) {
            setAvatarUri(result.assets[0].uri)
        }
    }

    const handleSave = async () => {
        setUpdating(true)
        try {
            const formData = new FormData()

            formData.append('FullName', fullName)

            if (avatarUri && !avatarUri.startsWith('http')) {
                const uri = avatarUri
                const uriParts = uri.split('.')
                const fileType = uriParts[uriParts.length - 1]

                formData.append('AvatarFile', {
                    uri: uri,
                    name: `avatar.${fileType}`,
                    type: `image/${fileType}`,
                })
            }

            const response = await fetch(`${url}/api/user/update-profile`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
                body: formData,
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.title || 'Update failed')
            }

            const updatedUser = {
                ...user,
                fullname: data.fullName,
                avatar: data.avatar,
            }

            console.log(updatedUser)

            signIn(updatedUser)

            Alert.alert('Success', 'Profile updated successfully!')
            router.back()
        } catch (error) {
            console.log(error)
            Alert.alert('Error', 'Could not update profile')
        } finally {
            setUpdating(false)
        }
    }

    if (loading)
        return (
            <View className="flex-1 bg-black justify-center items-center">
                <ActivityIndicator size="large" color="#f5c518" />
            </View>
        )

    return (
        <View className="bg-black flex-1 px-10">
            <Stack.Screen
                options={{
                    title: 'Edit Profile',
                    headerTintColor: 'white',
                    headerShown: true,
                }}
            />
            <View className="items-center justify-center mb-4">
                <View className="relative">
                    <Image
                        source={{
                            uri:
                                user?.avatar ||
                                'https://i.pinimg.com/736x/0d/64/98/0d64989794b1a4c9d89bff571d3d5842.jpg',
                        }}
                        className="w-28 h-28 rounded-full border-4 border-[#1f2937]"
                    />
                    <TouchableOpacity
                        onPress={pickImage}
                        className="absolute bottom-0 right-0 bg-[#f5c518] p-2 rounded-full border-4 border-black"
                    >
                        <MaterialCommunityIcons
                            name="pencil"
                            size={16}
                            color="black"
                        />
                    </TouchableOpacity>
                </View>
            </View>
            <TextInput
                className="bg-gray-800 text-white p-4 rounded-xl mb-4"
                placeholder="Full Name"
                placeholderTextColor="#9ca3af"
                value={fullName}
                onChangeText={setFullName}
            />

            <TouchableOpacity
                onPress={handleSave}
                disabled={updating}
                className="bg-[#f5c518] py-4 rounded-xl items-center"
            >
                {updating ? (
                    <ActivityIndicator color="black" />
                ) : (
                    <Text className="text-black font-bold text-lg">
                        Save Changes
                    </Text>
                )}
            </TouchableOpacity>
        </View>
    )
}
