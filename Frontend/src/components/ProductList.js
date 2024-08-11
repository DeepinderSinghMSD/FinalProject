import React from 'react';
import ProductItem from './ProductItem';

function ProductList({ products, addToCart }) {
  return (
    <div className="product-list">
      {products.map(product => (
        <ProductItem key={product._id} product={product} addToCart={addToCart} />
      ))}
    </div>
  );
}

export default ProductList;
