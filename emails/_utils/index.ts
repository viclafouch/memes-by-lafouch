export const baseUrl =
  process.env.NODE_ENV === 'production'
    ? `https://${process.env.VERCEL_URL}`
    : '/static'

export const styles = {
  main: {
    backgroundColor: '#f6f9fc',
    padding: '10px 0',
    fontFamily: `ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"`
  },

  container: {
    backgroundColor: '#ffffff',
    border: '1px solid #f0f0f0',
    padding: '45px'
  },

  text: {
    fontSize: '16px',
    fontWeight: '300',
    color: '#404040',
    lineHeight: '26px'
  },

  button: {
    backgroundColor: '#15c',
    borderRadius: '8px',
    border: '1px solid #ffffff',
    color: '#fff',
    fontFamily: `ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"`,
    fontSize: '15px',
    textDecoration: 'none',
    textAlign: 'center' as const,
    display: 'block',
    width: '210px',
    padding: '14px 7px'
  }
}
