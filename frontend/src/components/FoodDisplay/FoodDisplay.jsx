import React, { useContext } from 'react'
import './FoodDisplay.css'
import { StoreContext } from '../../context/StoreContext'
import FoodItem from '../FoodItem/FoodItem'

const FoodDisplay = ({category}) => {
    const { food_list } = useContext(StoreContext)

    const filtered = food_list.filter(item =>
        category === "All" || category === item.category?.name
    )

    return (
        <div className='food-display' id='food-display'>
            <div className='food-display-header'>
                <h2>{category === "All" ? "Бүх хоол" : category}</h2>
                <span>{filtered.length} бүтээгдэхүүн</span>
            </div>
            <div className='food-display-list'>
                {filtered.map((item, index) => (
                    <FoodItem
                        key={index}
                        id={item.id}
                        name={item.name}
                        description={item.description}
                        price={item.price}
                        image={item.image || 'https://placehold.co/300x200?text=No+Image'}
                    />
                ))}
            </div>
        </div>
    )
}

export default FoodDisplay