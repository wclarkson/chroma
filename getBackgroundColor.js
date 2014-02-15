chrome.extension.sendMessage({
  action: "getBackgroundColor",
  color: document.defaultView
                 .getComputedStyle(document.body, null)["background-color"]
});
