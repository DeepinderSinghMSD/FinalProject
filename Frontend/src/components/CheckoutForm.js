import React, { useState } from 'react';
import { useElements, useStripe, CardElement } from '@stripe/react-stripe-js';
import axios from 'axios';
import { useCart } from '../context/CartContext';

const CheckoutForm = () => {
  const { cart } = useCart();
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState('');
  
  // Address state
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    zip: ''
  });

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0);
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddress({ ...address, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement),
    });

    if (stripeError) {
      setError(stripeError.message);
      setIsProcessing(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/orders', {
        paymentMethodId: paymentMethod.id,
        products: cart.map(item => ({ product: item._id, quantity: item.quantity || 1 })),
        totalAmount: getTotalPrice(),
        address: address // Include address in the request
      });

      setMessage('Order placed successfully!');
      setError(null);
    } catch (err) {
      setError('Error placing order: ' + (err.response?.data?.error || err.message));
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Payment Details</h2>
      <CardElement />
      
      <h2>Shipping Address</h2>
      <label>
        Street Address:
        <input 
          type="text" 
          name="street" 
          value={address.street} 
          onChange={handleAddressChange} 
          required 
        />
      </label>
      <label>
        City:
        <input 
          type="text" 
          name="city" 
          value={address.city} 
          onChange={handleAddressChange} 
          required 
        />
      </label>
      <label>
        State:
        <input 
          type="text" 
          name="state" 
          value={address.state} 
          onChange={handleAddressChange} 
          required 
        />
      </label>
      <label>
        ZIP Code:
        <input 
          type="text" 
          name="zip" 
          value={address.zip} 
          onChange={handleAddressChange} 
          required 
        />
      </label>
      
      {error && <div className="error">{error}</div>}
      {message && <div className="success">{message}</div>}
      <button type="submit" disabled={isProcessing}>Pay ${getTotalPrice()}</button>
    </form>
  );
};

export default CheckoutForm;
