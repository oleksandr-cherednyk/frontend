import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';

export const store = configureStore({
  reducer: { cart: cartReducer },
});


store.subscribe(() => {
  try {
    const state = store.getState();
    localStorage.setItem('cart_v1', JSON.stringify(state.cart.items));
  } catch {(e) => {
    console.error(e)
  }}
});
