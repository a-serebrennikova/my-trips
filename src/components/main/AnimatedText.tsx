"use client";

import { Typewriter } from "react-simple-typewriter";

export const AnimatedText = () => {

  return (
    <h2 className="page-title">
      <Typewriter
        words={["Keep all your best trips in one place"]}
        loop={1}
        cursor={false}
        cursorStyle="|"
        typeSpeed={70}
        deleteSpeed={50}
        delaySpeed={1000}
      />
    </h2>
  );
};
