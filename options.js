const checkAutoReload = document.getElementById("autoreload_checkbox");

async function CheckboxChanged(e) {
  if (e.target.id.match(/([a-z_]+)_checkbox/)) {
    let pref = RegExp.$1;
    let params = {};
    params[pref] = e.target.checked;
    await browser.storage.local.set(params);
  }
}

function init() {
  [
    "autoreload_label",
    "reset_shortcuts_button"
  ].forEach((id) => {
    document.querySelector("#" + id).textContent = browser.i18n.getMessage(id);
  });

  loadOptions();
  checkAutoReload.addEventListener("change", CheckboxChanged);

  // Init shortcut reset button
  ResetShortcuts.Init();
}

function loadOptions() {
  browser.storage.local.get().then((result) => {
    checkAutoReload.checked = result.autoreload || false;
  });
}

init();
