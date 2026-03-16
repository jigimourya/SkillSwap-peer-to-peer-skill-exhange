import React, { useState, useEffect } from "react";
import axios from "axios";

function SkillProfile() {
  const [fullName, setFullName] = useState("");
  const [skills, setSkills] = useState("");
  const [learningInterests, setLearningInterests] = useState("");
  const [bio, setBio] = useState("");
  const [message, setMessage] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(""); // Store uploaded image URL
  const [profileSaved, setProfileSaved] = useState(false); // Toggle between view/edit
  const [editing, setEditing] = useState(false); // For update mode

  useEffect(() => {
    axios.get("http://localhost:5000/api/skill-profile/me", { withCredentials: true })
      .then(res => {
        const { fullName, skills, learningInterests, bio, imageUrl } = res.data;
        setFullName(fullName || "");
        setSkills(skills?.join(", ") || "");
        setLearningInterests(learningInterests?.join(", ") || "");
        setBio(bio || "");
        setImageUrl(imageUrl || "");
        setProfileSaved(true);
      }).catch(err => {
        console.log("No existing profile found.");
      });
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      let finalImageUrl = imageUrl;

      if (imageFile) {
        const formData = new FormData();
        formData.append("profilePic", imageFile);

        const uploadRes = await axios.post(
          "http://localhost:5000/api/skill-profile/upload-image",
          formData,
          { withCredentials: true } // Include session cookie
        );

        finalImageUrl = uploadRes.data.imageUrl;
      }

      const payload = {
        fullName,
        skills: skills.split(",").map(s => s.trim()),
        learningInterests: learningInterests.split(",").map(i => i.trim()),
        bio,
        imageUrl: finalImageUrl,
      };

      if (editing) {
        await axios.put("http://localhost:5000/api/skill-profile", payload, { withCredentials: true });
        setMessage("Profile updated successfully");
      } else {
        await axios.post("http://localhost:5000/api/skill-profile", payload, { withCredentials: true });
        setMessage("Profile created successfully");
      }

      setImageUrl(finalImageUrl);
      setProfileSaved(true);
      setEditing(false);
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Something went wrong");
    }
  };
  // const handleSave = async (e) => {
  //   e.preventDefault();
  //   try {
  //     let imageUrl = "";

  //     if (imageFile) {
  //       const formData = new FormData();
  //       formData.append("file", imageFile);
  //       formData.append("upload_preset", "your_preset"); // if using Cloudinary

  //       const uploadRes = await axios.post("https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload", formData);
  //       imageUrl = uploadRes.data.secure_url;
  //     }
  //     const payload = {
  //       fullName,
  //       skills: skills.split(",").map(s => s.trim()),
  //       learningInterests: learningInterests.split(",").map(i => i.trim()),
  //       bio,
  //       imageUrl,
  //     };

  //     if (editing) {
  //       // Update profile
  //       await axios.put("http://localhost:5000/api/skill-profile", payload, { withCredentials: true });
  //       setMessage("Profile updated successfully");
  //     } else {
  //       // Create profile
  //       await axios.post("http://localhost:5000/api/skill-profile", payload, { withCredentials: true });
  //       setMessage("Profile created successfully");
  //     }
  //     setImageUrl(imageUrl);  // Update image preview in view mode
  //     setProfileSaved(true);
  //     setEditing(false);
  //   } catch (err) {
  //     console.error(err);
  //     setMessage(err.response?.data?.message || "Something went wrong");
  //   }
  // };

  const handleEdit = () => {
    setEditing(true); // ✅ Switch to edit mode
    setProfileSaved(false);
  };

  const handleDelete = async () => {
    try {
      await axios.delete("http://localhost:5000/api/skill-profile", { withCredentials: true });
      setFullName("");
      setSkills("");
      setLearningInterests("");
      setBio("");
      setProfileSaved(false);
      setMessage("Profile deleted");
    } catch (err) {
      console.error(err);
      setMessage("Failed to delete profile");
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        minHeight: "100vh",
        backgroundColor: "#588157", // Avocado green
      }}
    >
      <div
        className="container p-4 rounded shadow"
        style={{
          backgroundColor: "#F9F5EB", // Cream
          color: "#1D1D1D",
          maxWidth: "700px",
          width: "100%",
          borderRadius: "15px",
        }}
      >
        <h2 className="mb-4 text-center">Skill Profile</h2>

        {(!profileSaved || editing) ? (
          <form onSubmit={handleSave}>
            {/* Form fields */}
            {/* You can keep form structure same, only style input fields */}
            <div className="mb-3">
              <label htmlFor="fullName" className="form-label">
                Full Name:
              </label>
              <input
                id="fullName"
                type="text"
                className="form-control"
                style={{ backgroundColor: "#fff" }}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="skills" className="form-label">
                Skills (comma-separated):
              </label>
              <input
                id="skills"
                type="text"
                className="form-control"
                style={{ backgroundColor: "#fff" }}
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="learningInterests" className="form-label">
                Learning Interests (comma-separated):
              </label>
              <input
                id="learningInterests"
                type="text"
                className="form-control"
                style={{ backgroundColor: "#fff" }}
                value={learningInterests}
                onChange={(e) => setLearningInterests(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="bio" className="form-label">
                Bio:
              </label>
              <textarea
                id="bio"
                className="form-control"
                style={{ backgroundColor: "#fff" }}
                rows="3"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              ></textarea>
            </div>

            <div className="mb-3">
              <label htmlFor="imageUpload" className="form-label">
                Upload Profile Image:
              </label>
              <input
                id="imageUpload"
                type="file"
                accept="image/*"
                className="form-control"
                onChange={(e) => setImageFile(e.target.files[0])}
              />
            </div>

            {imageFile && (
              <div className="mb-3">
                <img
                  src={URL.createObjectURL(imageFile)}
                  alt="Preview"
                  style={{ width: "100%", borderRadius: "10px", marginBottom: "10px" }}
                />
              </div>
            )}

            <button
              type="submit"
              className="btn"
              style={{
                backgroundColor: "#FFB703",
                color: "#1D1D1D",
                fontWeight: "bold",
                width: "100%",
              }}
            >
              {editing ? "Update Profile" : "Save Profile"}
            </button>
          </form>
        ) : (
          <div className="p-3">
            {imageUrl && (
              <img
                src={`http://localhost:3000${imageUrl}`}
                alt="Uploaded"
                style={{ width: "100%", borderRadius: "10px", marginBottom: "10px" }}
              />
            )}
            <h4 className="mb-3">{fullName}</h4>
            <p>
              <strong>Skills:</strong>{" "}
              {skills.split(",").map((skill, i) => (
                <span key={i} className="badge bg-success me-1">
                  {skill.trim()}
                </span>
              ))}
            </p>
            <p>
              <strong>Learning Interests:</strong>{" "}
              {learningInterests.split(",").map((interest, i) => (
                <span key={i} className="badge bg-info me-1">
                  {interest.trim()}
                </span>
              ))}
            </p>
            <p>
              <strong>Bio:</strong> {bio}
            </p>

            

            <div className="mt-3 d-flex gap-2">
              <button onClick={handleEdit} className="btn btn-warning">
                Edit
              </button>
              <button onClick={handleDelete} className="btn btn-danger">
                Delete
              </button>
            </div>
          </div>
        )}

        {message && (
          <div className="alert alert-info mt-3" role="alert">
            {message}
          </div>
        )}
      </div>
    </div>
  );

}

export default SkillProfile;