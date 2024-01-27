// JavaScript
import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";
import apiService from "../services/apiService";

const initialState = {
    productList: [],
    cartItem: [],
    generatedRecipe: null,
};

export const productSlice = createSlice({
    name: "product",
    initialState,
    reducers: {
        setDataProduct: (state, action) => {
            state.productList = [...action.payload];
        },
        addCartItem: (state, action) => {
            const check = state.cartItem.some((el) => el._id === action.payload._id);
            if (check) {
                toast("Already Item in Cart");
            } else {
                toast("Item Add successfully");
                const total = action.payload.price;
                state.cartItem = [
                    ...state.cartItem,
                    {...action.payload, qty: 1, total: total},
                ];

                const foodType = 'Indian'; // Replace with actual value
                const bmi = 20; // Replace with actual value

                // The function generateRecipe is an async function, you can't directly await it here in synchronous code.
                // Instead, here we simulate the API call without blocking the UI and handle the promise response/exception separately.
                apiService.generateRecipe(state.cartItem, foodType, bmi)
                    .then(recipe => {
                        state.generatedRecipe = recipe;
                    }).catch(error => {
                    console.error("Error generating recipe: ", error)
                })
            }
        },
        // rest of your reducers...
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