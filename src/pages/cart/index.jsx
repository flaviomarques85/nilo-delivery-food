import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function Cart() {
    const location = useLocation();
    const navigate = useNavigate();
    const { cartItems } = location.state || { cartItems: [] };

    const [showTicketInput, setShowTicketInput] = useState(false);
    const [tickets, setTickets] = useState([]);
    const [error, setError] = useState('');
    const [fadeError, setFadeError] = useState(false);

    useEffect(() => {
        if (showTicketInput) {
            setTickets(Array(calculateTotal()).fill(''));
        }
    }, [showTicketInput]);

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + item.quantity * item.price, 0);
    };

    const handleGoBack = () => {
        navigate('/', { state: { cartItems } });
    };

    const handleConfirm = () => {
        setShowTicketInput(true);
    };

    const handleValidateTickets = () => {
        if (tickets.some(ticket => ticket.trim() === '')) {
            setError('Por favor, preencha todos os campos de tickets antes de validar.');
            setFadeError(false);
        } else {
            setError('');
            // Implemente aqui a lógica de validação dos tickets
            console.log('Validando tickets:', tickets);
        }
    };

    const handleTicketChange = (index, value) => {
        const newTickets = [...tickets];
        newTickets[index] = value;
        setTickets(newTickets);

        if (error) {
            setFadeError(true);
            setTimeout(() => {
                setError('');
                setFadeError(false);
            }, 600);
        }
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
                                    {showTicketInput && (
                                        <div className="mt-2">
                                            <label htmlFor={`ticket-${item.title}`} className="block text-sm font-medium text-gray-700">
                                                Digite os tickets para {item.title}:
                                            </label>
                                            <input
                                                type="text"
                                                id={`ticket-${item.title}`}
                                                value={tickets[item.title] || ''}
                                                onChange={(e) => handleTicketChange(item.title, e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                                placeholder="Digite os tickets"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-6 bg-gray-100 p-4 rounded-lg">
                        <div className="text-xl font-bold text-right">
                            Total do Carrinho: {calculateTotal()} tickets
                        </div>
                    </div>
                    {showTicketInput && (
                        <div className="mt-6 bg-white shadow-md rounded-lg p-4">
                            <h3 className="font-bold text-lg mb-2">Digite os tickets:</h3>
                            {tickets.map((ticket, index) => (
                                <input
                                    key={index}
                                    type="text"
                                    value={ticket}
                                    onChange={(e) => handleTicketChange(index, e.target.value)}
                                    className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                    placeholder={`Ticket ${index + 1}`}
                                />
                            ))}
                            {error && (
                                <p className={`text-red-500 mt-2 transition-opacity duration-300 ${fadeError ? 'opacity-0' : 'opacity-100'}`}>
                                    {error}
                                </p>
                            )}
                        </div>
                    )}
                    {!showTicketInput ? (
                        <button
                            className="mt-6 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded w-full"
                            onClick={handleConfirm}
                        >
                            Confirmar
                        </button>
                    ) : (
                        <button
                            className="mt-6 w-full py-3 px-4 rounded font-bold text-white transition duration-300 ease-in-out bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 shadow-md"
                            onClick={handleValidateTickets}
                        >
                            Validar Tickets
                        </button>
                    )}
                </>
            )}
        </div>
    );
}

export default Cart;