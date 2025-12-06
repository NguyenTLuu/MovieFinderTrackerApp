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
import { useAuth } from '../../context/AuthContext'

export default function Login() {
    const router = useRouter()
    const { signIn } = useAuth() // Lấy hàm signIn từ context
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const url = process.env.EXPO_PUBLIC_API_LOCAL

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin')
            return
        }

        setLoading(true)
        try {
            const response = await fetch(`${url}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: email,
                    password: password,
                }),
            })

            if (response.ok) {
                const data = await response.json()
                signIn(data)
            } else {
                const errorText = await response.text()
                Alert.alert('Login Fail', errorText)
            }
        } catch (error) {
            Alert.alert('Error', error.message || `Can't connect to the server`)
        } finally {
            setLoading(false)
        }
    }

    const toRegister = () => {
        router.replace('/register')
    }

    const toVerify = () => {
        router.replace('/verify')
    }

    return (
        <View className="flex-1 bg-black justify-center px-6">
            <Text className="text-white text-3xl font-bold mb-8 text-center">
                Welcome Back
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
                className="bg-gray-800 text-white p-4 rounded-xl mb-6"
                placeholder="Password"
                placeholderTextColor="#9ca3af"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            <TouchableOpacity
                className="bg-[#f5c518] p-4 rounded-xl items-center"
                onPress={handleLogin}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color="black" />
                ) : (
                    <Text className="font-bold text-lg">Login</Text>
                )}
            </TouchableOpacity>

            <View className="flex-row justify-center mt-6">
                <Text className="text-gray-400">Don't have an account? </Text>
                <TouchableOpacity onPress={toRegister} activeOpacity={1}>
                    <Text className="text-[#f5c518] font-bold">Sign Up</Text>
                </TouchableOpacity>

                <Text className="text-gray-400"> or </Text>
                <TouchableOpacity onPress={toVerify} activeOpacity={1}>
                    <Text className="text-[#f5c518] font-bold">
                        Verify Account
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}
