import React from 'react';
import { useCart } from '../context/CartContext';

function CartItem({ item }) {
  const { removeFromCart, addToCart } = useCart();

  const handleQuantityChange = (e) => {
    const newQuantity = parseInt(e.target.value);
    if (newQuantity > 0) {
      addToCart({ ...item, quantity: newQuantity });
    } else {
      removeFromCart(item._id);
    }
  };

  return (
    <div className="cart-item">
      <h2>{item.name}</h2>
      <p>{item.description}</p>
      <p>${item.price}</p>
      <input 
        type="number" 
        value={item.quantity || 1} 
        min="1"
        onChange={handleQuantityChange} 
      />
      <button onClick={() => removeFromCart(item._id)}>Remove</button>
    </div>
  );
}

export default CartItem;
