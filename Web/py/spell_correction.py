from autocorrect import Speller
import sys

def correct_spelling(text):
    spell = Speller(lang='en')
    words = text.split()
    corrected_words = [spell(w) for w in words]
    corrected_text = ' '.join(corrected_words)
    return corrected_text

if __name__ == "__main__":
    input_text = sys.argv[1]
    corrected_text = correct_spelling(input_text)
    corrected_text = corrected_text.upper()
    print(corrected_text)