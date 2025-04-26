interface CustomWeatherIconProps {
  size?: number
}

export function CustomWeatherIcon({ size = 100 }: CustomWeatherIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M30 35C30 26.7157 36.7157 20 45 20C53.2843 20 60 26.7157 60 35" stroke="black" strokeWidth="3" />
      <path d="M25 40C25 31.7157 31.7157 25 40 25" stroke="black" strokeWidth="3" />
      <path d="M65 40C65 31.7157 58.2843 25 50 25" stroke="black" strokeWidth="3" />
      <path
        d="M25 45C16.7157 45 10 51.7157 10 60C10 68.2843 16.7157 75 25 75H75C83.2843 75 90 68.2843 90 60C90 51.7157 83.2843 45 75 45C75 36.7157 68.2843 30 60 30C51.7157 30 45 36.7157 45 45H25Z"
        fill="white"
        stroke="black"
        strokeWidth="3"
      />
    </svg>
  )
}
