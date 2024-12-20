import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState(null); // State for validation error message
  const navigate = useNavigate();

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });

    // Clear validation error when the user starts typing
    if (validationError && e.target.value) {
      setValidationError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // If there's already an error, do not continue with form submission
    if (error) {
      setError(null); // Clear error to allow a new submission attempt
    }

    // Validate required fields
    if (!formData.email || !formData.password) {
      setValidationError("All fields are required.");
      return;
    }

    try {
      setLoading(true);
      setError(null); // Clear previous errors before submission

      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success === false) {
        setError(data.message); // Show "User not found!" or other error messages
        setLoading(false);
        return;
      }

      setLoading(false);
      navigate("/"); // Navigate to home page on successful sign-in
    } catch (error) {
      setLoading(false);
      setError(error.message); // Handle other unexpected errors (e.g., network issues)
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign In</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          name="email"
          id="email"
          placeholder="Email"
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          id="password"
          placeholder="Password"
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        <button
          disabled={loading}
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80 flex items-center justify-center gap-2"
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
            "Sign In"
          )}
          {loading && <span>Loading...</span>}
        </button>
      </form>
      <div className="flex gap-2 mt-5">
        <p>Don't have an account?</p>
        <Link to={"/sign-up"}>
          <span className="text-blue-700">Sign up</span>
        </Link>
      </div>

      {/* Validation error message for empty fields */}
      {validationError && !error && (
        <p className="text-red-500 mt-5">{validationError}</p>
      )}

      {/* General error message (e.g., User not found) */}
      {error && <p className="text-red-500 mt-5">{error}</p>}
    </div>
  );
}
