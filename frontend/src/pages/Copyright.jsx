import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Copyright = () => {
  return (
    <div className="h-screen flex bg-[#0b1220] overflow-hidden">
      
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">

        {/* Navbar */}
        <div className="h-16">
          <Navbar />
        </div>

        {/* Body */}
        <div className="flex-1 p-4 bg-[#111827] flex flex-col overflow-hidden">



          {/* Main Content Area (Dark Gradient) */}
          <div className="flex-1 rounded-md shadow bg-gradient-to-b from-[#0f172a] to-[#020617] border border-white/10 p-8 overflow-y-auto w-full text-gray-300">
            <h1 className="text-3xl font-bold text-white mb-6">Copyright Notice</h1>
            
            <p className="mb-4">
              &copy; {new Date().getFullYear()} PrepAI. All rights reserved.
            </p>

            <h2 className="text-xl font-semibold text-white mt-8 mb-4">1. Ownership of Content</h2>
            <p className="mb-4">
              All content available on the PrepAI platform, including but not limited to text, graphics, logos, icons, images, audio clips, video clips, data compilations, and software (collectively, the "Content"), is the exclusive property of PrepAI or its content suppliers and is protected by international copyright laws.
            </p>

            <h2 className="text-xl font-semibold text-white mt-8 mb-4">2. Permitted Use</h2>
            <p className="mb-4">
              You are granted a limited, revocable, non-exclusive license to access and make personal, non-commercial use of the PrepAI platform and its Content. This license does not include any resale or commercial use of the site or its Content, or any derivative use thereof.
            </p>

            <h2 className="text-xl font-semibold text-white mt-8 mb-4">3. Prohibited Use</h2>
            <p className="mb-4">
              Without the express written consent of PrepAI, you may not:
            </p>
            <ul className="list-disc list-inside mb-4 space-y-2 opacity-90">
              <li>Reproduce, duplicate, copy, or otherwise exploit for any commercial purpose.</li>
              <li>Use any data mining, robots, or similar data gathering and extraction tools.</li>
              <li>Frame or utilize framing techniques to enclose any proprietary information.</li>
              <li>Modify, translate, reverse engineer, decompile, or disassemble any software aspect.</li>
            </ul>

            <h2 className="text-xl font-semibold text-white mt-8 mb-4">4. Trademarks</h2>
            <p className="mb-4">
              PrepAI, the PrepAI logo, and other marks indicated on our platform are trademarks or registered trademarks. They may not be used in connection with any product or service that is not ours without prior written consent.
            </p>

            <div className="mt-12 pt-6 border-t border-white/10 text-sm text-gray-500 flex justify-between">
              <span>Last updated: April 2, 2026</span>
              <span>contact@prepai.com</span>
            </div>
          </div>

        </div>

        {/* Sticky Footer */}
        <Footer />

      </div>
    </div>
  );
};

export default Copyright;