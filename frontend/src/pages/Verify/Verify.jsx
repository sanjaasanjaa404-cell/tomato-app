import React, { useContext, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { StoreContext } from '../../context/StoreContext'
import './Verify.css'

const Verify = () => {
  const [searchParams] = useSearchParams()
  const success  = searchParams.get('success')
  const orderId  = searchParams.get('orderId')
  const navigate = useNavigate()
  const { token, setCartItems } = useContext(StoreContext)

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/orders/verify/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ order_id: orderId, success })
        })
        const data = await res.json()

        if (data.success) {
          setCartItems({})
          navigate('/myorders')
        } else {
          navigate('/cart')
        }
      } catch {
        navigate('/cart')
      }
    }

    if (orderId) verifyPayment()
  }, [])

  return (
    <div style={{display:'flex', justifyContent:'center', alignItems:'center', height:'60vh'}}>
      <p>Төлбөр шалгаж байна...</p>
    </div>
  )
}

export default Verify