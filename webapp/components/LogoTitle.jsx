import React from 'react'
import { useTheme } from "next-themes"

const LogoTitle = () => {
  const { theme} = useTheme()
  return <>
  {theme === "light" ? <img className='w-[120px]' src="/images/flutter-high-resolution-logo-black-on-transparent-background.png" /> : <img className='w-[120px]' src="/images/flutter-high-resolution-logo-color-on-transparent-background.png"/>}</>
}

export default LogoTitle