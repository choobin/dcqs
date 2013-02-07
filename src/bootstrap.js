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

const PREFBRANCH = "extensions.dcqs@moongiraffe.net.";

let Dcqs = {
    startup: function(data) {
        let branch = Services.prefs.getDefaultBranch(PREFBRANCH);

        branch.setBoolPref("enable-control-shift-q", false);

        Services.prefs.addObserver(PREFBRANCH + "enable-control-shift-q", Dcqs, false);

        Services.ww.registerNotification(Dcqs);

        Dcqs.windows(Dcqs.set);
    },

    shutdown: function() {
        Services.prefs.removeObserver(PREFBRANCH + "enable-control-shift-q", Dcqs);

        Services.ww.unregisterNotification(Dcqs);

        Dcqs.windows(Dcqs.unset);
    },

    uninstall: function() {
        Services.prefs.deleteBranch(PREFBRANCH);
    },

    windows: function(fn) {
        let windows = Services.wm.getEnumerator("navigator:browser");

        while (windows.hasMoreElements()) {
            fn(windows.getNext());
        }
    },

    set: function(window) {
        var shortcut = window.document.getElementById("key_quitApplication");

        if (!shortcut)
            return;

        let ecsqs = Dcqs.ecsqs("enable-control-shift-q");

        if (ecsqs) {
            shortcut.setAttribute("modifiers", "accel shift");
            shortcut.setAttribute("disabled", "false");
        }
        else {
            shortcut.setAttribute("modifiers", "accel");
            shortcut.setAttribute("disabled", "true");
        }
    },

    unset: function(window) {
        var shortcut = window.document.getElementById("key_quitApplication");

        if (!shortcut)
            return;

        Services.console.logStringMessage("unset");

        shortcut.setAttribute("modifiers", "accel");
        shortcut.setAttribute("disabled", "false");
    },

    ecsqs: function(key) {
        let branch = Services.prefs.getBranch(PREFBRANCH);

        return branch.getBoolPref(key);
    },

    observe: function(subject, topic, data) {
        if (topic === "domwindowopened") {
            subject.addEventListener("load", function(event) {
                Dcqs.set(subject);
            }, false);
        }
        else {
            Dcqs.windows(Dcqs.set);
        }
    }
};

function startup(data, reason) {
    // As of Gecko 10.0, manifest registration is performed automatically.
    if (Services.vc.compare(Services.appinfo.platformVersion, "10.0") < 0)
        Components.manager.addBootstrappedManifestLocation(data.installPath);

    Dcqs.startup(data);
}

function shutdown(data, reason) {
    if (Services.vc.compare(Services.appinfo.platformVersion, "10.0") < 0)
        Components.manager.removeBootstrappedManifestLocation(data.installPath);

    Dcqs.shutdown();
}

function install(data, reason) {
}

function uninstall(data, reason) {
    if (reason === 6 /* ADDON_UNINSTALL */)
        Dcqs.uninstall();
}
