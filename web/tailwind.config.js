// Theme from helpapp (Timebars Cloud), so the blog looks like the rest of the Timebars sites.
/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		'./pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./components/**/*.{js,ts,jsx,tsx,mdx}',
		'./app/**/*.{js,ts,jsx,tsx,mdx}',
		'./lib/**/*.{js,jsx}',
	],
	darkMode: ['class'],
	safelist: [
		'text-tbBrown',
		'text-tbGreen',
		'text-tbOrange',
		'text-tbBlue',
		'text-tbBlue2',
		'text-tbGold',
		'text-tbGrey',
		'text-tbBlack',
		'text-tbGreyLight',
		'text-tbYellow'
	],
	theme: {
		extend: {
			fontFamily: {
				sans: ['Poppins', 'sans-serif'],
				poppins: ['Poppins', 'sans-serif']
			},
			gridTemplateColumns: {
				'70/30': '70% 28%'
			},
			colors: {
				tbBrown: '#5C4033',
				tbGreen: '#4fb258',
				tbOrange: '#ffa726',
				tbBlue: '#2519cc',
				tbBlue2: '#4286f3',
				tbGold: '#F5cf05',
				tbGrey: '#2b4631',
				tbBlack: '#0e0d0d',
				tbGreyLight: '#E3e8ec',
				tbYellow: '#F5cf05',
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				brown: {
					100: '#efebe9',
					200: '#d7ccc8',
					300: '#bcaaa4',
					400: '#a1887f',
					500: '#8d6e63',
					600: '#795548',
					700: '#6d4c41',
					800: '#5d4037',
					900: '#4e342e',
				},
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				lavender: {
					DEFAULT: '#8B5CF6',
					light: '#A78BFA'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				accent: {
					gold: '#F59E0B',
					teal: '#14B8A6',
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				gray: {
					dark: '#1F2937',
					light: '#F3F4F6',
					text: '#374151'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				chart: {
					'1': 'hsl(var(--chart-1))',
					'2': 'hsl(var(--chart-2))',
					'3': 'hsl(var(--chart-3))',
					'4': 'hsl(var(--chart-4))',
					'5': 'hsl(var(--chart-5))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out'
			}
		}
	},
	plugins: [
		require('@tailwindcss/typography'),
		require("tailwindcss-animate"),
	],
};