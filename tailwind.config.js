import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.tsx',
    ],

    theme: {
        extend: {
            colors: {
                ink: 'rgb(var(--c-ink) / <alpha-value>)',
                paper: 'rgb(var(--c-paper) / <alpha-value>)',
                surface: 'rgb(var(--c-surface) / <alpha-value>)',
                line: 'rgb(var(--c-line) / <alpha-value>)',
                muted: 'rgb(var(--c-muted) / <alpha-value>)',
                accent: 'rgb(var(--c-accent) / <alpha-value>)',
                sale: 'rgb(var(--c-sale) / <alpha-value>)',
                forest: 'rgb(var(--c-forest) / <alpha-value>)',
            },

            fontFamily: {
                sans: ['Barlow', ...defaultTheme.fontFamily.sans],
                display: ['"Barlow Condensed"', 'Barlow', ...defaultTheme.fontFamily.sans],
            },

            fontSize: {
                'display-sm': ['clamp(1.5rem, 1.1rem + 1.8vw, 2.5rem)', { lineHeight: '1.02', letterSpacing: '-0.01em' }],
                'display-md': ['clamp(2rem, 1.2rem + 3.4vw, 3.75rem)', { lineHeight: '0.98', letterSpacing: '-0.015em' }],
                'display-lg': ['clamp(2.75rem, 1.4rem + 5.4vw, 5.5rem)', { lineHeight: '0.94', letterSpacing: '-0.02em' }],
            },

            letterSpacing: {
                label: '0.14em',
                wider2: '0.08em',
            },

            borderRadius: {
                DEFAULT: '2px',
                sm: '2px',
                md: '2px',
                lg: '3px',
                xl: '4px',
            },

            maxWidth: {
                page: '1600px',
            },

            transitionTimingFunction: {
                out: 'cubic-bezier(0.16, 1, 0.3, 1)',
            },

            keyframes: {
                'fade-in': {
                    from: { opacity: '0' },
                    to: { opacity: '1' },
                },
                'fade-up': {
                    from: { opacity: '0', transform: 'translateY(12px)' },
                    to: { opacity: '1', transform: 'translateY(0)' },
                },
                'slide-in-right': {
                    from: { transform: 'translateX(100%)' },
                    to: { transform: 'translateX(0)' },
                },
                'slide-in-left': {
                    from: { transform: 'translateX(-100%)' },
                    to: { transform: 'translateX(0)' },
                },
                'slide-in-bottom': {
                    from: { transform: 'translateY(100%)' },
                    to: { transform: 'translateY(0)' },
                },
                'slide-down': {
                    from: { opacity: '0', transform: 'translateY(-8px)' },
                    to: { opacity: '1', transform: 'translateY(0)' },
                },
            },

            animation: {
                'fade-in': 'fade-in 200ms cubic-bezier(0.16, 1, 0.3, 1) both',
                'fade-up': 'fade-up 400ms cubic-bezier(0.16, 1, 0.3, 1) both',
                'slide-in-right': 'slide-in-right 260ms cubic-bezier(0.16, 1, 0.3, 1) both',
                'slide-in-left': 'slide-in-left 260ms cubic-bezier(0.16, 1, 0.3, 1) both',
                'slide-in-bottom': 'slide-in-bottom 260ms cubic-bezier(0.16, 1, 0.3, 1) both',
                'slide-down': 'slide-down 180ms cubic-bezier(0.16, 1, 0.3, 1) both',
            },
        },
    },

    plugins: [forms],
};
