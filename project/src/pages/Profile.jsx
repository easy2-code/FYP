import { useSelector, useDispatch } from "react-redux";
import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserStart,
} from "../redux/user/userSlice";
import { app } from "../firebase";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";

export default function Profile() {
  const fileRef = useRef(null);
  const { currentUser } = useSelector((state) => state.user); // Access current user from Redux state
  const dispatch = useDispatch();

  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const [formData, setFormData] = useState({});
  const [message, setMessage] = useState(""); // New state to hold the success message
  const [loading, setLoading] = useState(false); // State to track loading status
  const [listings, setListings] = useState([]); // State to store user listings
  const [showListings, setShowListings] = useState(false); // State to toggle the display of listings

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  // Fetch user listings when the "Show Listings" button is clicked
  const handleShowListings = async () => {
    try {
      const res = await fetch(`/api/user/listings/${currentUser.id}`);
      const data = await res.json();

      // Log the response to see the structure of the data
      console.log(data);

      // Ensure the data contains an array of listings and set it to state
      if (Array.isArray(data) && data.length > 0) {
        setListings(data); // Set listings as the response array
        setShowListings(true);
      } else {
        setMessage("No listings available.");
        setListings([]); // Clear listings if none are available
        setShowListings(false);
      }
    } catch (error) {
      setMessage("Error fetching listings.");
      setListings([]); // Clear listings in case of error
    }
  };

  const handleFileUpload = (file) => {
    setShowProgress(true);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setTimeout(() => {
          setFilePerc(Math.round(progress));
        }, 300);
      },
      (error) => {
        setFileUploadError(true);
        setShowProgress(false);
      },
      () => {
        setTimeout(() => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setFormData({ ...formData, avatar: downloadURL });
            setShowProgress(false);
            setFilePerc(0);
          });
        }, 500);
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // Function for upating user profile
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when form is submitted

    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        setLoading(false); // Stop loading on failure
        return;
      }
      dispatch(updateUserSuccess(data));
      setMessage("Profile Updated Successfully");

      // Set a timeout to hide the message after 3 seconds
      setTimeout(() => {
        setMessage("");
      }, 3000);

      setLoading(false); // Stop loading after the success
    } catch (error) {
      dispatch(updateUserFailure(error.message));
      setLoading(false); // Stop loading on error
    }
  };

  // Deleting user account
  const handleDeleteUser = async () => {
    const confirmation = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone!"
    );
    if (!confirmation) return;
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
      alert("Account deleted successfully. Redirecting...");
      // Redirect user after account deletion
      window.location.replace("/sign-up");
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  // Sign Out function
  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch("/api/auth/signout");
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
      window.location.replace("/sign-in"); // Redirect to the sign-in page
    } catch (error) {
      dispatch(deleteUserFailure(data.message));
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          name="profile"
          id="profile"
          ref={fileRef}
          hidden
          accept="image/*"
        />
        <img
          src={formData.avatar || currentUser.avatar}
          alt="profile"
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
          onClick={() => fileRef.current.click()}
        />

        {showProgress && (
          <>
            <div className="relative mt-2 w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="absolute h-full bg-blue-500 transition-all duration-300"
                style={{ width: `${filePerc}%` }}
              ></div>
            </div>
            <p className="text-sm self-center mt-1 text-gray-600">
              Uploading {filePerc}%...
            </p>
          </>
        )}
        {fileUploadError && (
          <p className="text-sm self-center mt-1 text-red-700">
            Error: Image upload failed (image must be less than 2 MB).
          </p>
        )}
        {!fileUploadError && filePerc === 100 && (
          <p className="text-sm self-center mt-1 text-green-700">
            Image Successfully Uploaded!
          </p>
        )}

        <input
          type="text"
          placeholder="Username"
          id="username"
          className="border p-3 rounded-lg"
          defaultValue={currentUser.username}
          onChange={handleChange}
        />
        <input
          type="email"
          placeholder="Email"
          id="email"
          className="border p-3 rounded-lg"
          defaultValue={currentUser.email}
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="Password"
          id="password"
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80 flex items-center justify-center gap-2"
        >
          {loading ? (
            <svg
              className="animate-spin h-5 w-5 border-t-2 border-white rounded-full"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="12" r="10" stroke="none" fill="none" />
            </svg>
          ) : (
            "Update Profile"
          )}
          {loading && <span>Loading...</span>}
        </button>
        <Link
          className="bg-blue-800 text-white p-3 rounded-lg uppercase text-center hover:opacity-95"
          to={"/create-listing"}
        >
          Create Listing
        </Link>
      </form>

      <div className="flex justify-between mt-5">
        <span
          onClick={handleDeleteUser}
          className="text-white bg-red-700 hover:bg-red-800 transition-colors duration-300 py-2 px-4 rounded-lg cursor-pointer font-semibold text-sm flex items-center gap-2"
        >
          <svg
            className="h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 4H8l-1 1H3v2h1l1 14h10l1-14h1V5h-3l-1-1z" />
          </svg>
          Delete Account
        </span>

        <span
          className="text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-300 py-2 px-4 rounded-lg cursor-pointer font-semibold text-sm flex items-center gap-2"
          onClick={handleSignOut}
        >
          <svg
            className="h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M16 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z" />
            <path d="M10 12l2-2 2 2" />
          </svg>
          Sign Out
        </span>
      </div>

      {/* Success message */}
      {message && (
        <div className="text-green-700 py-7 rounded-lg">{message}</div>
      )}

      <div className="mt-8">
        <button
          onClick={handleShowListings}
          className="bg-blue-800 text-white p-3 rounded-lg uppercase text-center hover:opacity-95 w-full"
        >
          Show My Listings
        </button>

        {showListings && listings.length > 0 ? (
          <div className="mt-5 bg-black bg-opacity-10 p-1 rounded-lg">
            <ul>
              {listings.map((listing) => (
                <li
                  key={listing.id}
                  className="my-4 p-4 bg-white rounded-lg shadow-lg"
                >
                  {/* Listing Details */}
                  <div className="mb-4">
                    <h3 className="text-xl font-semibold text-gray-800">
                      {listing.name}
                    </h3>
                    <p className="text-gray-600">{listing.description}</p>
                    <p className="text-gray-800 font-medium">
                      Price: ${listing.regularPrice}
                    </p>
                    <p className="text-gray-800 font-medium">
                      Type: {listing.type}
                    </p>
                  </div>

                  {/* Images and Buttons */}
                  <div className="space-y-4">
                    {listing.imageUrls &&
                      JSON.parse(listing.imageUrls).map((url, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-4"
                        >
                          {/* Image Section */}
                          <img
                            src={url}
                            alt={`listing-image-${index}`}
                            className="w-32 h-32 object-cover rounded-md"
                          />
                          {/* Edit and Delete Buttons */}
                          <div className="ml-auto flex flex-col space-y-3">
                            <button className="bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600">
                              Edit
                            </button>
                            <button className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600">
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-center text-gray-500">{message}</p>
        )}
      </div>
    </div>
  );
}
