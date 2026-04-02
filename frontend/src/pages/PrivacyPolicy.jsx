import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const PrivacyPolicy = () => {
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
            <h1 className="text-3xl font-bold text-white mb-6">Privacy Policy</h1>
            
            <p className="mb-4">
              At PrepAI, we take your privacy seriously. This privacy policy describes how we collect, use, and protect your personal information when you use our AI-driven interview evaluation platform.
            </p>

            <h2 className="text-xl font-semibold text-white mt-8 mb-4">1. Information We Collect</h2>
            <p className="mb-4">
              We may collect the following types of information:
            </p>
            <ul className="list-disc list-inside mb-4 space-y-2 opacity-90">
              <li><strong>Personal Data:</strong> Name, email address, phone number, and profile picture provided during registration or profile updates.</li>
              <li><strong>Interview Data:</strong> Audio, video, and transcript data recorded during mock interviews, as well as AI-generated performance evaluations.</li>
              <li><strong>Usage Data:</strong> Information about how you interact with our platform (e.g., pages visited, features used).</li>
              <li><strong>Device Information:</strong> Browser type, IP address, operating system, and hardware details (such as camera/microphone usage metrics).</li>
            </ul>

            <h2 className="text-xl font-semibold text-white mt-8 mb-4">2. How We Use Your Information</h2>
            <p className="mb-4">
              We use the collected information for various purposes, including:
            </p>
            <ul className="list-disc list-inside mb-4 space-y-2 opacity-90">
              <li>Providing and maintaining our Service, including AI evaluation of your interview skills.</li>
              <li>Improving your learning experience by tailoring feedback and recommendations.</li>
              <li>Communicating with you regarding updates, security alerts, and support messages.</li>
              <li>Monitoring and analyzing usage and trends to improve the platform's features.</li>
            </ul>

            <h2 className="text-xl font-semibold text-white mt-8 mb-4">3. Data Security and Storage</h2>
            <p className="mb-4">
              We implement strict security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. Interview recordings (audio/video) are securely encrypted and are only used for generating your personal performance reports unless explicitly stated otherwise.
            </p>

            <h2 className="text-xl font-semibold text-white mt-8 mb-4">4. Sharing Your Data</h2>
            <p className="mb-4">
              PrepAI does not sell your personal data. We may share your information only in the following scenarios:
            </p>
            <ul className="list-disc list-inside mb-4 space-y-2 opacity-90">
              <li>With third-party service providers acting on our behalf (e.g., cloud hosting, AI language models).</li>
              <li>To comply with legal obligations protecting our rights or in response to lawful requests by public authorities.</li>
            </ul>

            <h2 className="text-xl font-semibold text-white mt-8 mb-4">5. Your Privacy Rights</h2>
            <p className="mb-4">
              You have the right to access, update, or delete your personal information at any time. You can manage most of this directly from your account settings or by contacting our support team.
            </p>

            <div className="mt-12 pt-6 border-t border-white/10 text-sm text-gray-500 flex justify-between">
              <span>Last updated: April 2, 2026</span>
              <span>privacy@prepai.com</span>
            </div>
          </div>

        </div>

        {/* Sticky Footer */}
        <Footer />

      </div>
    </div>
  );
};

export default PrivacyPolicy;