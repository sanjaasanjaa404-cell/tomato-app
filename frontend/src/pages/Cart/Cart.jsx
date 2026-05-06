import React, { useContext } from 'react'
import './Cart.css'
import { StoreContext } from '../../context/StoreContext'
import { useNavigate } from 'react-router-dom'

const Cart = () => {
  const { cartItems, food_list, removeFromCart, addToCart, getTotalCartAmount, token } = useContext(StoreContext)
  const navigate = useNavigate()

  const subtotal = getTotalCartAmount()
  const deliveryFee = subtotal === 0 ? 0 : 2.99
  const total = subtotal + deliveryFee
  const cartIsEmpty = subtotal === 0

  return (
    <div className='cart'>
      <div className='cart-header'>
        <h1>Миний сагс</h1>
        <p>{Object.values(cartItems).filter(v => v > 0).length} бүтээгдэхүүн</p>
      </div>

      <div className='cart-items'>
        <div className="cart-items-title">
          <p>Зураг</p>
          <p>Нэр</p>
          <p>Үнэ</p>
          <p>Тоо</p>
          <p>Дүн</p>
          <p>Устгах</p>
        </div>
        <hr />

        {cartIsEmpty
          ? <div className='cart-empty'>
              <div className='cart-empty-icon'>🛒</div>
              <h3>Сагс хоосон байна</h3>
              <p>Дуртай хоолоо сагсанд нэмээрэй</p>
              <button onClick={() => navigate('/')}>Меню үзэх</button>
            </div>
          : food_list.map((item) => {
              const strId = String(item.id)
              if (!cartItems[strId] || cartItems[strId] <= 0) return null
              return (
                <div key={item.id}>
                  <div className='cart-items-title cart-items-item'>
                    <img src={item.image || 'https://placehold.co/300x200?text=No+Image'} alt={item.name} />
                    <p className='item-name'>{item.name}</p>
                    <p className='item-price'>${Number(item.price).toFixed(2)}</p>
                    <div className='cart-item-counter'>
                      <button onClick={() => removeFromCart(strId)}>−</button>
                      <span>{cartItems[strId]}</span>
                      <button onClick={() => addToCart(strId)}>+</button>
                    </div>
                    <p className='item-subtotal'>${(Number(item.price) * cartItems[strId]).toFixed(2)}</p>
                    <span
                      className='remove-btn'
                      onClick={() => {
                        for (let i = 0; i < cartItems[strId]; i++) {
                          removeFromCart(strId)
                        }
                      }}
                    >✕</span>
                  </div>
                  <hr />
                </div>
              )
            })
        }
      </div>

      {!cartIsEmpty &&
        <div className='cart-bottom'>
          <div className='cart-total'>
            <div className='cart-total-header'>
              <h2>Захиалгын дүн</h2>
            </div>
            <div className='cart-total-details'>
              <div>
                <span>Дүн</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <hr />
              <div>
                <span>Хүргэлт</span>
                <span>${deliveryFee.toFixed(2)}</span>
              </div>
              <hr />
              <div className='cart-total-final'>
                <span>Нийт</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
            <button className='checkout-btn' onClick={() => {
              if (!token) {
                alert("Захиалга өгөхийн тулд нэвтэрнэ үү!")
                return
              }
              navigate('/order')
            }}>
              Захиалга өгөх →
            </button>
            <button className='continue-btn' onClick={() => navigate('/')}>
              ← Меню рүү буцах
            </button>
          </div>

          <div className='cart-promocode'>
            <div className='promo-icon'>🎟️</div>
            <h3>Промо код</h3>
            <p>Хөнгөлөлтийн код байвал оруулна уу</p>
            <div className='cart-promocode-input'>
              <input type="text" placeholder='Код оруулах' />
              <button>Хэрэглэх</button>
            </div>
          </div>
        </div>
      }
    </div>
  )
}

export default Cart