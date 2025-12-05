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

export default function Register() {
    const router = useRouter()
    const [userName, setUserName] = useState('')
    const [password, setPassword] = useState('')
    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')

    const [loading, setLoading] = useState(false)

    const url = process.env.EXPO_PUBLIC_API_LOCAL

    const handleRegister = async () => {
        if (!userName || !password || !fullName || !email) {
            Alert.alert('Error', 'Please fill all fields')
            return
        }
        setLoading(true)
        try {
            const response = await fetch(`${url}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: userName,
                    email: email,
                    fullName: fullName,
                    password: password,
                }),
            })

            if (response.ok) {
                Alert.alert(
                    'Success',
                    'Đăng ký thành công. Vui lòng kiểm tra email để lấy mã.'
                )
                toVerify()
            } else {
                const errorText = await response.text()
                throw new Error(errorText)
            }
        } catch (error) {
            Alert.alert('Registration Failed', error.message)
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    const toVerify = () => {
        router.replace('/verify')
    }

    const toLogin = () => {
        router.replace('/login')
    }
    return (
        <View className="flex-1 bg-black justify-center px-6">
            <Text className="text-white text-3xl font-bold mb-8 text-center">
                Register Account
            </Text>
            <TextInput
                className="bg-gray-800 text-white p-4 rounded-xl mb-4"
                placeholder="Username"
                placeholderTextColor="#9ca3af"
                value={userName}
                onChangeText={setUserName}
                autoCapitalize="none"
            />

            <TextInput
                className="bg-gray-800 text-white p-4 rounded-xl mb-4"
                placeholder="Full Name"
                placeholderTextColor="#9ca3af"
                value={fullName}
                onChangeText={setFullName}
                autoCapitalize="none"
            />

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
                placeholder="Password"
                placeholderTextColor="#9ca3af"
                value={password}
                onChangeText={setPassword}
                autoCapitalize="none"
                secureTextEntry
            />

            <TouchableOpacity
                className="bg-[#f5c518] p-4 rounded-xl items-center"
                onPress={handleRegister}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color="black" />
                ) : (
                    <Text className="font-bold text-lg">Register</Text>
                )}
            </TouchableOpacity>

            <View className="flex-row justify-center mt-6">
                <Text className="text-gray-400">Already have an account? </Text>
                <TouchableOpacity onPress={toLogin} activeOpacity={1}>
                    <Text className="text-[#f5c518] font-bold">Log in</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}
