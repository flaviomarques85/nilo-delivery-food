import { useState, useContext, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom';
import Chup from '../../assets/chup.jpg'
import Coxinha from '../../assets/coxinha.jpg'
import Refri from '../../assets/refri.jpg'
import Burger from '../../assets/burger.jpg'

function Home() {
  const [productQuantities, setProductQuantities] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Recupera o estado do carrinho, se existir
    if (location.state && location.state.cartItems) {
      const newProductQuantities = {};
      location.state.cartItems.forEach(item => {
        newProductQuantities[item.title] = item.quantity;
      });
      setProductQuantities(newProductQuantities);
    }
  }, [location]);

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage('');
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  const Products = [
    {
      Image: Chup,
      Title: 'Chup-Chup/Geladinho',
      Description: 'Refrescante Geladinho.',
      Price: 1,
      stock: true
    },
    {
      Image: Coxinha,
      Title: 'Coxinha',
      Description: 'Suculenta coxinha crocante, frita na hora.',
      Price: 1,
      stock: true
    },
    {
      Image: Burger,
      Title: 'Hamburguer',
      Description: 'Delicioso hamburguer artesanal.',
      Price: 1,
      stock: false
    },
    {
      Image: Refri,
      Title: 'Refrigerante',
      Description: 'Refrescante Refri estupdamente gelado.',
      Price: 1,
      stock: true
    },

  ]

  const incrementQuantity = (productTitle) => {
    setProductQuantities(prevQuantities => {
      const currentQuantity = prevQuantities[productTitle] || 0;
      if (currentQuantity >= 2) {
        setErrorMessage('A quantidade máxima de cada item é 2.');
        return prevQuantities;
      }
      return {
        ...prevQuantities,
        [productTitle]: currentQuantity + 1
      };
    });
  };

  const decrementQuantity = (productTitle) => {
    setProductQuantities(prevQuantities => ({
      ...prevQuantities,
      [productTitle]: Math.max((prevQuantities[productTitle] || 0) - 1, 0)
    }));
  };

  const clearCart = () => {
    setProductQuantities({});
    setErrorMessage('');
  };

  const goToCart = () => {
    const cartItems = Products.filter(product => productQuantities[product.Title] > 0)
      .map(product => ({
        title: product.Title,
        quantity: productQuantities[product.Title],
        price: product.Price
      }));

    navigate('/cart', { state: { cartItems } });
  };

  return (
    <div className='container mx-auto px-4 py-6 max-w-lg relative'>
      <h2 className='text-2xl sm:text-3xl font-bold mb-6 text-gray-800 text-center'>Nossos Produtos</h2>
      <div className='flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 mb-6'>
        <button
          className='bg-gradient-to-r from-red-700 to-orange-500 hover:from-red-900 hover:to-orange-600 text-white font-bold py-3 px-4 rounded transition duration-300 w-full sm:w-auto shadow-md'
          onClick={clearCart}
        >
          Esvaziar Sacola
        </button>
        <button
          className='bg-gradient-to-r from-blue-800 to-green-600 hover:from-blue-700 hover:to-green-900 text-white font-bold py-3 px-4 rounded transition duration-300 w-full sm:w-auto shadow-md'
          onClick={goToCart}
        >
          Ver Carrinho
        </button>
      </div>
      {errorMessage && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Atenção!</strong>
            <span className="block sm:inline"> {errorMessage}</span>
          </div>
        </div>
      )}
      <div className='space-y-6'>
        {Products.map(product => (
          <div key={product.Title} className="bg-white rounded-lg shadow-md overflow-hidden">
            <img className={`w-full h-48 object-cover items-food ${!product.stock ? 'grayscale' : ''}`} src={product.Image} alt={product.Title} />
            <div className='p-4'>
              <h3 className='font-bold text-xl mb-2 text-gray-800'>
                {product.Title}
                {!product.stock && <span className="text-pink-600 text-sm ml-2">Sem Estoque</span>}
              </h3>
              <p className='text-gray-600 mb-4 text-sm'>{product.Description}</p>
              <p className='text-gray-800 font-semibold mb-4'>Preço: {product.Price} tickets</p>
              <div className='flex items-center justify-between'>
                <button
                  className={`bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-l transition duration-300 ${!product.stock ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={() => decrementQuantity(product.Title)}
                  disabled={!product.stock}
                >
                  -
                </button>
                <span className='px-4 py-2 bg-gray-200 font-bold'>
                  {productQuantities[product.Title] || 0}
                </span>
                <button
                  className={`bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-r transition duration-300 ${!product.stock ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={() => incrementQuantity(product.Title)}
                  disabled={!product.stock}
                >
                  +
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className='flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 mb-6 py-6'>
        <button
          className='bg-gradient-to-r from-red-700 to-orange-500 hover:from-red-900 hover:to-orange-600 text-white font-bold py-3 px-4 rounded transition duration-300 w-full sm:w-auto shadow-md'
          onClick={clearCart}
        >
          Esvaziar Sacola
        </button>
        <button
          className='bg-gradient-to-r from-blue-800 to-green-600 hover:from-blue-700 hover:to-green-900 text-white font-bold py-3 px-4 rounded transition duration-300 w-full sm:w-auto shadow-md'
          onClick={goToCart}
        >
          Ver Carrinho
        </button>
      </div>
    </div>
  )
}

export default Home
