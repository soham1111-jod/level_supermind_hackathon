import React, { useState } from "react";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 flex w-full items-center bg-gray-100 dark:bg-gray-900 shadow-lg">
      <div className="container mx-auto px-6 py-3">
        <div className="relative flex items-center justify-between">
          {/* Logo */}
          <div className="w-48">
            <a href="/#" className="block">
              <img
                src="https://cdn.tailgrids.com/2.0/image/assets/images/logo/logo-primary.svg"
                alt="logo"
                className="dark:hidden"
              />
              {/* <img
              src=""
              alt="logo"
              className="hidden dark:block"
               /> */}
              <h1 className="text-xl font-bold dark: text-blue-500">BYTE BANDITS</h1>
            </a>
          </div>
          {/* Links and Buttons */}
          <div className="flex items-center">
            <button
              onClick={() => setOpen(!open)}
              id="navbarToggler"
              className={`${open && "navbarTogglerActive"
                } lg:hidden focus:outline-none`}
            >
              <span className="block h-0.5 w-6 bg-gray-800 dark:bg-gray-200 mb-1 transition-transform"></span>
              <span className="block h-0.5 w-6 bg-gray-800 dark:bg-gray-200 mb-1"></span>
              <span className="block h-0.5 w-6 bg-gray-800 dark:bg-gray-200"></span>
            </button>
            <nav
              id="navbarCollapse"
              className={`${open ? "block" : "hidden"
                } lg:flex items-center space-x-6`}
            >
              <ul className="flex flex-col lg:flex-row items-center text-gray-800 dark:text-gray-200">
                {/* <ListItem NavLink="/#">Home</ListItem> */}
                {/* {/* <ListItem NavLink="/#">Payment</ListItem>
              <ListItem NavLink="/#">About</ListItem> */}
              </ul>
              <div className="mt-4 lg:mt-0 lg:flex lg:space-x-10">
                {/* <a
                href="/#"
                className="text-gray-800 dark:text-gray-200 hover:text-blue-600 transition"
              >
                Sign in
              </a> */}
                {/* <a
                  href="/#"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                >
                  Sign Up
                </a> */}
              </div>
            </nav>
          </div>
        </div>
      </div>
    </header>

  );
};

export default Navbar;

const ListItem = ({ children, NavLink }) => {
  return (
    <li>
      <a
        href={NavLink}
        className="flex py-2 text-base font-medium text-body-color hover:text-dark dark:text-dark-6 dark:hover:text-white lg:ml-12 lg:inline-flex"
      >
        {children}
      </a>
    </li>
  );
};