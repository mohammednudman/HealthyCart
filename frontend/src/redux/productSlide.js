import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";

const initialCartState = localStorage.getItem("cartState")
    ? JSON.parse(localStorage.getItem("cartState"))
    : [];

export const productSlice = createSlice({
    name: "product",
    initialState: {
        productList: [],
        cartItem: initialCartState,
        generatedRecipe: null,
        loadingRecipe: false
    },
    reducers: {
        setDataProduct: (state, action) => {
            state.productList = [...action.payload];
        },
        addCartItem: (state, action) => {
            const existingItem = state.cartItem.find(item => item._id === action.payload._id);
            if (existingItem) {
                toast("Item already in cart");
            } else {
                toast("Item added successfully");
                state.cartItem.push({ ...action.payload, qty: 1, total: action.payload.price });
                localStorage.setItem("cartState", JSON.stringify(state.cartItem));
            }
        },
        deleteCartItem: (state, action) => {
            toast("Item deleted from cart");
            state.cartItem = state.cartItem.filter(item => item._id !== action.payload);
            localStorage.setItem("cartState", JSON.stringify(state.cartItem));
        },
        increaseQty: (state, action) => {
            const itemToUpdate = state.cartItem.find(item => item._id === action.payload);
            if (itemToUpdate) {
                itemToUpdate.qty++;
                itemToUpdate.total = itemToUpdate.qty * itemToUpdate.price;
                localStorage.setItem("cartState", JSON.stringify(state.cartItem));
            }
        },
        decreaseQty: (state, action) => {
            const itemToUpdate = state.cartItem.find(item => item._id === action.payload);
            if (itemToUpdate && itemToUpdate.qty > 1) {
                itemToUpdate.qty--;
                itemToUpdate.total = itemToUpdate.qty * itemToUpdate.price;
                localStorage.setItem("cartState", JSON.stringify(state.cartItem));
            }
        },
    }
});

export const {
    setDataProduct,
    addCartItem,
    deleteCartItem,
    increaseQty,
    decreaseQty,
} = productSlice.actions;

export default productSlice.reducer;
