import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";


// Load state from local storage if available, otherwise use initialState
const initialState = localStorage.getItem("productState")
    ? JSON.parse(localStorage.getItem("productState"))
    : {
        productList: [],
        cartItem: [],
        generatedRecipe: null,
        loadingRecipe: false
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
                    { ...action.payload, qty: 1, total: total },
                ];

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
