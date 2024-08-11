import React from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import CartItem from '../components/CartItem';

function Cart() {
  const { cart, removeFromCart, clearCart } = useCart();

  return (
    <div>
      <h1>Shopping Cart</h1>
      {cart.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <div>
          {cart.map(item => (
            <CartItem key={item._id} item={item} />
          ))}
          <button onClick={clearCart}>Clear Cart</button>
          <Link to="/checkout">
            <button>Proceed to Checkout</button>
          </Link>
        </div>
      )}
    </div>
  );
}

export default Cart;
