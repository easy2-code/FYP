import React, { useState, useRef } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
<<<<<<< HEAD
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function CreateListing() {
  // Retrieve the current user from Redux store
  const { currentUser } = useSelector((state) => state.user);

  // State management
  const [files, setFiles] = useState([]); // For file uploads
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "Enter Listing Name",
    description: "",
    address: "",
    type: "rent", // Default listing type
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
=======
import {useSelector} from "react-redux"
import {useNavigate} from "react-router-dom"

export default function CreateListing() {
  const {currentUser} = useSelector(state => state.user)
  const navigate = useNavigate()
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    type: "",
    bedrooms: "1",
    bathrooms: "1",
    regularPrice: 0,
>>>>>>> 7bf151b3634acdb69222326fa7747fe6f914e5ca
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });
<<<<<<< HEAD
  const [imageUploadError, setImageUploadError] = useState(""); // To handle image upload errors
  const [uploading, setUploading] = useState(false); // Upload progress state
  const [uploadProgress, setUploadProgress] = useState(0); // Progress bar
  const [uploadCompleted, setUploadCompleted] = useState(false); // Completion status
  const [uploadSuccess, setUploadSuccess] = useState(false); // Upload success notification
  const [deleteMessage, setDeleteMessage] = useState(""); // Delete confirmation message
  const fileInputRef = useRef(null); // Reference for file input
  const [error, setError] = useState(false); // General error state
  const [loading, setLoading] = useState(false); // Form submission state
  const navigate = useNavigate(); // For programmatic navigation
=======
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  // console.log(formData)
  const [uploadProgress, setUploadProgress] = useState(0); // Track the upload progress
