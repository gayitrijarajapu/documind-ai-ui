const logoPath = '/app-logo.png'

function AppLogo({ className = 'h-10 w-10 rounded-md', imageClassName = 'h-9 w-9' }) {
  return (
    <div className={`grid place-items-center ${className}`}>
      <img
        alt="DocuMind AI logo"
        className={`object-contain grayscale ${imageClassName}`}
        src={logoPath}
      />
    </div>
  )
}

export default AppLogo
