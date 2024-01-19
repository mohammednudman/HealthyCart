// JavaScript
const serverURL = 'http://localhost:5000';

const generateRecipe = async (cartItems) => {
    const ingredients = cartItems.map(item => item.name); // Assuming each cartItem has a `name` property

    const response = await fetch(`${serverURL}/generate-recipe`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ingredients }), // Using the ingredients in the post body
    });

    if(response.ok) {
        return await response.json();
    } else {
        throw new Error(response.statusText);
    }
};

export default {
    generateRecipe
};