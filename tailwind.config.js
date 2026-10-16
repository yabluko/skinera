/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            maxWidth: {
                '8xl': '88rem',   // 1408px
                '9xl': '96rem',   // 1536px
                '10xl': '104rem', // 1664px
                '11xl': '112rem', // 1792px
                '12xl': '120rem', // 1920px
                '13xl': '128rem', // 2048px
                '14xl': '136rem', // 2176px
                '15xl': '144rem', // 2304px
                '16xl': '152rem', // 2432px
                '17xl': '160rem', // 2560px
                '18xl': '168rem', // 2688px
                '19xl': '176rem', // 2816px
            },
            fontFamily: {
                display: ['var(--font-cormorant)', 'Times New Roman', 'serif'],
                body: ['var(--font-manrope)', 'system-ui', 'sans-serif'],
            },
            colors: {
                // Redesign palette ("The Quiet Studio")
                skin: {
                    pink: '#e9a9a4',
                    'pink-deep': '#c97a76',
                    'pink-soft': '#f6deda',
                    lavender: '#bfb6c9',
                    'lavender-soft': '#e6e1ec',
                    'lavender-deep': '#7d7290',
                    ink: '#3a3330',
                    gray: '#8a817a',
                    'gray-mid': '#d6cfc8',
                    paper: '#efebe7',
                    white: '#fffdfb',
                },
                backgroundYellow: '#FCEFE7',
                backgroundPink: '#F5E6ED',
                background: "var(--background)",
                foreground: "var(--foreground)",
                grayCustom: '#8F8F8F',
                pinkCustom: '#FFE9F5',

                brand: {
                    50: '#FAF7F9',
                    100: '#F5E6ED',
                    200: '#EECFDC',
                    300: '#E6B8CD',
                    400: '#DFA1BE',
                    500: '#D95A89',
                    600: '#BF4475',
                    700: '#A03D66',
                },
                social: {
                    instagram: {
                        from: '#833AB4',
                        via: '#FD1D1D',
                        to: '#405DE6',
                    },
                    facebook: '#1877F2',
                    telegram: '#0088CC',
                },
            },
            boxShadow: {
                '3xl': '0 -7px 50px -20px rgba(0, 0, 0, 0.3)',
            },
            screens: {
                "md": '800px'
            },
            backgroundImage: {
                'arrow-down': "url('/components/svgs/arrow-down.svg')"
            }
        },
    },
    plugins: [
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        require('@tailwindcss/forms'),
    ],
} 