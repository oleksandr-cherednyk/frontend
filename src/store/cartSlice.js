import { createSlice, createSelector } from '@reduxjs/toolkit';

const LS_KEY = 'cart_v1';

// начальное состояние из localStorage (корзина)
const load = () => {
  try { return JSON.parse(localStorage.getItem(LS_KEY)) ?? []; }
  catch { return []; }
};

const initialState = { // начальное состояние корзины (items храние массив товаров)
  items: load(), // [{id,title,image,price,discont_price,qty}]
};

// priceToUse — скидочная цена если есть, иначе обычная
export const priceToUse = (p) => Number(p.discont_price ?? p.price) || 0;

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem(state, { payload }) { // Если товар уже есть в корзине - увеличиваем qty
      const i = state.items.findIndex((x) => x.id === payload.id);
      if (i !== -1) {
        state.items[i].qty += payload.qty ?? 1;
      } else {
        state.items.push({ ...payload, qty: payload.qty ?? 1 });
      }
    },
    decreaseQty(state, { payload: id }) { // Уменьшает количество товара
      const i = state.items.findIndex((x) => x.id === id);
      if (i !== -1) {
        state.items[i].qty -= 1;
        if (state.items[i].qty <= 0) state.items.splice(i, 1);
      }
    },
    removeItem(state, { payload: id }) { // Удаляет товар целиком
      state.items = state.items.filter((x) => x.id !== id);
    },
  },
});

export const { addItem, decreaseQty, removeItem, clearCart } = cartSlice.actions;
export default cartSlice.reducer;

/*  селекторы (получить товары, общее количествоб) */
export const selectItems = (state) => state.cart.items; // получить все товары из состояния state.cart.items

export const selectCount = createSelector([selectItems], (items) =>
  items.reduce((s, p) => s + p.qty, 0)
);

export const selectSubtotal = createSelector([selectItems], (items) =>
  items.reduce((s, p) => s + priceToUse(p) * p.qty, 0)
);
