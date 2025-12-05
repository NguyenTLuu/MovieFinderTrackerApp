// context/AuthContext.js
import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
} from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { jwtDecode } from 'jwt-decode'
import 'core-js/stable/atob'

const AuthContext = createContext({})

export function useAuth() {
    return useContext(AuthContext)
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [tokenExp, setTokenExp] = useState(null)

    const signOut = useCallback(async () => {
        await AsyncStorage.removeItem('userToken')
        await AsyncStorage.removeItem('tokenExpiry')
        setUser(null)
        setIsAuthenticated(false)
        setTokenExp(null)
    }, [])

    useEffect(() => {
        const loadUser = async () => {
            try {
                const now = Date.now()
                const token = await AsyncStorage.getItem('userToken')
                const exp = await AsyncStorage.getItem('tokenExpiry')

                // Dont have token or token expired
                if (!token || !exp) {
                    setUser(null)
                    setIsAuthenticated(false)
                    setTokenExp(null)
                    return
                }

                // Token is expired
                if (now > parseInt(exp, 10)) {
                    await signOut()
                    return
                }

                setUser({ token })
                setIsAuthenticated(true)
                setTokenExp(parseInt(exp, 10))
            } catch (e) {
                console.log(e)
                setIsAuthenticated(false)
                setUser(null)
            } finally {
                setLoading(false)
            }
        }
        loadUser()
    }, [])

    useEffect(() => {
        if (!tokenExp) return

        const intervalId = setInterval(() => {
            const now = Date.now()
            if (now >= tokenExp) {
                signOut()
            }
        }, 30_000)
        return () => clearInterval(intervalId)
    }, [tokenExp])

    const signIn = async (token) => {
        const decoded = jwtDecode(token)
        const expiry = decoded.exp * 1000

        await AsyncStorage.setItem('userToken', token)
        await AsyncStorage.setItem('tokenExpiry', expiry.toString())
        setUser({ token })
        setTokenExp(expiry)
        setIsAuthenticated(true)
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated,
                loading,
                signIn,
                signOut,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}
