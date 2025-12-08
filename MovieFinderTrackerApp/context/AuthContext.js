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

    const [systemListIds, setSystemListIds] = useState({
        watchlistId: null,
        watchedId: null,
    })

    const url = process.env.EXPO_PUBLIC_API_LOCAL

    const signOut = useCallback(async () => {
        await AsyncStorage.removeItem('userToken')
        await AsyncStorage.removeItem('tokenExpiry')
        setUser(null)
        setIsAuthenticated(false)
        setTokenExp(null)
        setSystemListIds({ watchlistId: null, watchedId: null })
    }, [])

    useEffect(() => {
        const loadUser = async () => {
            try {
                const now = Date.now()
                const userData = await AsyncStorage.getItem('userData')
                const exp = await AsyncStorage.getItem('tokenExpiry')

                // Dont have token or token expired
                if (!userData || !exp) {
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
                // String to Object
                const JsonUserData = JSON.parse(userData)

                setUser(JsonUserData)
                await fetchSystemLists(JsonUserData.token)
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

        const checkToken = setInterval(() => {
            const now = Date.now()
            if (now >= tokenExp) {
                signOut()
            }
        }, 30_000)
        return () => clearInterval(checkToken)
    }, [tokenExp])

    const fetchSystemLists = async (token) => {
        try {
            const response = await fetch(`${url}/api/CustomList`, {
                headers: { Authorization: `Bearer ${token}` },
            })

            if (response.ok) {
                const data = await response.json()

                const watchlist = data.find(
                    (l) => l.name === 'Watchlist' && l.isSystemDefault
                )
                const watched = data.find(
                    (l) => l.name === 'Watched' && l.isSystemDefault
                )

                setSystemListIds({
                    watchlistId: watchlist?.customListId || null,
                    watchedId: watched?.customListId || null,
                })
            }
        } catch (error) {
            console.log('Error fetching system lists', error)
        }
    }

    const signIn = async (data) => {
        const { token } = data
        const decoded = jwtDecode(token)
        const expiry = decoded.exp * 1000

        await AsyncStorage.setItem('userData', JSON.stringify(data))
        await AsyncStorage.setItem('tokenExpiry', expiry.toString())
        setUser(data)
        setTokenExp(expiry)
        setIsAuthenticated(true)
        await fetchSystemLists(token)
    }

    return (
        <AuthContext.Provider
            value={{
                systemListIds,
                user,
                isAuthenticated,
                signIn,
                signOut,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}
