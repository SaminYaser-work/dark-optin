import { memo, useEffect, useState } from 'react'

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
              <div>Custom Color</div>
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
                <div>Choose Color</div>
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
      <Title />

      {content}

      <Link />
    </main>
  )
}

const Title = memo(() => {
  return (
    <h3>
      Dark{' '}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Icon width={38} height={38} />
        ptin
      </div>
    </h3>
  )
})

const Link = memo(() => {
  return (
    <a href={link} target="_blank">
      Created with ⚡ by Samin Yaser
    </a>
  )
})

function Icon(props: React.SVGAttributes<SVGSVGElement>) {
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
      className="lucide lucide-moon-icon lucide-moon"
      {...props}
    >
      <path d="M12 3a6 6 0 009 9 9 9 0 11-9-9z" />
    </svg>
  )
}

export default Popup
