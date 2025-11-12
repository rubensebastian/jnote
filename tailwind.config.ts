import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#00091a',
        highlight: '#00fa7d',
        desaturated: '#80ffbf',
        sublight: '#7d00fa',
        subdesaturated: '#bf80ff',
      },
    },
  },
  plugins: [],
}
export default config
