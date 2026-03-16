from sklearn.metrics.pairwise import cosine_similarity
from pymongo import MongoClient
from bson import ObjectId
from model_loader import get_model

# Connect to DB
client = MongoClient("mongodb://localhost:27017")
db = client["skillswap"]
collection = db["skill_profiles"]

def normalize_list(input_list):
    return [item.strip().lower() for item in input_list if isinstance(item, str)]

def recommend_users(user_id_str):
    try:
        user_id = ObjectId(user_id_str)
    except Exception as e:
        return {"error": f"Invalid user ID format: {str(e)}"}

    user = collection.find_one({"userId": user_id})
    if not user:
        return {"error": "User not found"}

    user_skills = normalize_list(user.get("skills", []))
    user_learning = normalize_list(user.get("learningInterests", []))

    best_match = None
    best_score = -1

    for other in collection.find({"userId": {"$ne": user_id}}):
        other_skills = normalize_list(other.get("skills", []))
        other_learning = normalize_list(other.get("learningInterests", []))

        # Matching based on both directions
        score = len(set(other_skills) & set(user_learning)) + \
                len(set(other_learning) & set(user_skills))

        if score > best_score:
            best_score = score
            best_match = other

    if best_match:
        return {
            # "userId": str(best_match.get("userId", "")),
            "fullName": best_match.get("fullName", ""),
            # "bio": best_match.get("bio", ""),
            "skills": best_match.get("skills", []),
            "imageUrl": best_match.get("imageUrl", ""),
            # "learningInterests": best_match.get("learningInterests", [])
        }
    else:
        return {"message": "No suitable recommendations found."}