const { coolGray } = require("tailwindcss/colors")

module.exports = {
	purge: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
	mode: "jit",
	darkMode: false, // or 'media' or 'class'
	theme: {
		extend: {
			colors: {
				coolGray,
			},
		},
		fontFamily: {
			sans: "Inter",
			mono: "'JetBrains Mono'",
		},
	},
	variants: {
		extend: {},
	},
	plugins: [],
}
