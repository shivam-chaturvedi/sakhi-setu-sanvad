import { useEffect, useState } from "react";

const GoogleTranslate = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const scriptId = "google-translate-script";

    // Define init function globally before script runs
    window.googleTranslateElementInit = function () {
      if (document.getElementById("google_translate_element")) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "en",
            includedLanguages: "en,hi,mr", // English, Hindi, Marathi
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false,
            multilanguagePage: true,
          },
          "google_translate_element"
        );
        setIsLoaded(true);
      }
    };

    // Only add script if not already added
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src =
        "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      script.defer = true;

      // Wait for window to be ready — helps on mobile
      script.onload = () => {
        if (window.google && window.google.translate) {
          window.googleTranslateElementInit();
        }
      };

      document.body.appendChild(script);
    } else if (window.google && window.google.translate) {
      window.googleTranslateElementInit();
    }

    // Re-initialize on window resize (mobile rotates or resizes)
    const handleResize = () => {
      if (window.google && window.google.translate) {
        window.googleTranslateElementInit();
      }
    };
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="google-translate-container">
      <div
        id="google_translate_element"
        style={{
          minHeight: "20px",
          overflow: "visible",
          zIndex: 9999,
        }}
      ></div>
      {!isLoaded && (
        <div className="text-xs text-gray-500 dark:text-gray-400 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded">
          Translate
        </div>
      )}
    </div>
  );
};

export { GoogleTranslate };
export default GoogleTranslate;
