import React from "react";
import { useRouter } from "next/router";

function Sidebar() {
  const router = useRouter();
  const isActivePath = (path) => router.pathname === path;

  return (
    <div className="w-1/6 md:w-1/12 lg:w-1/6  font-raleway font-semibold border-r border-gray-800 ">
      <div className="flex flex-col items-center  h-screen overflow-hidden text-main-text ">
        <a className="flex items-center w-full px-3 mt-3 h-12" href="/">
          <img className="w-8 h-8 rounded-full" src="./logo.png"></img>
          <span className="hidden lg:block ml-2 text-xl font-bold font-raleway text-white">
            OpenDex
          </span>
        </a>
        <div className="w-full px-2 transition-all duration-200">
          <div className="flex flex-col items-center w-full mt-3 border-t border-gray-700">
            <a
              className={`flex items-center w-full h-12 px-3 mt-2 rounded ${
                isActivePath("/") ? "bg-secondary-bg text-title-text" : ""
              } hover:bg-secondary-bg hover:text-title-text transition-all duration-200`}
              href="/"
            >
              <svg
                className="w-6 h-6 stroke-current"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              <span className="ml-2 text-sm hidden lg:block">Markets</span>
            </a>
            <a
              className="flex items-center w-full h-12 px-3 mt-2 rounded hover:bg-secondary-bg hover:text-title-text transition-all duration-200"
              href="#"
            >
              <svg
                className="w-6 h-6 stroke-current"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <span className="ml-2 text-sm font-semibold hidden lg:block">
                Search
              </span>
            </a>
            <a
              className={`flex items-center w-full h-12 px-3 mt-2 rounded ${
                isActivePath("/create_market")
                  ? "bg-secondary-bg text-title-text"
                  : ""
              } hover:bg-secondary-bg hover:text-title-text transition-all duration-200`}
              href="/create_market"
            >
              <svg
                className="w-6 h-6 stroke-current"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span className="ml-2 text-sm font-semibold hidden lg:block">
                Create Market{" "}
              </span>
            </a>
            <a
              className="flex items-center w-full h-12 px-3 mt-2 rounded hover:bg-secondary-bg hover:text-title-text transition-all duration-200"
              href="https://neif.org"
              target="_blank"
            >
              <svg
                className="w-6 h-6 stroke-current"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"
                />
              </svg>
              <span className="ml-2 text-sm font-semibold hidden lg:block">
                Docs
              </span>
            </a>
          </div>
          <div className="flex flex-col items-center w-full mt-2 border-t border-gray-700">
            <a
              className="flex items-center w-full h-12 px-3 mt-2 rounded hover:bg-secondary-bg hover:text-title-text transition-all duration-200"
              href="/comingsoon"
            >
              <svg
                className="w-6 h-6 stroke-current"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <span className="ml-2 text-sm font-semibold hidden lg:block">
                Products
              </span>
            </a>

            {/* REMOVE THIS CODE AFTER YOUR CUSTOMISATION  */}
            {/* START HERE */}
            <a
              className={`flex items-center w-full h-12 px-3 mt-2 rounded ${
                isActivePath("/customisation")
                  ? "bg-secondary-bg text-title-text"
                  : ""
              } hover:bg-secondary-bg hover:text-title-text transition-all duration-200`}
              href="/customisation"
            >
              <svg
                className="w-6 h-6 stroke-current"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                />
              </svg>
              <span className="ml-2 text-sm font-semibold hidden lg:block">
                Customize
              </span>
            </a>
            {/* REMOVE THIS CODE AFTER YOUR CUSTOMISATION  */}
            {/* END HERE */}
            <a
              className="relative flex items-center w-full h-12 px-3  rounded hover:bg-secondary-bg hover:text-title-text transition-all duration-200"
              href="/comingsoon"
            >
              <svg
                className="w-6 h-6 stroke-current"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                />
              </svg>
              <span className="ml-2 text-sm font-semibold hidden lg:block">
                Messages
              </span>
              <span className="absolute top-0 left-0 w-2 h-2 mt-2 ml-2 bg-indigo-500 rounded-full"></span>
            </a>
          </div>
        </div>
        <a
          className="flex items-center justify-center w-full h-16 mt-auto bg-secondary-bg hover:text-title-text cursor-pointer transition-all duration-200"
          href="#"
        >
          <svg
            className="w-6 h-6 stroke-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="ml-2 text-sm font-bold hidden lg:block">
            Account
          </span>
        </a>
      </div>
    </div>
  );
}

export default Sidebar;
