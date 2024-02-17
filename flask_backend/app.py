from flask import Flask, request, jsonify
from flask_cors import CORS
from langchain.prompts import PromptTemplate
from langchain.llms import CTransformers
import json
import re

app = Flask(__name__)
CORS(app)


def remove_g(match):
    return match.group(1)


def clean_response(response):
    index_of_equal = response.find("=")
    response = response[index_of_equal + 1:].strip()
    response += "}"

    numeric_g_pattern = re.compile(r'(\d+)g')
    response = numeric_g_pattern.sub(remove_g, response)
    return response


def generate_recipe(food_type, ingredients, bmi):
    llm = CTransformers(model='models/llama-2-13b-chat.ggmlv3.q2_K.bin',
                        model_type="llama",
                        local_files_only=True,
                        config={
                            "temperature": 0.01,
                            "max_new_tokens": 300,
                        })
    template = f"""
        Generate a step by step recipe which is personalized Indian {food_type} recipe with the following ingredients: {ingredients}

        BMI (Body Mass Index): {bmi}

        According to the serving size of one adult, also provide the calorie intake for the same, and do mention total calories.
    """

    prompt = PromptTemplate(input_variables=["food_type", "ingredients", "bmi"],
                            template=template)

    response = llm(prompt.format(food_type=food_type,
                   ingredients=ingredients, bmi=bmi))
    # response = clean_response(response)
    print(response)
    return response


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
