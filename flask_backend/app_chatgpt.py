from flask import Flask, request, jsonify
from flask_cors import CORS
import re
from openai import OpenAI

app = Flask(__name__)
CORS(app)

client = OpenAI()

def generate_recipe(food_type, ingredients, bmi):
    template = f"""
        Generate a step by step recipe which is personalized Indian {food_type} recipe with the following ingredients: {ingredients}

        BMI (Body Mass Index): {bmi}

        According to the serving size of one adult, also provide the calorie intake for the same, and do mention total calories.
    """

    
    response = client.chat.completions.create(
        model="gpt-3.5-turbo-0125",
        response_format={ "type": "json_object" },
        messages=[
            {"role": "system", "content": "You are a helpful chef designed to output JSON."},
            {"role": "user", "content": template}
        ]
    )

    print(response.choices[0].message.content)

    if response.status_code == 200:
        return response.json()["choices"][0]["text"].strip()
    else:
        return "Error: Failed to generate recipe"


@app.route('/generate_recipe', methods=['POST'])
def generate_recipe_endpoint():
    try:
        data = request.get_json(force=True)

        # Input validation
        required_fields = ['food_type', 'ingredients', 'bmi']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400

        food_type = data['food_type']
        ingredients = data['ingredients']
        bmi = data['bmi']

        # Generate recipe
        generated_recipe = generate_recipe(food_type, ingredients, bmi)

        response = {'recipe': generated_recipe}

        # Return only the generated recipe
        return jsonify(response)

    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(port=5000)
