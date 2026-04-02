import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="bg-[#0f172a]/95 border-t border-white/10 text-xs text-gray-400 py-2 px-6">
      
      <div className="flex items-center gap-2">
        
        <Link to="/copyright" className="hover:text-white">
          © 2026 AI Interviewer
        </Link>

        <span>|</span>

        <Link to="/privacy" className="hover:text-white">
          Privacy
        </Link>

        <span>|</span>

        <Link to="/terms" className="hover:text-white">
          Terms
        </Link>

        <span>|</span>

        <Link to="/cookies" className="hover:text-white">
          Cookies
        </Link>

      </div>

    </div>
  );
};

export default Footer;