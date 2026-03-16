from sentence_transformers import SentenceTransformer

# Load once and reuse
_model = None

def get_model():
    global _model
    if _model is None:
        print("Loading model...")
        _model = SentenceTransformer('all-MiniLM-L6-v2')
    return _model
