import { extendTheme, theme as base, withDefaultColorScheme, withDefaultVariant } from "@chakra-ui/react";

const inputSelectStyle = {
    variants: {
        filled: {
            field: {
                _focus: {
                    borderColor: 'none',
                }
            }
        }
    }
}

const theme = extendTheme({
    colors: {
        brand: {
          50: '#FEDFD7',
          100: '#FEC4B5',
          200: '#F6957C',
          300: '#EE6440',
          400: '#E14016',
          500: '#B02805',
          600: '#881D02',
          700: '#5A1302',
          800: '#370B01',
        },
      },
    fonts: {
        heading: `Montserrat, ${base.fonts.heading}`,
        body: `Inter, ${base.fonts.heading}`
    },
    components: {
        Input: {...inputSelectStyle},
    }
}, 
    // withDefaultColorScheme({
    //     colorScheme: 'brand',
    //     components: ['Button']
    // }),
    withDefaultVariant({
        variant: 'filled',
        components: ['Input']
    })
)


export default theme