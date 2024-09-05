import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function Cart() {
    const location = useLocation();
    const navigate = useNavigate();
    const { cartItems } = location.state || { cartItems: [] };

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + item.quantity * item.price, 0);
    };

    const handleGoBack = () => {
        navigate('/', { state: { cartItems } });
    };

    return (
        <div className="container mx-auto px-4 py-6 max-w-md">
            <button onClick={handleGoBack} className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded mb-4 w-full sm:w-auto">
                ← Voltar
            </button>
            <h2 className="text-2xl font-bold mb-6 text-center">Seu Carrinho</h2>
            {cartItems.length === 0 ? (
                <p className="text-gray-600 text-center">Seu carrinho está vazio.</p>
            ) : (
                <>
                    <div className="bg-white shadow-md rounded-lg overflow-hidden">
                        {cartItems.map((item) => (
                            <div key={item.title} className="border-b border-gray-200 last:border-b-0">
                                <div className="p-4">
                                    <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                                    <div className="flex justify-between items-center text-sm">
                                        <span>Quantidade: {item.quantity}</span>
                                        <span>Preço: {item.price} tickets</span>
                                    </div>
                                    <div className="text-right font-semibold mt-2">
                                        Total: {item.quantity * item.price} tickets
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-6 bg-gray-100 p-4 rounded-lg">
                        <div className="text-xl font-bold text-right">
                            Total do Carrinho: {calculateTotal()} tickets
                        </div>
                    </div>
                    <button className="mt-6 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded w-full">
                        Finalizar Pedido
                    </button>
                </>
            )}
        </div>
    );
}

export default Cart;