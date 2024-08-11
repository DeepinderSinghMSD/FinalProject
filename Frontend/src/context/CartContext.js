import React, { createContext, useState, useContext } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    const existingProduct = cart.find(p => p._id === product._id);
    if (existingProduct) {
      setCart(cart.map(p => p._id === product._id ? { ...p, quantity: product.quantity } : p));
    } else {
      setCart([...cart, { ...product, quantity: product.quantity || 1 }]);
    }
  };
  

  const removeFromCart = (productId) => {
    setCart(cart.filter(product => product._id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
