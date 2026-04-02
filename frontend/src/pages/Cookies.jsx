import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Cookies = () => {
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
            <h1 className="text-3xl font-bold text-white mb-6">Cookie Policy</h1>
            
            <p className="mb-4">
              This Cookie Policy explains how PrepAI ("we", "us", or "our") uses cookies and similar technologies to recognize you when you visit our web application. It explains what these technologies are and why we use them, as well as your rights to control our use of them.
            </p>

            <h2 className="text-xl font-semibold text-white mt-8 mb-4">1. What are Cookies?</h2>
            <p className="mb-4">
              Cookies are small data files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work, or work more efficiently, as well as to provide reporting information.
            </p>

            <h2 className="text-xl font-semibold text-white mt-8 mb-4">2. Why do we use Cookies?</h2>
            <p className="mb-4">
              We use first-party and third-party cookies for several reasons:
            </p>
            <ul className="list-disc list-inside mb-4 space-y-2 opacity-90">
              <li><strong>Essential Cookies:</strong> Some cookies are required for technical reasons in order for our platform to operate (e.g., maintaining your logged-in session, securing API requests).</li>
              <li><strong>Performance & Analytics Cookies:</strong> These gather information about how you interact with PrepAI, which helps us to improve the platform and provide a better learning experience.</li>
              <li><strong>Functionality Cookies:</strong> Used to recognize you when you return to our website so we can personalize our content (like remembering your theme preferences or language).</li>
            </ul>

            <h2 className="text-xl font-semibold text-white mt-8 mb-4">3. Local Storage and Session Storage</h2>
            <p className="mb-4">
              In addition to traditional cookies, we may use HTML5 Local Storage and Session Storage to cache data on your browser. This enables us to store necessary state information efficiently, ensuring that complex tasks like interview generation load faster upon subsequent visits.
            </p>

            <h2 className="text-xl font-semibold text-white mt-8 mb-4">4. Managing Your Cookies</h2>
            <p className="mb-4">
              You have the right to decide whether to accept or reject cookies. You can set or amend your web browser controls to accept or refuse cookies. If you choose to reject cookies, you may still use our website though your access to some functionality and areas may be restricted or broken (for example, authentication flows might fail).
            </p>

            <h2 className="text-xl font-semibold text-white mt-8 mb-4">5. Updates to this Policy</h2>
            <p className="mb-4">
              We may update this Cookie Policy from time to time in order to reflect changes to the cookies we use or for other operational, legal, or regulatory reasons. Please re-visit this page regularly to stay informed about our use of cookies and related technologies.
            </p>

            <div className="mt-12 pt-6 border-t border-white/10 text-sm text-gray-500 flex justify-between">
              <span>Last updated: April 2, 2026</span>
              <span>cookies@prepai.com</span>
            </div>
          </div>

        </div>

        {/* Sticky Footer */}
        <Footer />

      </div>
    </div>
  );
};

export default Cookies;