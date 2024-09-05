import { useState, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import Burger from '../../assets/burger.jpg'
import Refri from '../../assets/refri.jpg'
import Coxinha from '../../assets/coxinha.jpg'
import { CartContext } from '../cart/cartContext'
import './style.css'

function Home() {
  const [productQuantities, setProductQuantities] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage('');
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  const { } = CartContext
  const Products = [
    {
      Image: Burger,
      Title: 'Hamburguer',
      Description: 'Delicioso hamburguer preparado com carne fresca especialmente para a esta feira.',
      Price: 1
    },
    {
      Image: Refri,
      Title: 'Refrigerante',
      Description: 'Refrescante refri estupdamente gelado.',
      Price: 1
    },
    {
      Image: Coxinha,
      Title: 'Coxinha',
      Description: 'Suculenta coxinha cocrante, frita na hora.',
      Price: 1
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
    <div className='container'>
      <h2>Nossos Produtos</h2>
      <button
        className='btn btn-primary me-md-2'
        onClick={clearCart}
      >
        Esvaziar Sacola
      </button>
      <button
        className='btn btn-success'
        onClick={goToCart}
      >
        Ver Carrinho
      </button>
      {errorMessage && <div className="alert alert-warning">{errorMessage}</div>}
      {Products.map((product => (
        <div key={product.Title} className="row">
          <img className='col-2' src={product.Image} alt="item-food" />
          <div className='product-text col'>
            <ul className="list-unstyled">
              <li>{product.Title}</li>
              <li>{product.Description}</li>
              <li>Preço: {product.Price} tickets</li>
            </ul>

          </div>
          <div className='product-add col-2'>
            <button onClick={() => decrementQuantity(product.Title)}>-</button>
            <span>{productQuantities[product.Title] || 0}</span>
            <button onClick={() => incrementQuantity(product.Title)}>+</button>
          </div>
        </div>
      )))}
      <p></p>
    </div>
  )
}

export default Home
