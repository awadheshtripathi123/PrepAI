import { useNavigate } from "react-router-dom";

const Hero = ({ type = "home" }) => {
  const navigate = useNavigate();

  return (
    <div className="card-dark px-8 py-6 rounded-xl flex flex-col lg:flex-row items-center justify-between gap-6">

      <div className="flex-1 max-w-[520px]">

        <h1 className="text-3xl lg:text-4xl font-semibold text-white">
          {type === "learning"
            ? "Welcome Back, Aman!"
            : "Welcome to AI Interviewer 🚀"}
        </h1>

        <p className="text-gray-400 text-sm mt-2">
          {type === "learning"
            ? "Let’s conquer your interview today."
            : "Practice interviews, improve skills and get hired."}
        </p>

        <div className="mt-6 flex gap-4">

          {type === "learning" ? (
            <>
              <button className="btn-primary px-5 py-2">
                Community Hub
              </button>

              <button
                onClick={() => navigate("/mock/performance")}
                className="btn-primary opacity-90 px-5 py-2"
              >
                Start a Mock Test
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate("/mock/performance")} // ✅ FIXED
                className="btn-primary px-5 py-2"
              >
                Start Interview
              </button>

               <button
                 onClick={() => navigate("/community")}
                 className="btn-primary text-sm px-5 py-2"
                >
               Community Hub
              </button>
            </>
          )}

        </div>
      </div>

      <div className="flex-1 flex justify-center lg:justify-end">
        <img
          src="https://cdn-icons-png.flaticon.com/512/4712/4712109.png"
          className="w-56 lg:w-64"
          alt="hero"
        />
      </div>

    </div>
  );
};

export default Hero;