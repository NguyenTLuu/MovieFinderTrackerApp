import { Image, Text, View } from 'react-native'
import { FontAwesome } from '@expo/vector-icons'

export default function MyReviewCard({ date, poster, content, rating, title }) {
    const formatDate = (date) => {
        const dateObj = new Date(date)
        return dateObj.toLocaleDateString('en-US', {
            hour: 'numeric',
            minute: 'numeric',
        })
    }
    return (
        <View className="flex-row bg-gray-900 px-4 py-4 rounded-xl mb-3">
            <Image
                source={{ uri: poster }}
                className="w-24 aspect-[2/3] rounded-lg"
                resizeMode="cover"
            />
            <View className="flex-col flex-1 ml-4 justify-between ">
                <View>
                    <View className="flex-row justify-between items-start">
                        <Text
                            className="text-white font-bold text-base mb-1 flex-1 mr-2"
                            numberOfLines={2}
                        >
                            {title}
                        </Text>
                    </View>
                    <View className="flex-row gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <FontAwesome
                                key={star}
                                name={star <= rating ? 'star' : 'star-o'}
                                size={12}
                                color={star <= rating ? '#f5c518' : 'gray'}
                            />
                        ))}
                    </View>
                </View>
                <View className="flex-1 justify-center py-2">
                    <Text className="text-gray-300 text-sm" numberOfLines={3}>
                        {content}
                    </Text>
                </View>

                <View className="justify-end flex-row">
                    <Text className="text-gray-500 text-xs italic">
                        {formatDate(date)}
                    </Text>
                </View>
            </View>
        </View>
    )
}
