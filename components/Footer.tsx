import { useEffect, useState } from "react";

export default function Footer() {
  const [screenWidth, setScreenWidth] = useState<number>(0);
  useEffect(() => {
    setScreenWidth(window.innerWidth);
    window.addEventListener("resize", () => {
      setScreenWidth(window.innerWidth);
    });
  }, []);
  return (
    <footer id="main-footer">
      <a
        href="https://portfolio-gobindsingh.vercel.app/"
        target="_blank"
        rel="noopener noreferrer"
      >
        {`Made with ❤️ from 
        ${screenWidth < 900 ? "🇮🇳" : "India"} 
        by Gobind Singh.`}
        {/* {"Made with ❤️ from " +
        (screenWidth < 900 ? "🇮🇳" : "India") +
        "by Gobind Singh."} */}
      </a>
    </footer>
  );
}
