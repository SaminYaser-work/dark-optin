import { useEffect, useState } from 'react'

import { DEFAULT_SETTINGS } from '../background'
import './Popup.css'

const link = 'https://yaser.com.bd'
export const Popup = () => {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    chrome.storage.local.get('settings', (result) => {
      setSettings(result.settings || DEFAULT_SETTINGS)
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    if (!loading) {
      chrome.runtime.sendMessage({ action: 'updateSettings', payload: settings })
    }
  }, [settings, loading])

  const content = loading ? (
    <div className="loader" />
  ) : (
    <>
      <div className="container">
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

        {settings.enabled && (
          <>
            <label className="switch-wrapper">
              <div>Enable Custom Color</div>
              <div className="switch">
                <input
                  className="toggle"
                  type="checkbox"
                  checked={settings.customColorEnabled}
                  onChange={(e) =>
                    setSettings((prev) => ({ ...prev, customColorEnabled: e.target.checked }))
                  }
                />
                <span className="slider" />
              </div>
            </label>

            {settings.customColorEnabled && (
              <label className="switch-wrapper">
                <div>Custom Color</div>
                <input
                  type="color"
                  onChange={(e) =>
                    setSettings((prev) => ({ ...prev, customColor: e.target.value }))
                  }
                />
              </label>
            )}
          </>
        )}
      </div>
    </>
  )

  return (
    <main>
      <h3>
        Dark <Glasses width={38} height={38} /> Optin
      </h3>

      {content}

      <a href={link} target="_blank">
        Created with ⚡ by Samin Yaser
      </a>
    </main>
  )
}

function Glasses(props: React.SVGAttributes<SVGSVGElement>) {
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
      {...props}
    >
      <circle cx={6} cy={15} r={4} />
      <circle cx={18} cy={15} r={4} />
      <path d="M14 15a2 2 0 00-2-2 2 2 0 00-2 2M2.5 13L5 7c.7-1.3 1.4-2 3-2M21.5 13L19 7c-.7-1.3-1.5-2-3-2" />
    </svg>
  )
}

export default Popup
