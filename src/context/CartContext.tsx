import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { CartItem, Product } from '../types';

interface CartState {
  items: CartItem[];
  wishlist: Product[];
}

type CartAction =
  | { type: 'ADD_TO_CART'; product: Product }
  | { type: 'REMOVE_FROM_CART'; productId: string }
  | { type: 'UPDATE_QUANTITY'; productId: string; quantity: number }
  | { type: 'CLEAR_CART' }

  | { type: 'ADD_TO_WISHLIST'; product: Product }
  | { type: 'REMOVE_FROM_WISHLIST'; productId: string }
  | { type: 'CLEAR_WISHLIST' }

  | { type: 'LOAD_STATE'; state: CartState };
  

interface CartContextType {
  items: CartItem[];
  wishlist: Product[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;

  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  clearWishlist: () => void;
  isInWishlist: (productId: string) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_TO_CART':
      { const existingItem = state.items.find(item => item.product.id === action.product.id);
      
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.product.id === action.product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        };
      }
      
      return {
        ...state,
        items: [...state.items, { product: action.product, quantity: 1 }]
      }; }
    
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        items: state.items.filter(item => item.product.id !== action.productId)
      };
    
    case 'UPDATE_QUANTITY':
      if (action.quantity <= 0) {
        return {
          ...state,
          items: state.items.filter(item => item.product.id !== action.productId)
        };
      }
      
      return {
        ...state,
        items: state.items.map(item =>
          item.product.id === action.productId
            ? { ...item, quantity: action.quantity }
            : item
        )
      };
    
    case 'CLEAR_CART':
      return {...state, items: [] };

    case 'ADD_TO_WISHLIST': {
      const exists = state.wishlist.some(item => item.id === action.product.id);
      if (exists) return state;
      return { ...state, wishlist: [...state.wishlist, action.product] };
    }

    case 'REMOVE_FROM_WISHLIST':
      return {
        ...state,
        wishlist: state.wishlist.filter(item => item.id !== action.productId)
      };

    case 'CLEAR_WISHLIST':
      return { ...state, wishlist: [] };

    case 'LOAD_STATE':
      return action.state;
    
    default:
      return state;
  }
};

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, { items: [], wishlist: [] });

  // Load cart & wishlist from localStorage on first render
  useEffect(() => {
    const savedState = localStorage.getItem('cartState');
    if (savedState) {
      try {
        dispatch({ type: 'LOAD_STATE', state: JSON.parse(savedState) });
      } catch (err) {
        console.error('Failed to parse saved cart:', err);
      }
    }
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('cartState', JSON.stringify(state));
  }, [state]);

  //Cart methods
  const addToCart = (product: Product) => {
    dispatch({ type: 'ADD_TO_CART', product });
  };

  const removeFromCart = (productId: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', productId });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', productId, quantity });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const getTotalItems = () => {
    return state.items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return state.items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };
  
  // Wishlist methods
  const addToWishlist = (product: Product) => dispatch({ type: 'ADD_TO_WISHLIST', product });
  const removeFromWishlist = (productId: string) =>
    dispatch({ type: 'REMOVE_FROM_WISHLIST', productId });
  const clearWishlist = () => dispatch({ type: 'CLEAR_WISHLIST' });
  const isInWishlist = (productId: string) => state.wishlist.some(p => p.id === productId);

  return (
    <CartContext.Provider value={{
      items: state.items,
      wishlist: state.wishlist,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getTotalItems,
      getTotalPrice,
      addToWishlist,
      removeFromWishlist,
      clearWishlist,
      isInWishlist,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};