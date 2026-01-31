// tailwind.config.js
module.exports = {
  content: [
    "./**/*.html",
    "./js/**/*.js",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1E3A8A",    // your main blue
        secondary: "#2563EB",  // a lighter blue
        accent: "#F59E0B",     // a yellow/orange accent
        background: "#F3F4F6", // gray-100
        text: "#1F2937",       // gray-800
        card: "#FFFFFF",       // for cards / white
      },
    },
  },
  plugins: [],
}
