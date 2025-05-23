export const DEFAULT_SETTINGS = {
  enabled: true,
  customColorEnabled: false,
  customColor: '#222831',
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.action) {
    case 'updateSettings': {
      const settings = message.payload as ISettings

      chrome.storage.local.set({ settings })

      chrome.tabs?.query({}, (tabs) => {
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
