const fragment: { [prop: string]: any } = {};
const internal: { [prop: string]: any } = {};

// @ts-ignore
const chrome = globalThis['chrome'] as any;

internal.whenClicked = () => {
  try {
    // + send example-extension-content.ts an action
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { command: 'append' }, (response) => {
        console.log(response);
      });
    });
  } catch (error) {
    // not allow to access current tab
    // console.warn(error);
  }
};

chrome.browserAction.onClicked //
  .addListener(internal.whenClicked);
