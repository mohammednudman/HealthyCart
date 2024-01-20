from flask import Flask, request, jsonify
import torch
from transformers import GPT2LMHeadModel, GPT2Tokenizer

app = Flask(__name__)


def load_model(device='cpu'):
    model_name = "gpt2"
    model = GPT2LMHeadModel.from_pretrained(model_name)
    tokenizer = GPT2Tokenizer.from_pretrained(model_name)

    # Move model to GPU if available
    model.to(device)

    return model, tokenizer


def generate_recipe(input_text, device='cpu'):
    input_ids = tokenizer.encode(input_text, return_tensors="pt").to(device)
    attention_mask = torch.ones_like(input_ids).to(device)

    output = model.generate(
        input_ids,
        attention_mask=attention_mask,
        max_length=200,  # Adjust max_length as needed
        temperature=1.0,
        num_beams=5,
        no_repeat_ngram_size=2,
        top_k=50,
        top_p=0.95,
        early_stopping=True,
        do_sample=True
    )

    generated_recipe = tokenizer.decode(output[0], skip_special_tokens=True)
    return generated_recipe


@app.route('/generate_recipe', methods=['POST'])
def generate_recipe_endpoint():
    try:
        data = request.get_json(force=True)
        ingredients = data['ingredients']

        # Combine ingredients into a prompt
        input_text = f"Generate a recipe with the following ingredients: {', '.join(ingredients)}"

        # Generate recipe
        generated_recipe = generate_recipe(input_text)

        response = {'recipe': generated_recipe}
        return jsonify(response)

    except Exception as e:
        return jsonify({'error': str(e)})


if __name__ == '__main__':
    device = 'cpu'
    print(f'Using device: {device}')

    # Load the model and tokenizer
    model, tokenizer = load_model(device=device)

    # Run the Flask app
    app.run(port=5000)
