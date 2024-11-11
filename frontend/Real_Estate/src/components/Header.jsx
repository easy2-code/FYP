import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaSearch } from "react-icons/fa";

export default function Header() {
  const [displayedText, setDisplayedText] = useState("Real Estate");
  // Text variations
  const morphText = [
    "Real Estate",
    "Property Hub",
    "Dream Homes",
    "Luxury Estates",
  ];
  // Increased duration for each text display (adjusted to 4000 ms)
  const morphDuration = 4000;
  // Increased fade duration for slower fade in/out
  const fadeDuration = 700;
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    let index = 0;
    const morphInterval = setInterval(() => {
      // Start fading out
      setIsVisible(false);
      setTimeout(() => {
        setDisplayedText(morphText[index]);
        // Fade in new text
        setIsVisible(true);
        // Cycle through text
        index = (index + 1) % morphText.length;
      }, fadeDuration); // Time to wait before showing new text
    }, morphDuration);
    // Cleanup on unmount
    return () => clearInterval(morphInterval);
  }, []);

  return (
    <header className="bg-slate-200 shadow-md text-black-500">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <Link to="/" className="flex-shrink-0">
          <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
            <span
              style={{
                opacity: isVisible ? 1 : 0,
                transition: `opacity ${fadeDuration}ms ease`,
                display: "inline-block",
                width: "200px", // Fixed width for the animated text
              }}
            >
              {displayedText}
            </span>
          </h1>
        </Link>

        <form className="bg-slate-100 p-3 rounded-lg flex items-center ml-4">
          <input
            type="text"
            placeholder="Search...."
            className="bg-transparent focus:outline-none w-24 sm:w-64"
          />
          <FaSearch className="text-slate-600" />
        </form>

        <ul className="flex gap-4">
          <Link to="/">
            <li className="hidden sm:inline text-slate-700 hover:underline">
              Home
            </li>
          </Link>
          <Link to="/about">
            <li className="hidden sm:inline text-slate-700 hover:underline">
              About
            </li>
          </Link>
          <Link to="/sign-in">
            <li className="sm:inline text-slate-700 hover:underline">
              Sign in
            </li>
          </Link>
        </ul>
      </div>
    </header>
  );
}
