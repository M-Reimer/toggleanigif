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

"use strict";

(() => {
  // Get sure we register only once.
  if (window.hasListener === true) return;
  window.hasListener = true;

  // Register message event listener.
  browser.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
    if (request.type == "FreezeAnimation") {
      // Get the referenced image.
      let elem = browser.menus.getTargetElement(request.elementid);
      if (!elem)
        return;

      // Copy the image content to a canvas and replace the animation with the
      // static image.
      const canvas = document.createElement("canvas");
      canvas.width = elem.width;
      canvas.height = elem.height;
      canvas.getContext("2d").drawImage(elem, 0, 0, elem.width, elem.height);
      elem.src = canvas.toDataURL("image/png");
    }
  });
})();
