import React from "react";

const ElephantAvatar: React.FC<{ size?: number }> = ({ size = 56 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 120 130"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ display: 'block' }}
  >
    {/* Ears (raised and inset) */}
    <ellipse cx="25" cy="52" rx="30" ry="22" fill="#e3ecf7" />
    <ellipse cx="95" cy="52" rx="30" ry="22" fill="#e3ecf7" />
    {/* Inner Ears (raised) */}
    <ellipse cx="25" cy="56" rx="20" ry="14" fill="#ffd6e0" />
    <ellipse cx="95" cy="56" rx="20" ry="14" fill="#ffd6e0" />
    {/* Head */}
    <ellipse cx="60" cy="58" rx="38" ry="34" fill="#e3ecf7" />
    {/* Eyebrows */}
    <path d="M42 54 Q48 50 54 54" stroke="#222" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    <path d="M66 54 Q72 50 78 54" stroke="#222" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    {/* Eyes */}
    <ellipse cx="49" cy="66" rx="7" ry="8.5" fill="#fff" />
    <ellipse cx="71" cy="66" rx="7" ry="8.5" fill="#fff" />
    <ellipse cx="49" cy="69" rx="4.7" ry="5.5" fill="#444" />
    <ellipse cx="71" cy="69" rx="4.7" ry="5.5" fill="#444" />
    {/* Eye highlights */}
    <ellipse cx="51" cy="67" rx="1.3" ry="2" fill="#fff" opacity="0.8" />
    <ellipse cx="73" cy="67" rx="1.3" ry="2" fill="#fff" opacity="0.8" />
    {/* Cheeks */}
    <ellipse cx="43" cy="78" rx="5.5" ry="3.2" fill="#ffd6e0" opacity="0.9" />
    <ellipse cx="77" cy="78" rx="5.5" ry="3.2" fill="#ffd6e0" opacity="0.9" />
    {/* Trunk (animated) */}
    <g style={{ transformOrigin: '60px 78px' }} className="trunk-wiggle">
      <path d="M60 78 Q62 90 66 99 Q68 104 63 107 Q70 114 77 107 Q82 102 74 98 Q66 94 68 88" fill="none" stroke="#e3ecf7" strokeWidth="12" strokeLinecap="round" />
    </g>
    <style>{`
      .trunk-wiggle {
        animation: trunkWiggle 2.5s infinite ease-in-out;
      }
      @keyframes trunkWiggle {
        0% { transform: rotate(-7deg); }
        50% { transform: rotate(7deg); }
        100% { transform: rotate(-7deg); }
      }x
    `}</style>
    {/* Trunk lines */}
    {/* <path d="M66 95 Q68 97 70 96" stroke="#b5c6d6" strokeWidth="2" strokeLinecap="round" />
    <path d="M70 100 Q72 102 74 101" stroke="#b5c6d6" strokeWidth="2" strokeLinecap="round" />
    <path d="M73 104 Q75 106 77 105" stroke="#b5c6d6" strokeWidth="2" strokeLinecap="round" /> */}
  </svg>
);

export default ElephantAvatar;