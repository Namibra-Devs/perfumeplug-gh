/* eslint-disable react-refresh/only-export-components */
import { Product } from "../types/product";
import { CartItem } from "../types/cart";
import React, { createContext, useReducer, ReactNode, useEffect, useState } from "react";
import { OrderItem, ShippingAddress } from "../types/order";

interface CartState {
  items: CartItem[];
  wishlist: Product[];
  orders: OrderItem[];
}

type CartAction =
  | { type: "ADD_TO_CART"; product: Product }
  | { type: "REMOVE_FROM_CART"; productId: string }
  | { type: "UPDATE_QUANTITY"; productId: string; quantity: number }
  | { type: "CLEAR_CART" }
  | { type: "ADD_TO_WISHLIST"; product: Product }
  | { type: "REMOVE_FROM_WISHLIST"; productId: string }
  | { type: "CLEAR_WISHLIST" }
  | { type: "PLACE_ORDER"; order: OrderItem }
  | { type: "CLEAR_ORDERS" }
  | { type: "LOAD_STATE"; state: CartState };

interface CartContextType {
  items: CartItem[];
  wishlist: Product[];
  orders: OrderItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  canAddToCart: (product: Product) => { canAdd: boolean; reason?: string };
  getAvailableQuantity: (product: Product) => number;

  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  clearWishlist: () => void;
  isInWishlist: (productId: string) => boolean;

  placeOrder?: (
    items: OrderItem[],
    shippingAddress: ShippingAddress,
    customerNotes?: string
  ) => void;
  // clearOrders?: () => void;

  showAlertCart: boolean;
  setShowAlertCart: React.Dispatch<React.SetStateAction<boolean>>;
}

// Create the context
const CartContext = createContext<CartContextType | undefined>(undefined);

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "ADD_TO_CART": {
      const existingItem = state.items.find(
        (item) => item.product._id === action.product._id
      );

      if (existingItem) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.product._id === action.product._id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }

      return {
        ...state,
        items: [...state.items, { product: action.product, quantity: 1 }],
      };
    }

    case "REMOVE_FROM_CART":
      return {
        ...state,
        items: state.items.filter(
          (item) => item.product._id !== action.productId
        ),
      };

    case "UPDATE_QUANTITY":
      if (action.quantity <= 0) {
        return {
          ...state,
          items: state.items.filter(
            (item) => item.product._id !== action.productId
          ),
        };
      }

      return {
        ...state,
        items: state.items.map((item) =>
          item.product._id === action.productId
            ? { ...item, quantity: action.quantity }
            : item
        ),
      };

    case "CLEAR_CART":
      return { ...state, items: [] };

    case "ADD_TO_WISHLIST": {
      const exists = state.wishlist.some(
        (item) => item._id === action.product._id
      );
      if (exists) return state;
      return { ...state, wishlist: [...state.wishlist, action.product] };
    }

    case "REMOVE_FROM_WISHLIST":
      return {
        ...state,
        wishlist: state.wishlist.filter(
          (item) => item._id !== action.productId
        ),
      };

    case "CLEAR_WISHLIST":
      return { ...state, wishlist: [] };

    case "PLACE_ORDER":
      return {
        ...state,
        items: [], // clear cart after order placement
      };

    case "CLEAR_ORDERS":
      return {
        ...state,
        orders: [],
      };

    case "LOAD_STATE":
      return action.state;

    default:
      return state;
  }
};

// Cart Provider Component
const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    wishlist: [],
    orders: [],
  });
  const [showAlertCart, setShowAlertCart] = useState(false);

  // Load cart & wishlist from localStorage on first render
  useEffect(() => {
    const savedState = localStorage.getItem("cartState");
    if (savedState) {
      try {
        dispatch({ type: "LOAD_STATE", state: JSON.parse(savedState) });
      } catch (err) {
        console.error("Failed to parse saved cart:", err);
      }
    }
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem("cartState", JSON.stringify(state));
  }, [state]);

  //Cart methods
  const addToCart = (product: Product) => {
    // Check if product has inventory tracking and is out of stock
    if (product.inventory && !product.inventory.inStock) {
      // Don't add to cart if out of stock
      console.warn(`Cannot add ${product.name} to cart - out of stock`);
      return; // Silently fail - caller should check before calling
    }

    // Check if adding one more would exceed available stock
    const existingItem = state.items.find(item => item.product._id === product._id);
    if (product.inventory && existingItem) {
      const newQuantity = existingItem.quantity + 1;
      if (newQuantity > product.inventory.available) {
        console.warn(`Cannot add more ${product.name} - only ${product.inventory.available} available`);
        return; // Silently fail - caller should check before calling
      }
    }

    dispatch({ type: "ADD_TO_CART", product });
    // Add to cart logic...
    setShowAlertCart(true);
    // Auto hide after some time
    setTimeout(() => setShowAlertCart(false), 5000);
  };

  const removeFromCart = (productId: string) => {
    dispatch({ type: "REMOVE_FROM_CART", productId });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", productId, quantity });
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  const getTotalItems = () => {
    return state.items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return state.items.reduce(
      (total, item) => total + item.product.sellingPrice * item.quantity,
      0
    );
  };

  // Check if product can be added to cart
  const canAddToCart = (product: Product): { canAdd: boolean; reason?: string } => {
    // If product doesn't track inventory, it can always be added
    if (!product.inventory) {
      return { canAdd: true };
    }

    // Check if product is in stock
    if (!product.inventory.inStock) {
      return { canAdd: false, reason: 'Out of stock' };
    }

    // Check if adding one more would exceed available stock
    const existingItem = state.items.find(item => item.product._id === product._id);
    const currentQuantity = existingItem ? existingItem.quantity : 0;
    const newQuantity = currentQuantity + 1;

    if (newQuantity > product.inventory.available) {
      return { 
        canAdd: false, 
        reason: `Only ${product.inventory.available} available${currentQuantity > 0 ? ` (${currentQuantity} in cart)` : ''}` 
      };
    }

    return { canAdd: true };
  };

  // Get available quantity for a product (considering what's already in cart)
  const getAvailableQuantity = (product: Product): number => {
    if (!product.inventory) {
      return 999; // Unlimited if not tracking inventory
    }

    const existingItem = state.items.find(item => item.product._id === product._id);
    const currentQuantity = existingItem ? existingItem.quantity : 0;
    
    return Math.max(0, product.inventory.available - currentQuantity);
  };

  // Wishlist methods
  const addToWishlist = (product: Product) =>
    dispatch({ type: "ADD_TO_WISHLIST", product });
  const removeFromWishlist = (productId: string) =>
    dispatch({ type: "REMOVE_FROM_WISHLIST", productId });
  const clearWishlist = () => dispatch({ type: "CLEAR_WISHLIST" });
  const isInWishlist = (productId: string) =>
    state.wishlist.some((p) => p._id === productId);

  // const placeOrder = async (
  //   items: OrderItem[],
  //   shippingAddress: ShippingAddress,
  // LEGACY COMMENTED CODE - Removed to keep project clean

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        wishlist: state.wishlist,
        orders: state.orders,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice,
        canAddToCart,
        getAvailableQuantity,
        addToWishlist,
        removeFromWishlist,
        clearWishlist,
        isInWishlist,
        showAlertCart,
        setShowAlertCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Export both the context and provider
export { CartContext, CartProvider };
