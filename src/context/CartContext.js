import React, { createContext, useState, useContext, useEffect } from 'react';
import { GraphQLClient, gql } from 'graphql-request';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

const GRAPHQL_ENDPOINT = process.env.REACT_APP_GRAPHQL_ENDPOINT || 'http://localhost:2000/graphql';

const GET_DELIVERY_CHARGERS = gql`
  query GetAllDeliveryChargers {
    getAllDeliveryChargers {
      id
      charge
      status
    }
  }
`;

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [deliveryCharge, setDeliveryCharge] = useState(0);

  useEffect(() => {
    const fetchDeliveryCharge = async () => {
      try {
        const client = new GraphQLClient(GRAPHQL_ENDPOINT);
        const data = await client.request(GET_DELIVERY_CHARGERS);
        const activeCharger = data.getAllDeliveryChargers?.find(charger => charger.status === 'ACTIVE');
        if (activeCharger) {
          setDeliveryCharge(activeCharger.charge);
        }
      } catch (err) {
        console.error("Error fetching delivery charge:", err);
      }
    };
    fetchDeliveryCharge();
  }, []);

  const addToCart = (product, quantity, size) => {
    setCartItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(
        item => item.product.id === product.id && item.size === size
      );

      if (existingItemIndex > -1) {
        // Item exists, update quantity
        const newItems = [...prevItems];
        newItems[existingItemIndex].quantity += quantity;
        return newItems;
      } else {
        // Add new item
        return [...prevItems, { product, quantity, size }];
      }
    });
  };

  const updateQuantity = (productId, size, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId, size);
      return;
    }
    setCartItems(prevItems => prevItems.map(item => 
      item.product.id === productId && item.size === size 
        ? { ...item, quantity: newQuantity } 
        : item
    ));
  };

  const removeFromCart = (productId, size) => {
    setCartItems(prevItems => prevItems.filter(item => 
      !(item.product.id === productId && item.size === size)
    ));
  };

  const getCartCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const clearCart = React.useCallback(() => {
    setCartItems([]);
  }, []);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, updateQuantity, removeFromCart, clearCart, getCartCount, getCartTotal, deliveryCharge }}>
      {children}
    </CartContext.Provider>
  );
};
