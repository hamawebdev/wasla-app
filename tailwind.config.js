/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: process.env.DARK_MODE ? process.env.DARK_MODE : 'class',
  content: [
    './app/**/*.{html,js,jsx,ts,tsx,mdx}',
    './components/**/*.{html,js,jsx,ts,tsx,mdx}',
    './utils/**/*.{html,js,jsx,ts,tsx,mdx}',
    './*.{html,js,jsx,ts,tsx,mdx}',
    './src/**/*.{html,js,jsx,ts,tsx,mdx}',
  ],
  presets: [require('nativewind/preset')],
  important: 'html',
  safelist: [
    {
      pattern:
        /(bg|border|text|stroke|fill)-(background|foreground|card|card-foreground|primary|primary-foreground|secondary|secondary-foreground|muted|muted-foreground|accent|accent-foreground|destructive|destructive-foreground|border|input|ring|success|success-foreground|warning|warning-foreground)/,
    },
  ],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--color-background) / <alpha-value>)',
        foreground: 'hsl(var(--color-foreground) / <alpha-value>)',

        card: 'hsl(var(--color-card) / <alpha-value>)',
        'card-foreground': 'hsl(var(--color-card-foreground) / <alpha-value>)',

        primary: 'hsl(var(--color-primary) / <alpha-value>)',
        'primary-foreground': 'hsl(var(--color-primary-foreground) / <alpha-value>)',

        secondary: 'hsl(var(--color-secondary) / <alpha-value>)',
        'secondary-foreground': 'hsl(var(--color-secondary-foreground) / <alpha-value>)',

        muted: 'hsl(var(--color-muted) / <alpha-value>)',
        'muted-foreground': 'hsl(var(--color-muted-foreground) / <alpha-value>)',

        accent: 'hsl(var(--color-accent) / <alpha-value>)',
        'accent-foreground': 'hsl(var(--color-accent-foreground) / <alpha-value>)',

        destructive: 'hsl(var(--color-destructive) / <alpha-value>)',
        'destructive-foreground': 'hsl(var(--color-destructive-foreground) / <alpha-value>)',

        border: 'hsl(var(--color-border) / <alpha-value>)',
        input: 'hsl(var(--color-input) / <alpha-value>)',
        ring: 'hsl(var(--color-ring) / <alpha-value>)',

        success: 'hsl(var(--color-success) / <alpha-value>)',
        'success-foreground': 'hsl(var(--color-success-foreground) / <alpha-value>)',
        warning: 'hsl(var(--color-warning) / <alpha-value>)',
        'warning-foreground': 'hsl(var(--color-warning-foreground) / <alpha-value>)',

        // MD3 aliases
        surface: 'hsl(var(--color-surface) / <alpha-value>)',
        'surface-container-lowest': 'hsl(var(--color-surface-container-lowest) / <alpha-value>)',
        'surface-container-low': 'hsl(var(--color-surface-container-low) / <alpha-value>)',
        'surface-container': 'hsl(var(--color-surface-container) / <alpha-value>)',
        'surface-container-high': 'hsl(var(--color-surface-container-high) / <alpha-value>)',
        'surface-variant': 'hsl(var(--color-surface-variant) / <alpha-value>)',
        'on-surface': 'hsl(var(--color-on-surface) / <alpha-value>)',
        'on-surface-variant': 'hsl(var(--color-on-surface-variant) / <alpha-value>)',
        outline: 'hsl(var(--color-outline) / <alpha-value>)',
        'outline-variant': 'hsl(var(--color-outline-variant) / <alpha-value>)',
        'primary-fixed': 'hsl(var(--color-primary-fixed) / <alpha-value>)',
        'on-primary-fixed-variant': 'hsl(var(--color-on-primary-fixed-variant) / <alpha-value>)',
        'secondary-container': 'hsl(var(--color-secondary-container) / <alpha-value>)',
        'on-secondary-container': 'hsl(var(--color-on-secondary-container) / <alpha-value>)',
        tertiary: 'hsl(var(--color-tertiary) / <alpha-value>)',
        'tertiary-fixed': 'hsl(var(--color-tertiary-fixed) / <alpha-value>)',
        'on-tertiary-fixed-variant': 'hsl(var(--color-on-tertiary-fixed-variant) / <alpha-value>)',
        'error-container': 'hsl(var(--color-error-container) / <alpha-value>)',
        'on-error-container': 'hsl(var(--color-on-error-container) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['Rubik', 'ui-sans-serif', 'system-ui'],
      },
      borderRadius: {
        xl: '16px',
        lg: '12px',
        md: '8px',
        sm: '6px',
      },
      boxShadow: {
        sm: '0px 4px 10px 0px rgba(15, 28, 32, 0.04)',
        md: '0px 8px 20px 0px rgba(15, 28, 32, 0.08)',
        lg: '0px 16px 40px 0px rgba(15, 28, 32, 0.12)',
      },
      fontSize: {
        '2xs': '10px',
      },
      fontWeight: {
        extrablack: '950',
      },
      lineHeight: {
        arabic: '1.6',
      },
      letterSpacing: {
        arabic: '-0.01em',
      },
      minHeight: {
        'touch': '48px',
        'btn': '56px',
      },
    },
  },
};
