import React from 'react';
import { useCart } from '../context/CartContext';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from '../components/CheckoutForm';

const stripePromise = loadStripe('pk_test_51PkzBx2KIftQSB193IcWdtzEOfsXO86fzyO9JDXx9gdSxT5UlNN7MAKqifryVz2AZ9Oxcj9KWApH3TrttvldkXFc00mWuBbXUA');

function Checkout() {
  const { cart } = useCart();

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0);
  };

  return (
    <div>
      <h1>Checkout</h1>
      <h2>Order Summary</h2>
      {cart.map(item => (
        <div key={item._id}>
          <h3>{item.name}</h3>
          <p>${item.price} x {item.quantity || 1}</p>
        </div>
      ))}
      <h3>Total Price: ${getTotalPrice()}</h3>
      <Elements stripe={stripePromise}>
        <CheckoutForm />
      </Elements>
    </div>
  );
}

export default Checkout;
