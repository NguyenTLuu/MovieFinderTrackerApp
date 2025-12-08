import { Modal, View, Text, TouchableOpacity } from 'react-native'
import React from 'react'

export function ConfirmModal({
    visible,
    onClose,
    onConfirm,
    title,
    message,
    applyBtnName,
}) {
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View className="flex-1 bg-black/80 justify-center items-center px-6">
                <View className="bg-[#1a1a1a] w-full rounded-2xl p-6 border border-gray-700 shadow-2xl">
                    <Text className="text-white text-xl font-bold mb-2 text-center">
                        {title}
                    </Text>

                    <Text className="text-gray-400 text-base text-center mb-6 leading-6">
                        {message}
                    </Text>

                    <View className="flex-row justify-between space-x-3 gap-3">
                        <TouchableOpacity
                            onPress={onClose}
                            className="flex-1 py-3 rounded-xl bg-gray-700 items-center"
                        >
                            <Text className="text-white font-semibold text-base">
                                Cancel
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={onConfirm}
                            className="flex-1 py-3 rounded-xl bg-red-600 items-center"
                        >
                            <Text className="text-white font-bold text-base">
                                {applyBtnName || 'Delete'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    )
}
