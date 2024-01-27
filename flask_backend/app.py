from flask import Flask, request, jsonify
from langchain.prompts import PromptTemplate
from langchain.llms import CTransformers

def load_model():
    model = CTransformers(model='models/llama-2-7b-chat.ggmlv3.q8_0.bin',
                          model_type='llama',
                          config={'max_new_tokens':256,
                                  'temperature':0.01})

    template = """
        Create an Indian {food_type} recipe with the following ingredients: {ingredients}
        
        Additional Ingredients (if needed):
        - {additional_ingredients}

        BMI (Body Mass Index): {bmi}
            """

    prompt = PromptTemplate(input_variables=["food_type", "ingredients", "additional_ingredients", "bmi"],
                            template=template)

    return model, prompt

def generate_recipe(food_type, ingredients, bmi, model, prompt):
    ingredients_list = ', '.join(ingredients)
    response = model(prompt.format(food_type=food_type, ingredients=ingredients_list, additional_ingredients='', bmi=bmi))
    return response

app = Flask(__name__)

@app.route('/generate_recipe', methods=['POST'])
def generate_recipe_endpoint():
    try:
        data = request.get_json(force=True)
        ingredients = data['ingredients']
        food_type = data['food_type']
        bmi = data['bmi']

        # Generate recipe
        generated_recipe = generate_recipe(food_type, ingredients, bmi, model, prompt)

        response = {'recipe': generated_recipe}
        return jsonify(response)

    except Exception as e:
        return jsonify({'error': str(e)})

if __name__ == '__main__':
    # Load the model and prompt
    model, prompt = load_model()

    # Run the Flask app
    app.run(port=5000)
