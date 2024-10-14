import React, { useEffect, useState } from 'react';
import axios from 'axios';

function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeOrder, setActiveOrder] = useState(null); // Estado para controlar o pedido ativo
    const [menuVisible, setMenuVisible] = useState(false); // Estado para controlar a visibilidade do menu

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get('http://ec2-35-168-106-126.compute-1.amazonaws.com:3001/api/orders');
                setOrders(response.data);
            } catch (err) {
                setError('Erro ao carregar os pedidos.');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const toggleMenu = (orderId) => {
        if (activeOrder === orderId) {
            setMenuVisible(!menuVisible);
        } else {
            setActiveOrder(orderId);
            setMenuVisible(true);
        }
    };

    const handleOptionClick = (option) => {
        console.log(`Opção selecionada: ${option}`);
        setMenuVisible(false); // Fecha o menu após a seleção
    };

    if (loading) {
        return <div>Carregando...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="container mx-auto px-4 py-6">
            <h2 className="text-2xl font-bold mb-4">Gestão de Pedidos</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {orders.map(order => (
                    <div key={order._id} className="bg-white rounded-lg shadow-md p-4 relative">
                        <h3 className="font-bold text-lg">Pedido #{order._id}</h3>
                        <button
                            onClick={() => toggleMenu(order._id)}
                            className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
                        >
                            . . .
                        </button>
                        {menuVisible && activeOrder === order._id && (
                            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded shadow-lg z-10">
                                <ul className="py-2">
                                    <li
                                        onClick={() => handleOptionClick('Excluir')}
                                        className="text-red-500 hover:bg-red-100 cursor-pointer px-4 py-2"
                                    >
                                        Excluir
                                    </li>
                                    <li
                                        onClick={() => handleOptionClick('Cancelar')}
                                        className="text-yellow-500 hover:bg-yellow-100 cursor-pointer px-4 py-2"
                                    >
                                        Cancelar
                                    </li>
                                    <li
                                        onClick={() => handleOptionClick('Atender')}
                                        className="text-green-500 hover:bg-green-100 cursor-pointer px-4 py-2"
                                    >
                                        Atender
                                    </li>
                                    <li
                                        onClick={() => handleOptionClick('Detalhes')}
                                        className="text-blue-500 hover:bg-blue-100 cursor-pointer px-4 py-2"
                                    >
                                        Detalhes
                                    </li>
                                </ul>
                            </div>
                        )}
                        <p><strong>Order:</strong> {order.order_number}</p>
                        <p><strong>Status:</strong> {order.order_status}</p>
                        <p><strong>Data:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
                        <p><strong>Hora:</strong> {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>

                        <h4 className="font-semibold mt-4">Itens do Pedido:</h4>
                        <ul className="list-disc list-inside">
                            {order.items.map(item => (
                                <li key={item.item_name} className="text-gray-700">
                                    {item.item_name} - Quantidade: {item.quantity}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default AdminOrders;