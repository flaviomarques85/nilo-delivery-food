import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Cart() {
    const location = useLocation();
    const navigate = useNavigate();
    const { cartItems } = location.state || { cartItems: [] };

    const [showTicketInput, setShowTicketInput] = useState(false);
    const [tickets, setTickets] = useState([]);
    const [ticketStatus, setTicketStatus] = useState([]);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [validatingTickets, setValidatingTickets] = useState(false);
    const [allTicketsValid, setAllTicketsValid] = useState(false);
    const [orderNumber, setOrderNumber] = useState('');
    const [orderPlaced, setOrderPlaced] = useState(false); // Novo estado para controlar se o pedido foi realizado

    useEffect(() => {
        if (showTicketInput) {
            const totalTickets = calculateTotal();
            setTickets(Array(totalTickets).fill(''));
            setTicketStatus(Array(totalTickets).fill('pending'));
        }
    }, [showTicketInput]);

    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => {
                setSuccessMessage('');
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [successMessage]);

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + item.quantity * item.price, 0);
    };

    const handleGoBack = () => {
        navigate('/', { state: { cartItems } });
    };

    const handleConfirm = () => {
        setShowTicketInput(true);
    };

    const handleTicketChange = (index, value) => {
        const newTickets = [...tickets];
        newTickets[index] = value;
        setTickets(newTickets);

        const newTicketStatus = [...ticketStatus];
        newTicketStatus[index] = 'pending';
        setTicketStatus(newTicketStatus);

        setError('');
        setAllTicketsValid(false);
    };

    const handleValidateTickets = async () => {
        if (tickets.some(ticket => ticket.trim() === '')) {
            setError('Por favor, preencha todos os campos de tickets antes de validar.');
            return;
        }

        setValidatingTickets(true);
        setError('');

        const newTicketStatus = [...ticketStatus];
        let allValid = true;

        for (let i = 0; i < tickets.length; i++) {
            try {
                const response = await axios.get(`https://delivery-food-backend-7db5bb48766a.herokuapp.com/api/ticket/${tickets[i]}`);
                if (response.status === 200) {
                    newTicketStatus[i] = 'valid';
                } else {
                    newTicketStatus[i] = 'invalid';
                    allValid = false;
                }
            } catch (error) {
                newTicketStatus[i] = 'invalid';
                allValid = false;
            }
        }

        setTicketStatus(newTicketStatus);
        setValidatingTickets(false);
        setAllTicketsValid(allValid);

        if (allValid) {
            setSuccessMessage('Todos os tickets são válidos! Você pode finalizar o pedido agora.');
        } else {
            setError('Um ou mais tickets são inválidos. Por favor, verifique e tente novamente.');
        }
    };

    const handleFinishOrder = async () => {
        try {
            const orderItems = cartItems.map((item, index) => ({
                item_name: item.title,
                quantity: item.quantity,
                ticket_num: tickets[index]
            }));

            const newOrderNumber = `ORD${Date.now()}`;
            const orderData = {
                order_number: newOrderNumber,
                order_status: "pendente",
                items: orderItems
            };

            const response = await axios.post(`https://delivery-food-backend-7db5bb48766a.herokuapp.com/api/orders`, orderData);
            if (response.status === 201) { // Alterado para 201
                setOrderNumber(newOrderNumber);
                setSuccessMessage(`Pedido ${newOrderNumber} realizado com sucesso. Aguarde a entrega.`);
                setAllTicketsValid(false); // Desabilita o botão "Finalizar Pedido"
                setShowTicketInput(false); // Esconde o campo de tickets
                setOrderPlaced(true); // Marca que o pedido foi realizado
            }
        } catch (error) {
            setError('Erro ao finalizar o pedido. Por favor, tente novamente.');
            setAllTicketsValid(false); // Permite que o usuário valide os tickets novamente
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
                                    className={`mt-2 block w-full rounded-md border shadow-sm focus:ring focus:ring-opacity-50 ${ticketStatus[index] === 'valid'
                                        ? 'border-green-500 text-green-700 focus:border-green-300 focus:ring-green-200'
                                        : ticketStatus[index] === 'invalid'
                                            ? 'border-red-500 text-red-700 focus:border-red-300 focus:ring-red-200'
                                            : 'border-gray-300 focus:border-indigo-300 focus:ring-indigo-200'
                                        }`}
                                    placeholder={`Ticket ${index + 1}`}
                                />
                            ))}
                            {error && (
                                <p className="text-red-500 mt-2">
                                    {error}
                                </p>
                            )}
                        </div>
                    )}
                    {!showTicketInput ? (
                        <button
                            className="mt-6 w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-3 px-4 rounded shadow-md transition duration-300 ease-in-out hover:from-blue-600 hover:to-purple-700"
                            onClick={handleConfirm}
                        >
                            Confirmar
                        </button>
                    ) : (
                        <>
                            {!allTicketsValid && !orderPlaced && ( // Esconde o botão "Validar Tickets" se o pedido foi realizado
                                <button
                                    className={`mt-6 w-full py-3 px-4 rounded font-bold text-white transition duration-300 ease-in-out ${validatingTickets
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600'
                                        } shadow-md`}
                                    onClick={handleValidateTickets}
                                    disabled={validatingTickets}
                                >
                                    {validatingTickets ? 'Validando...' : 'Validar Tickets'}
                                </button>
                            )}
                            {allTicketsValid && !orderPlaced && ( // Esconde o botão "Finalizar Pedido" se o pedido foi realizado
                                <button
                                    className="mt-4 w-full bg-gradient-to-r from-green-500 to-black text-white font-bold py-3 px-4 rounded shadow-md transition duration-300 ease-in-out hover:from-green-600 hover:to-black"
                                    onClick={handleFinishOrder}
                                >
                                    Finalizar Pedido
                                </button>
                            )}
                        </>
                    )}
                </>
            )}
            {successMessage && (
                <div className="fixed bottom-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded shadow-md">
                    {successMessage}
                </div>
            )}
        </div>
    );
}

export default Cart;