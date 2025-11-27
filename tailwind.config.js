import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],
    darkMode: 'class',
    theme: {
        extend: {
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                // Cores do modo light
                light: {
                  background: '#F9F9F9',
                  foreground: '#191F2A',
                  card: '#FFFFFF',
                  'card-foreground': '#191F2A',
                  primary: '#3551E3',
                  'primary-foreground': '#F9F9F9',
                  secondary: '#F5F5F5',
                  'secondary-foreground': '#191F2A',
                  muted: '#F5F5F5',
                  'muted-foreground': '#737373',
                  accent: '#F5F5F5',
                  'accent-foreground': '#191F2A',
                  destructive: '#EF4444',
                  'destructive-foreground': '#F9F9F9',
                  border: '#E5E5E5',
                  input: '#E5E5E5',
                  ring: '#3551E3',
                },
                // Cores do modo dark
                dark: {
                  background: '#191F2A',
                  foreground: '#F9F9F9',
                  card: '#111727',
                  'card-foreground': '#F9F9F9',
                  primary: '#3551E3',
                  'primary-foreground': '#F9F9F9',
                  secondary: '#242F42',
                  'secondary-foreground': '#F9F9F9',
                  muted: '#242F42',
                  'muted-foreground': '#9CA3AF',
                  accent: '#242F42',
                  'accent-foreground': '#F9F9F9',
                  destructive: '#EF4444',
                  'destructive-foreground': '#F9F9F9',
                  border: '#242F42',
                  input: '#242F42',
                  ring: '#5F96F5',
                },
                // Sua paleta de cores completa
                blue: {
                  light: '#5F96F5',
                  primary: '#3551E3',
                  dark: '#242F7C',
                  darker: '#202A58',
                },
                green: {
                  success: '#42D879',
                  dark: '#154929',
                },
                purple: {
                  light: '#BB76F8',
                  dark: '#501679',
                }
              },
        },
    },

    plugins: [forms],
};