import React from "react";

const Card = ({ title, img, onClick }) => {
  return (
    <div className="card-dark w-[180px] h-[240px] flex flex-col items-center justify-between py-5 px-3 text-center rounded-xl border border-white/10 shadow-md hover:shadow-lg transition duration-300 hover:scale-105">

      {/* Image Circle */}
      <div className="h-24 w-24 rounded-full bg-[#5a3f36] flex items-center justify-center shadow-inner overflow-hidden">
        <img
          src={img}
          alt={title}
          className="h-14 object-contain transition-transform duration-300 hover:scale-110"
        />
      </div>

      {/* Title */}
      <h3 className="text-sm md:text-base text-pink-400 font-semibold leading-tight px-1">
        {title}
      </h3>

      {/* 🔥 BUTTON (UPDATED) */}
      <button
        onClick={onClick} // ✅ IMPORTANT
        className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-5 py-2 rounded-lg shadow-md transition active:scale-95"
      >
        Get Started
      </button>

    </div>
  );
};

export default Card;