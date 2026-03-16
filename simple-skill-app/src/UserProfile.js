import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./UserProfile.css"; // optional for styling

function UserProfile() {
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/skill-profile/${userId}`, {
      withCredentials: true,
    })
      .then(res => setProfile(res.data))
      .catch(err => console.error("Failed to fetch profile", err));
  }, [userId]);

  if (!profile) {
    return <div className="text-center mt-5">Loading profile...</div>;
  }

  const { fullName, bio, skills, learningInterests, imageUrl } = profile;

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <img
            src={imageUrl || "/default.png"}
            alt={fullName}
            className="profile-img"
          />
          <div>
            <h2>{fullName}</h2>
            <p className="text-muted">🌐 Available Online</p>
          </div>
        </div>

        <div className="profile-section">
          <h4>📘 Bio</h4>
          <p>{bio || "No bio provided."}</p>
        </div>

        <div className="profile-section">
          <h4>🛠️ Skills</h4>
          <div className="badge-group">
            {skills?.map((skill, i) => (
              <span key={i} className="badge badge-skill">{skill}</span>
            )) || "No skills listed"}
          </div>
        </div>

        <div className="profile-section">
          <h4>🎓 Learning Interests</h4>
          <div className="badge-group">
            {learningInterests?.map((interest, i) => (
              <span key={i} className="badge badge-learn">{interest}</span>
            )) || "No interests listed"}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
