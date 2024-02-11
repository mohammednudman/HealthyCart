import axios from "axios"

const serverURL = 'http://localhost:5000';

const generateRecipe = async (cartItems, foodType, bmi) => {
    const ingredients = cartItems.map(item => item.name);
    const response = await fetch(`${serverURL}/generate_recipe`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            ingredients: ingredients,
            food_type: foodType,
            bmi: bmi
        }),
    });
    if (response.ok) {
        return await response.json();
    } else {
        throw new Error(response.statusText);
    }
};

export default {
    generateRecipe
};
