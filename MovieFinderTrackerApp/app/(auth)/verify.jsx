import React, { useState } from 'react'
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
} from 'react-native'
import { useRouter } from 'expo-router'

export default function Verify() {
    const router = useRouter()
    const [code, setCode] = useState('')
    const [email, setEmail] = useState('')

    const [loading, setLoading] = useState(false)

    const url = process.env.EXPO_PUBLIC_API_LOCAL

    const handleVerify = async () => {
        if (!code || !email) {
            Alert.alert('Error', 'Please fill all fields')
            return
        }
        setLoading(true)
        try {
            const response = await fetch(`${url}/api/auth/verify`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: email,
                    code: code,
                }),
            })

            if (response.ok) {
                Alert.alert('Success', 'Xác thực thành công!')
                toLogin()
            } else {
                const errorText = await response.text()
                throw new Error(errorText)
            }
        } catch (error) {
            Alert.alert('Verify Failed', error.message)
        } finally {
            setLoading(false)
        }
    }

    const toLogin = () => {
        router.replace('/login')
    }
    return (
        <View className="flex-1 bg-black justify-center px-6">
            <Text className="text-white text-3xl font-bold mb-8 text-center">
                Verify Account
            </Text>

            <TextInput
                className="bg-gray-800 text-white p-4 rounded-xl mb-4"
                placeholder="Email"
                placeholderTextColor="#9ca3af"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
            />

            <TextInput
                className="bg-gray-800 text-white p-4 rounded-xl mb-4"
                placeholder="Code"
                placeholderTextColor="#9ca3af"
                value={code}
                onChangeText={setCode}
                autoCapitalize="none"
            />

            <TouchableOpacity
                className="bg-[#f5c518] p-4 rounded-xl items-center"
                onPress={handleVerify}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color="black" />
                ) : (
                    <Text className="font-bold text-lg">Verify</Text>
                )}
            </TouchableOpacity>

            <View className="flex-row justify-center mt-6">
                <Text className="text-gray-400">Already verify account? </Text>
                <TouchableOpacity onPress={toLogin} activeOpacity={1}>
                    <Text className="text-[#f5c518] font-bold">Log in</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}
