// for icons
import { FaSearch } from "react-icons/fa";
// link is going to bring us from one page to another page without refreshing the page
import { Link } from "react-router-dom";

export default function Header() {
  return (
    // Create Header component start
    <header className="bg-slate-200 shadow-md">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        {/* logo of our project  start*/}
        <Link to="/">
          <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
            <span className="text-slate-500">Artic</span>
            <span className="text-slate-700">Estate</span>
          </h1>
        </Link>
        {/* logo of our project  end*/}

        {/* search bar of header component  start*/}
        <form className="bg-slate-100 p-3 rounded-lg flex items-center">
          <input
            type="text"
            name="search"
            id="search"
            placeholder="search.... "
            className="bg-transparent focus: outline-none w-24 sm:w-64"
          />
          <FaSearch className="text-slate-600" />
        </form>
        {/* search bar of header component  end*/}

        {/* Navbars start */}
        <ul className="flex gap-4 ">
          <Link to="">
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
            <li className="text-slate-700 hover:underline">Sign in</li>
          </Link>
        </ul>
        {/* Navbars end */}
      </div>
    </header>
    // Create Header component start
  );
}