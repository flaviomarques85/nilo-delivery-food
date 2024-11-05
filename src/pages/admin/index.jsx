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
                const response = await axios.get('https://delivery-food-backend-7db5bb48766a.herokuapp.com/api/orders');
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

    const handleOptionClick = async (option, orderId) => {
        try {
            let response;
            switch (option) {
                case 'Cancelar':
                case 'Atender':
                    const status = option === 'Cancelar' ? 'cancelado' : 'atendido';
                    response = await axios.put(`https://delivery-food-backend-7db5bb48766a.herokuapp.com/api/orders/${orderId}`, {
                        order_status: status
                    });

                    // Atualiza o estado local com o novo status
                    setOrders(orders.map(order =>
                        order._id === orderId ? { ...order, order_status: status } : order
                    ));
                    console.log(`Pedido ${orderId} ${status} com sucesso`);
                    break;

                case 'Excluir':
                    response = await axios.delete(`https://delivery-food-backend-7db5bb48766a.herokuapp.com/api/orders/${orderId}`);

                    // Remove o pedido excluído do estado local
                    setOrders(orders.filter(order => order._id !== orderId));
                    console.log(`Pedido ${orderId} excluído com sucesso`);
                    break;

                default:
                    console.log(`Opção selecionada: ${option}`);
                    break;
            }
        } catch (error) {
            console.error(`Erro ao ${option.toLowerCase()} o pedido:`, error);
            setError(`Erro ao ${option.toLowerCase()} o pedido. Por favor, tente novamente.`);
        } finally {
            setMenuVisible(false); // Fecha o menu após a seleção
        }
    };

    const calculateOrderTotals = () => {
        const totals = {
            atendidos: 0,
            pendentes: 0,
            cancelados: 0
        };

        orders.forEach(order => {
            switch (order.order_status) {
                case 'atendido':
                    totals.atendidos++;
                    break;
                case 'cancelado':
                    totals.cancelados++;
                    break;
                default:
                    totals.pendentes++;
                    break;
            }
        });

        return totals;
    };

    if (loading) {
        return <div>Carregando...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    const orderTotals = calculateOrderTotals();

    return (
        <div className="container mx-auto px-4 py-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Gestão de Pedidos</h2>
                <div className="flex space-x-4">
                    <span className="text-green-500 font-semibold">
                        Atendidos: {orderTotals.atendidos}
                    </span>
                    <span className="text-blue-500 font-semibold">
                        Pendentes: {orderTotals.pendentes}
                    </span>
                    <span className="text-red-500 font-semibold">
                        Cancelados: {orderTotals.cancelados}
                    </span>
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {orders.map(order => (
                    <div
                        key={order._id}
                        className={`rounded-lg shadow-md p-4 relative transition-colors duration-200 ${order.order_status === 'atendido'
                                ? 'bg-green-50 border-2 border-green-200'
                                : order.order_status === 'cancelado'
                                    ? 'bg-red-50 border-2 border-red-200'
                                    : 'bg-blue-50 border-2 border-blue-200'
                            }`}
                    >
                        <h3 className={`font-bold text-lg ${order.order_status === 'atendido'
                                ? 'text-green-700'
                                : order.order_status === 'cancelado'
                                    ? 'text-red-700'
                                    : 'text-blue-700'
                            }`}>
                            Pedido #{order._id}
                        </h3>
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
                                        onClick={() => handleOptionClick('Excluir', order._id)}
                                        className="text-red-500 hover:bg-red-100 cursor-pointer px-4 py-2"
                                    >
                                        Excluir
                                    </li>
                                    <li
                                        onClick={() => handleOptionClick('Cancelar', order._id)}
                                        className="text-yellow-500 hover:bg-yellow-100 cursor-pointer px-4 py-2"
                                    >
                                        Cancelar
                                    </li>
                                    <li
                                        onClick={() => handleOptionClick('Atender', order._id)}
                                        className="text-green-500 hover:bg-green-100 cursor-pointer px-4 py-2"
                                    >
                                        Atender
                                    </li>
                                    <li
                                        onClick={() => handleOptionClick('Detalhes', order._id)}
                                        className="text-blue-500 hover:bg-blue-100 cursor-pointer px-4 py-2"
                                    >
                                        Detalhes
                                    </li>
                                </ul>
                            </div>
                        )}
                        <p className={`${order.order_status === 'atendido'
                                ? 'text-green-600'
                                : order.order_status === 'cancelado'
                                    ? 'text-red-600'
                                    : 'text-blue-600'
                            }`}>
                            <strong>Order:</strong> {order.order_number}
                        </p>
                        <p className={`font-medium ${order.order_status === 'atendido'
                                ? 'text-green-600'
                                : order.order_status === 'cancelado'
                                    ? 'text-red-600'
                                    : 'text-blue-600'
                            }`}>
                            <strong>Status:</strong> {order.order_status}
                        </p>
                        <p className="text-gray-700"><strong>Data:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
                        <p className="text-gray-700"><strong>Hora:</strong> {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>

                        <h4 className="font-semibold mt-4 text-gray-800">Itens do Pedido:</h4>
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