>>>>>>> 7bf151b3634acdb69222326fa7747fe6f914e5ca

  // Constants for file validation
  const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20 MB
  const ACCEPTED_FILE_TYPES = ["image/jpeg", "image/png", "image/gif"];

  // Handle image upload
  const handleImageSubmit = (e) => {
    if (files.length > 0 && files.length + formData.imageUrls.length <= 6) {
      setUploading(true);
      setImageUploadError("");
      setUploadProgress(0);
      setUploadCompleted(false);
      setUploadSuccess(false);

      const promises = []; // Array to hold upload promises
      let totalBytes = 0;

      // Validate each file
      for (let i = 0; i < files.length; i++) {
        if (!ACCEPTED_FILE_TYPES.includes(files[i].type)) {
          setImageUploadError("Invalid file type. Please upload an image.");
          setUploading(false);
          return;
        }
        if (files[i].size > MAX_FILE_SIZE) {
          setImageUploadError("File size exceeds 20MB limit.");
          setUploading(false);
          return;
        }
        totalBytes += files[i].size;
        promises.push(storeImage(files[i])); // Add image to upload queue
      }

      // Simulate progress for better UX
      let simulatedProgress = 0;
      const progressInterval = setInterval(() => {
        simulatedProgress = Math.min(simulatedProgress + 5, 100);
        setUploadProgress(simulatedProgress);
        if (simulatedProgress === 100) {
          clearInterval(progressInterval);
        }
      }, 100);

      // Process all uploads
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setUploading(false);
          setUploadCompleted(true);
          setUploadSuccess(true);

          // Success notification timeout
          setTimeout(() => {
            setUploadSuccess(false);
          }, 3000);

          setFiles([]); // Reset files
          fileInputRef.current.value = null; // Clear file input
        })
        .catch(() => {
          setImageUploadError("Image upload failed.");
          setUploading(false);
        });
    } else {
      setImageUploadError("You can upload up to 6 images per listing.");
    }
  };

  // Store image in Firebase
  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = `${new Date().getTime()}-${file.name}`;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {},
        (error) => reject(error),
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  // Remove image from listing
  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
    setDeleteMessage("Image successfully deleted!");

    // Notification timeout
    setTimeout(() => {
      setDeleteMessage("");
    }, 3000);
  };

  // Update prices dynamically
  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle other input changes
  const handleChange = (e) => {
    const { id, type, checked, value } = e.target;

    if (id === "sale" || id === "rent") {
      // Ensure that only one of the two checkboxes is checked at a time
      setFormData((prevData) => ({
        ...prevData,
        type: checked ? id : "rent", // Set type to "sale" or "rent"
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [id]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log("Current User:", currentUser); // Safely log currentUser
    // console.log("Current User ID:", currentUser?.id); // Safely log currentUser.id
    // console.log(formData);

    if (!currentUser || !currentUser.id) {
      setError("User is not logged in or user ID is missing.");
      return;
    }

    try {
      if (formData.imageUrls.length < 1) {
        return setError("Please upload at least one image.");
      }
      if (+formData.regularPrice < formData.discountPrice) {
        return setError("Discount price must be lower than regular price.");
      }

      setLoading(true);
      setError(false);

      // Create the request body
      const requestBody = {
        ...formData,
        userRef: currentUser.id, // Ensure userRef is set correctly
      };
      // console.log("Request Body:", requestBody); // Log request body for debugging

      // Get the token (you can store it in localStorage or state)
      const token = localStorage.getItem("authToken");

      // Make the API request
      const res = await fetch("/api/listing/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Add the token here
        },
        body: JSON.stringify(requestBody),
      });

      const data = await res.json();
      setLoading(false);

      if (data.success === false) {
        setError(data.message);
        return;
      }

      navigate(`/listing/${data.id}`); // Redirect to listing page
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;

    if (id === "sale" || id === "rent") {
      setFormData({
        ...formData,
        type: id,
      });
    } else if (id === "parking" || id === "furnished" || id === "offer") {
      setFormData({
        ...formData,
        [id]: checked,
      });
    } else {
      setFormData({
        ...formData,
        [id]: type === "number" ? parseInt(value) : value,
      });
    }
  };

  const handleSubmit =async (e) => {
    e.preventDefault();
    try {
      if (formData.imageUrls.length < 1)
        return setError("You must upload at least on image");
      if (+formData.regularPrice < +formData.discountPrice)
        return setError("Discount price must be less than regular price");
      setLoading(true);
      setError(false);
      const res = await fetch("/api/listing/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser.id,
        }),
      });
      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        setError(data.message);
      }
      navigate(`/listing/${data.id}`);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  }

  return (
    <main className="p-6 rounded-lg shadow-xl max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold text-center text-gray-700 mb-6">
        Create a New Listing
      </h1>
<<<<<<< HEAD
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-6">
        {/* Form Section */}
        {/* Form Section */}
        <div className="flex flex-col gap-6 flex-1">
=======
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-4 flex-1">
>>>>>>> 7bf151b3634acdb69222326fa7747fe6f914e5ca
          <input
            type="text"
            placeholder="Listing Name"
            className="border p-4 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            id="name"
            maxLength="62"
            minLength="10"
            required
            onChange={handleChange}
            value={formData.name}
          />
          <textarea
            placeholder="Description"
            className="border p-4 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            id="description"
            required
            onChange={handleChange}
            value={formData.description}
          />
          <input
            type="text"
            placeholder="Address"
            className="border p-4 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            id="address"
            required
            onChange={handleChange}
            value={formData.address}
          />

<<<<<<< HEAD
          {/* Regular Price and Discount Price */}
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2 w-full sm:w-1/2 lg:w-1/3">
              <input
                type="number"
                name="regularPrice"
                placeholder="Regular Price"
                min="50"
                max="100000"
                value={formData.regularPrice}
                onChange={handlePriceChange}
                className="p-4 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
              <span>Regular Price</span>
            </div>
            {formData.offer && (
              <div className="flex items-center gap-2 w-full sm:w-1/2 lg:w-1/3">
                <input
                  type="number"
                  name="discountPrice"
                  placeholder="Discount Price"
                  min="0"
                  max="1000"
                  value={formData.discountPrice}
                  onChange={handlePriceChange}
                  className="p-4 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
                <span>Discount Price</span>
              </div>
            )}
          </div>

          {/* Bedrooms and Bathrooms */}
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2 w-full sm:w-1/2 lg:w-1/3">
              <input
                type="number"
                name="bedrooms"
                placeholder="Number of beds.."
                value={formData.bedrooms}
                onChange={handlePriceChange}
                className="p-4 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
              <span>Bedrooms</span>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-1/2 lg:w-1/3">
              <input
                type="number"
                name="bathrooms"
                placeholder="Number of baths.."
                value={formData.bathrooms}
                onChange={handlePriceChange}
                className="p-4 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
              <span>Bathrooms</span>
            </div>
          </div>

          {/* Sell, Rent, Parking, Furnished, Offer */}
          <div className="flex flex-wrap gap-6">
            <div className="flex gap-2 w-full sm:w-1/2 lg:w-1/3">
              <input
                type="checkbox"
                id="sale"
                className="w-5"
                onChange={handleChange}
                checked={formData.type === "sale"} // Only checked if the type is "sale"
              />
              <span>Sell</span>
            </div>
            <div className="flex gap-2 w-full sm:w-1/2 lg:w-1/3">
              <input
                type="checkbox"
                id="rent"
                className="w-5"
                onChange={handleChange}
                checked={formData.type === "rent"} // Only checked if the type is "rent"
              />
              <span>Rent</span>
            </div>

            <div className="flex gap-2 w-full sm:w-1/2 lg:w-1/3">
              <input
                type="checkbox"
                id="parking"
                className="w-5"
                onChange={handleChange}
                checked={formData.parking}
              />
              <span>Parking</span>
            </div>
            <div className="flex gap-2 w-full sm:w-1/2 lg:w-1/3">
              <input
                type="checkbox"
                id="furnished"
                className="w-5"
                onChange={handleChange}
                checked={formData.furnished}
              />
              <span>Furnished</span>
            </div>
            <div className="flex gap-2 w-full sm:w-1/2 lg:w-1/3">
              <input
                type="checkbox"
                id="offer"
                className="w-5"
                onChange={handleChange}
                checked={formData.offer}
              />
              <span>Offer</span>
            </div>
=======
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="sale"
                className="w-5"
                onChange={handleChange}
                checked={formData.type === "sale"}
              />
              <span>Sell</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="rent"
                className="w-5"
                onChange={handleChange}
                checked={formData.type === "rent"}
              />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="parking"
                className="w-5"
                onChange={handleChange}
                checked={formData.parking}
              />
              <span>Parking spot</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                className="w-5"
                onChange={handleChange}
                checked={formData.furnished}
              />
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="offer"
                className="w-5"
                onChange={handleChange}
                checked={formData.offer}
              />
              <span>Offer</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <input
                className="p-3 border border-gray-300 rounded-lg"
                type="number"
                id="bedrooms"
                min="1"
                max="10"
                required
                onChange={handleChange}
                value={formData.bedrooms}
              />
              <p>Beds</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                className="p-3 border border-gray-300 rounded-lg"
                type="number"
                id="bathrooms"
                min="1"
                max="10"
                required
                onChange={handleChange}
                value={formData.bathrooms}
              />
              <p>Baths</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                className="p-3 border border-gray-300 rounded-lg"
                type="number"
                id="regularPrice"
                min="50"
                max="10000000"
                required
                onChange={handleChange}
                value={formData.regularPrice}
              />
              <div className="flex flex-col items-center">
                <p>Regular Price</p>
                <span className="text-xs">($ / month)</span>
              </div>
            </div>
            {formData.offer && (
              <div className="flex items-center gap-2">
                <input
                  className="p-3 border border-gray-300 rounded-lg"
                  type="number"
                  id="discountPrice"
                  min="0"
                  max="10000000"
                  required
                  onChange={handleChange}
                  value={formData.discountPrice}
                />
                <div className="flex flex-col items-center">
                  <p>Discounted price</p>
                  <span className="text-xs">($ / month)</span>
                </div>
              </div>
            )}
>>>>>>> 7bf151b3634acdb69222326fa7747fe6f914e5ca
          </div>
        </div>

        {/* Image Upload Section */}
        <div className="flex flex-col gap-6 flex-1">
          <p className="font-semibold text-gray-700">
            Images:
            {imageUploadError ? (
              <span className="text-red-600 text-sm ml-2">
                {imageUploadError}
              </span>
            ) : uploadSuccess || deleteMessage ? (
              <span className="text-green-600 text-sm ml-2">
                {uploadSuccess ? "Image uploaded successfully!" : deleteMessage}
              </span>
            ) : (
              <span className="text-gray-500 ml-2">
                You can upload up to 6 images.
              </span>
            )}
          </p>

          <div className="flex gap-6">
            <input
              ref={fileInputRef}
              onChange={(e) => setFiles(e.target.files)}
              className="p-4 border border-gray-300 rounded w-full text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              type="file"
              id="images"
              accept="image/*"
              multiple
            />
            <button
              type="button"
              disabled={uploading}
              onClick={handleImageSubmit}
              className="p-4 text-white bg-indigo-600 rounded-lg uppercase hover:opacity-90 disabled:opacity-70"
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>

          {uploading && !uploadCompleted && (
            <div className="relative pt-4">
              <div className="flex mb-2 items-center justify-between">
                <span className="text-xs font-semibold text-teal-600">
                  Uploading Images
                </span>
                <span className="text-xs font-semibold text-teal-600">
                  {uploadProgress}% Complete
                </span>
              </div>
              <div className="w-full bg-teal-100 rounded-full">
                <div
                  className="bg-teal-600 text-xs font-semibold text-white text-center p-1 leading-none rounded-l-full"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url, index) => (
              <div
                key={index}
                className="flex justify-between p-4 bg-gray-200 rounded-lg items-center"
              >
                <img
                  src={url}
                  alt={`listing-${index}`}
                  className="w-24 h-24 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="p-3 text-red-700 rounded-lg uppercase hover:opacity-75"
                >
                  Delete
                </button>
              </div>
            ))}

          <button
            disabled={loading || uploading}
<<<<<<< HEAD
            className="p-4 bg-indigo-600 text-white rounded-lg uppercase hover:opacity-90 disabled:opacity-70"
            type="submit"
          >
            {loading ? "Creating...." : "Create Listing"}
=======
            className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
            type="submit"
          >
            {loading ? "Creating..." : "Create Listing"}
>>>>>>> 7bf151b3634acdb69222326fa7747fe6f914e5ca
          </button>
          {error && <p className="text-red-700 text-sm">{error}</p>}
        </div>
      </form>
    </main>
  );
}
