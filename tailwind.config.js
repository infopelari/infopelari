/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bgPrimary: 'var(--bg-primary)',
        bgSecondary: 'var(--bg-secondary)',
        bgTertiary: 'var(--bg-tertiary)',
        textPrimary: 'var(--text-primary)',
        textSecondary: 'var(--text-secondary)',
        textMuted: 'var(--text-muted)',
        accentGreen: 'var(--accent-green)',
        accentYellow: 'var(--accent-yellow)',
        statusWarning: 'var(--status-warning)',
        statusDanger: 'var(--status-danger)',
        statusInfo: 'var(--status-info)',
        borderLight: 'var(--border-light)',
      },
      fontFamily: {
        inter: ['var(--font-inter)'],
        outfit: ['var(--font-outfit)'],
      },
    },
  },
  plugins: [],
}
