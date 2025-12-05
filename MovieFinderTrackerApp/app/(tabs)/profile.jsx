import { View, Button } from 'react-native'
import { useAuth } from '../../context/AuthContext'

export default function Profile() {
    const { signOut } = useAuth()

    return (
        <View className="flex-1 bg-black justify-center items-center">
            <Button title="Log Out" color="#ef4444" onPress={signOut} />
        </View>
    )
}
