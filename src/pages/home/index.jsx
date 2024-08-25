import { useState } from 'react'
import Burger from '../../assets/burger.jpg'
import Refri from '../../assets/refri.jpg'
import Coxinha from '../../assets/coxinha.jpg'
import './style.css'

function Home() {
  const [count, setCount] = useState(0)
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

  return (
    <div className='container'>
      <h1>Nossos Produtos</h1>

      {Products.map((product => (
        <div class="product-box">
          <img className='product-img' src={product.Image} alt="Refri" />
          <div className='product-text'>
            <h2>{product.Title}</h2>
            <p>{product.Description}</p>
            <p>Preço: {product.Price} tickets</p>
          </div>
        </div>
      )))}

    </div>
  )
}

export default Home
