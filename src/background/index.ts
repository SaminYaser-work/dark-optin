import { isBuilderPage } from '../lib/utils'

export const DEFAULT_SETTINGS = {
  enabled: true,
  customColorEnabled: false,
  customColor: '#1e1e1e',
}

// Handle extension installation and updates
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    chrome.storage.local.set({ settings: DEFAULT_SETTINGS })
  }
})

// Listen for tab updates to inject content script if necessary
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  // Only proceed if the page has finished loading
  if (changeInfo.status !== 'complete' || !tab.url?.startsWith('http')) {
    return
  }

  try {
    const { settings = DEFAULT_SETTINGS } = await chrome.storage.local.get('settings')

    if (!settings.enabled || !isBuilderPage()) {
      return
    }

    chrome.tabs
      .sendMessage(tabId, { action: 'updateSettings', payload: settings })
      .catch((error) => {
        // Content script might not be loaded yet, this is normal
        console.log('Content script not ready, will be handled on page load')
      })
  } catch (error) {
    console.error('Error in tab update handler:', error)
  }
})

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.action) {
    case 'updateSettings': {
      const settings = message.payload as ISettings

      chrome.storage.local.set({ settings })

      chrome.tabs.query({}, (tabs) => {
        tabs.forEach((tab) => {
          if (tab.id) {
            chrome.tabs.sendMessage(tab.id, { action: 'updateSettings', payload: settings })
          }
        })
      })
    }

    case 'getSettings': {
      chrome.storage.local.get('settings', (result) => {
        sendResponse({
          settings: result.settings || DEFAULT_SETTINGS,
        })
      })
    }
  }
})
