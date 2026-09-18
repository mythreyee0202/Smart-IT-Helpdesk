/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#F7F8FA",
        primary: {
          DEFAULT: "#3157D5",
          hover: "#2645B0",
          light: "#EEF2FF",
          dark: "#1E368A",
        },
        dark: {
          DEFAULT: "#172033",
          secondary: "#667085",
          muted: "#94A3B8",
        },
        card: "#FFFFFF",
        border: "#E5E7EB",
        success: {
          DEFAULT: "#16A34A",
          light: "#F0FDF4",
          border: "#BBF7D0",
        },
        warning: {
          DEFAULT: "#D97706",
          light: "#FFFBEB",
          border: "#FDE68A",
        },
        danger: {
          DEFAULT: "#DC2626",
          light: "#FEF2F2",
          border: "#FECACA",
        },
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)',
        'card': '0 2px 8px -2px rgba(15, 23, 42, 0.06), 0 1px 4px -1px rgba(15, 23, 42, 0.04)',
        'elevated': '0 10px 25px -5px rgba(15, 23, 42, 0.08), 0 8px 10px -6px rgba(15, 23, 42, 0.04)',
      },
    },
  },
  plugins: [],
}
