function init() {
  [
    "reset_shortcuts_button"
  ].forEach((id) => {
    document.querySelector("#" + id).textContent = browser.i18n.getMessage(id);
  });

  // Init shortcut reset button
  ResetShortcuts.Init();
}

init();
