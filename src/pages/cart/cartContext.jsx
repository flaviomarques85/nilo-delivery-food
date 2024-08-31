import { createContext, useState } from "react"

export const CartContext = createContext()

export default function CartProvider({ childen }) {
    const [productsCart, setProductsCart] = useState([])

    function addProductToCart(id) {
        const copyProductsCart = [...productsCart]
        const item = copyProductsCart.find((product) => product.id === id)

        if (!item) {
            copyProductsCart.push({ id: id, qtd: 1 })
        } else {
            item.qtd += 1
        }

        setProductsCart(copyProductsCart)
    }

    function removeProductToCart(id) {
        const copyProductsCart = [...productsCart]
        const item = copyProductsCart.find((product) => product.id === id)

        if (item && item.qtd > 1) {
            item.qtd -= 1
            setProductsCart(copyProductsCart)
        } else {
            const arrayFiltered = copyProductsCart.filter((product) => product.id !== id)
            setProductsCart(arrayFiltered)
        }
    }

    function clearCart() {
        setProductsCart([])
    }

    return (
        <CartContext.Provider
            value={{ productsCart, addProductToCart, removeProductToCart, clearCart }}
        >
            {childen}
        </CartContext.Provider>
    )
}