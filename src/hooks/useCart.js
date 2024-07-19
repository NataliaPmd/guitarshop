import { useState, useEffect, useMemo } from 'react'
import { db } from '../data/db'


const useCart = () => {

    const initialCart = () => {
        const localStorageCart = localStorage.getItem('cart')
        return localStorageCart ? JSON.parse(localStorageCart) : []
    }
    const [data] = useState(db)
    const [cart, setCart] = useState(initialCart)

    const MAX_ITEMS = 5
    const MIN_ITEMS = 1

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart))
    }, [cart])

    //API
    // const [data, setData] = useState([])
    // useEffect(() => {
    //     setData(db)
    // }, [])

    function addToCart(item) {

        const itemExists = cart.findIndex((guitar) => guitar.id === item.id)
        if(itemExists >= 0) {
            if(cart[itemExists].quantity >= MAX_ITEMS) return
            const updatedCart = [...cart]
            updatedCart[itemExists].quantity++
            setCart(updatedCart);
        } else {
            item.quantity = 1
            setCart(prevCart => [...prevCart, item])
        }
    }

    function removeFromCart(id) {
        setCart(prevCart => prevCart.filter(guitar=> guitar.id != id))
    }

    function increaseQuantity(id) {
        const UpdatedCart = cart.map( item => {
            if(item.id === id && item.quantity < MAX_ITEMS) {
                return {
                    ...item,
                    quantity: item.quantity + 1
                }
            }
            return item
        })

        setCart(UpdatedCart)
    }

    function decreaseQuantity(id) {
        const UpdatedCart = cart.map( item => {
            if(item.id === id && item.quantity > MIN_ITEMS) {
                return {
                    ...item,
                    quantity: item.quantity - 1
                }
            }
            return item
        })

        setCart(UpdatedCart)
    }
  
    function deleteCart() {
        setCart([])
    }

     // State derivado
     const isEmpty = useMemo(() => cart.length === 0, [cart])
     const cartTotal = useMemo(() => cart.reduce((total, item) => total + (item.quantity * item.price), 0), [cart])
    
    return{
        data,
        cart,
        isEmpty,
        cartTotal,
        addToCart,
        removeFromCart,
        decreaseQuantity,
        increaseQuantity,
        deleteCart
    }
}

export default useCart