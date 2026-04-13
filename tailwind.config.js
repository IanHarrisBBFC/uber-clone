module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        'brand-black': '#111111',
        'brand-dark': '#1A1A1A',
        'brand-charcoal': '#222222',
        'brand-yellow': '#FFD700',
        'brand-gold': '#DAA520',
        'brand-gray': '#6C757D',
      },
      fontFamily: {
        'display': ['CabnFly', 'Segoe UI', 'sans-serif'],
        'sans': ['Segoe UI', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
    }
  },
  plugins: []
}
