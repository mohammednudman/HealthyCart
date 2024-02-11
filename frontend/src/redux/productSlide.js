// productSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";
import apiService from "../services/apiService";
import axios from "axios"

// Load state from local storage if available, otherwise use initialState
const initialState = localStorage.getItem("productState")
    ? JSON.parse(localStorage.getItem("productState"))
    : {
        productList: [],
        cartItem: [],
        generatedRecipe: null,
        loadingRecipe: false
    };

export const fetchRecipe = createAsyncThunk(
    'product/fetchRecipe',
    async (cartItem, { getState, rejectWithValue }) => {
        try {
            const state = getState(); // Get the current Redux state
            const userState = JSON.parse(localStorage.getItem("userState"));
            const data = { "email": userState.email }

            // Fetch user details
            const response = await axios.post(`${process.env.REACT_APP_SERVER_DOMIN}/getUserDetails`, data);
            const { foodType, bmi } = response.data;

            // Generate recipe based on user details and cart items
            const recipe = await apiService.generateRecipe(cartItem, foodType, bmi);
            return recipe;
        } catch (error) {
            console.error("Error fetching recipe: ", error);
            return rejectWithValue(error.message);
        }
    }
);

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
                    { ...action.payload, qty: 1, total: total },
                ];

                const userState = JSON.parse(localStorage.getItem("userState"));
                const data = { "email": userState.email }

                axios.post(`${process.env.REACT_APP_SERVER_DOMIN}/getUserDetails`, data)
                    .then((response) => {
                        const foodType = response.data.foodType
                        const bmi = response.data.bmi;

                        console.log(foodType, bmi)

                        apiService.generateRecipe(state.cartItem, foodType, bmi)
                            .then(recipe => {
                                state.generatedRecipe = recipe;
                            }).catch(error => {
                                console.error("Error generating recipe: ", error)
                            })
                    })
                    .catch((err) => {
                        console.error(err)
                    })
                localStorage.setItem("productState", JSON.stringify(state));
            }
        },
        deleteCartItem: (state, action) => {
            toast("one Item Delete");
            const index = state.cartItem.findIndex((el) => el._id === action.payload);
            state.cartItem.splice(index, 1);
            console.log(index);
            // Save state to local storage
            localStorage.setItem("productState", JSON.stringify(state));
        },
        increaseQty: (state, action) => {
            const index = state.cartItem.findIndex((el) => el._id === action.payload);
            let qty = state.cartItem[index].qty;
            const qtyInc = ++qty;
            state.cartItem[index].qty = qtyInc;

            const price = state.cartItem[index].price;
            const total = price * qtyInc;

            state.cartItem[index].total = total;
            // Save state to local storage
            localStorage.setItem("productState", JSON.stringify(state));
        },
        decreaseQty: (state, action) => {
            const index = state.cartItem.findIndex((el) => el._id === action.payload);
            let qty = state.cartItem[index].qty;
            if (qty > 1) {
                const qtyDec = --qty;
                state.cartItem[index].qty = qtyDec;

                const price = state.cartItem[index].price;
                const total = price * qtyDec;

                state.cartItem[index].total = total;
                // Save state to local storage
                localStorage.setItem("productState", JSON.stringify(state));
            }
        },
    },
    extraReducers: {
        [fetchRecipe.pending]: (state) => {
            state.loadingRecipe = true;
        },
        [fetchRecipe.fulfilled]: (state, action) => {
            state.loadingRecipe = false;
            state.generatedRecipe = action.payload;
        },
        [fetchRecipe.rejected]: (state, action) => {
            state.loadingRecipe = false;
            console.error("Error fetching recipe: ", action.payload);
            toast.error("Error fetching recipe");
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
