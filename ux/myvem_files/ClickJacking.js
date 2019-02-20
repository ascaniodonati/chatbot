function antiClickJackIng() {
    return;
    // Se si tratta di un browser IE o Edge (prima della versione 15 non supporta il CSP)
    if (window.navigator.userAgent.indexOf("MSIE ") > 0 || window.navigator.userAgent.indexOf("Edge/") > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {

        addStyle();

        var hasPermise = true;

        try {
            console.log("wp: " +window.parent.location);
        } catch (e) {
            hasPermise = false;
        }

        var url = window.location;

        if (hasPermise === true)
            url = (window.location != window.parent.location)
                ? getHostName(document.referrer)
                : document.location.hostname;
        else {
            try {
                url = getHostName(document.referrer)
            } catch (ex) {
                console.error("err new url " + ex);
            }
        }

        if (self === top) {
            console.log("ClickJacking ===> Self Domain");

            removeStyle();
        } else {

            try {
                if (url != "myvemtest.com" &&
                    url != "nms.vg" &&
                    url != "myvem.com" &&
                    url != "vem.com" && 
                    url != "localhost"
                    ) {
                    console.error("ClickJacking ===> Domain Not Trusted");
                } else {
                    console.log("ClickJacking ===> Domain Trusted");
                   // top.location = self.location
                    removeStyle();
                }

            } catch (ex) {
                console.error(ex);
            }
        }
    }
}

function getHostName(url) {
    var match = url.match(/:\/\/(www[0-9]?\.)?(.[^/:]+)/i);
    if (match != null && match.length > 2 && typeof match[2] === 'string' && match[2].length > 0) {
        return match[2];
    }
    else {
        return null;
    }
}

function getDomain(url) {
    if (url) {
        var match = /(?:https?:\/\/)?(?:\w+:\/)?[^:?#\/\s]*?([^.\s]+\.(?:[a-z]{2,}|co\.uk|org\.uk|ac\.uk|org\.au|com\.au))(?:[:?#\/]|$)/gi
                .exec(url);
        return match ? match[1] : null;
    } else
        return null;
}

function addStyle() {
    document.body.innerHTML += '<style id="antiClickjack">body{display:none !important;}</style>';
}

function removeStyle() {
    var antiClickjack = document.getElementById("antiClickjack");
    if (antiClickjack)
        antiClickjack.parentNode.removeChild(antiClickjack);
}