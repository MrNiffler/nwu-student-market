import React, { useState, useEffect } from "react";

function Notification({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed top-4 right-4 px-4 py-2 rounded-lg shadow-lg text-white text-sm transition-opacity duration-200 z-50 ${
        type === "success" ? "bg-green-500" :
        type === "error" ? "bg-red-500" :
        "bg-blue-500"
      }`}
    >
      {message}
    </div>
  );
}

function Spinner() {
  return (
    <div className="flex justify-center items-center my-8">
      <div className="w-12 h-12 border-4 border-t-4 border-indigo-800 border-solid rounded-full animate-spin"></div>
    </div>
  );
}

function FileUpload({ title, onFileSelect }) {
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    
    // Simulate upload process
    const formData = new FormData();
    formData.append('file', file);
    
    // Simulate API call
    setTimeout(() => {
      setUploading(false);
      if (Math.random() > 0.2) { // 80% success rate for demo
        onFileSelect({ name: file.name, size: file.size, type: file.type });
        return true; // success
      } else {
        return false; // error
      }
    }, 2000);
  };

  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-500 transition-colors">
      {uploading ? (
        <div className="space-y-4">
          <Spinner />
          <p className="text-gray-600">Uploading {title}...</p>
        </div>
      ) : (
        <>
          <div className="mb-4">
            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="space-y-1 text-center">
            <h3 className="text-lg font-medium text-gray-900">{title}</h3>
            <p className="text-sm text-gray-500">PNG, JPG, GIF up to 10MB</p>
          </div>
          <input
            type="file"
            className="mt-4 hidden"
            id={`${title.toLowerCase().replace(/\s+/g, '-')}-upload`}
            accept="image/*"
            onChange={handleFileUpload}
          />
          <label
            htmlFor={`${title.toLowerCase().replace(/\s+/g, '-')}-upload`}
            className="cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md inline-flex items-center font-medium text-sm transition-colors"
          >
            Choose File
          </label>
        </>
      )}
    </div>
  );
}

function Profile() {
  const [profile, setProfile] = useState(null);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [notifications, setNotifications] = useState([]);

  // Add notification
  const addNotification = (message, type = "success") => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message, type }]);
  };

  // Remove notification
  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  // Fetch profile data
  useEffect(() => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setProfile({
        name: "Thabo Mokoena",
        email: "thabo@thabotech.co.za",
        role: "Student Seller",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
      });
      setListings([
        { id: 1, title: "Math Textbook", status: "active" },
        { id: 2, title: "Wireless Headphones", status: "sold" }
      ]);
      setLoading(false);
      addNotification("Profile loaded successfully!", "success");
    }, 1500);
  }, []);

  // Handle avatar upload
  const handleAvatarUpload = (file) => {
    setUploadingAvatar(true);
    setTimeout(() => {
      setUploadingAvatar(false);
      setAvatarFile(file);
      addNotification(`Avatar uploaded successfully: ${file.name}`, "success");
    }, 2000);
  };

  // Handle profile update
  const handleProfileUpdate = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      addNotification("Profile updated successfully!", "success");
    }, 1000);
  };

  if (loading && !profile) {
    return (
      <div className="page-container max-w-5xl mx-auto px-4">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="page-container max-w-5xl mx-auto px-4">
      <section className="hero text-center py-10 bg-gradient-to-b from-white to-gray-50 rounded-lg my-5">
        <h2 className="text-2xl font-bold mb-2">Your Profile</h2>
        <p className="text-gray-600">Manage your listings, view messages, and update information.</p>
      </section>

      <section className="profile-info mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4">Profile Information</h3>
          
          {uploadingAvatar ? (
            <div className="flex justify-center items-center py-8">
              <Spinner />
              <span className="ml-2 text-gray-600">Updating avatar...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-6">
              <div className="relative">
                <img
                  src={avatarFile ? URL.createObjectURL(avatarFile) : profile?.avatar}
                  alt="Avatar"
                  className="w-24 h-24 rounded-full object-cover border-4 border-indigo-600"
                />
                <FileUpload 
                  title="Change Avatar" 
                  onFileSelect={handleAvatarUpload}
                  disabled={uploadingAvatar}
                />
              </div>
              
              <div className="flex-1">
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      value={profile?.name || ""}
                      onChange={(e) => setProfile({...profile, name: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      disabled={loading}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={profile?.email || ""}
                      onChange={(e) => setProfile({...profile, email: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      disabled={loading}
                    />
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                      <input
                        type="text"
                        value={profile?.role || ""}
                        className="w-full p-3 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                        readOnly
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {loading ? "Updating..." : "Update Profile"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="listings mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4">Your Listings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {listings.length === 0 ? (
              <div className="col-span-full text-center py-8 text-gray-500">
                <p>No active listings yet.</p>
                <button className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
                  Create New Listing
                </button>
              </div>
            ) : (
              listings.map((listing) => (
                <div key={listing.id} className="card border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h4 className="font-semibold text-base mb-2">{listing.title}</h4>
                  <p className={`text-sm ${listing.status === 'active' ? 'text-green-600' : 'text-gray-500'}`}>
                    Status: {listing.status}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          message={notification.message}
          type={notification.type}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </div>
  );
}

export default Profile;