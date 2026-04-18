/* Color Palettes */

const colors = {
  slate: { 50:"#f8fafc",100:"#f1f5f9",200:"#e2e8f0",300:"#cbd5e1",400:"#94a3b8",500:"#64748b",600:"#475569",700:"#334155",800:"#1e293b",900:"#0f172a",950:"#020617" },
  gray: { 50:"#f9fafb",100:"#f3f4f6",200:"#e5e7eb",300:"#d1d5db",400:"#9ca3af",500:"#6b7280",600:"#4b5563",700:"#374151",800:"#1f2937",900:"#111827",950:"#030712" },
  zinc: { 50:"#fafafa",100:"#f4f4f5",200:"#e4e4e7",300:"#d4d4d8",400:"#a1a1aa",500:"#71717a",600:"#52525b",700:"#3f3f46",800:"#27272a",900:"#18181b",950:"#09090b" },
  neutral: { 50:"#fafafa",100:"#f5f5f5",200:"#e5e5e5",300:"#d4d4d4",400:"#a3a3a3",500:"#737373",600:"#525252",700:"#404040",800:"#262626",900:"#171717",950:"#0a0a0a" },
  stone: { 50:"#fafaf9",100:"#f5f5f4",200:"#e7e5e4",300:"#d6d3d1",400:"#a8a29e",500:"#78716c",600:"#57534e",700:"#44403c",800:"#292524",900:"#1c1917",950:"#0c0a09" },

  red: { 50:"#fef2f2",100:"#fee2e2",200:"#fecaca",300:"#fca5a5",400:"#f87171",500:"#ef4444",600:"#dc2626",700:"#b91c1c",800:"#991b1b",900:"#7f1d1d",950:"#450a0a" },
  orange: { 50:"#fff7ed",100:"#ffedd5",200:"#fed7aa",300:"#fdba74",400:"#fb923c",500:"#f97316",600:"#ea580c",700:"#c2410c",800:"#9a3412",900:"#7c2d12",950:"#431407" },
  amber: { 50:"#fffbeb",100:"#fef3c7",200:"#fde68a",300:"#fcd34d",400:"#fbbf24",500:"#f59e0b",600:"#d97706",700:"#b45309",800:"#92400e",900:"#78350f",950:"#451a03" },
  yellow: { 50:"#fefce8",100:"#fef9c3",200:"#fef08a",300:"#fde047",400:"#facc15",500:"#eab308",600:"#ca8a04",700:"#a16207",800:"#854d0e",900:"#713f12",950:"#422006" },

  green: { 50:"#f0fdf4",100:"#dcfce7",200:"#bbf7d0",300:"#86efac",400:"#4ade80",500:"#22c55e",600:"#16a34a",700:"#15803d",800:"#166534",900:"#14532d",950:"#052e16" },
  blue: { 50:"#eff6ff",100:"#dbeafe",200:"#bfdbfe",300:"#93c5fd",400:"#60a5fa",500:"#3b82f6",600:"#2563eb",700:"#1d4ed8",800:"#1e40af",900:"#1e3a8a",950:"#172554" },

  purple: { 50:"#faf5ff",100:"#f3e8ff",200:"#e9d5ff",300:"#d8b4fe",400:"#c084fc",500:"#a855f7",600:"#9333ea",700:"#7e22ce",800:"#6b21a8",900:"#581c87",950:"#3b0764" },
  pink: { 50:"#fdf2f8",100:"#fce7f3",200:"#fbcfe8",300:"#f9a8d4",400:"#f472b6",500:"#ec4899",600:"#db2777",700:"#be185d",800:"#9d174d",900:"#831843",950:"#500724" },
};


/* Complementary Color Map */

const colorComplements = {
  slate: "stone",
  gray: "zinc",
  zinc: "gray",
  neutral: "stone",
  stone: "slate",
  red: "green",
  orange: "blue",
  amber: "purple",
  yellow: "purple",
  green: "red",
  blue: "orange",
  purple: "amber",
  pink: "blue",
};


/* Apply Primary Color */

function setPrimaryColor(colorName) {
  const root = document.documentElement;
  const shades = colors[colorName];

  // Guard: invalid color
  if (!shades) {
    console.error(`Color "${colorName}" not found.`);
    return;
  }

  Object.entries(shades).forEach(([key, value]) => {
    root.style.setProperty(`--primary-${key}`, value);
  });

  // Apply complementary accent color
  const complementName = colorComplements[colorName];
  const complement = colors[complementName];

  if (complement) {
    root.style.setProperty('--complementary-400', complement[400]);
  }

  // Persist choice
  localStorage.setItem("primaryColor", colorName);
}


/* Random Color Picker */

function getRandomColor() {
  const names = Object.keys(colors);
  return names[Math.floor(Math.random() * names.length)];
}


/* Theme toggle (light / dark)*/

function setTheme(mode) {
  const root = document.documentElement;

  if (mode === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }

  localStorage.setItem("theme", mode);
}


/* Tailwind extension */

tailwind.config = {
  theme: {
    extend: {
      boxShadow: {
        sm: "0 1px 2px 0 var(--shadow-color)",
        md: "0 4px 6px -1px var(--shadow-color), 0 2px 4px -2px var(--shadow-color)",
        lg: "0 10px 15px -3px var(--shadow-color), 0 4px 6px -4px var(--shadow-color)",
        xl: "0 20px 25px -5px var(--shadow-color), 0 8px 10px -6px var(--shadow-color)",
      },

      colors: {
        text: {
          title: "var(--text-title)",
          contrast_title: "var(--text-contrast-title)",
          subtitle: "var(--text-subtitle)",
          text: "var(--text-text)",
          boldtext: "var(--text-boldtext)",
          subtext: "var(--text-subtext)",
          contrast_text: "var(--text-contrast-text)",
          link: "var(--text-link)",
          hover: "var(--text-hover)",
          extra: "var(--text-extra)",
          extra_hover: "var(--text-extra-hover)",
          title_extra1: "var(--text-title-extra1)",
          title_extra2: "var(--text-title-extra2)",
          title_extra3: "var(--text-title-extra3)",
        },

        bg: {
          main: "var(--bg-main)",
          bottom: "var(--bg-bottom)",
          header: "var(--bg-header)",
          title: "var(--bg-title)",
          card: "var(--bg-card)",
          simple_hover: "var(--bg-simple-hover)",
          hover: "var(--bg-hover)",
          extra1: "var(--bg-extra1)",
          extra2: "var(--bg-extra2)",
          extra3: "var(--bg-extra3)",
          primary: "var(--primary-500)",
          primary_hover: "var(--primary-600)",
        },

        border: {
          border1: "var(--border1)",
          border2: "var(--border2)",
          border3: "var(--border3)",
          border4: "var(--border4)",
        },

        shadow: {
          box: "var(--light-shadow-color)",
          box_hover: "var(--dark-shadow-color)",
        },
      },
    },
  },
};


/* Initialize theme */

(function initTheme() {
  const theme = localStorage.getItem("theme") || "light";
  const primary = localStorage.getItem("primaryColor") || "blue";

  setTheme(theme);
  setPrimaryColor(primary);
})();

export { colors, getRandomColor, setPrimaryColor, setTheme };