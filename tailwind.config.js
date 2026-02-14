export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        obsidian: '#000000',
        coral: '#FF6B6B',
        neonpink: '#CC00FF',
        holographic: '#E0E0E0'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        glow: '0 0 15px rgba(255,107,107,0.4)',
        glowPink: '0 0 18px rgba(204,0,255,0.4)'
      },
      backdropBlur: {
        cyber: '20px'
      },
      keyframes: {
        orbit: {
          '0%': { transform: 'translate(-50%, -50%) rotate(0deg)' },
          '100%': { transform: 'translate(-50%, -50%) rotate(360deg)' }
        },
        pulseGlow: {
          '0%, 100%': { opacity: 0.6 },
          '50%': { opacity: 1 }
        }
      },
      animation: {
        orbit: 'orbit 14s linear infinite',
        orbitSlow: 'orbit 20s linear infinite',
        pulseGlow: 'pulseGlow 4s ease-in-out infinite'
      }
    }
  },
  plugins: []
};
