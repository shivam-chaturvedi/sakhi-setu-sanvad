import React from 'react';

const Background3D = () => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      {/* Fallback animated background without Three.js */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#ffcdcd]/20 via-[#faa0cc]/20 to-[#46bdb6]/20">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute w-32 h-32 rounded-full opacity-20 animate-pulse"
            style={{
              background: `linear-gradient(45deg, ${['#faa0cc', '#46bdb6', '#ffcdcd', '#46bdb6', '#faa0cc'][i]}, transparent)`,
              left: `${20 + i * 15}%`,
              top: `${20 + i * 10}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${3 + i}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Background3D;