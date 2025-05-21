import { DEFAULT_SETTINGS } from '../background'
import { isBuilderPage } from '../lib/utils'

let styleElement: HTMLStyleElement | null = null

function injectStyle(settings: ISettings) {
  try {
    // Remove existing style if any
    if (styleElement) {
      styleElement.remove()
    }

    styleElement = document.createElement('style')
    styleElement.id = 'dark-optin-styles'
    styleElement.textContent = `
        .optn-builder-editor-container {
            background: ${settings.customColorEnabled ? settings.customColor : '#282b30'};
        }
    `
    document.head.appendChild(styleElement)
  } catch (error) {
    console.error('Error injecting style:', error)
  }
}

function removeStyle() {
  if (styleElement) {
    styleElement.remove()
    styleElement = null
  }
}

async function initialize() {
  try {
    const { settings = DEFAULT_SETTINGS } = await chrome.storage.local.get('settings')

    if (settings?.enabled && isBuilderPage()) {
      injectStyle(settings)
    } else {
      removeStyle()
    }
  } catch (error) {
    console.error('Error initializing style injector:', error)
  }
}

chrome.runtime.onMessage.addListener(
  ({ action, payload }: { action: string; payload: ISettings }) => {
    console.log(action, payload)
    if (action === 'updateSettings' && payload.enabled && isBuilderPage()) {
      injectStyle(payload)
    } else {
      removeStyle()
    }
  },
)

initialize()
