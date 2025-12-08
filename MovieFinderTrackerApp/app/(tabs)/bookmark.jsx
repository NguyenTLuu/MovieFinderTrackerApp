import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    RefreshControl,
    Alert,
} from 'react-native'
import React, { useState, useCallback } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAuth } from '../../context/AuthContext'
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'
import { Link, useFocusEffect } from 'expo-router'
import { ConfirmModal } from '../../components/ConfirmModal'

export default function Bookmark() {
    const { user } = useAuth()
    const [lists, setLists] = useState([])
    const [loading, setLoading] = useState(true)
    const url = process.env.EXPO_PUBLIC_API_LOCAL

    const [showConfirmDelete, setShowConfirmDelete] = useState(false)
    const [selectedListToDelete, setSelectedListToDelete] = useState(null)

    const fetchMyLists = async () => {
        try {
            const response = await fetch(`${url}/api/CustomList`, {
                headers: { Authorization: `Bearer ${user.token}` },
            })
            const data = await response.json()
            setLists(data)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    useFocusEffect(
        useCallback(() => {
            fetchMyLists()
        }, [user])
    )

    const promptDelete = (id) => {
        setSelectedListToDelete(id)
        setShowConfirmDelete(true)
    }

    const handleDeleteList = async () => {
        setShowConfirmDelete(false)
        if (!selectedListToDelete) return

        try {
            const response = await fetch(
                `${url}/api/CustomList/${selectedListToDelete}`,
                {
                    method: 'DELETE',
                    headers: { Authorization: `Bearer ${user.token}` },
                }
            )
            const message = await response.text()

            if (response.ok) {
                Alert.alert('Thành công', 'Đã xóa danh sách.')
                setLists((prev) =>
                    prev.filter(
                        (item) => item.customListId !== selectedListToDelete
                    )
                )
            } else {
                Alert.alert('Lỗi', message)
            }
        } catch (error) {
            Alert.alert('Lỗi', 'Không thể kết nối đến server.')
        }
    }

    // Render Each List
    const renderListItem = ({ item }) => {
        let iconName = 'folder-outline'
        let iconColor = '#9ca3af'

        if (item.name === 'Watchlist') {
            iconName = 'bookmark-outline'
            iconColor = '#f5c518'
        } else if (item.name === 'Watched') {
            iconName = 'check-circle-outline'
            iconColor = '#22c55e'
        }

        return (
            <Link
                href={{
                    pathname: '/lists/[id]',
                    params: { id: item.customListId, name: item.name },
                }}
                asChild
            >
                <TouchableOpacity className="flex-row items-center bg-[#1a1a1a] p-4 mb-3 rounded-xl border border-gray-800">
                    <View className="bg-gray-800 p-3 rounded-full mr-4">
                        <MaterialCommunityIcons
                            name={iconName}
                            size={24}
                            color={iconColor}
                        />
                    </View>

                    <View className="flex-1 ">
                        <View className="flex-row  items-center">
                            <Text className="text-white text-lg font-bold">
                                {item.name}
                            </Text>
                            <View className="flex px-3 justify-center items-center bg-[#f5c518]/80 rounded-full ml-5 ">
                                <Text className="  text-black text-xs font-bold text-center">
                                    {item.movieCount}
                                </Text>
                            </View>
                        </View>
                        <Text className="text-gray-500 text-xs">
                            {item.isSystemDefault
                                ? 'Default List'
                                : 'Custom List'}
                        </Text>
                    </View>

                    {!item.isSystemDefault && (
                        <TouchableOpacity
                            className="p-4 border-l border-gray-800 justify-center items-center "
                            onPress={() => promptDelete(item.customListId)}
                        >
                            <MaterialIcons
                                name="delete-outline"
                                size={24}
                                color="#ef4444"
                            />
                        </TouchableOpacity>
                    )}

                    {item.isSystemDefault && (
                        <View className="p-4 justify-center items-center">
                            <MaterialCommunityIcons
                                name="chevron-right"
                                size={24}
                                color="gray"
                            />
                        </View>
                    )}
                </TouchableOpacity>
            </Link>
        )
    }

    return (
        <SafeAreaView className="flex-1 bg-black px-4 py-3">
            <Text className="text-white text-3xl font-bold mt-4 mb-6">
                My Lists
            </Text>

            <FlatList
                data={lists}
                keyExtractor={(item) => item.customListId.toString()}
                renderItem={renderListItem}
                showsVerticalScrollIndicator={false}
            />

            <ConfirmModal
                visible={showConfirmDelete}
                onClose={() => setShowConfirmDelete(false)}
                onConfirm={handleDeleteList}
                title="Delete List?"
                message="Are you sure you want to delete this list? All movies in this list will be removed."
                applyBtnName="Delete"
            />
        </SafeAreaView>
    )
}
