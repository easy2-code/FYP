import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setLoading(true);
      setError(null); // Clear previous errors before submission

      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success == false) {
        setError(data.message);
        setLoading(false);
        response;
        return;
      }

      setLoading(false);
      // if eveything is ok then navigate to sign in page
      navigate("/sign-in");
      // console.log(data);
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto sm:max-w-md md:max-w-lg lg:max-w-xl">
      <h1 className="text-3xl text-center font-semibold my-7">Sign Up</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label htmlFor="username" className="text-lg font-medium">
          Username
        </label>
        <input
          type="text"
          name="username"
          id="username"
          placeholder="Enter your username"
          className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          onChange={handleChange}
        />
        <label htmlFor="email" className="text-lg font-medium">
          Email
        </label>
        <input
          type="email"
          name="email"
          id="email"
          placeholder="Enter your email"
          className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          onChange={handleChange}
        />
        <label htmlFor="password" className="text-lg font-medium">
          Password
        </label>
        <input
          type="password"
          name="password"
          id="password"
          placeholder="Enter your password"
          className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          onChange={handleChange}
        />
        <button
          disabled={loading}
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "Loading..." : "Sign Up"}
        </button>
      </form>
      <div className="flex gap-2 mt-5">
        <p>Have an account?</p>
        <Link to={"/sign-in"}>
          <span className="text-blue-700 underline hover:text-blue-500">
            Sign in
          </span>
        </Link>
      </div>
      {error && <p className="text-red-500 mt-5">{error}</p>}
    </div>
  );
}
