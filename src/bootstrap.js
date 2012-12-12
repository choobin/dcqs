/*
Copyright 2012 Christopher Hoobin. All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are
met:

   1. Redistributions of source code must retain the above copyright
      notice, this list of conditions and the following disclaimer.

   2. Redistributions in binary form must reproduce the above
      copyright notice, this list of conditions and the following
      disclaimer in the documentation and/or other materials provided
      with the distribution.

THIS SOFTWARE IS PROVIDED BY CHRISTOPHER HOOBIN ''AS IS'' AND ANY
EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL CHRISTOPHER HOOBIN OR
CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

The views and conclusions contained in the software and documentation
are those of the authors and should not be interpreted as representing
official policies, either expressed or implied, of Christopher Hoobin.
*/

Components.utils.import("resource://gre/modules/Services.jsm");

let moongiraffe = {};

moongiraffe.Dcqs = {
    toggle: function(window, value) {
        var shortcut = window.document.getElementById("key_quitApplication");

        if (shortcut)
            shortcut.setAttribute("disabled", value);
    },

    set: function(window) {
        moongiraffe.Dcqs.toggle(window, "true");
    },

    unset: function(window) {
        moongiraffe.Dcqs.toggle(window, "false");
    },

    observe: function(subject, topic, data) {
        if (topic === "domwindowopened") {
            subject.addEventListener("load", function(event) {
                moongiraffe.Dcqs.set(subject);
            }, false);
        }
    },
};

function startup(data, reason) {
    Services.ww.registerNotification(moongiraffe.Dcqs);

    let windows = Services.wm.getEnumerator("navigator:browser");

    while (windows.hasMoreElements()) {
        moongiraffe.Dcqs.set(windows.getNext());
    }
}

function shutdown(data, reason) {
    Services.ww.unregisterNotification(moongiraffe.Dcqs);

    let windows = Services.wm.getEnumerator("navigator:browser");

    while (windows.hasMoreElements()) {
        moongiraffe.Dcqs.unset(windows.getNext());
    }
}

function install(data, reason) {
}

function uninstall(data, reason) {
}
