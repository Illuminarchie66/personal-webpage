const colors = {
    slate: { 
        50: "#f8fafc", 100: "#f1f5f9", 200: "#e2e8f0", 300: "#cbd5e1", 400: "#94a3b8",
        500: "#64748b", 600: "#475569", 700: "#334155", 800: "#1e293b", 900: "#0f172a", 950: "#020617"
    },
    gray: { 
        50: "#f9fafb", 100: "#f3f4f6", 200: "#e5e7eb", 300: "#d1d5db", 400: "#9ca3af",
        500: "#6b7280", 600: "#4b5563", 700: "#374151", 800: "#1f2937", 900: "#111827", 950: "#030712"
    },
    zinc: { 
        50: "#fafafa", 100: "#f4f4f5", 200: "#e4e4e7", 300: "#d4d4d8", 400: "#a1a1aa",
        500: "#71717a", 600: "#52525b", 700: "#3f3f46", 800: "#27272a", 900: "#18181b", 950: "#09090b"
    },
    neutral: { 
        50: "#fafafa", 100: "#f5f5f5", 200: "#e5e5e5", 300: "#d4d4d4", 400: "#a3a3a3",
        500: "#737373", 600: "#525252", 700: "#404040", 800: "#262626", 900: "#171717", 950: "#0a0a0a"
    },
    stone: { 
        50: "#fafaf9", 100: "#f5f5f4", 200: "#e7e5e4", 300: "#d6d3d1", 400: "#a8a29e",
        500: "#78716c", 600: "#57534e", 700: "#44403c", 800: "#292524", 900: "#1c1917", 950: "#0c0a09"
    },
    red: { 
        50: "#fef2f2", 100: "#fee2e2", 200: "#fecaca", 300: "#fca5a5", 400: "#f87171",
        500: "#ef4444", 600: "#dc2626", 700: "#b91c1c", 800: "#991b1b", 900: "#7f1d1d", 950: "#450a0a"
    },
    orange: { 
        50: "#fff7ed", 100: "#ffedd5", 200: "#fed7aa", 300: "#fdba74", 400: "#fb923c",
        500: "#f97316", 600: "#ea580c", 700: "#c2410c", 800: "#9a3412", 900: "#7c2d12", 950: "#431407"
    },
    amber: { 
        50: "#fffbeb", 100: "#fef3c7", 200: "#fde68a", 300: "#fcd34d", 400: "#fbbf24",
        500: "#f59e0b", 600: "#d97706", 700: "#b45309", 800: "#92400e", 900: "#78350f", 950: "#451a03"
    },
    yellow: { 
        50: "#fefce8", 100: "#fef9c3", 200: "#fef08a", 300: "#fde047", 400: "#facc15",
        500: "#eab308", 600: "#ca8a04", 700: "#a16207", 800: "#854d0e", 900: "#713f12", 950: "#422006"
    },
    lime: { 
        50: "#f7fee7", 100: "#ecfccb", 200: "#d9f99d", 300: "#bef264", 400: "#a3e635",
        500: "#84cc16", 600: "#65a30d", 700: "#4d7c0f", 800: "#3f6212", 900: "#365314", 950: "#1a2e05"
    },
    green: { 
        50: "#f0fdf4", 100: "#dcfce7", 200: "#bbf7d0", 300: "#86efac", 400: "#4ade80",
        500: "#22c55e", 600: "#16a34a", 700: "#15803d", 800: "#166534", 900: "#14532d", 950: "#052e16"
    },
    emerald: { 
        50: "#ecfdf5", 100: "#d1fae5", 200: "#a7f3d0", 300: "#6ee7b7", 400: "#34d399",
        500: "#10b981", 600: "#059669", 700: "#047857", 800: "#065f46", 900: "#064e3b", 950: "#022c22"
    },
    teal: { 
        50: "#f0fdfa", 100: "#ccfbf1", 200: "#99f6e4", 300: "#5eead4", 400: "#2dd4bf",
        500: "#14b8a6", 600: "#0d9488", 700: "#0f766e", 800: "#115e59", 900: "#134e4a", 950: "#042f2e"
    },
    cyan: { 
        50: "#ecfeff", 100: "#cffafe", 200: "#a5f3fc", 300: "#67e8f9", 400: "#22d3ee",
        500: "#06b6d4", 600: "#0891b2", 700: "#0e7490", 800: "#155e75", 900: "#164e63", 950: "#083344"
    },
    sky: { 
        50: "#f0f9ff", 100: "#e0f2fe", 200: "#bae6fd", 300: "#7dd3fc", 400: "#38bdf8",
        500: "#0ea5e9", 600: "#0284c7", 700: "#0369a1", 800: "#075985", 900: "#0c4a6e", 950: "#082f49"
    },
    blue: { 
        50: "#eff6ff", 100: "#dbeafe", 200: "#bfdbfe", 300: "#93c5fd", 400: "#60a5fa",
        500: "#3b82f6", 600: "#2563eb", 700: "#1d4ed8", 800: "#1e40af", 900: "#1e3a8a", 950: "#172554"
    },
    indigo: { 
        50: "#eef2ff", 100: "#e0e7ff", 200: "#c7d2fe", 300: "#a5b4fc", 400: "#818cf8",
        500: "#6366f1", 600: "#4f46e5", 700: "#4338ca", 800: "#3730a3", 900: "#312e81", 950: "#1e1b4b"
    },
    violet: { 
        50: "#f5f3ff", 100: "#ede9fe", 200: "#ddd6fe", 300: "#c4b5fd", 400: "#a78bfa",
        500: "#8b5cf6", 600: "#7c3aed", 700: "#6d28d9", 800: "#5b21b6", 900: "#4c1d95", 950: "#2e1065"
    },
    purple: { 
        50: "#faf5ff", 100: "#f3e8ff", 200: "#e9d5ff", 300: "#d8b4fe", 400: "#c084fc",
        500: "#a855f7", 600: "#9333ea", 700: "#7e22ce", 800: "#6b21a8", 900: "#581c87", 950: "#3b0764"
    },
    fuchsia: { 
        50: "#fdf4ff", 100: "#fae8ff", 200: "#f5d0fe", 300: "#f0abfc", 400: "#e879f9",
        500: "#d946ef", 600: "#c026d3", 700: "#a21caf", 800: "#86198f", 900: "#701a75", 950: "#4a044e"
    },
    pink: { 
        50: "#fdf2f8", 100: "#fce7f3", 200: "#fbcfe8", 300: "#f9a8d4", 400: "#f472b6",
        500: "#ec4899", 600: "#db2777", 700: "#be185d", 800: "#9d174d", 900: "#831843", 950: "#500724"
    },
    rose: { 
        50: "#fff1f2", 100: "#ffe4e6", 200: "#fecdd3", 300: "#fda4af", 400: "#fb7185",
        500: "#f43f5e", 600: "#e11d48", 700: "#be123c", 800: "#9f1239", 900: "#881337", 950: "#4c0519"
    }
};

