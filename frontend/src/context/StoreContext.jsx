import { createContext, useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export const StoreContext = createContext(null)

const StoreContextProvider = (props) => {

    const [food_list, setFoodList] = useState([]);
    const [token, setToken] = useState(localStorage.getItem("token") || "")
    const [user, setUser] = useState(null)

    const [cartItems, setCartItems] = useState(() => {
        const saved = localStorage.getItem("cartItems")
        return saved ? JSON.parse(saved) : {}
    })

    useEffect(() => {
        localStorage.setItem("cartItems", JSON.stringify(cartItems))
    }, [cartItems])

    useEffect(() => {
        fetch(`${API_URL}/api/food/`)
            .then(res => res.json())
            .then(data => setFoodList(data))
            .catch(err => console.error('Food fetch error:', err))
    }, [])

    useEffect(() => {
        if (token) {
            fetch(`${API_URL}/api/auth/profile/`, {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(res => res.json())
                .then(data => setUser(data))
                .catch(err => {
                    console.error('Profile fetch error:', err)
                    setToken("")
                    localStorage.removeItem("token")
                })
        }
    }, [token])

    const addToCart = (itemId) => {
        if (!cartItems[itemId]) {
            setCartItems((prev) => ({ ...prev, [itemId]: 1 }))
        } else {
            setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }))
        }
    }

    const removeFromCart = (itemId) => {
        setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }))
    }

    const getTotalCartAmount = () => {
        let total = 0;
        for (const itemId in cartItems) {
            if (cartItems[itemId] > 0) {
                const item = food_list.find(p => String(p.id) === itemId);
                if (item) total += Number(item.price) * cartItems[itemId];
            }
        }
        return total;
    }

    const logout = () => {
        setToken("")
        setUser(null)
        setCartItems({})
        localStorage.removeItem("token")
        localStorage.removeItem("cartItems")
    }

    const contextValue = {
        food_list,
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        token,
        setToken,
        user,
        setUser,
        logout,
        API_URL,
    }

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    )
}

export default StoreContextProvider