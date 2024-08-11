import React, { useEffect, useState } from 'react';
import ProductItem from '../components/ProductItem';
import axios from 'axios';

function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/products');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div>
      <h1>Trendy Collection</h1>
      {products.map(product => (
        <ProductItem key={product._id} product={product} />
      ))}
    </div>
  );
}

export default Home;
