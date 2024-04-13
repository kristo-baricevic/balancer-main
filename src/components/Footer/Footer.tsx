// Footer.js

import { useState } from "react";
import { Link } from "react-router-dom";
import "../../App.css"; // Import the common Tailwind CSS styles

function Footer() {
  const [isPressed, setIsPressed] = useState(false);

  const handleMouseDown = () => setIsPressed(true);
  const handleMouseUp = () => setIsPressed(false);

  return (
    // <div className="xl:px-50 mx-auto hidden h-20 items-center justify-between border-t border-gray-300 bg-white  px-4 sm:px-6 md:px-8 lg:flex lg:px-8 2xl:px-56">
    <div className=" mt-20 flex w-full border-t border-gray-300  ">
      {/* <div className="footer-content footer-content mr-5 mt-5 rounded-md border-l border-r border-t border-gray-300 "> */}{" "}
      {/* Added mt-5 and mr-5 */}
      <footer className=" font_body mt-10 w-full ">
        <div className="m-auto  grid max-w-[900px] grid-cols-2 flex-wrap items-center justify-between gap-5 px-5 py-3 md:grid-cols-5 md:py-12">
          <Link
            to="/"
            className=" flex justify-center text-black hover:border-blue-600 hover:text-blue-600 hover:no-underline"
          >
            Home
          </Link>
          <Link
            to='/'
            onClick={(e) => {
                window.location.href = 'mailto:balancerteam@codeforphilly.org';
                e.preventDefault();
            }}
            className="flex justify-center text-black hover:border-blue-600 hover:text-blue-600 hover:no-underline"
          >
            Contact us
          </Link>
          <Link
            to="/about"
            className="flex justify-center text-black hover:border-blue-600 hover:text-blue-600 hover:no-underline"
          >
            About
          </Link>
          <Link
            to="/feedback"
            className="flex justify-center text-black hover:border-blue-600 hover:text-blue-600 hover:no-underline"
          >
            Leave feedback
          </Link>
          <Link
            to="/help"
            className="flex justify-center text-black hover:border-blue-600 hover:text-blue-600 hover:no-underline"
          >
            Help
          </Link>
        </div>

        <div className="mb-8 mt-8 flex items-center justify-center">
          <div className=" rounded  px-2 py-2 ">
            <input
              type="email"
              id="email"
              className="input md:w-[570px]"
              placeholder="Subscribe to our newsletter for the latest updates and insights."
            />
          </div>
          <div className="ml-2 ">
            <button
              type="submit"
              className={`btnBlue ${
                isPressed &&
                "transition-transform focus:outline-none focus:ring focus:ring-blue-200"
              }`}
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
            >
              {isPressed ? (
                <div className="flex items-center justify-center">
                  <div className="mr-2 h-4 w-4 animate-ping rounded-full bg-white"></div>
                  <p>Loading...</p>
                </div>
              ) : (
                <p>Subscribe</p>
              )}
            </button>
          </div>
        </div>
        <div className="flex justify-center rounded  px-4 py-2 ">
          © 2024 Balancer. All rights reserved.
        </div>
      </footer>
    </div>
    // </div>
  );
}

export default Footer;
