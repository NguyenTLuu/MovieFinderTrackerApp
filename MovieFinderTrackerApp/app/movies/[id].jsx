import { Link, Stack, useLocalSearchParams } from 'expo-router'
import {
    Image,
    Text,
    View,
    ImageBackground,
    ActivityIndicator,
    ScrollView,
    Alert,
    FlatList,
    TouchableOpacity,
    Modal,
    TextInput,
    KeyboardAvoidingView,
    Platform,
} from 'react-native'
import AntDesign from '@expo/vector-icons/AntDesign'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6'
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons'
import React, { useState, useEffect, useMemo } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import YoutubePlayer from 'react-native-youtube-iframe'
import { LinearGradient } from 'expo-linear-gradient'
import { useAuth } from '../../context/AuthContext'

export default function MovieDetail() {
    const { user, systemListIds } = useAuth()

    const { id } = useLocalSearchParams()
    const [loading, setLoading] = useState(true)
    const [movie, setMovie] = useState(null)

    const [modalAddList, setModalAddList] = useState(false)

    const url = process.env.EXPO_PUBLIC_API_LOCAL

    const [modalVisible, setModalVisible] = useState(false)
    const [myLists, setMyLists] = useState([])
    const [containingListIds, setContainingListIds] = useState([])
    const [listLoading, setListLoading] = useState(false)

    const [newList, setNewList] = useState('')

    const inWatchlist = useMemo(
        () => containingListIds.includes(systemListIds?.watchlistId),
        [containingListIds, systemListIds]
    )

    const inWatched = useMemo(
        () => containingListIds.includes(systemListIds?.watchedId),
        [containingListIds, systemListIds]
    )

    const [reviewText, setReviewText] = useState('')
    const [rating, setRating] = useState(5)

    const [hasError, setHasError] = useState(false)
    const [responseMessage, setResponseMessage] = useState('')
    const [showNotification, setShowNotification] = useState(false)

    useEffect(() => {
        if (!id) return
        const fetchData = async () => {
            setLoading(true)
            try {
                const [movieRes, checkRes] = await Promise.all([
                    fetch(`${url}/api/movie/${id}`),
                    fetch(`${url}/api/UserMovie/check/${id}`, {
                        headers: { Authorization: `Bearer ${user.token}` },
                    }),
                ])
                setMovie(await movieRes.json())
                setContainingListIds(await checkRes.json())
            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [id])

    const handleToggleList = async (listId) => {
        if (!listId) {
            Alert.alert('Error', 'Không tìm thấy thông tin danh sách.')
            return
        }

        const isPresent = containingListIds.includes(listId)

        if (isPresent) {
            setContainingListIds((prev) => prev.filter((pid) => pid !== listId))
        } else {
            setContainingListIds((prev) => [...prev, listId])
        }

        try {
            const endpoint = isPresent ? 'remove' : 'add'
            await fetch(`${url}/api/UserMovie/${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
                body: JSON.stringify({
                    movieId: id,
                    customListId: listId,
                }),
            })
        } catch (error) {
            console.log(error)
            // Revert nếu lỗi (Đảo ngược lại hành động trên)
            if (isPresent) setContainingListIds((prev) => [...prev, listId])
            else
                setContainingListIds((prev) =>
                    prev.filter((pid) => pid !== listId)
                )
            Alert.alert('Lỗi', 'Không thể cập nhật danh sách')
        }
    }

    const handleAddNewList = async () => {
        setListLoading(true)

        try {
            const response = await fetch(`${url}/api/CustomList`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
                body: JSON.stringify({ name: newList }),
            })

            const data = await response.json()
            if (!response.ok) {
                throw new Error('Error', data)
            }

            setMyLists((prev) => [
                ...prev,
                {
                    customListId: data.customListId,
                    name: data.name,
                    isSystemDefault: false,
                },
            ])
            setModalAddList(false)
        } catch (error) {
            Alert.alert(error.message)
        } finally {
            setListLoading(false)
            setNewList('')
        }
    }

    const openManageListModal = async () => {
        setModalVisible(true)
        setListLoading(true)
        try {
            const response = await fetch(`${url}/api/CustomList`, {
                headers: { Authorization: `Bearer ${user.token}` },
            })
            setMyLists(await response.json())
        } catch (error) {
            console.log(error)
        } finally {
            setListLoading(false)
        }
    }

    const handleSubmitReview = async () => {
        setListLoading(true)
        const content = reviewText.trim()
        if (!content) {
            setHasError(true)
            setResponseMessage("Review can't be empty")
            setShowNotification(true)

            return
        }

        try {
            const response = await fetch(`${url}/api/review`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
                body: JSON.stringify({
                    movieId: id,
                    rating: rating,
                    content: content,
                }),
            })
            const data = await response.text()

            if (!response.ok) {
                throw new Error(data)
            }

            setHasError(false)
            setResponseMessage(data)
            setRating(5)
            setReviewText('')
        } catch (error) {
            setHasError(true)
            setResponseMessage(error.message)
        } finally {
            setLoading(false)
            setShowNotification(true)
        }
    }

    if (loading || !movie) {
        return (
            <View className="flex-1 items-center justify-center bg-black">
                <ActivityIndicator size="large" color="white" />
            </View>
        )
    }

    const runtime = movie.runtime
    const hour = Math.floor(runtime / 60)
    const minute = runtime % 60
    const length = `${hour}h ${minute}m`

    return (
        <SafeAreaView className="bg-black flex flex-col justify-center items-center">
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
            >
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <ImageBackground
                        source={{ uri: movie.backdrop }}
                        resizeMode="cover"
                        style={{ width: '100%', minHeight: 450 }}
                    >
                        <LinearGradient
                            colors={[
                                'transparent',
                                'rgba(0,0,0,0.3)',
                                '#000000',
                            ]}
                            className="absolute w-full h-full"
                            start={{ x: 0.5, y: 0 }}
                            end={{ x: 0.5, y: 1 }}
                        />
                        <View className="flex-row items-end px-4 pb-8 mt-auto">
                            <View className="shadow-2xl shadow-black">
                                <Image
                                    source={{ uri: movie.poster }}
                                    style={{
                                        width: 120,
                                        height: 180,
                                        borderRadius: 12,
                                        borderWidth: 1,
                                        borderColor: 'rgba(255,255,255,0.1)',
                                    }}
                                    resizeMode="cover"
                                />
                            </View>
                            <View className="flex-1 ml-4 justify-end pb-1">
                                <Text
                                    className="text-white font-bold text-2xl mb-2 shadow-black"
                                    numberOfLines={2}
                                >
                                    {movie.title}
                                </Text>
                                <View className="flex-row items-center mb-3">
                                    <MaterialCommunityIcons
                                        name="star"
                                        size={20}
                                        color="#FFD700"
                                    />
                                    <Text className="text-yellow-400 font-bold text-lg ml-1">
                                        {movie.rating.toFixed(1)}
                                    </Text>
                                    <Text className="text-gray-400 text-xs ml-1 mt-1">
                                        / 10
                                    </Text>
                                    <View className="w-1 h-1 bg-gray-500 rounded-full mx-2" />
                                    <View className="bg-gray-800 px-2 py-0.5 rounded-md border border-gray-600">
                                        <Text className="text-gray-300 text-xs font-bold uppercase">
                                            English
                                        </Text>
                                    </View>
                                </View>
                                <View className="flex-row flex-wrap mb-3">
                                    {movie.genreNames
                                        ?.slice(0, 3)
                                        .map((genre, index) => (
                                            <View
                                                key={index}
                                                className="bg-white/20 px-3 py-1 rounded-full mr-2 mb-1 backdrop-blur-md"
                                            >
                                                <Text className="text-white text-xs font-medium">
                                                    {genre}
                                                </Text>
                                            </View>
                                        ))}
                                </View>
                                <View className="flex-row items-center space-x-4">
                                    <View className="flex-row items-center">
                                        <MaterialCommunityIcons
                                            name="calendar-blank"
                                            size={16}
                                            color="#9ca3af"
                                        />
                                        <Text className="text-gray-300 text-sm ml-1">
                                            {movie.releaseYear}
                                        </Text>
                                    </View>
                                    <View className="flex-row items-center ml-3">
                                        <MaterialCommunityIcons
                                            name="clock-outline"
                                            size={16}
                                            color="#9ca3af"
                                        />
                                        <Text className="text-gray-300 text-sm ml-1">
                                            {length}
                                        </Text>
                                    </View>
                                    <View className="flex-row items-center ml-3">
                                        <MaterialCommunityIcons
                                            name="map-marker-outline"
                                            size={16}
                                            color="#9ca3af"
                                        />
                                        <Text className="text-gray-300 text-sm ml-1">
                                            USA
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </ImageBackground>

                    {/* Action Buttons */}
                    <View className="flex-row px-4 mb-5 items-center gap-4">
                        <TouchableOpacity
                            activeOpacity={0.7}
                            onPress={() =>
                                handleToggleList(systemListIds.watchlistId)
                            }
                            className={`flex-1 flex-row justify-center items-center border rounded-full py-3 
                            ${
                                inWatchlist
                                    ? 'bg-[#f5c518] border-[#f5c518]'
                                    : 'bg-gray-800/80 border-gray-700'
                            }`}
                        >
                            <FontAwesome6
                                name={inWatchlist ? 'check' : 'bookmark'}
                                size={18}
                                color={inWatchlist ? 'black' : 'white'}
                            />
                            <Text
                                className={`font-semibold text-sm ml-2 ${inWatchlist ? 'text-black font-bold' : 'text-white'}`}
                            >
                                {inWatchlist ? 'In Watchlist' : 'Watchlist'}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            activeOpacity={0.7}
                            onPress={() =>
                                handleToggleList(systemListIds.watchedId)
                            }
                            className={`flex-1 flex-row justify-center items-center border rounded-full py-3 
                            ${
                                inWatched
                                    ? 'bg-green-600 border-green-600'
                                    : 'bg-gray-800/80 border-gray-700'
                            }`}
                        >
                            <AntDesign
                                name={inWatched ? 'check-circle' : 'check'}
                                size={20}
                                color="white"
                            />
                            <Text className="text-white font-bold text-sm ml-2">
                                {inWatched ? 'Watched' : 'Mark Watched'}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            activeOpacity={0.7}
                            onPress={openManageListModal}
                            className="bg-gray-800 py-3 px-3 rounded-xl justify-center items-center border border-gray-600"
                        >
                            <MaterialCommunityIcons
                                name="playlist-plus"
                                size={20}
                                color="#f5c518"
                            />
                        </TouchableOpacity>
                    </View>

                    <View className="flex-1 px-4 pt-2">
                        <Text className="text-gray-400 text-base leading-6 italic mb-6 text-justify hyphens-auto">
                            "{movie.description}"
                        </Text>
                        <View>
                            <Text className="text-white text-xl mb-3 font-bold border-l-4 border-[#f5c518] pl-2">
                                Trailer
                            </Text>
                            <YoutubePlayer
                                height={220}
                                videoId={movie.trailer}
                            />
                        </View>
                    </View>

                    <View className="flex-1 px-4 pt-4">
                        <Text className="text-white text-xl mb-3 font-bold border-l-4 border-[#f5c518] pl-2">
                            Top Casts
                        </Text>
                        <FlatList
                            data={movie.casts}
                            keyExtractor={(item) => item.castId.toString()}
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                            className="my-3"
                            contentContainerStyle={{
                                flexGrow: 2,
                                justifyContent: 'space-around',
                            }}
                            renderItem={({ item }) => (
                                <Link href={`/casts/${item.castId}`} asChild>
                                    <TouchableOpacity>
                                        <Image
                                            source={{ uri: item.avatar }}
                                            style={{
                                                width: 80,
                                                height: 80,
                                                borderRadius: 40,
                                                borderWidth: 2,
                                                borderColor: '#737373',
                                            }}
                                            resizeMode="cover"
                                        />
                                        <Text className="text-white mt-1 w-[80px] text-center">
                                            {item.name}
                                        </Text>
                                    </TouchableOpacity>
                                </Link>
                            )}
                        />
                    </View>

                    {movie.director && (
                        <View className="flex-1 px-4 pt-4">
                            <Text className="text-white text-xl mb-3 font-bold border-l-4 border-[#f5c518] pl-2">
                                Director
                            </Text>
                            <View className="flex-1 my-3 items-center">
                                <Link
                                    href={`/directors/${movie.director.directorId}`}
                                >
                                    <View>
                                        <Image
                                            source={{
                                                uri: movie.director.avatar,
                                            }}
                                            style={{
                                                width: 80,
                                                height: 80,
                                                borderRadius: 40,
                                                borderWidth: 2,
                                                borderColor: '#737373',
                                            }}
                                            resizeMode="cover"
                                        />
                                        <Text className="text-white mt-1 w-[80px] text-center">
                                            {movie.director.name}
                                        </Text>
                                    </View>
                                </Link>
                            </View>
                        </View>
                    )}

                    {/* Review */}
                    <View className="flex-1 px-4 pt-4">
                        <Text className="text-white text-xl mb-3 font-bold border-l-4 border-[#f5c518] pl-2">
                            Review
                        </Text>

                        {/* Notification for submit */}
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
                                    <Text className="text-gray-100 font-bold">
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

                        {/* Input Review */}
                        <View className="flex-1 my-3 mt-4bg-gray-800 rounded-2xl border bg-gray-800/60 border-gray-700 p-2 h-28">
                            <TextInput
                                className="flex-1 ml-2 text-white text-base"
                                placeholder="What do you think about this movie?"
                                value={reviewText}
                                onChangeText={setReviewText}
                                placeholderTextColor="gray"
                                multiline={true}
                                numberOfLines={3}
                                textAlignVertical="top"
                            />
                        </View>
                        <View className="flex-row justify-between items-center">
                            <View className="flex-row gap-2 ml-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <TouchableOpacity
                                        key={star}
                                        onPress={() => setRating(star)}
                                        activeOpacity={0.7}
                                    >
                                        <FontAwesome
                                            name={
                                                star <= rating
                                                    ? 'star'
                                                    : 'star-o'
                                            }
                                            size={20}
                                            color={
                                                star <= rating
                                                    ? '#f5c518'
                                                    : 'gray'
                                            }
                                        />
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <TouchableOpacity
                                className="bg-[#f5c518] py-3 px-6 rounded-xl items-center"
                                onPress={handleSubmitReview}
                            >
                                {loading ? (
                                    <ActivityIndicator color="black" />
                                ) : (
                                    <Text className="text-black font-bold text-base">
                                        Submit
                                    </Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>

                    <Link
                        href={{
                            pathname: '/movies/review',
                            params: { id: id },
                        }}
                        asChild
                    >
                        <TouchableOpacity className="justify-center items-center mt-4 ">
                            <Text className="text-gray-400 font-bold text-base">
                                Show all reviews
                            </Text>
                        </TouchableOpacity>
                    </Link>

                    <View className="h-20" />
                </ScrollView>
            </KeyboardAvoidingView>

            {/* Modal Create New List */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalAddList}
                onRequestClose={() => setModalAddList(false)}
                className="flex-1"
            >
                <View className="flex-1 justify-center items-center">
                    <View className="bg-[#1a1a1a] w-full max-w-sm rounded-2xl p-6 border border-gray-700 shadow-xl">
                        <View className="flex-row justify-between">
                            <Text className="text-white text-xl font-bold mb-4 text-center">
                                Create New List
                            </Text>
                            <TouchableOpacity
                                onPress={() => setModalAddList(false)}
                            >
                                <MaterialCommunityIcons
                                    name="close"
                                    size={24}
                                    color="gray"
                                />
                            </TouchableOpacity>
                        </View>
                        <TextInput
                            placeholder="Enter list name..."
                            value={newList}
                            onChangeText={setNewList}
                            placeholderTextColor="#9ca3af"
                            className="bg-gray-800 text-white p-3 rounded-lg border border-gray-600 mb-6"
                            autoFocus={true}
                        />
                        <View className="flex-row justify-end gap-3">
                            <TouchableOpacity
                                className="px-6 py-3 rounded-lg bg-gray-700 "
                                onPress={() => setModalAddList(false)}
                            >
                                <Text className="text-white font-semibold">
                                    Cancel
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                className="px-6 py-3 rounded-lg bg-[#f5c518] "
                                onPress={handleAddNewList}
                            >
                                <Text className="text-black font-bold">
                                    Create
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Modal add movie to list */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View className="flex-1 justify-end bg-black/80">
                    <View className="bg-[#1a1a1a] rounded-t-3xl h-[50%] p-4">
                        {/* Header Modal */}
                        <View className="flex-row justify-between items-center mb-4 border-b border-gray-700 pb-2">
                            <Text className="text-white text-xl font-bold">
                                Save to...
                            </Text>
                            <TouchableOpacity
                                onPress={() => setModalVisible(false)}
                            >
                                <MaterialCommunityIcons
                                    name="close"
                                    size={24}
                                    color="gray"
                                />
                            </TouchableOpacity>
                        </View>

                        {/* Render List */}
                        {listLoading ? (
                            <ActivityIndicator color="#f5c518" />
                        ) : (
                            <FlatList
                                data={myLists}
                                keyExtractor={(item) =>
                                    item.customListId.toString()
                                }
                                renderItem={({ item }) => {
                                    const isChecked =
                                        containingListIds.includes(
                                            item.customListId
                                        )

                                    return (
                                        <TouchableOpacity
                                            onPress={() =>
                                                handleToggleList(
                                                    item.customListId
                                                )
                                            }
                                            className="flex-row items-center py-3 border-b border-gray-800"
                                        >
                                            <MaterialCommunityIcons
                                                name={
                                                    isChecked
                                                        ? 'checkbox-marked'
                                                        : 'checkbox-blank-outline'
                                                }
                                                size={24}
                                                color={
                                                    isChecked
                                                        ? '#f5c518'
                                                        : 'gray'
                                                }
                                            />

                                            <Text
                                                className={`ml-3 text-lg ${isChecked ? 'text-[#f5c518] font-bold' : 'text-white'}`}
                                            >
                                                {item.name}
                                            </Text>

                                            <View className="ml-auto bg-gray-700 px-2 py-1 rounded">
                                                <Text className="text-xs text-gray-300">
                                                    {item.isSystemDefault ===
                                                    true
                                                        ? 'Default'
                                                        : 'Custom'}
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                    )
                                }}
                            />
                        )}

                        {/* Create new list button */}
                        <TouchableOpacity
                            onPress={() => setModalAddList(true)}
                            className="mt-4 flex-row items-center justify-center py-3 bg-gray-800 rounded-lg"
                        >
                            <MaterialCommunityIcons
                                name="plus"
                                size={20}
                                color="white"
                            />
                            <Text className="text-white font-bold ml-2">
                                New List
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    )
}
