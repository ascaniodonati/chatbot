var chartsList = [];

function aggiungiInDashboard(idComponente, idDashboard) {

    var componente;
    var url;
    var random = Math.floor((Math.random() * 100000000) + 1);

    if ($(idComponente)[0].className == "k-chart") {
        componente = $(idComponente).data("kendoChart");
        url = componente.dataSource.transport.options.read.url;
        url = url.replace("/grafici/datigrafico", "/energia/control/dashboardControl");
        url = url + "&t=aggiungi&idDashboard=" + idDashboard + "&drp=" + selectedRangePreset + "&rnd=" + random;
    }
    else if ($(idComponente)[0].className == "k-gauge") {
        componente = $(idComponente).data("kendoLinearGauge");
        url = "/energia/control/dashboardControl.aspx?cl=" + componente.p_classe + "&te=" + componente.p_tipo_entita + "&ide_1=" + componente.p_id_entita_1 + "&t=aggiungi&idDashboard=" + idDashboard + "&drp=" + selectedRangePreset + "&rnd=" + random;
    }
    else if ($(idComponente)[0].className.indexOf("k-grid") >= 0) {
        componente = $(idComponente).data("kendoGrid");
        url = componente.dataSource.transport.options.read.url;
        url = url.replace("/grafici/datigrafico", "/energia/control/dashboardControl");
        url = url + "&t=aggiungi&idDashboard=" + idDashboard + "&drp=" + selectedRangePreset + "&rnd=" + random;
    }
    else {
        alert('Inserimento in dashboard non supportato');
    }

    $("#menudashboard").css("visibility", "hidden");
    $.get(url, function (data) {
        if (data[0].stato == '0') {
            alert('Inserimento in dashboard avvenuto con successo');
            if (idDashboard == '-1') {
                parent.parent.parent.frames[1].frames[0].location.reload();
            }
        }
        else {
            alert('Errore nell\'inserimento in dashboard');
        }
    }, "json");
}

function eliminaDashboard(idDashboard) {

    var url = document.URL;
    var random = Math.floor((Math.random() * 100000000) + 1);
    url = url.replace("dashboard", "control/dashboardControl");
    url = url + "&t=eliminadashboard&idDashboard=" + idDashboard + "&rnd=" + random;

    $.get(url, function (data) {
        if (data[0].stato == '0') {
            alert('Eliminazione dashboard avvenuto con successo');
            parent.parent.parent.frames[1].frames[0].location.reload();
            p1 = url.indexOf("control/dashboardControl", 0);
            url = url.substr(0, p1) + 'dashboard.aspx';
            document.URL = url;
        }
        else {
            alert('Errore nell\'eliminazione della dashboard');
        }
    }, "json");
}

function apriMenu(evt, idComponente) {

    var clickX = 0, clickY = 0;

    if ((evt.clientX || evt.clientY) && document.body && document.body.scrollLeft != null) {
        clickX = evt.clientX + document.body.scrollLeft;
        clickY = evt.clientY + document.body.scrollTop;
    }
    if ((evt.clientX || evt.clientY) && document.compatMode == 'CSS1Compat' && document.documentElement && document.documentElement.scrollLeft != null) {
        clickX = evt.clientX + document.documentElement.scrollLeft;
        clickY = evt.clientY + document.documentElement.scrollTop;
    }
    if (evt.pageX || evt.pageY) {
        clickX = evt.pageX;
        clickY = evt.pageY;
    }

    var random = Math.floor((Math.random() * 100000000) + 1);

    $.get("control/dashboardControl.aspx?t=elenco&rnd=" + random, function (data) {

        var html = "<ul><li id=\"item0\">Inserisci in dashboard<ul>";
        for (i = 0; i < data.length; i++) {
            html += "<li class=\"menuLi\" onmouseout=\"style.color='#000'; style.backgroundColor='transparent'\" onclick='aggiungiInDashboard(\"" + idComponente + "\",\"" + data[i].idDashboard + "\")'>" + data[i].titolo + "</li>"
        }
        html += "<li class=\"menuLi\" onmouseout=\"style.color='#000'; style.backgroundColor='transparent'\" onclick='aggiungiInDashboard(\"" + idComponente + "\",\"-1\")'>Nuova dashboard</li>";
        html += "</ul></li></ul>"

        ab_menu();
        $("#divprop").html(html);
        pop('divprop', evt);
        


    }, "json");
}

function apriMenuManuele(idComponente) {

    var evt = window.event;
    var clickX = 0, clickY = 0;

    if ((evt.clientX || evt.clientY) && document.body && document.body.scrollLeft != null) {
        clickX = evt.clientX + document.body.scrollLeft;
        clickY = evt.clientY + document.body.scrollTop;
    }
    if ((evt.clientX || evt.clientY) && document.compatMode == 'CSS1Compat' && document.documentElement && document.documentElement.scrollLeft != null) {
        clickX = evt.clientX + document.documentElement.scrollLeft;
        clickY = evt.clientY + document.documentElement.scrollTop;
    }
    if (evt.pageX || evt.pageY) {
        clickX = evt.pageX;
        clickY = evt.pageY;
    }

    var random = Math.floor((Math.random() * 100000000) + 1);

    $.get("control/dashboardControl.aspx?t=elenco&rnd=" + random, function (data) {

        var elenco = [];

        for (i = 0; i < data.length; i++) {
            elenco.push("<span onclick='aggiungiInDashboard(\"" + idComponente + "\",\"" + data[i].idDashboard + "\")'>" + data[i].titolo + "</span>");
        }

        contMenu.open(clickX, clickY, elenco);


//        $("#menu").html(html);
//        $("#menu").kendoMenu();
//        var menu = $("#menu").data("kendoMenu");
//        menu.open("#item0");
//        menu.bind("close", function (e) {
//            $("#divmenu").css("visibility", "hidden");
//        });

//        $("#divmenu").css("left", clickX);
//        $("#divmenu").css("top", clickY);
//        $("#divmenu").css("visibility", "visible");
//        $("#divmenu").css("z-index", "10000");

    }, "json");
}

