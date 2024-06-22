#!/usr/bin/env python
# coding: utf-8

# In[ ]:


#pip install git+https://github.com/UBC-NLP/octopus.git


# In[1]:


from flask import Flask, request, jsonify
import logging
import os
from octopus import octopus

app = Flask(__name__)

# Setting up logging
logging.basicConfig(
    format="%(asctime)s | %(levelname)s | %(name)s | %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
    level=os.environ.get("LOGLEVEL", "INFO").upper(),
)
logger = logging.getLogger("octopus")

cache_dir = "./octopus_cache/"
oct_obj = octopus.octopus(logger, cache_dir)

# Define route for processing text
@app.route('/process_text', methods=['POST'])
def process_text_route():
    try:
        data = request.get_json()
        task = 'إعاده الصياغه'
        input_text = data.get('input_text')

        if task not in ['تشكيل النص', 'التصحيح النحوي', 'توليد العناوين', 'إعاده الصياغه', 'الإجابة على الأسئلة', 'توليد الأسئلة', 'الترجمة']:
            return jsonify({'error': 'Invalid task specified'}), 400

        if not input_text:
            return jsonify({'error': 'Input text is required'}), 400

        output = process_text(task, input_text)
        return jsonify({'output': output}), 200

    except Exception as e:
        logger.error(str(e))
        return jsonify({'error': 'An error occurred'}), 500

# Function to process text based on the specified task
def process_text(task, input_text):
    task_prefix_map = {
        'تشكيل النص': "diacritize",
        'التصحيح النحوي': "correct_grammar",
        'توليد العناوين': "generate_title",
        'إعاده الصياغه': "paraphrase",
        'الإجابة على الأسئلة': "answer_question",
        'توليد الأسئلة': "generate_question",
        'الترجمة': "transliterate"  
    }

    prefix = task_prefix_map[task]
    text_with_prefix = f"{prefix}: {input_text}"
    gen_options = {"search_method": "beam", "seq_length": 300, "num_beams": 5, "no_repeat_ngram_size": 2, "max_outputs": 1}
    output = oct_obj.do_generate(text_with_prefix, **gen_options)
    return output

if __name__ == '__main__':
    app.run(debug=True)


# In[ ]:




