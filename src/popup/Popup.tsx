import { useEffect, useState } from 'react'

import { DEFAULT_SETTINGS } from '../background'
import './Popup.css'

const link = 'https://yaser.com.bd'

function Glasses(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-glasses-icon lucide-glasses"
      {...props}
    >
      <circle cx={6} cy={15} r={4} />
      <circle cx={18} cy={15} r={4} />
      <path d="M14 15a2 2 0 00-2-2 2 2 0 00-2 2M2.5 13L5 7c.7-1.3 1.4-2 3-2M21.5 13L19 7c-.7-1.3-1.5-2-3-2" />
    </svg>
  )
}

export const Popup = () => {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    chrome.storage.sync.get(['settings'], (result) => {
      console.log(result)
      setSettings(Object.assign({}, DEFAULT_SETTINGS, result.settings || {}))
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    if (!loading) {
      chrome.runtime.sendMessage({ action: 'updateSettings', payload: settings })
    }
  }, [settings, loading])

  return (
    <main>
      {loading ? (
        <div className="loader" />
      ) : (
        <>
          <h3>
            Dark <Glasses width={32} height={32} /> Optin
          </h3>

          <label className="switch-wrapper">
            <div>Enable</div>
            <div className="switch">
              <input
                className="toggle"
                type="checkbox"
                checked={settings.enabled}
                onChange={(e) => setSettings((prev) => ({ ...prev, enabled: e.target.checked }))}
              />
              <span className="slider" />
            </div>
          </label>

          <a href={link} target="_blank">
            Created with ⚡ by Samin Yaser
          </a>
        </>
      )}
    </main>
  )
}

export default Popup
