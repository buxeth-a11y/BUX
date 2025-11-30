module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        buxGreen: '#056e31ff',
        buxLightGreen: '#056e31ff',
        buxYellow: '#facc13ff',
        buxDollarGreen:'#faf4dd',
        buxBlack:'#3c3b34',
      },
      fontFamily: {
        pixel: ['"Press Start 2P"', 'monospace'],
      },
      boxShadow: {
        'pixel': '2px 2px 0px 0px rgba(0,0,0,0.5)',
      },
    },
  },
  plugins: [],
};