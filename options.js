const checkAutoReload = document.getElementById("autoreload_checkbox");
const checkFreeze = document.getElementById("freeze_checkbox");

// If the user checks the checkbox, then trigger a permission request.
// If the user denies the request, then switch the checkbox back to "unchecked".
// If the user unchecks the checkbox, then drop the additional permissions.
async function checkFreezeChanged(e) {
  const permissions = { origins: ["<all_urls>"] };

  if (checkFreeze.checked) {
    const success = await browser.permissions.request(permissions);
    if (!success)
      checkFreeze.checked = false;
  }
  else
    await browser.permissions.remove(permissions);
}

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
    "autoreload_label"
  ].forEach((id) => {
    document.querySelector("#" + id).textContent = browser.i18n.getMessage(id);
  });

  loadOptions();
  checkAutoReload.addEventListener("change", CheckboxChanged);
  checkFreeze.addEventListener("change", checkFreezeChanged);
}

async function loadOptions() {
  checkFreeze.checked = await browser.permissions.contains({origins: ["<all_urls>"]});

  browser.storage.local.get().then((result) => {
    checkAutoReload.checked = result.autoreload || false;
  });
}

init();
