import { DarkTheme, ThemeProvider } from '@react-navigation/native'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import 'react-native-reanimated'
import '../global.css' // Giữ file này để dùng Tailwind
import { SafeAreaProvider } from 'react-native-safe-area-context'

export const unstable_settings = {
    anchor: '(tabs)',
}

// Định nghĩa Theme tối tùy chỉnh (Ép nền đen tuyệt đối)
const MyNavDarkTheme = {
    ...DarkTheme,
    colors: {
        ...DarkTheme.colors,
        background: '#000000', // Quan trọng: Nền đen thay vì xám mặc định
        card: '#000000', // Header đen
        text: '#ffffff',
        border: '#27272a', // Viền xám nhẹ
    },
}

export default function RootLayout() {
    return (
        // Đặt màu nền cho SafeAreaProvider để tránh vệt trắng ở tai thỏ/đáy màn hình
        <SafeAreaProvider style={{ backgroundColor: '#000' }}>
            <ThemeProvider value={MyNavDarkTheme}>
                <Stack
                    screenOptions={{
                        // Đảm bảo nội dung bên trong stack cũng nền đen
                        contentStyle: { backgroundColor: '#000000' },
                        headerShown: false,
                        // Hiệu ứng chuyển cảnh mượt
                        animation: 'slide_from_right',
                    }}
                >
                    <Stack.Screen name="(tabs)" />
                    <Stack.Screen name="movies" />
                    <Stack.Screen name="directors" />

                    {/* Giữ nguyên tên thư mục Casts viết hoa như cấu trúc của bạn */}
                    <Stack.Screen name="casts" />
                </Stack>

                {/* Luôn hiển thị chữ trắng trên thanh trạng thái */}
                <StatusBar style="light" backgroundColor="#000000" />
            </ThemeProvider>
        </SafeAreaProvider>
    )
}
