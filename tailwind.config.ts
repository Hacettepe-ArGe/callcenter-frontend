import type { Config } from "tailwindcss";
import { colors } from "./lib/constants/colors"
import { breakpoints } from "./lib/constants/breakpoints"

const config: Config = {
    darkMode: ["class"],
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
  	container: {
  		center: true,
  		padding: {
  			DEFAULT: '1rem',
  			sm: '1.5rem',
  			lg: '2rem',
  		},
  		screens: {
  			'2xl': '1600px',
  		},
  	},
  	screens: {
  		'sm': breakpoints.sm,
  		'md': breakpoints.md,
  		'lg': breakpoints.lg,
  		'xl': breakpoints.xl,
  		'2xl': breakpoints['2xl'],
  	},
  	extend: {
  		fontFamily: {
			khand: ['var(--font-khand)'],
  			poppins: ['var(--font-poppins)'],
  		},
  		colors: {
  			...colors,
  			border: colors.sage.DEFAULT,
  			input: colors.sage.light,
  			ring: colors.forest.DEFAULT,
  			background: colors.cream,
  			foreground: colors.forest.DEFAULT,
  			primary: {
  				DEFAULT: colors.sage.DEFAULT,
  				foreground: colors.forest.DEFAULT,
  			},
  			secondary: {
  				DEFAULT: colors.mint,
  				foreground: colors.forest.DEFAULT,
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			muted: {
  				DEFAULT: colors.sage.light,
  				foreground: colors.forest.DEFAULT,
  			},
  			accent: {
  				DEFAULT: colors.forest.light,
  				foreground: colors.forest.DEFAULT,
  			},
  			popover: {
  				DEFAULT: colors.cream,
  				foreground: colors.forest.DEFAULT,
  			},
  			card: {
  				DEFAULT: colors.cream,
  				foreground: colors.forest.DEFAULT,
  			},
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			},
  			cream: colors.cream,
  			forest: colors.forest,
  			sage: colors.sage,
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		height: {
  			'screen-navbar': 'calc(100vh - var(--navbar-height))',
  		},
  		minHeight: {
  			'screen-navbar': 'calc(100vh - var(--navbar-height))',
  		},
  		spacing: {
  			'navbar': 'var(--navbar-height)',
  		},
  	}
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