function eliminaComponente(idComponente) {

    var random = Math.floor((Math.random() * 100000000) + 1);
    var url = "control/dashboardControl.aspx?t=elimina&idcomp=" + idComponente + "&rnd=" + random;
    $.get(url, function (data) {
        if (data[0].stato != '0') {
            alert('Errore nell\'eliminazione dalla dashboard');
        } else {
            var div = document.getElementById("componenti");
            var div1 = document.getElementById("div" + idComponente);
            div.removeChild(div1);
        }
    }, "json");
}


function sottraiTimeSpan(data, timespan, dettaglio) {

    var d1 = new Date(data);
    var d2 = new Date(d1 - (timespan));
    var giorno;
    var offset;

    if ((dettaglio == 6 || dettaglio == 11) && timespan > 0) {
        giorno = d2.getDate();
        offset = 0;

        while (giorno != 1) {
            if (giorno > 15) {
                offset -= 86400000;
            } 
            else {
                offset += 86400000;
            }
            d2 = new Date(d1 - (timespan + offset));
            giorno = d2.getDate();
        }
    }

    return d2;
}

function accorciaLabel(label, lunghezza) {

   // alert(label);

    if (label.length > lunghezza) {
        return label.substring(0, lunghezza - 3) + '..';
    }

    return label;
}




function ab_menu() {
    document.onmousedown = pop;
}
function dis_menu() {
    document.onmousedown = pop;
}
function pop2(ido, ev) {

    var dp = getCtxMenu();

    dp.style.visibility = "hidden";
    $(dp).removeClass('show');

    if (ido != null) {
        try {
            $(dp).css("top", mouseY(ev));
            $(dp).css("left", mouseX(ev));
            $(dp).addClass("show");
            dp.style.visibility = "visible";
        }
        catch (e) {
        }
    }
    document.onmousedown = pop;
}
function pop(ido, ev) {
    if (ev) {
        var dp = '#' + ido;
        var jdp = $(dp);

        jdp.hide();
        jdp.removeClass('show');

        $("#debug").val('');

        if (ido != null) {

            try {
                var o = document.getElementById(ido);
                if (o) {

                    var posx = mouseX(ev);

                    jdp.addClass("show");
                    jdp.show();

                    if (posx + jdp.width() > window.innerWidth) {
                        posx = posx - (jdp.width());
                    }
                    else {
                        var ie8 = false;
                        try {


                            var undef,
                                v = 3,
                                div = document.createElement('div'),
                                all = div.getElementsByTagName('i');

                            while (
                                div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->',
                                all[0]
                            );

                            ie8 = ((v > 4 ? v : undef) < 9);
                        }
                        catch (e) {
                        }

                        if (ie8) {
                            posx = posx - (jdp.width());
                        }

                    }

                    jdp.css("top", mouseY(ev));
                    jdp.css("left", posx);
                    //jdp.css("left", mouseX(ev) - (jdp.width() + jdp.width() + 10));

                    //alert($('div').is(':offscreen'));

                    //alert(posx + jdp.width());
                    //alert(window.innerWidth);
                }
            }
            catch (e) {
            }
        }
        document.onmousedown = pop;
    }
    $('#divProp').mouseleave(function () {
        $(this).hide();
        $(this).removeClass('show');
    });
}


function mouseX(evt) {
    if (evt.pageX) {
        return evt.pageX;
    } else if (evt.clientX) {
        return evt.clientX + (document.documentElement.scrollLeft ?
                                   document.documentElement.scrollLeft :
                                   document.body.scrollLeft);
    } else {
        return null;
    }
}

function mouseY(evt) {
    if (evt.pageY) {
        return evt.pageY;
    } else if (evt.clientY) {
        return evt.clientY + (document.documentElement.scrollTop ?
                                   document.documentElement.scrollTop :
                                   document.body.scrollTop);
    } else {
        return null;
    }
}

function getScrollTop() {
    var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
    return scrollTop;
}

function getScrollLeft() {
    var scrolLeft = document.body.scrollLeft || document.documentElement.scrollLeft;
    return scrolLeft;
}

function getCtxMenu() {
    var dp = document.getElementById('divProp');

    if (!dp) {
        var d = document.createElement("div");
        d.setAttribute('id', 'divProp');
        d.className = "divMenu";

        d.onmouseover = function () {
            try {
                ab_menu();
            } catch (e) { }
        };

        d.onmouseout = function () {
            try {
                dis_menu();
            } catch (e) { }
        };

        document.body.appendChild(d);
        dp = d;

    }

    return dp;
}



