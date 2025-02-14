import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

function NavBar() {
  return (
    <div className="flex text-main-text bg-main-bg  p-2 justify-between items-center border-b border-gray-800 sticky top-0 z-50">
      {/* <div className="border-l bg-slate-900 border-gray-200 p-4 "> */}
      <div className="px-4 text-sm flex items-center">
        <p className="min-w-[40%] mr-6"> Welcome to OpenDex, User !!!</p>
        <div className="flex items-center  h-12 w-[20vw] px-4 rounded-lg bg-secondary-bg hover:bg-hover-one  transition-all duration-200 cursor-pointer">
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
        </div>
      </div>
      <div className="flex">
        <WalletMultiButton className="bg-violet-500" />
      </div>

      {/* </div> */}
    </div>
  );
}

export default NavBar;
