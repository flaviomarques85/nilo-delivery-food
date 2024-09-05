import React from 'react';
import { useLocation } from 'react-router-dom';

function Cart() {
    const location = useLocation();
    const { cartItems } = location.state || { cartItems: [] };

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + item.quantity * item.price, 0);
    };

    return (
        <div className="container">
            <h2>Seu Carrinho</h2>
            {cartItems.length === 0 ? (
                <p>Seu carrinho está vazio.</p>
            ) : (
                <>
                    {cartItems.map((item) => (
                        <div key={item.title} className="row mb-3">
                            <div className="col-6">{item.title}</div>
                            <div className="col-2">Quantidade: {item.quantity}</div>
                            <div className="col-2">Preço: {item.price} tickets</div>
                            <div className="col-2">Total: {item.quantity * item.price} tickets</div>
                        </div>
                    ))}
                    <div className="row">
                        <div className="col-12 text-end">
                            <strong>Total do Carrinho: {calculateTotal()} tickets</strong>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default Cart;