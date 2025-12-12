import React, { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import {
    ActivityIndicator,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native'
import { Stack } from 'expo-router'
import AntDesign from '@expo/vector-icons/AntDesign'
import { MaterialCommunityIcons } from '@expo/vector-icons'

export default function ChangePassword() {
    const { user } = useAuth()

    const [loading, setLoading] = useState(false)

    const [hasError, setHasError] = useState(false)
    const [responseMessage, setResponseMessage] = useState('')
    const [showNotification, setShowNotification] = useState(false)

    const [oldPassword, setOldPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')

    const url = process.env.EXPO_PUBLIC_API_LOCAL

    const handleChangePassword = async () => {
        if (!oldPassword || newPassword.trim().length < 6) {
            setHasError(true)
            setResponseMessage(
                'Please enter old and new password. Password must be at least 6 characters.'
            )
            setShowNotification(true)
            return
        }

        setLoading(true)
        try {
            const response = await fetch(`${url}/api/user/change-password`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
                body: JSON.stringify({
                    oldPassword: oldPassword,
                    newPassword: newPassword,
                }),
            })

            const data = await response.text()
            if (!response.ok) {
                setResponseMessage(data)
                throw new Error(data)
            }
            setHasError(false)
            setResponseMessage(data)
        } catch (error) {
            console.log(error)

            setHasError(true)
        } finally {
            setShowNotification(true)
            setLoading(false)
        }
    }

    return (
        <View className="bg-black flex-1 justify-center px-10">
            <Stack.Screen
                options={{
                    title: 'Change Password',
                    headerTintColor: 'white',
                    headerShown: true,
                }}
            />

            <TextInput
                className="bg-gray-800 text-white p-4 rounded-xl mb-4"
                placeholder="Old Password"
                placeholderTextColor="#9ca3af"
                value={oldPassword}
                onChangeText={setOldPassword}
            />
            <TextInput
                className="bg-gray-800 text-white p-4 rounded-xl mb-4"
                placeholder="New Password"
                placeholderTextColor="#9ca3af"
                value={newPassword}
                onChangeText={setNewPassword}
            />
            <TouchableOpacity
                onPress={handleChangePassword}
                className="bg-[#f5c518] justify-center items-center p-4 rounded-xl"
            >
                {loading ? (
                    <ActivityIndicator color="black" />
                ) : (
                    <Text className="text-black font-bold">Change</Text>
                )}
            </TouchableOpacity>

            {showNotification && (
                <View
                    className={`flex-row justify-between items-center  mt-4 px-3 py-3 rounded-2xl ${hasError ? 'bg-red-600/70' : 'bg-green-400/60'}`}
                >
                    <View className="items-center flex-row gap-3">
                        {hasError ? (
                            <AntDesign
                                name="exclamation-circle"
                                size={20}
                                color="white"
                            />
                        ) : (
                            <AntDesign
                                name="check-circle"
                                size={20}
                                color="white"
                            />
                        )}
                        <Text className="text-gray-100 font-bold flex-1">
                            {responseMessage}
                        </Text>
                    </View>
                    <TouchableOpacity
                        onPress={() => setShowNotification(false)}
                    >
                        <MaterialCommunityIcons
                            name="close"
                            size={24}
                            color="black"
                        />
                    </TouchableOpacity>
                </View>
            )}
        </View>
    )
}
