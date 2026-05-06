import React, { useContext, useState } from 'react'
import './PlaceOrder.css'
import { StoreContext } from '../../context/StoreContext'
import { useNavigate } from 'react-router-dom'

const PlaceOrder = () => {
  const { cartItems, food_list, getTotalCartAmount, token } = useContext(StoreContext)
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const [data, setData] = useState({
    firstName: "", lastName: "",
    email: "", street: "",
    city: "", state: "",
    zipcode: "", country: "",
    phone: ""
  })

  const onChangeHandler = (e) => {
    setData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const subtotal = getTotalCartAmount()
  const deliveryFee = subtotal === 0 ? 0 : 2.99
  const total = subtotal + deliveryFee

  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const items = []
    for (const itemId in cartItems) {
      if (cartItems[itemId] > 0) {
        items.push({ food_id: Number(itemId), quantity: cartItems[itemId] })
      }
    }

    const delivery = {
      first_name: data.firstName,
      last_name:  data.lastName,
      email:      data.email,
      street:     data.street,
      city:       data.city,
      state:      data.state,
      zipcode:    data.zipcode,
      country:    data.country,
      phone:      data.phone,
    }

    try {
      const res = await fetch('http://localhost:8000/api/orders/checkout/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ items, delivery })
      })

      const result = await res.json()

      if (result.session_url) {
        window.location.href = result.session_url
      } else {
        alert('Алдаа гарлаа: ' + JSON.stringify(result))
      }
    } catch (err) {
      alert('Сервертэй холбогдоход алдаа гарлаа')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='place-order-page'>
      <div className='place-order-header'>
        <h1>Захиалга өгөх</h1>
        <p>Хүргэлтийн мэдээллээ бөглөнө үү</p>
      </div>

      <form onSubmit={onSubmit} className='place-order'>

        {/* LEFT */}
        <div className="place-order-left">
          <div className='section-title'>
            <span>01</span>
            <h2>Хүргэлтийн мэдээлэл</h2>
          </div>

          <div className="multi-fields">
            <div className='input-group'>
              <label>Нэр</label>
              <input name="firstName" type="text" placeholder="Нэр" value={data.firstName} onChange={onChangeHandler} required />
            </div>
            <div className='input-group'>
              <label>Овог</label>
              <input name="lastName" type="text" placeholder="Овог" value={data.lastName} onChange={onChangeHandler} required />
            </div>
          </div>

          <div className='input-group'>
            <label>Имэйл</label>
            <input name="email" type="email" placeholder="example@email.com" value={data.email} onChange={onChangeHandler} required />
          </div>

          <div className='input-group'>
            <label>Дүүрэг</label>
            <input name="street" type="text" placeholder="Дүүрэг" value={data.street} onChange={onChangeHandler} required />
          </div>

          <div className="multi-fields">
            <div className='input-group'>
              <label>Хороо</label>
              <input name="city" type="text" placeholder="Хороо" value={data.city} onChange={onChangeHandler} required />
            </div>
            <div className='input-group'>
              <label>Оршин суугаа хаяг</label>
              <input name="state" type="text" placeholder="4-201" value={data.state} onChange={onChangeHandler} required />
            </div>
          </div>

          <div className="multi-fields">
            <div className='input-group'>
              <label>Зип код</label>
              <input name="zipcode" type="text" placeholder="00000" value={data.zipcode} onChange={onChangeHandler} required />
            </div>
            <div className='input-group'>
              <label>Улс</label>
              <input name="country" type="text" placeholder="Монгол" value={data.country} onChange={onChangeHandler} required />
            </div>
          </div>

          <div className='input-group'>
            <label>Утасны дугаар</label>
            <input name="phone" type="tel" placeholder="+976 9900 0000" value={data.phone} onChange={onChangeHandler} required />
          </div>
        </div>

        {/* RIGHT */}
        <div className="place-order-right">
          <div className='section-title'>
            <span>02</span>
            <h2>Захиалгын дэлгэрэнгүй</h2>
          </div>

          <div className="order-items-list">
            {food_list.map((item) => {
              const strId = String(item.id)
              if (!cartItems[strId]) return null
              return (
                <div key={item.id} className="order-item">
                  <img src={item.image || 'https://placehold.co/60x60?text=No+Image'} alt={item.name} />
                  <div className="order-item-info">
                    <p>{item.name}</p>
                    <span>x{cartItems[strId]}</span>
                  </div>
                  <p className="order-item-price">${(Number(item.price) * cartItems[strId]).toFixed(2)}</p>
                </div>
              )
            })}
          </div>

          <div className="cart-total-details">
            <div>
              <span>Дүн</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div>
              <span>Хүргэлт</span>
              <span>${deliveryFee.toFixed(2)}</span>
            </div>
            <div className="cart-total-final">
              <span>Нийт</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          <button type="submit" className='checkout-btn' disabled={loading}>
            {loading ? (
              <span className='loading'>⏳ Уншиж байна...</span>
            ) : (
              <span>💳 Stripe-р төлөх</span>
            )}
          </button>

          <p className="back-btn" onClick={() => navigate('/cart')}>
            ← Сагс руу буцах
          </p>
        </div>

      </form>
    </div>
  )
}

export default PlaceOrder