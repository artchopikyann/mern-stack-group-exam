import React, { useState, useEffect } from "react";

const Profile = ({ setUser }) => {
  const [image, setImage] = useState("./images/default.png");
  const [file, setFile] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("http://localhost:5000/users/profile", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const data = await response.json();
        if (response.ok) {
          setUser(data);
          setFirstName(data.username || "");
          setLastName(data.surname || "");
          setEmail(data.email || "");
          setPhone(data.phoneNumber || "");

          const avatarUrl = data.avatar ? `http://localhost:5000${data.avatar}` : "./images/default.png";
          setImage(avatarUrl);
        } else {
          alert("Failed to load user data.");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [setUser]);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
      setImage(URL.createObjectURL(file));
    }
  };

  const handleRemovePhoto = async () => {
    try {
      const response = await fetch("http://localhost:5000/users/remove-photo", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setFile(null);
        setImage("/images/default.png");
        alert("Photo removed successfully");
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert("Failed to remove photo.");
    }
  };


  const handleSaveChanges = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("email", email);
    formData.append("phone", phone);

    if (file) {
      formData.append("profileImage", file);
    }

    try {
      const response = await fetch("http://localhost:5000/users/change-profile", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        alert("Profile updated successfully!");
        setImage(`http://localhost:5000${data.avatar}`); 
        setFile(null); 
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert("Something went wrong! Try again.");
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/users/change-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Password changed successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert("Error changing password!");
    }
  };

  return (
    <div className="profile-container">
      
      <div className="profile-header">
        <div className="profile-picture">
          <div className="image-box">
          {image ? (
            <img src={image} alt="Profile" width="150" style={{ marginBottom: '20px'}} />
          ) : (
            <div
              style={{
                width: 150,
                height: 150,
                background: "#eee",
                borderRadius: "50%",
              }}
            >
              No photo
            </div>
          )}
          </div>
          

          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            id="fileInput"
            style={{ display: "none" }}
          />
          <button type="button" onClick={() => document.getElementById("fileInput").click()} style={{ backgroundColor: 'green', color: 'white' }}>
            Change Photo
          </button>
          {image && (
            <button type="button" onClick={handleRemovePhoto} style={{ backgroundColor: 'red', color: 'white' }}>
              Remove Photo
            </button>
          )}
        </div>

        <form onSubmit={handleSaveChanges} className="profile-form">
          <div className="form-group">
            <label>First Name</label>
            <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Last Name</label>
            <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Phone Number</label>
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <button type="submit" className="save-changes-btn">
            Save Changes
          </button>
        </form>

        <div className="change-password-section">
          <h3>Change Password</h3>
          <form onSubmit={handleChangePassword}>
            <div className="form-group">
              <label>Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <button type="submit" className="change-password-btn">
              Change Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
