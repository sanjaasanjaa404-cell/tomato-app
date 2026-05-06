import React, { useContext, useEffect, useState } from 'react'
import './MyOrders.css'
import { StoreContext } from '../../context/StoreContext'
import { useNavigate } from 'react-router-dom'
import { assets } from '../../assets/assets'

const MyOrders = () => {
    const { token } = useContext(StoreContext)
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        if (!token) { navigate('/'); return }
        fetch('http://localhost:8000/api/orders/', {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => { setOrders(data); setLoading(false) })
            .catch(err => { console.error(err); setLoading(false) })
    }, [token])

    const statusConfig = {
        pending:    { label: 'Хүлээгдэж байна', icon: '🕐', color: '#f5a623' },
        confirmed:  { label: 'Баталгаажсан',     icon: '✅', color: '#4a90e2' },
        preparing:  { label: 'Бэлтгэж байна',    icon: '👨‍🍳', color: '#7ed321' },
        on_the_way: { label: 'Хүргэлтэнд гарсан',icon: '🚴', color: '#9b59b6' },
        delivered:  { label: 'Хүргэгдсэн',       icon: '🎉', color: '#2ecc71' },
        cancelled:  { label: 'Цуцлагдсан',       icon: '❌', color: '#e74c3c' },
    }

    const steps = ['pending', 'confirmed', 'preparing', 'on_the_way', 'delivered']

    if (loading) return (
        <div className='myorders-loading'>
            <div className='loading-spinner'></div>
            <p>Уншиж байна...</p>
        </div>
    )

    return (
        <div className='myorders'>
            <div className='myorders-header'>
                <h1>Миний захиалгууд</h1>
                <p>{orders.length} захиалга</p>
            </div>

            <div className='myorders-content'>
                {orders.length === 0
                    ? <div className='myorders-empty'>
                        <div className='empty-icon'>📦</div>
                        <h3>Захиалга байхгүй байна</h3>
                        <p>Дуртай хоолоо захиалаарай</p>
                        <button onClick={() => navigate('/')}>Меню үзэх</button>
                      </div>
                    : orders.map((order) => {
                        const status = statusConfig[order.status] || statusConfig.pending
                        const currentStep = steps.indexOf(order.status)

                        return (
                            <div key={order.id} className='myorders-order'>

                                {/* Header */}
                                <div className='order-header'>
                                    <div className='order-header-left'>
                                        <img src={assets.parcel_icon} alt="" />
                                        <div>
                                            <h3>Захиалга #{order.id}</h3>
                                            <p>{new Date(order.created_at).toLocaleDateString('mn-MN', {
                                                year: 'numeric', month: 'long', day: 'numeric',
                                                hour: '2-digit', minute: '2-digit'
                                            })}</p>
                                        </div>
                                    </div>
                                    <div className='order-status-badge' style={{background: status.color}}>
                                        <span>{status.icon}</span>
                                        <span>{status.label}</span>
                                    </div>
                                </div>

                                {/* Progress */}
                                {order.status !== 'cancelled' && (
                                    <div className='order-progress'>
                                        {steps.map((step, index) => (
                                            <React.Fragment key={step}>
                                                <div className={`progress-step ${index <= currentStep ? 'active' : ''}`}>
                                                    <div className='step-dot'>
                                                        {index < currentStep ? '✓' : statusConfig[step]?.icon}
                                                    </div>
                                                    <span>{statusConfig[step]?.label}</span>
                                                </div>
                                                {index < steps.length - 1 && (
                                                    <div className={`progress-line ${index < currentStep ? 'active' : ''}`}></div>
                                                )}
                                            </React.Fragment>
                                        ))}
                                    </div>
                                )}

                                {/* Items */}
                                <div className='order-items'>
                                    <h4>Захиалсан хоолнууд</h4>
                                    <div className='order-items-grid'>
                                        {order.items.map((item, index) => (
                                            <div key={index} className='order-item-row'>
                                                <span className='item-qty'>x{item.quantity}</span>
                                                <span className='item-name'>{item.name}</span>
                                                <span className='item-price'>${Number(item.price * item.quantity).toFixed(2)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Footer */}
                                <div className='order-footer'>
                                    <div className='order-address'>
                                        <p><span>📍</span> {order.street}, {order.city}, {order.country}</p>
                                        <p><span>📞</span> {order.phone}</p>
                                    </div>
                                    <div className='order-totals'>
                                        <div>
                                            <span>Дүн</span>
                                            <span>${Number(order.subtotal).toFixed(2)}</span>
                                        </div>
                                        <div>
                                            <span>Хүргэлт</span>
                                            <span>${Number(order.delivery_fee).toFixed(2)}</span>
                                        </div>
                                        <div className='total-final'>
                                            <span>Нийт</span>
                                            <span>${Number(order.total).toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default MyOrders