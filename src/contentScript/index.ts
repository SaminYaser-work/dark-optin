import { isBuilderPage } from '../lib/utils'

let styleElement: HTMLStyleElement | null = null

function injectStyle() {
  try {
    // Remove existing style if any
    if (styleElement) {
      styleElement.remove()
    }

    styleElement = document.createElement('style')
    styleElement.id = 'dark-optin-styles'
    styleElement.textContent = `
        .optn-builder-editor-container {
            background: red !important;
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
    const { settings } = await chrome.storage.sync.get(['settings'])

    if (settings?.enabled && isBuilderPage()) {
      injectStyle()
    } else {
      removeStyle()
    }
  } catch (error) {
    console.error('Error initializing style injector:', error)
  }
}

chrome.runtime.onMessage.addListener(
  ({ action, payload: { enabled = false } }: { action: string; payload: ISettings }) => {
    if (action === 'updateSettings' && enabled && isBuilderPage()) {
      injectStyle()
    } else {
      removeStyle()
    }
  },
)

initialize()
