import React, { useContext } from 'react'
import './FoodItem.css'
import { assets } from '../../assets/assets'
import { StoreContext } from '../../context/StoreContext'

const FoodItem = ({id, name, price, description, image}) => {
    const strId = String(id)
    const { cartItems, addToCart, removeFromCart } = useContext(StoreContext)

    return (
        <div className='food-item'>
            <div className='food-item-img-container'>
                <img
                    className='food-item-image'
                    src={image || 'https://placehold.co/300x200?text=No+Image'}
                    alt={name}
                />
                {!cartItems[strId]
                    ? <button className='add-btn' onClick={() => addToCart(strId)}>+ Сагслах</button>
                    : <div className='food-item-counter'>
                        <button onClick={() => removeFromCart(strId)}>−</button>
                        <span>{cartItems[strId]}</span>
                        <button onClick={() => addToCart(strId)}>+</button>
                    </div>
                }
            </div>
            <div className='food-item-info'>
                <p className='food-item-name'>{name}</p>
                <p className='food-item-desc'>{description}</p>
                <p className='food-item-price'>₮{Number(price).toLocaleString()}</p>
            </div>
        </div>
    )
}

export default FoodItem