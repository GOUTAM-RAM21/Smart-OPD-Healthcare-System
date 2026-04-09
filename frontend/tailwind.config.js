export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: { primary: '#5f6FFF' },
      fontFamily: { outfit: ['Outfit', 'sans-serif'] },
      gridTemplateColumns: { auto: 'repeat(auto-fill, minmax(200px,1fr))' },
    },
  },
  plugins: [],
}
