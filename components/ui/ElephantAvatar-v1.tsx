import React from "react";

const ElephantAvatar: React.FC<{ size?: number }> = ({ size = 56 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 120 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ display: "block" }}
  >
    {/* Ears behind head */}
    <ellipse cx="32" cy="60" rx="22" ry="18" fill="#B7D3E8" opacity="0.7" />
    <ellipse cx="88" cy="60" rx="22" ry="18" fill="#B7D3E8" opacity="0.7" />
    {/* Head (dominant, round) */}
    <ellipse cx="60" cy="56" rx="30" ry="26" fill="#B7D3E8" />
    {/* Trunk (S-shaped, animated) */}
    <g style={{transformOrigin: "60px 82px", animation: "trunkWiggle 1.7s infinite alternate cubic-bezier(.68,-0.55,.27,1.55)"}}>
      <path
        d="M60 74 Q63 90 60 104 Q67 106 68 98"
        stroke="#A3C1DA"
        strokeWidth="9"
        fill="none"
        strokeLinecap="round"
      />
      {/* Nostrils */}
      {/* <ellipse cx="68" cy="104" rx="2" ry="1.2" fill="#888" />
      <ellipse cx="63" cy="104" rx="2" ry="1.2" fill="#888" /> */}
    </g>
    {/* Body (bigger, moved up)
    <ellipse cx="60" cy="85" rx="26" ry="15" fill="#A3C1DA" /> */}
    {/* Feet (moved up)
    <ellipse cx="48" cy="99" rx="7" ry="3.2" fill="#B7D3E8" opacity="0.85" />
    <ellipse cx="72" cy="99" rx="7" ry="3.2" fill="#B7D3E8" opacity="0.85" /> */}
    {/* Eyes (spaced, with highlight) */}
    <ellipse cx="48" cy="60" rx="4.5" ry="6" fill="#222" />
    <ellipse cx="72" cy="60" rx="4.5" ry="6" fill="#222" />
    <ellipse cx="50" cy="58" rx="1.2" ry="1.8" fill="#fff" opacity="0.8" />
    <ellipse cx="74" cy="58" rx="1.2" ry="1.8" fill="#fff" opacity="0.8" />
    {/* Cheeks (spaced under eyes) */}
    <ellipse cx="48" cy="70" rx="3.7" ry="2.3" fill="#F8BBD0" opacity="0.7" />
    <ellipse cx="72" cy="70" rx="3.7" ry="2.3" fill="#F8BBD0" opacity="0.7" />
    {/* Smile */}
    <path d="M54 74 Q60 80 66 74" stroke="#888" strokeWidth="2" fill="none" />
    <style>{`
      @keyframes trunkWiggle {
        0%   { transform: rotate(-8deg); }
        100% { transform: rotate(18deg); }
      }
    `}</style>
  </svg>
);

export default ElephantAvatar;
