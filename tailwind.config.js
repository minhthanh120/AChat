/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        'tg-primary': '#3390ec',
        'tg-primary-hover': '#2481e0',
        'tg-bg-primary': '#ffffff',
        'tg-bg-secondary': '#f7f8fa',
        'tg-bg-tertiary': '#ebedf0',
        'tg-text-primary': '#000000',
        'tg-text-secondary': '#707579',
        'tg-border': '#e4e6ea',
        'tg-hover': '#f0f2f5',
        'tg-message-sent': '#e7f3ff',
        'tg-message-received': '#ffffff',
      },
    },
  },
  plugins: [],
};
