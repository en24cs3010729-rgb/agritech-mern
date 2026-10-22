import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('agritech_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem('agritech_cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('agritech_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('agritech_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('agritech_cart', JSON.stringify(cart));
  }, [cart]);

  const login = async (email, password) => {
    const res = await axios.post('/api/auth/login', { email, password });
    if (res.data.success) {
      setUser(res.data.data);
      return res.data.data;
    }
    throw new Error(res.data.message || 'Login failed');
  };

  const register = async (userData) => {
    const res = await axios.post('/api/auth/register', userData);
    if (res.data.success) {
      setUser(res.data.data);
      return res.data.data;
    }
    throw new Error(res.data.message || 'Registration failed');
  };

  const logout = () => {
    setUser(null);
  };

  // Cart Management
  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product._id === product._id);
      if (existing) {
        return prev.map((item) =>
          item.product._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.product._id !== productId));
  };

  const clearCart = () => setCart([]);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        cart,
        addToCart,
        removeFromCart,
        clearCart
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
