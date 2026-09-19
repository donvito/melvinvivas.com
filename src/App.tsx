import { useState } from 'react'
import { BootScreen } from './components/BootScreen'
import { Desktop } from './components/Desktop'

const SKIP_BOOT_KEY = 'xp:booted'

export default function App() {
  const [booted, setBooted] = useState(() => sessionStorage.getItem(SKIP_BOOT_KEY) === '1')

  if (!booted) {
    return (
      <BootScreen
        onDone={() => {
          sessionStorage.setItem(SKIP_BOOT_KEY, '1')
          setBooted(true)
        }}
      />
    )
  }

  return (
    <Desktop
      onLogOff={() => {
        sessionStorage.removeItem(SKIP_BOOT_KEY)
        history.replaceState(null, '', window.location.pathname)
        setBooted(false)
      }}
    />
  )
}
