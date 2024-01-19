// JavaScript - React
import React from "react";

const RecipeContainer = ({ recipe }) => {
    const containerStyle = {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        border: "1px solid #cccccc",
        borderRadius: "5px",
        padding: "20px",
        margin: "20px 0",
        height: "200px",
        fontSize: "28px",
        fontWeight: "bold"
    };

    const titleStyle = {
        fontSize: "28px",
        fontWeight: "bold",
        marginBottom: "10px"
    };

    const descriptionStyle = {
        fontSize: "16px",
        textAlign: "center"
    };

    if (!recipe) {
        return <div style={containerStyle}>No recipe generated yet</div>;
    }

    return (
        <div style={containerStyle}>
            <h2 style={titleStyle}>Generated Recipe</h2>
            <p style={descriptionStyle}>{recipe}</p>
        </div>
    );
};

export default RecipeContainer;