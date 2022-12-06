import React from 'react'
import { useTheme } from "next-themes"

const LogoTitle = () => {
  const { theme} = useTheme()
  return <>
  {theme === "light" ? <img className='w-[180px]' src="/images/powmemes-high-resolution-logo-black-on-transparent-background.png" /> : <img className='w-[180px]' src="/images/powmemes-high-resolution-logo-white-on-transparent-background.png"/>}</>
}

export default LogoTitle