const colorComplements = {
    slate: "stone",
    gray: "zinc",
    zinc: "gray",
    neutral: "stone",
    stone: "slate",
    red: "green",
    orange: "blue",
    amber: "purple",
    yellow: "violet",
    lime: "fuchsia",
    green: "red",
    emerald: "rose",
    teal: "pink",
    cyan: "orange",
    sky: "rose",
    blue: "orange",
    indigo: "amber",
    violet: "yellow",
    purple: "amber",
    fuchsia: "lime",
    pink: "teal",
    rose: "emerald"
};


function setPrimaryColor(colorName) {
    const root = document.documentElement;
    const colorShades = colors[colorName];
    const complementShades = colors[colorComplements[colorName]];
    console.log(colorName, colorComplements[colorName]);

    if (!colorShades) {
        console.error(`Color "${colorName}" not found.`);
        return;
    }

    root.style.setProperty('--primary-50', colorShades[50]);
    root.style.setProperty('--primary-100', colorShades[100]);
    root.style.setProperty('--primary-200', colorShades[200]);
    root.style.setProperty('--primary-300', colorShades[300]);
    root.style.setProperty('--primary-400', colorShades[400]);
    root.style.setProperty('--primary-500', colorShades[500]);
    root.style.setProperty('--primary-600', colorShades[600]);
    root.style.setProperty('--primary-700', colorShades[700]);
    root.style.setProperty('--primary-800', colorShades[800]);
    root.style.setProperty('--primary-900', colorShades[900]);
    root.style.setProperty('--primary-950', colorShades[950]);

    root.style.setProperty('--complementary-400', complementShades[400]);
    localStorage.setItem("primaryColor", colorName);
}

function getRandomColor() {
    const colorNames = Object.keys(colors);
    const randomIndex = Math.floor(Math.random() * colorNames.length);
    return colorNames[randomIndex];
}

function setTheme(mode) {
    const root = document.documentElement;

    if (mode === "dark") {
        root.classList.add("dark");
    } else {
        root.classList.remove("dark");
    }

    localStorage.setItem("theme", mode);
}

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
                    title: "var(--text-title)", // blue-900
                    contrast_title: "var(--text-contrast-title)", // white
                    subtitle: "var(--text-subtitle)", // blue-700
                    text: "var(--text-text)", // gray-800
                    boldtext: "var(--text-boldtext)", // black
                    subtext: "var(--text-subtext)", // gray-600
                    contrast_text: "var(--text-contrast-text)", // white
                    link: "var(--text-link)", // blue-600
                    hover: "var(--text-hover)", // blue-700
                    extra: "var(--text-extra)", // blue-600
                    extra_hover: "var(--text-extra-hover)", // orange-400
                    title_extra1: "var(--text-title-extra1)", // blue-900
                    title_extra2: "var(--text-title-extra2)", // yellow-900
                    title_extra3: "var(--text-title-extra3)", // purple-900
                },

                bg: {
                    main: "var(--bg-main)", // gray-100
                    bottom: "var(--bg-bottom)", // gray-300
                    header: "var(--bg-header)", // white
                    title: "var(--bg-title)", // blue-900
                    card: "var(--bg-card)", // white
                    simple_hover: "var(--bg-simple-hover)", // gray-200
                    hover: "var(--bg-hover)", // blue-100
                    extra1: "var(--bg-extra1)", // blue-100
                    extra2: "var(--bg-extra2)", // yellow-100
                    extra3: "var(--bg-extra3)", // purple-100
                },

                border: {
                    border1: "var(--border1)", // blue-800
                    border2: "var(--border2)", // blue-600
                    border3: "var(--border3)", // blue-400
                    border4: "var(--border4)", // blue-200
                },

                shadow: {
                    box: "var(--light-shadow-color)",
                    box_hover: "var(--dark-shadow-color)",
                },
			}
		}
		}
};

(function initTheme() {
    const theme = localStorage.getItem("theme") || "light";
    const primary = localStorage.getItem("primaryColor") || "blue";
    console.log("Initializing theme:", theme, "with primary color:", primary);
    setTheme(theme);
    setPrimaryColor(primary);
})();

export { colors, getRandomColor, setPrimaryColor, setTheme };