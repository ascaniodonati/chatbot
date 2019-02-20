function l_page() {

    try {
        
        //con chrome da problemi
        /*var doc = getTargetDocument();
        makeLoadingDoc(doc);*/
        
    } catch (e) { }
}

function creaLmnu(ddomid, doc, spinner) {
    try {

        if (doc) {

            var mnu = doc.getElementById(ddomid);
            if (mnu) {
                mnu.parentNode.removeChild(mnu);
            }

            var im;
            if (spinner) {
                
                /*
                im = document.createElement("img");
                im.src = "../images/ajax-loader.gif";
                im.setAttribute("style", "width:auto; margin-left:auto;margin-right:auto; margin-top:200px; display:block;");
                */

                //nota: su chrome la richiesta src viene cancellata(missing image 7ms)
                //

                /*
                var wsite = window.location.protocol + "//" + window.location.hostname;
                im = doc.createElement("img");
                im.src = wsite + ((wsite.indexOf('.81')>-1)?"/monitorbak/":"/") + "images/ajax-loader.gif";
                im.setAttribute("style", "width:auto; margin-left:auto;margin-right:auto; margin-top:200px; display:block;");
                */

                im = document.createElement("div");
                im.setAttribute("style", "width:auto; margin-left:auto;margin-right:auto; margin-top:200px;text-align:center;font-family:'Verdana','Times New Roman','Times','serif';font-size:30px;");
                im.innerHTML = "Caricamento in corso...";

            }

            var _docHeight = (doc.height !== undefined) ? doc.height : doc.body.offsetHeight;
            var _docWidth = (doc.width !== undefined) ? doc.width : doc.body.offsetWidth;

            var d = doc.createElement("div");
            d.setAttribute('id', ddomid);

            var w_style = "100%";
            var h_style = "100%";

            if (_docHeight > 200) {
                h_style = _docHeight + "px";
            }

            //h_style = _docHeight + "px";
            //w_style = _docWidth + "px";

            d.setAttribute("style", "position:absolute; display:inline; left:0; top:0;z-index:99999; width:" + w_style + "; height:" + h_style + "; background-color:rgba(255,255,255,.9);");



            //alert(_docWidth);


            if (im) {
                d.appendChild(im);
            }

            doc.body.appendChild(d);

            //setTimeout(function () { onPageLoadTimeout(); }, 10000);

            //d.setAttribute("style", "height:" + _docHeight + "px");
        }

    } catch (e) { }

}

function getTargetDocument() {
    return iframeDocumentFromID('main');
}

function makeLoadingDoc(doc) {

    try {

        var d;
        var i;
        var dlID = 'filterloading';

        var fr = doc.getElementsByTagName('FRAME');

        if (fr.length > 0) {

            var biggerfidx = fr.length - 1; //the second frame

            for (i = 0; i < fr.length; i++) {
                d = iframeDocument(fr[i]);

                if (i == biggerfidx) //bigger frame
                {
                    creaLmnu(dlID, d, true);
                }
                else {
                    creaLmnu(dlID, d, false); //forach iframe
                }
            }
        }
        else {
            d = doc;
            creaLmnu(dlID, d, true); //on main doc

            fr = doc.getElementsByTagName('IFRAME');

            if (fr.length > 0) {
                for (i = 0; i < fr.length; i++) {
                    d = iframeDocument(fr[i]);
                    if (i == fr.length - 1) {
                        creaLmnu(dlID, d, false); //forach iframe
                    }
                }
            }
        }

    } catch (e) { }
}

function iframeDocumentFromID(frameDomID) {
    var x = parent.document.getElementById(frameDomID);
    return iframeDocument(x);
}

function iframeDocument(docDomElement) {
    var y;
    //try {

    var x = docDomElement;
    y = (x.contentWindow || x.contentDocument);
    if (y.document) y = y.document;
    /*
    } catch (e) {
    y = null;
    }*/

    return y;
}