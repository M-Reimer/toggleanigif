/*
    Firefox addon "Toggle Animated Gif"
    Copyright (C) 2022  Manuel Reimer <manuel.reimer@gmx.de>

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

// Fired if the toolbar button is clicked.
// Toggles the anigif setting.
async function ToolbarButtonClicked(aTab) {
  let value = (await browser.browserSettings.imageAnimationBehavior.get({})).value;
  value = (value == "none") ? "normal" : "none";
  await browser.browserSettings.imageAnimationBehavior.set({value: value});
  await UpdateBadge();

  const prefs = await browser.storage.local.get();
  const autoreload = prefs.autoreload || false;
  if (autoreload)
    browser.tabs.reload(aTab.id);
}

// Sets browserAction badge text based on anigif status.
async function UpdateBadge() {
  let value = (await browser.browserSettings.imageAnimationBehavior.get({})).value;
  value = (value != "none");
  const badgetext = value ? "" : "X";
  const title = browser.i18n.getMessage("button_title") + " (" +
      browser.i18n.getMessage(value ? "title_enabled" : "title_disabled") +
      ")";

  if (browser.browserAction.setBadgeText !== undefined) // Not Android
    browser.browserAction.setBadgeText({text: badgetext});
  browser.browserAction.setTitle({title: title});
}

// Shows/hides the "Freeze animation" context menu entry based on the
// availability of the required "<all_urls>" permission.
async function UpdateMenu() {
  browser.menus.removeAll();
  if (await browser.permissions.contains({origins: ["<all_urls>"]})) {
    browser.menus.create({
      title: browser.i18n.getMessage("freeze_animation_title"),
      contexts: ["image"]
    })
  }
}

// Only of "menus" support exists (not on Android)
if (browser.menus !== undefined) {
  browser.permissions.onAdded.addListener(UpdateMenu);
  browser.permissions.onRemoved.addListener(UpdateMenu);
  UpdateMenu();

  // Fired if the context menu entry "Freeze animation" is clicked.
  browser.menus.onClicked.addListener(async (info, tab) => {
    // Load our content script into the active tab
    await browser.tabs.executeScript(tab.id, {
      allFrames: true,
      file: "contentscript.js"
    });

    // Communicate the targetElementId, which references the image, to our
    // content script.
    await browser.tabs.sendMessage(tab.id, {
      type: "FreezeAnimation",
      elementid: info.targetElementId
    });
  });
}

// Set background color to a non-intrusive gray
if (browser.browserAction.setBadgeBackgroundColor !== undefined) // Not Android
  browser.browserAction.setBadgeBackgroundColor({color: "#666666"});

// Register event listeners
browser.browserAction.onClicked.addListener(ToolbarButtonClicked);

// Update badge for the first time
UpdateBadge();

IconUpdater.Init("icons/toggleanigif.svg");
