import sys
import json
from pymongo import MongoClient
from bson import ObjectId
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

def normalize_list(input_list):
    return [item.strip().lower() for item in input_list if isinstance(item, str)]

# ✅ MongoDB connection
client = MongoClient("mongodb://localhost:27017/")
db = client["skillswap"]
collection = db["skill_profiles"]

# ✅ Get current userId from command line
current_user_id = sys.argv[1]
current_user = collection.find_one({"userId": ObjectId(current_user_id)})

if not current_user:
    print(json.dumps({"error": "Current user not found"}))
    sys.exit()

# Normalize current user's learning interests
current_learning_interests = normalize_list(current_user.get("learningInterests", []))

# ✅ Fetch all other users except current
all_users = list(collection.find({"userId": {"$ne": ObjectId(current_user_id)}}))

# Normalize other users' skills
for user in all_users:
    user["normalized_skills"] = normalize_list(user.get("skills", []))

# ✅ Build vocabulary from all normalized skills and interests
vocab = set(current_learning_interests)
for user in all_users:
    vocab.update(user["normalized_skills"])
vocab = sorted(list(vocab))
vocab_index = {skill: i for i, skill in enumerate(vocab)}

# Debug prints
print("Vocabulary:", vocab, file=sys.stderr)
print("Current user learning interests:", current_learning_interests, file=sys.stderr)
print("Other users' normalized skills:", [user["normalized_skills"] for user in all_users], file=sys.stderr)

# ✅ Convert interests and skills to vectors
def to_vector(keywords):
    vec = np.zeros(len(vocab))
    for kw in keywords:
        if kw in vocab_index:
            vec[vocab_index[kw]] = 1
    return vec

current_vec = to_vector(current_learning_interests)

# ✅ Compare with each user's skills and compute cosine similarity
recommendations = []
for user in all_users:
    skill_vec = to_vector(user["normalized_skills"])
    score = cosine_similarity([current_vec], [skill_vec])[0][0]
    if score > 0:
        recommendations.append({
            "userId": str(user["userId"]),
            "fullName": user.get("fullName", ""),
            "skills": user.get("skills", []),
            "bio": user.get("bio", ""),
            "score": score,
            "imageUrl": user.get("imageUrl", ""),
        })

# ✅ Sort and return top 5 matches
recommendations.sort(key=lambda x: x["score"], reverse=True)
top_matches = recommendations[:5]

# ✅ Print JSON result (readable by Express backend)
print(json.dumps(top_matches))
