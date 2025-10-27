import { Link } from "react-router-dom";
import ThemeSwitcher from "../common/ThemeSwitcher.jsx";

const GuestNavbar = () => {
  return (
    <div className="navbar bg-base-100 fixed top-0 z-50 shadow-md">
      <div className="navbar-start">
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </label>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li>
              <Link to="/">Home</Link>
            </li>
          </ul>
        </div>
        <Link to="/" className="btn btn-ghost normal-case text-xl">
          <img
            src="/logo.png"
            alt="TurfSpot"
            className="h-10 w-10 mask mask-squircle"
          />
          TurfSpot
        </Link>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li>
            <Link to="/">Home</Link>
          </li>
        </ul>
      </div>
      <div className="navbar-end gap-2">
        <ThemeSwitcher />
        <Link to="/login" className="btn btn-ghost gap-2">
          {/*<svg*/}
          {/*  xmlns="http://www.w3.org/2000/svg"*/}
          {/*  className="h-5 w-5"*/}
          {/*  fill="none"*/}
          {/*  viewBox="0 0 24 24"*/}
          {/*  stroke="currentColor"*/}
          {/*>*/}
          {/*  <path*/}
          {/*    strokeLinecap="round"*/}
          {/*    strokeLinejoin="round"*/}
          {/*    strokeWidth="2"*/}
          {/*    d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"*/}
          {/*  />*/}
          {/*</svg>*/}
          <span className="max-sm:hidden">Đăng nhập</span>
        </Link>
        <Link to="/signup" className="btn btn-primary gap-2">
          {/*<svg*/}
          {/*  xmlns="http://www.w3.org/2000/svg"*/}
          {/*  className="h-5 w-5"*/}
          {/*  fill="none"*/}
          {/*  viewBox="0 0 24 24"*/}
          {/*  stroke="currentColor"*/}
          {/*>*/}
          {/*  <path*/}
          {/*    strokeLinecap="round"*/}
          {/*    strokeLinejoin="round"*/}
          {/*    strokeWidth="2"*/}
          {/*    d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"*/}
          {/*  />*/}
          {/*</svg>*/}
          <span className="max-sm:hidden">Đăng ký</span>
        </Link>
      </div>
    </div>
  );
};

export default GuestNavbar;
