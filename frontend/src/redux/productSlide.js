// JavaScript
import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";
import apiService from "../services/apiService";

const initialState = {
    productList: [],
    cartItem: [],
    generatedRecipe: null,      // add this line
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

                apiService.generateRecipe(state.cartItem).then(recipe => {
                    state.generatedRecipe = recipe;  // add this line
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