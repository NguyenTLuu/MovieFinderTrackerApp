import React, { useState, useEffect, useCallback } from 'react'
import {
    Alert,
    Keyboard,
    Text,
    TextInput,
    View,
    TouchableWithoutFeedback,
    FlatList,
    ActivityIndicator,
    TouchableOpacity,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { SafeAreaView } from 'react-native-safe-area-context'
import DropDownPicker from 'react-native-dropdown-picker'
import MovieCard from '../../components/MovieCard'

export default function Search() {
    const [genreItems, setGenreItems] = useState([])
    const [selectedGenre, setSelectedGenre] = useState(null)
    const [openGenre, setOpenGenre] = useState(false)

    const [languageItems, setLanguageItems] = useState([])
    const [selectedLanguage, setSelectedLanguage] = useState(null)
    const [openLanguage, setOpenLanguage] = useState(false)

    const [query, setQuery] = useState('')

    const [result, setResult] = useState([])
    const [loading, setLoading] = useState(false)
    const [hasSearched, setHasSearched] = useState(false)

    const onOpenGenre = useCallback(() => {
        setOpenLanguage(false)
        Keyboard.dismiss()
    }, [])

    const onOpenLanguage = useCallback(() => {
        setOpenGenre(false)
        Keyboard.dismiss()
    }, [])

    const url = process.env.EXPO_PUBLIC_API_LOCAL

    const handleReset = () => {
        setQuery('')
        setSelectedGenre(null)
        setSelectedLanguage(null)
        setResult([])
        setHasSearched(false)
        setOpenGenre(false)
        setOpenLanguage(false)
        Keyboard.dismiss()
    }

    const fetchMovie = async () => {
        setLoading(true)
        setHasSearched(true)
        setOpenGenre(false)
        setOpenLanguage(false)
        Keyboard.dismiss()

        const params = new URLSearchParams()
        if (query) params.append('title', query)
        if (selectedGenre) params.append('genreId', selectedGenre)
        if (selectedLanguage) params.append('languageId', selectedLanguage)

        try {
            const respone = await fetch(
                `${url}/api/movie/search?${params.toString()}`
            )
            const data = await respone.json()
            if (!respone.ok) {
                throw new Error(data.message)
            }

            setResult(data)
        } catch (err) {
            setResult([])
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        const fetchGenre = async () => {
            try {
                const respone = await fetch(`${url}/api/genre`)
                const data = await respone.json()
                if (!respone.ok) {
                    throw new Error(data.message)
                }

                const dropdownData = [
                    { label: 'All Genres', value: null },
                    ...data.map((item) => ({
                        label: item.name,
                        value: item.genreId,
                    })),
                ]
                setGenreItems(dropdownData)
            } catch (err) {
                Alert.alert('Error', err.message)
                setGenreItems([])
            }
        }

        const fetchLanguage = async () => {
            try {
                const respone = await fetch(`${url}/api/languages`)
                const data = await respone.json()
                if (!respone.ok) {
                    throw new Error(data.message)
                }

                const dropdownData = [
                    { label: 'All Language', value: null },
                    ...data.map((item) => ({
                        label: item.name,
                        value: item.languageId,
                    })),
                ]
                setLanguageItems(dropdownData)
            } catch (err) {
                Alert.alert('Error', err.message)
                setLanguageItems([])
            }
        }
        fetchGenre()
        fetchLanguage()
    }, [])

    return (
        <SafeAreaView className="flex-1 px-4 py-4 bg-black">
            <View className="flex-row items-center bg-gray-800 rounded-full px-4 py-2 border border-gray-600 py-0">
                <Ionicons name="search" size={20} color="gray" />

                <TextInput
                    className="flex-1 ml-2 text-white text-base"
                    placeholder="Search movies..."
                    value={query}
                    onChangeText={setQuery}
                    placeholderTextColor="gray"
                />

                {query.length > 0 && (
                    <TouchableWithoutFeedback onPress={() => setQuery('')}>
                        <Ionicons name="close-circle" size={20} color="gray" />
                    </TouchableWithoutFeedback>
                )}
            </View>
            <View className="flex-row gap-2 mt-4">
                <View className="flex-1">
                    <DropDownPicker
                        open={openGenre}
                        value={selectedGenre}
                        items={genreItems}
                        setOpen={setOpenGenre}
                        setValue={setSelectedGenre}
                        setItems={setGenreItems}
                        placeholder="Select Genre"
                        onOpen={onOpenGenre}
                        theme="DARK"
                        style={{
                            backgroundColor: '#1f2937',
                            borderColor: selectedGenre ? '#eab308' : '#4b5563',
                            borderRadius: 12,
                            minHeight: 50,
                        }}
                        dropDownContainerStyle={{
                            backgroundColor: '#1f2937',
                            borderColor: '#4b5563',
                            borderRadius: 12,
                        }}
                        placeholderStyle={{
                            color: '#9ca3af',
                        }}
                        tickIconStyle={{
                            tintColor: '#22c55e',
                        }}
                    />
                </View>
                <View className="flex-1">
                    <DropDownPicker
                        open={openLanguage}
                        value={selectedLanguage}
                        items={languageItems}
                        setOpen={setOpenLanguage}
                        setValue={setSelectedLanguage}
                        setItems={setLanguageItems}
                        placeholder="Select Language"
                        onOpen={onOpenLanguage}
                        theme="DARK"
                        style={{
                            backgroundColor: '#1f2937',
                            borderColor: selectedLanguage
                                ? '#eab308'
                                : '#4b5563',
                            borderRadius: 12,
                            minHeight: 50,
                        }}
                        dropDownContainerStyle={{
                            backgroundColor: '#1f2937',
                            borderColor: '#4b5563',
                            borderRadius: 12,
                        }}
                        placeholderStyle={{
                            color: '#9ca3af',
                        }}
                        tickIconStyle={{
                            tintColor: '#22c55e',
                        }}
                    />
                </View>
            </View>
            <View className="flex-row gap-2 z-0 mt-4">
                <TouchableOpacity
                    activeOpacity={0.7}
                    className="justify-center items-center py-3 flex-1 rounded-full border-gray-600 color-[#9ca3af] bg-[#f5c518]"
                    onPress={fetchMovie}
                >
                    <Text>Search</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    activeOpacity={0.7}
                    className="justify-center items-center py-3 w-1/3 rounded-full border-gray-600 border"
                    onPress={handleReset}
                >
                    <Text className="color-[#9ca3af]">Reset</Text>
                </TouchableOpacity>
            </View>

            {/*Search result*/}
            <View className="mt-5 flex-1">
                {loading ? (
                    <View className="flex-1 justify-center items-center">
                        <ActivityIndicator size="large" color="#f5c518" />
                    </View>
                ) : (
                    <FlatList
                        data={result}
                        keyExtractor={(item) => item.movieId.toString()}
                        numColumns={3}
                        renderItem={({ item }) => (
                            <View className="w-[31%]">
                                <MovieCard item={item} />
                            </View>
                        )}
                        columnWrapperStyle={{
                            justifyContent: 'flex-start',
                            gap: 10,
                            paddingRight: 5,
                            marginBottom: 10,
                        }}
                        ListEmptyComponent={
                            hasSearched && !loading ? (
                                <View className="items-center mt-10">
                                    <Ionicons
                                        name="film-outline"
                                        size={50}
                                        color="#4b5563"
                                    />
                                    <Text className="text-gray-400 mt-2">
                                        No movies found.
                                    </Text>
                                </View>
                            ) : null
                        }
                    />
                )}
            </View>
        </SafeAreaView>
    )
}
