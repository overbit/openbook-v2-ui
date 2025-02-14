import { useState } from "react";
import CustomForm from "../components/CustomForm";

export default function customisation() {
  const [type, setType] = useState("manual");
  return (
    <>
      <div className="p-4 h-screen text-main-text mb-32">
        <div className="space-y-12">
          <div className="border-b border-gray-900/10 p-5">
            <h2 className="leading-7 font-bold text-5xl text-title-text mb-4">
              Customize your Application
            </h2>

            <p className="mt-1 text-sm leading-6 text-grey-600 w-[70%] mb-8">
              Customize your application logo, colors, and RPC links from here.
            </p>
            <div className="flex gap-4 mb-4">
              <button
                onClick={() => setType("manual")}
                className={`${
                  type == "manual" ? "bg-hover-one" : "bg-secondary-bg"
                } px-8 py-2  rounded-lg hover:bg-hover-one hover:text-hover-two`}
              >
                Manual Customisation
              </button>
              <button
                onClick={() => setType("auto")}
                className={`${
                  type == "auto" ? "bg-hover-one" : "bg-secondary-bg"
                } px-8 py-2 rounded-lg hover:bg-hover-one hover:text-hover-two`}
              >
                Automatic Customisation
              </button>
            </div>
            <div className={`${type == "manual" ? "block" : "hidden"}`}>
              <div className="mb-12">
                <h2 className="text-4xl font-semibold mb-4 text-gray-300">
                  Step 1: Change Theme Colors
                </h2>

                <p className="mb-4">
                  It's the easiest step here. Just go to
                  <span className="font-bold italic"> tailwind.config.js </span>
                  and find the colors section. Change the given 6 colors to
                  whatever theme you have in mind.
                </p>

                <h4 className="text-2xl underline mb-3 ">
                  The colors are as follows:
                </h4>
                <ul className="p-8 bg-secondary-bg rounded-lg">
                  <li>i. main-bg: The main background color</li>
                  <li>ii. main-text: The color of the current text</li>
                  <li>
                    iii. secondary-bg: The background color of the search bar
                    above
                    <span className="text-secondary-bg"> This one</span>
                  </li>
                  <li>
                    iv. title-text: The color of the title above
                    <span className="text-title-text"> This one</span>
                  </li>
                  <li>
                    v. hover-one: The main hover option
                    <span className="text-hover-one"> This one</span>
                  </li>
                  <li>
                    vi. hover-two: The secondary hover option
                    <span className="text-hover-two"> This one</span>
                  </li>
                </ul>

                <p className="mt-4 text-xs pl-12">
                  <span className="italic font-bold">NOTE:</span> The color of
                  the wallet is currently uncustomizable and will require some
                  time to patch.
                </p>
              </div>

              <div className="mb-12">
                <h2 className="text-4xl font-semibold mb-4 text-gray-300">
                  Step 2: Change Logo and Favicon
                </h2>

                <p className="mb-4">
                  It's also very easy. Just go to the
                  <span className="font-bold italic"> public folder</span> and
                  follow these 2 steps:
                </p>

                <div className="p-8 rounded-lg bg-secondary-bg">
                  <h3 className="pl-8">
                    i. Delete the existing logo.png and favicon.ico files
                  </h3>
                  <h3 className="pl-8">
                    ii. Add your logo as png and ico files and name them
                    logo.png and favicon.ico
                  </h3>
                </div>
                <h3 className="mt-3">And Voila!! You are done...</h3>
              </div>

              <div className="mb-12">
                <h2 className="text-4xl font-semibold mb-4 text-gray-300">
                  Step 3: Change RPC URL
                </h2>

                <h3 className="p-8 rounded-lg bg-secondary-bg">
                  Go to the
                  <span className="italic font-bold"> utils</span> folder and
                  change the
                  <span className="text-gray-200 italic underline">
                    {" "}
                    const RPC = "to your own RPC URL"
                  </span>
                </h3>
              </div>
            </div>
            <div className={`${type == "auto" ? "block" : "hidden"}`}>
              <CustomForm />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// objective
// 1. logo customisation
// 2. color customisaiton
// 3. RPC customisation
