// components/ColorForm.js
import { useState } from "react";

const CustomForm = () => {
  const [formData, setFormData] = useState({
    mainBg: "",
    mainText: "",
    secondaryBg: "",
    titleText: "",
    hoverOne: "",
    hoverTwo: "",
  });
  const [rpc, setRpc] = useState("");
  const [file, setFile] = useState(null);

  const handleChangeRPC = (e) => {
    setRpc(e.target.value);
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Send data to the server
    const response = await fetch("/api/update-colors", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      // Handle successful response
      alert("Colors updated successfully!");
    } else {
      // Handle error
      alert("Error updating colors.");
    }
  };
  const handleSubmitRPC = async (e) => {
    e.preventDefault();

    // Send data to the server
    const response = await fetch("/api/update-rpc", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ rpc }),
    });

    if (response.ok) {
      // Handle successful response
      alert("RPC URL updated successfully!");
    } else {
      // Handle error
      alert("Error updating RPC URL.");
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmitFile = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/update-logo", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      alert("Logo updated successfully!");
    } else {
      alert("Error updating logo.");
    }
  };

  return (
    <div>
      <div>
        <h1 className="leading-7 font-bold text-3xl mb-2">
          1. Change Theme Colors
        </h1>
        <p className="mb-6 text-hover-two">
          {" "}
          Please Provide Hex Codes eg:#ffffff{" "}
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-md">
          <label>
            Main Background Color:
            <input
              type="text"
              name="mainBg"
              value={formData.mainBg}
              onChange={handleChange}
              className="bg-secondary-bg rounded-lg px-4 py-2 ml-4 outline-none"
              placeholder="#1e1924"
            />
          </label>
          <label>
            Main Text Color:
            <input
              type="text"
              name="mainText"
              value={formData.mainText}
              onChange={handleChange}
              className="bg-secondary-bg rounded-lg px-4 py-2 ml-4 outline-none"
              placeholder="#b2aacd"
            />
          </label>
          <label>
            Secondary Background Color:
            <input
              type="text"
              name="secondaryBg"
              value={formData.secondaryBg}
              onChange={handleChange}
              className="bg-secondary-bg rounded-lg px-4 py-2 ml-4 outline-none"
              placeholder="#483c58"
            />
          </label>
          <label>
            Title Text Color:
            <input
              type="text"
              name="titleText"
              value={formData.titleText}
              onChange={handleChange}
              className="bg-secondary-bg rounded-lg px-4 py-2 ml-4 outline-none"
              placeholder="#a78bfa"
            />
          </label>
          <label>
            Hover One Color:
            <input
              type="text"
              name="hoverOne"
              value={formData.hoverOne}
              onChange={handleChange}
              className="bg-secondary-bg rounded-lg px-4 py-2 ml-4 outline-none"
              placeholder="#5a4c6b "
            />
          </label>
          <label>
            Hover Two Color:
            <input
              type="text"
              name="hoverTwo"
              value={formData.hoverTwo}
              onChange={handleChange}
              className="bg-secondary-bg rounded-lg px-4 py-2 ml-4 outline-none"
              placeholder="#ab82ae"
            />
          </label>
          <button
            type="submit"
            className="bg-title-text w-[20%] p-3 rounded-lg mt-4 text-white font-bold"
          >
            Update Colors
          </button>
        </form>
      </div>
      <div className="flex justify-between">
        <div className="mt-8">
          <h1 className="leading-7 font-bold text-3xl mb-2">2. Change Logo</h1>
          <p className="mb-6 text-hover-two">
            {" "}
            Currently the Best Way is to replace logo.png in the public folder
          </p>
          <form
            onSubmit={handleSubmitFile}
            className="flex flex-col gap-4 text-md"
          >
            <label>
              Logo Png file:
              <input
                type="file"
                accept="image/png"
                onChange={handleFileChange}
                className="bg-secondary-bg rounded-lg px-4 py-2 ml-4 outline-none"
                placeholder="logo.png"
              />
            </label>
            {/* <label>
              Icon .ico FIle:
              <input
                type="text"
                name="mainText"
                value={formData.mainText}
                onChange={handleChange}
                className="bg-secondary-bg rounded-lg px-4 py-2 ml-4 outline-none"
                placeholder="logo.ico"
              />
            </label> */}

            <button
              type="submit"
              className="bg-title-text w-[50%] p-3 rounded-lg mt-4 text-white font-bold"
            >
              Update Logo (Not working)
            </button>
          </form>
        </div>
        <div className="mt-8">
          <h1 className="leading-7 font-bold text-3xl mb-2">
            3. Change RPC URL
          </h1>
          <p className="mb-6 text-hover-two">
            {" "}
            Please Provide RPC URL to update{" "}
          </p>
          <form
            onSubmit={handleSubmitRPC}
            className="flex flex-col gap-4 text-md"
          >
            <label>
              YOUR RPC URL
              <input
                type="text"
                name="mainBg"
                value={rpc}
                onChange={handleChangeRPC}
                className="bg-secondary-bg rounded-lg px-4 py-2 ml-4 outline-none"
                placeholder="solana.my-rpc.mainnet.com"
              />
            </label>

            <button
              type="submit"
              className="bg-title-text w-[50%] p-3 rounded-lg mt-4 text-white font-bold"
            >
              Update RPC URL
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CustomForm;
