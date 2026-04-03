import { User, Mail, Lock, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { setToken } from "../utils/api";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID_HERE";

const SignupPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const background = location.state?.background || location;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleClose = () => {
    if (location.state?.background || window.history.length > 2) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [navigate]);

  // Load Google SDK on mount
  useEffect(() => {
    if (document.getElementById("google-gsi-script")) return;
    const script = document.createElement("script");
    script.id = "google-gsi-script";
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
  }, []);

  // Google signup
  const handleGoogleSignup = async () => {
    try {
      if (!window.google || !window.google.accounts) {
        alert("Google is still loading. Please wait a moment and try again.");
        return;
      }

      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: async (response) => {
          try {
            const res = await fetch("/api/v1/auth/google", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ tokenId: response.credential }),
            });
            const data = await res.json();
            if (data.success) {
              setToken(data.token);
              alert("Signup Successful");
              navigate("/");
            } else {
              alert(data.error || "Google signup failed");
            }
          } catch (err) {
            console.error("Google signup error:", err);
            alert("Google signup failed. Please try again.");
          }
        },
      });

      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed()) {
          alert("Google popup was blocked. Please allow popups for this site.");
        }
      });
    } catch (error) {
      console.error("Google signup error:", error);
      alert("Google signup failed. Please try again.");
    }
  };

  // Apple signup
  const handleAppleSignup = async () => {
    try {
      if (!window.AppleID) {
        const script = document.createElement("script");
        script.src = "https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js";
        script.async = true;
        document.body.appendChild(script);
        await new Promise((resolve, reject) => {
          script.onload = resolve;
          script.onerror = reject;
        });
      }

      window.AppleID.auth.init({
        clientId: "YOUR_APPLE_CLIENT_ID",
        scope: "name email",
        redirectURI: window.location.origin,
        usePopup: true,
      });

      const response = await window.AppleID.auth.signIn();

      const res = await fetch("/api/v1/auth/apple", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identityToken: response.authorization.id_token,
          user: response.user,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setToken(data.token);
        alert("Signup Successful");
        navigate("/");
      } else {
        alert(data.error || "Apple signup failed");
      }
    } catch (error) {
      if (error.error === "popup_closed_by_user") return;
      console.error("Apple signup error:", error);
      alert("Apple signup failed. Please try again.");
    }
  };

  const handleSignup = async () => {
    if (!name || !email || !password) {
      alert("Please fill all fields");
      return;
    }

    try {
      const res = await fetch("/api/v1/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (data.success) {
        setToken(data.token);
        alert("Signup Successful");
        navigate("/");
      } else {
        alert(data.error || "Signup failed. Please try again.");
      }
    } catch (error) {
      console.error("Signup failed:", error);
      alert("Signup failed. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-md"
      />

      <div className="relative z-10 w-[380px] rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-6 shadow-2xl">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X size={18} />
        </button>

        <h2 className="text-white text-xl font-semibold mb-1">Create Account</h2>
        <p className="text-gray-400 text-sm mb-5">Start your journey with us</p>

        <div className="flex items-center bg-white/10 px-3 py-2 rounded-lg mb-3 border border-white/10">
          <User size={16} className="text-gray-400" />
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-transparent ml-2 outline-none text-white w-full"
          />
        </div>

        <div className="flex items-center bg-white/10 px-3 py-2 rounded-lg mb-3 border border-white/10">
          <Mail size={16} className="text-gray-400" />
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-transparent ml-2 outline-none text-white w-full"
          />
        </div>

        <div className="flex items-center bg-white/10 px-3 py-2 rounded-lg mb-4 border border-white/10">
          <Lock size={16} className="text-gray-400" />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-transparent ml-2 outline-none text-white w-full"
          />
        </div>

        <button
          onClick={handleSignup}
          className="w-full py-2 rounded-lg bg-gradient-to-r from-cyan-400 to-purple-400 text-white font-medium mb-4"
        >
          Create Account
        </button>

        <div className="flex items-center gap-2 text-gray-400 text-sm mb-4">
          <div className="flex-1 h-[1px] bg-white/10"></div>
          OR
          <div className="flex-1 h-[1px] bg-white/10"></div>
        </div>

        <button
          onClick={handleGoogleSignup}
          className="w-full py-2 rounded-lg bg-white/10 text-white mb-2 hover:bg-white/20 flex items-center justify-center gap-2"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>

        <button
          onClick={handleAppleSignup}
          className="w-full py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 flex items-center justify-center gap-2"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
            <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
          </svg>
          Continue with Apple
        </button>

        <p className="text-gray-400 text-sm text-center mt-4">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login", { state: { background } })}
            className="text-cyan-400 cursor-pointer"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
