import { Image, Text, View } from 'react-native'
import { FontAwesome } from '@expo/vector-icons'

export default function ReviewCard({
    userName,
    rating,
    content,
    date,
    avatar,
}) {
    const formatDate = (date) => {
        const dateObj = new Date(date)
        return dateObj.toLocaleDateString('en-US', {
            hour: 'numeric',
            minute: 'numeric',
        })
    }

    return (
        <View className="flex-row flex bg-gray-900 rounded-xl px-3 py-4 items-start mb-3">
            <Image
                source={{
                    uri:
                        avatar ||
                        'https://i.pinimg.com/736x/0d/64/98/0d64989794b1a4c9d89bff571d3d5842.jpg',
                }}
                className="h-[50px] w-[50px] rounded-full"
                resizeMode="cover"
            />
            <View className="flex-col flex-1 ml-4">
                <View className="flex-row gap-3 items-center mb-1">
                    <Text className="text-white font-bold">@{userName}</Text>
                    <View className="flex-row gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <FontAwesome
                                key={star}
                                name={star <= rating ? 'star' : 'star-o'}
                                size={16}
                                color={star <= rating ? '#f5c518' : 'gray'}
                            />
                        ))}
                    </View>
                </View>
                <Text className="text-gray-300">{content}</Text>
                <View className="justify-end flex-row mt-4">
                    <Text className="text-gray-500 text-sm italic">
                        {formatDate(date)}
                    </Text>
                </View>
            </View>
        </View>
    )
}
