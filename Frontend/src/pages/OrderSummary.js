import React from 'react';
import { useCart } from '../context/CartContext';

function OrderSummary() {
  const { cart } = useCart();
  
  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0);
  };

  return (
    <div>
      <h1>Order Summary</h1>
      {cart.map(item => (
        <div key={item._id}>
          <h3>{item.name}</h3>
          <p>${item.price} x {item.quantity || 1}</p>
        </div>
      ))}
      <h3>Total Price: ${getTotalPrice()}</h3>
    </div>
  );
}

export default OrderSummary;
