

//var wLoad = window.showModelessDialog('attesa.asp','','dialogHeight: 25px; dialogWidth: 270px; center: Yes; status:No; help:No; resizable:No; unadorned:1;')
var pEdit = 0; 

//alert(window.opener.name)
//alert(parent.parent.main.frames[1].PuntoTab.tagName)
//var frMain = window.opener.parent.centrale.main; // esterno
//var mainFrame =parent.parent //window.top.centrale
//var frMain = parent.parent.main; // esterno
var sqlDati =''
var aPr, aMon, aApp, aPer, aPor, aTel, aPc, aSt, aTer, aVar, aArm, aPat, aPermAut;

var idImpianto = null
var fCh = false ,fEdit = false,redy = false
var aWin = new Array()
var winAtt = null;

function addWin(fn){aWin[aWin.length] = fn;}

function openWin(url, nome,x, y, w, h) {
    var f = window.open(url,nome, "height=" + h + ",width=" + w + ",top="+y+",left=" + w + ",menubar=no,scrollbars=no,resizable=yes,toolbar=no")
    f.focus();
}




function creaOggetti() {
    if (sqlDati.length == 0) return
    var aInDati = sqlDati.split('Ç')
    var aP
    var o

    aTel = new Array();
    aP = aInDati[11].split(','); //Telefoni
    for (i = 0; i < aP.length - 1; i += 6)
        aTel[aTel.length] = new gTel(aTel.length, aP[i], aP[i + 1], aP[i + 2], aP[i + 3], aP[i + 4], aP[i + 5])

    aPc = new Array();
    aP = aInDati[7].split(','); //Computer
    for (i = 0; i < aP.length - 1; i += 2)
        aPc[aPc.length] = new gPc(aPc.length, aP[i], aP[i + 1])

    aArm = new Array();
    aP = aInDati[1].split(','); //Armadi
    for (i = 0; i < aP.length - 1; i += 2)
        aArm[aArm.length] = new gArm(aArm.length, aP[i], aP[i + 1])

    aPat = new Array();
    aP = aInDati[12].split(','); //Patch
    for (i = 0; i < aP.length; i = i + 8)
        aPat[aPat.length] = new gPatch(aPat.length, aP[i], aP[i + 1], aP[i + 2], aP[i + 3], aP[i + 4], aP[i + 5], aP[i + 6], aP[i + 7])

    aPr = new Array();
    aP = aInDati[2].split(','); //Prese
    for (i = 0; i < aP.length - 1; i += 5)
        aPr[aPr.length] = new gpr(aPr.length, aP[i], aP[i + 1], aP[i + 2], aP[i + 3], aP[i + 4], 0)

    aMon = new Array();
    aP = aInDati[3].split(','); //Montanti
    for (i = 0; i < aP.length - 1; i += 7) {
        o = new gMon(aMon.length, aP[i], aP[i + 1], aP[i + 2], aP[i + 3], aP[i + 4], aP[i + 5], aP[i + 6])
        aMon[aMon.length] = o
        addMonArm(o)
    }

    aSt = new Array();
    aP = aInDati[8].split(','); //Stampanti
    for (i = 0; i < aP.length - 1; i += 2)
        aSt[aSt.length] = new gSt(aSt.length, aP[i], aP[i + 1])

    aTer = new Array();
    aP = aInDati[9].split(','); //Terminali
    for (i = 0; i < aP.length - 1; i += 2)
        aTer[aTer.length] = new gTer(aTer.length, aP[i], aP[i + 1])

    aVar = new Array();
    aP = aInDati[10].split(','); //Varie
    for (i = 0; i < aP.length - 1; i += 3)
        aVar[aVar.length] = new gVar(aVar.length, aP[i], aP[i + 1], aP[i + 2])

    aApp = new Array();
    aP = aInDati[5].split(','); //Apparati
    for (i = 0; i < aP.length - 1; i += 4)
        aApp[aApp.length] = new gApp(aApp.length, aP[i], aP[i + 1], aP[i + 2], aP[i + 3])

    //porte apparati
    aPor = new Array();
    if (aApp.length > 0) {
        aP = aInDati[6].split(','); //Porte
        //0 idPorta, 1 nomePorta, 2 idApparato, 3 tipoPer, 4 idPermuta, 5 slot, 6 idInterfaccia, 7 idPortaPer, 8 tpObRiv, 9 idObRiv, 10 tpObRiv2, 11 idObRiv2 
        var curApp = aApp[0]
        for (i = 0; i < aP.length - 1; i += 12) {
            o = new gPor(aPor.length, aP[i], aP[i + 1], aP[i + 2], aP[i + 3], aP[i + 4], aP[i + 5], aP[i + 6],aP[i + 7])
            var dfr = aP[i + 9]
            if (aP[i + 8] && aP[i + 9]) {
                if (aP[i + 8] == 3) {
                    o.portRiv = aP[i + 9];
                } else if (aP[i + 8] > 10) {
                    o.obRiv = new gObRiv(aP[i + 8], aP[i + 9])
                } else {
                    o.obRiv = getobjS(aP[i + 8], aP[i + 9] );
                }
            }
            if (aP[i + 10] && aP[i + 11]) {
                o.obRiv2 = getobjS(aP[i + 10], aP[i + 11])
            }
            if (curApp.id != o.idApp) for (m = 0; m < aApp.length; m++) if (aApp[m].id == o.idApp) { curApp = aApp[m]; break; }
            if (curApp.id == o.idApp) { curApp.port[curApp.port.length] = o; o.oApp = curApp }
            aPor[aPor.length] = o
        }
    }

    aP = aInDati[4].split(','); //Permute').innerHTML.split(',');
    aPer = new Array();
    for (i = 0; i < aP.length - 1; i += 8) {
        o = new gper(aPer.length, aP[i], aP[i + 2], aP[i + 3], aP[i + 4], aP[i + 5], aP[i + 6], aP[i + 7])
        var idMon = aP[i + 1];
        for (m = 0; m < aMon.length; m++) if (aMon[m].id == idMon) { aMon[m].per[aMon[m].per.length] = o; o.Mon = aMon[m]; break; }
        aPer[aPer.length] = o
        //if(idMon==29) alert(o.id + ' ' +
    }


// allaccio Oggetti

    //prese
    for (i = 0; i < aPr.length; i++)
        if (aPr[i].tp > 0 && aPr[i].idp > 0) {
        var o = getobjS(aPr[i].tp, aPr[i].idp)
        aPr[i].opr = o
        if (o != null) if (o.to != 2 && o.to != 12) o.oba = aPr[i]
    }

    //Permute
    for (i = 0; i < aPer.length; i++) {
        if (aPer[i].oba == null && aPer[i].tpA > 0 && aPer[i].idpA > 0) {
            var o = getobjS(aPer[i].tpA, aPer[i].idpA)
            if (o != null) {
                aPer[i].oba = o
                if (o.to != 2 && o.to != 12) o.oba = aPer[i]
            }
        }
        if (aPer[i].opr == null && aPer[i].tpB > 0 && aPer[i].idpB > 0) {
            var o = getobjS(aPer[i].tpB, aPer[i].idpB)
            if (o != null) {
                aPer[i].opr = o
                if (o.to != 2 && o.to != 12) o.oba = aPer[i]
            }
        }
    }

    //alert("allaccia Patch")
    for (i = 0; i < aPat.length; i++) {
        if (aPat[i].oba == null && aPat[i].tpA > 0 && aPat[i].idpA > 0) {
            var o = getobjS(aPat[i].tpA, aPat[i].idpA)
            if (o != null) {
                aPat[i].oba = o
                if (o.to != 2 && o.to != 12) o.oba = aPat[i]
            }
        }
        if (aPat[i].opr == null && aPat[i].tpB > 0 && aPat[i].idpB > 0) {
            var o = getobjS(aPat[i].tpB, aPat[i].idpB)
            if (o != null) {
                aPat[i].opr = o
                if (o.to != 2 && o.to != 12) o.oba = aPat[i]
            }
        }
    }

    //alert("allaccia Porte")
    for (i = 0; i < aPor.length; i++)
        if (aPor[i].tp > 0 && aPor[i].idp > 0 && aPor[i].oba == null) {
        var o = getobjS(aPor[i].tp, aPor[i].idp)
        aPor[i].oba = o
        if (o != null)
            if (o.to != 2 && o.to != 12)
            o.oba = aPor[i]
    }

    //alert("allaccia Telefoni")
    for (i = 0; i < aTel.length; i++)
        if (aTel[i].tp > 0 && aTel[i].idp > 0) {
        var o = getobjS(aTel[i].tp, aTel[i].idp)
        aTel[i].opr = o
        if (o != null) if (o.to > 3 && o.to != 12) o.oba = aTel[i]
    }


    aP = aInDati[13].split(','); //PermAut
    aPermAut = new Array();
    var oM
    for (i = 0; i < aP.length - 1; i += 5) {
        var o1 = getObPermAut(aP[i], aP[i + 1])
        var o2 = getObPermAut(aP[i + 2], aP[i + 3])
        if (o1 && o2) {
            if (o1.to == 1 || o1.to == 3) {
  //              if (o1.id == 92741)
  //                  var cf = '';
                o2.pAut = true
                if (o1.oba != o2) {
                    o1.oba = overPermuta(o1, o1.oba, o2); if (o1.to != 1 || o2.to != 1) o1.ch = true
                }
            }
            if (o1.to == 2) {
                if (o1.Mon.idA == parseInt(aP[i + 4])) {
                    if (o1.oba != o2) {
                        o1.oba = overPermuta(o1, o1.oba, o2); o1.ch = true
                    }
                } else {
                    //o1.opr.pAut = true
                    if (o1.opr != o2) {
                        o1.opr = overPermuta(o1, o1.opr, o2); o1.ch = true
                    }
                }
            }
        }
    }

//oggetti rilevati

    for (i = 0; i < aPor.length; i++) {
        var o = aPor[i];
        if (o.portRiv) {
            o.obRiv = getobjS(3, o.portRiv);
            if (o.obRiv) { o.obRiv.obRiv = o; o.obRiv.portRiv = null; }
            o.portRiv = null
        }
    }
    for (i = 0; i < aPor.length; i++) {
        var o = aPor[i];
        if (o.id == 83860)
            i = i;
        if (o.obRiv && o.obRiv.to <9) {
            var obRiv = o.obRiv, obRiv2 = o.obRiv2;
            if (o.id == 92224)
                i = i;
            if(obRiv){
                if(obRiv2){
                    if (obRiv.opr != obRiv2){obRiv.opr = overPermuta(obRiv,obRiv.opr,obRiv2)}
                    if (obRiv2.oba != obRiv){obRiv2.oba = overPermuta(obRiv2,obRiv2.oba,obRiv)}
                }
                var prOb = o,oins = o.oba
                while (oins != null && oins !=obRiv) {
                    if (oins.oba == prOb) { prOb = oins; oins = oins.opr } else { prOb = oins; oins = oins.oba }
                }
                if (oins) {
                    oins.pAut = true;
                } else {
                    if (prOb == o) {
                        prOb.oba = overPermuta(prOb, prOb.oba, obRiv);
                        obRiv.oba = overPermuta(obRiv, obRiv.oba, prOb);
                        obRiv.pAut = true;
                    }
                    if (prOb.to == 1) {
                        prOb.opr = overPermuta(prOb, prOb.opr, obRiv);
                        obRiv.oba = overPermuta(obRiv, obRiv.oba, prOb);
                        obRiv.pAut = true;
                    } else if (prOb.to == 12 || prOb.to == 2) {
                        if (prOb.oba) {
                            prOb.opr = overPermuta(prOb, prOb.opr, obRiv);
                            obRiv.oba = overPermuta(obRiv, obRiv.oba, prOb);
                        } else {
                            prOb.oba = overPermuta(prOb, prOb.oba, obRiv);
                            obRiv.oba = overPermuta(obRiv, obRiv.oba, prOb);
                        }
                        obRiv.pAut = true;
                    } else if (prOb.to > 3) {
                        prOb = prOb.oba
                        prOb.opr = overPermuta(prOb, prOb.opr, obRiv);
                        obRiv.oba = overPermuta(obRiv, obRiv.oba, prOb);
                        obRiv.pAut = true;
                    }
                }
                    
                //if(obRiv.oba != obRiv2) obRiv.oba = overPermuta(obRiv,obRiv.oba,obRiv2)
            }
        }
    }

 

}



function getPermuta(idMom,cp,ncp) {
    var p
    var m = getobj(10, idMom);
    for (var n = 0; n < m.per.length; n++) {
        var gp = m.per[n]
        if (cp >= parseInt(gp.cp) && cp < (parseInt(gp.ncp) + parseInt(gp.cp))) { p=gp;break; }
    }
    if (!p) {
        p = {};
        p.ncp = ncp; p.cp = cp;
        p.ida = aPer.length
        p.id = 0;
        p.to = 2;
        p.Mon = m
        p.ch = true;
        aPer.push(p)
        m.per.push(p)
    }
    return p
}

function overPermuta(ob, obOldAtt,obNewAtt) {
    if (obOldAtt){
        if (obOldAtt.opr == ob) {obOldAtt.opr = null;  obOldAtt.ch = true}
        if (obOldAtt.oba == ob) { obOldAtt.oba = null; obOldAtt.ch = true}
        
    }
    return obNewAtt; 
}


function getObPermAut(stp,sidp){
    var ob,oM
    var tp =parseInt(stp),idp =parseInt(sidp) ;
    if (tp < 0){
        tp = Math.abs(tp)
        var ob = getobjS(tp, idp)
    }else{
        for (var pM = 0; pM < aMon.length; pM++) if (aMon[pM].id == idp) {oM =aMon[pM];break}
        for (var pP = 0; pP < oM.per.length; pP++) if (oM.per[pP].cp == tp) {ob = oM.per[pP];break}
    }
    return ob
}


function addMonArm(m) {
    var a
    a = getobj(11, m.idA).aMon
    a[a.length] = m
    a = getobj(11, m.idB).aMon
    a[a.length] = m 
}






function gpr(p0,p1,p2,p3,p4,p5){this.to=1;this.ida=p0;this.id=p1;this.nome=p2;this.idArm=p3;this.tp=p4;this.idp=p5;this.att=0;this.opr=null;}
function gMon(p0, p1, p2, p3, p4, p5, p6, p7) { this.ida = p0; this.id = p1; this.nome = p2; this.cpm = p3; this.idA = p4; this.idB = p5; this.tp = p6; this.firstCp = parseInt(p7); this.per = new Array(); this.opr = null; }

function gper(p0,p1,p2,p3,p4,p5,p6,p7){this.to=2;this.ida=p0;this.id=p1;this.ncp=p2;this.cp=p3;this.tpA=p4;this.idpA=p5;this.tpB=p6;this.idpB=p7;this.opr=null;}
function gApp(p0,p1,p2,p3,p4,p5,p6){this.ida=p0;this.id=p1;this.nome=p2;this.idArm=p3;this.tipo=p4;this.port=new Array();this.opr=null;}
//function gPor(p0,p1,p2,p3,p4,p5){this.to=3;this.ida=p0;this.id=p1;this.nome=p2;this.idApp=p3;this.tp=p4;this.idp=p5;this.att=0;this.opr=null;}
function gPor(p0, p1, p2, p3, p4, p5, p6, p7, p8) { this.to = 3; this.ida = p0; this.id = p1; this.nome = p2; this.idApp = p3; this.tp = p4; this.idp = p5; this.att = 0; this.opr = null; this.sl = (p6 == '') ? -1 : parseInt(p6); this.idInt = p7; this.idPortaPer = p8; }
function gPatch(p0, p1, p2, p3, p4, p5, p6, p7, p8) {this.to = 12; this.ida = p0; this.id = p1; this.idArm = (p2=='')?null:p2; this.nome = p3; this.tpA = p4; this.idpA = p5; this.tpB = p6; this.idpB = p7; this.tp = p8; this.opr = null; }

function gPc(p0,p1,p2){this.to=4;this.ida=p0;this.id=p1;this.nome=p2;this.opr=null;}
function gTel(p0,p1,p2,p3,p4,p5,p6){this.to=5;this.ida=p0;this.id=p1;this.nome=p2;this.ute=p3;this.tp=p4;this.idp=p5;this.tipo=p6;this.opr=null;}
function gSt(p0,p1,p2){this.to=7;this.ida=p0;this.id=p1;this.nome=p2;this.opr=null;}
function gTer(p0,p1,p2){this.to=8;this.ida=p0;this.id=p1;this.nome=p2;this.opr=null;}
function gVar(p0,p1,p2,p3){this.to=9;this.ida=p0;this.id=p1;this.nome=p2;this.tp=p3;this.opr=null;}
function gArm(p0, p1, p2) { this.to = 11; this.ida = p0; this.id = p1; this.nome = p2; this.aMon = new Array(); }
function gObRiv(p0, p1) { this.to = p0; this.par = p1; }


function getobjS(tipo,id){
var aP,fin,ini,meta,sp 
	id = parseInt(id)
    switch (parseInt(tipo)) {
        case 1: aP = aPr;break
        case 2: aP = aPer; break
        case 3: aP = aPor; break
        case 4: aP = aPc; break
        case 5: aP = aTel; break
        case 7: aP = aSt; break
        case 8: aP = aTer; break
        case 9: aP = aVar; break
        case 12: aP = aPat; break
        default: return
    }
	ini = 0
	if (tipo <4 && aP.length > 10){
		if (id < aP[0].id) return
		for ( sp = ini; sp < aP.length; sp = sp+100) if(id <aP[sp].id ){ini = sp-100;break}
		for ( sp = ini; sp < aP.length; sp = sp+10) if(id < aP[sp].id )	{ini = sp-10;break}
		}
	for (nA=ini; nA < aP.length; nA++)
		if (aP[nA].id == id) return aP[nA];
}


function getobj(tipo,id){
	if (tipo == 1)
		for (nA=0; nA < aPr.length; nA++)
			if (aPr[nA].id == id) return aPr[nA];

	if (tipo == 2)
		for (nA=0; nA < aPer.length; nA++)
			if (aPer[nA].id == id) return aPer[nA];


	if (tipo == 3)
		for (nA=0; nA < aPor.length; nA++)
			if (aPor[nA].id == id) return aPor[nA];

	if (tipo == 4)
		for (nA=0; nA < aPc.length; nA++)
			if (aPc[nA].id == id) return aPc[nA];

	if (tipo == 5)
		for (nA=0; nA < aTel.length; nA++)
			if (aTel[nA].id == id) return aTel[nA];

	if (tipo == 6)
		for (nA=0; nA < aApp.length; nA++)
			if (aApp[nA].id == id) return aApp[nA];

	if (tipo == 7)
		for (nA=0; nA < aSt.length; nA++)
			if (aSt[nA].id == id) return aSt[nA];

	if (tipo == 8)
		for (nA=0; nA < aTer.length; nA++)
			if (aTer[nA].id == id) return aTer[nA];

	if (tipo == 9)
		for (nA=0; nA < aVar.length; nA++)
			if (aVar[nA].id == id) return aVar[nA];

	if (tipo == 10)
		for (nA=0; nA < aMon.length; nA++)
			if (aMon[nA].id == id) return aMon[nA];

	if (tipo == 11)
		for (nA=0; nA < aArm.length; nA++)
			if (aArm[nA].id == id) return aArm[nA];

	if (tipo == 12)
	    for (nA = 0; nA < aPat.length; nA++)
	    if (aPat[nA].id == id) return aPat[nA];

}

function getArray(nAy){
	if ( nAy == "aPer") return aPer
}


function insObj(tipo,id,nome,ute,tp){
	var i,aP,o
	if( getobj(tipo,id) != null) return false	
	if (tipo == 1) { 
		o = new gpr(aPr.length,id,nome,ute)
		aPr[aPr.length]= o
	    return o
	}
	if (tipo == 2) {
	    o = new gMon(aMon.length, id, nome,1,ute,tp,4)
	    aMon[aMon.length] = o
	    addMonArm(o)
	    aMon.sort(sortTel)
	    for (i = 0; i < aMon.length; i++) aMon[i].ida = i
	    return o
	}
	if (tipo == 4) {
		o = new gPc(aPc.length,id,nome)
	    aPc[aPc.length] = o
		aPc.sort(sortTel)
		for(i=0; i< aPc.length; i++) aPc[i].ida = i
	    return o
    }
	if (tipo == 5) { 
		o = new gTel(aTel.length,id,nome,ute,1)
		aTel[aTel.length]= o
		aTel.sort(sortTel)
		for(i=0; i< aTel.length; i++) aTel[i].ida = i
	    return o
    }
	if (tipo == 7) { 
		o= new gSt(aSt.length,id,nome)
		aSt[aSt.length]= o
		aSt.sort(sortTel)
		for(i=0; i< aSt.length; i++) aSt[i].ida = i
	    return o
    }
	if (tipo == 8) { 
		o = new gTer(aTer.length,id,nome)
		aTer[aTer.length]= o
		aTer.sort(sortTel)
		for(i=0; i< aTer.length; i++) aTer[i].ida = i
		return o
	}
	if (tipo == 9) {
	    o = new gVar(aVar.length, id, nome, tp)
	    aVar[aVar.length] = o
	    aVar.sort(sortTel)
	    for (i = 0; i < aVar.length; i++) aVar[i].ida = i
	    return o
	}
	if (tipo == 12) {
	    o = new gPatch(aPat.length, id, null,nome,null,null,null,null, tp)
	    aPat[aPat.length] = o
	    aPat.sort(sortTel)
	    for (i = 0; i < aPat.length; i++) aPat[i].ida = i
	    return o;
	}

}

function sortTel(a,b){
	if (a.nome > b.nome) return 1
	if (a.nome < b.nome) return -1
	return 0
}


function salva() {
	var o;
	var stAtt = "";
	var stIn ="",stUp="",stDe="";
	var idm, idprA, tpprA, idprB, tpprB, idArm, isatt;
	// permute montanti
	for (i=0; i<aPer.length; i++){
		if (aPer[i].ch ){
			
			if (aPer[i].id == 0 && (aPer[i].opr != null || aPer[i].oba != null))
				stIn += aPer[i].Mon.id+','+aPer[i].ncp+','+aPer[i].cp+',';
			if (aPer[i].id > 0 && aPer[i].opr == null && aPer[i].oba == null)
				stDe += aPer[i].id+',';
			else{
				idm = (aPer[i].id==0)?aPer[i].Mon.id+'/'+aPer[i].cp:aPer[i].id;
				idprA="";tpprA="";idprB="";tpprB="";
				o =  aPer[i].oba; //: aPer[i].opr;
				if (o != null ) {
					tpprA = o.to
					idprA = (o.to == 2 && o.id == 0)?o.Mon.id+'/'+o.cp:o.id;
					}
				o =  aPer[i].opr; //: aPer[i].opr;
				if (o != null ) {
					tpprB = o.to
					idprB = (o.to == 2 && o.id == 0)?o.Mon.id+'/'+o.cp:o.id;
					}

				stUp += idm+','+aPer[i].ncp+','+tpprA+','+idprA+','+tpprB+','+idprB+','
				}
			}
		}
	if (stIn != "") stAtt += 'perIn:'+stIn+';'
	if (stDe != "") stAtt += 'perDe:'+stDe+';'
	if (stUp != "") stAtt += 'perUp:'+stUp+';'

	stUp = "";
	//porte apparati
	for (i=0; i<aPor.length; i++){
		if (aPor[i].ch ){
			idpr="";tppr="";
			if (aPor[i].oba != null ) {
				o=aPor[i].oba
				idpr=o.id;
				tppr=o.to;
				if (tppr == 2 && idpr == 0)	idpr = o.Mon.id+'/'+o.cp;
				}			
			stUp += aPor[i].id +','+tppr+','+idpr+',';
			}
		}
	if (stUp != "") stAtt += 'porUp:'+stUp+';'

	stUp = "";
	//prese
	for (i=0; i<aPr.length; i++){
		if (aPr[i].ch ){
			idpr="";tppr="";
			if (aPr[i].opr != null ) {
				idpr=aPr[i].opr.id;
				tppr=aPr[i].opr.to;
				if (tppr == 2 && idpr == 0){
					idpr =aPr[i].opr.Mon.id+'/'+aPr[i].opr.cp;
					}
				}			
			isatt =(aPr[i].oba ==null)?'':'1';
			stUp += aPr[i].id +','+tppr+','+idpr+','+isatt+',';
			}
		}
	if (stUp != "") stAtt += 'preUp:'+stUp+';'

    //telefoni
	stUp = "";
	for (i=0; i<aTel.length; i++){
		if (aTel[i].ch ){
			idpr="";tppr="";
			if (aTel[i].opr != null ) {
				idpr=aTel[i].opr.id;
				tppr=aTel[i].opr.to;
				if (tppr == 2 && idpr == 0){
					idpr =aTel[i].opr.Mon.id+'/'+aTel[i].opr.cp;
					}
				}			
			stUp += aTel[i].id +','+tppr+','+idpr+',';
			}
		}
	if (stUp != "") stAtt += 'telUp:'+stUp+';'

	//Patch
	stUp = "";
	for (i = 0; i < aPat.length; i++) {
	    if (aPat[i].ch) {
			idprA="";tpprA="";idprB="";tpprB="";
			o =  aPat[i].oba; 
			if (o != null ) {
				tpprA = o.to
				idprA = (o.to == 2 && o.id == 0)?o.Mon.id+'/'+o.cp:o.id;
				}
			o =  aPat[i].opr;
			if (o != null ) {
				tpprB = o.to
				idprB = (o.to == 2 && o.id == 0)?o.Mon.id+'/'+o.cp:o.id;
				}

			idArm = (aPat[i].idArm == null) ? "" : aPat[i].idArm;   
			stUp += aPat[i].id+','+tpprA+','+idprA+','+tpprB+','+idprB+','+idArm+','
	        }
	    }
	if (stUp != "") stAtt += 'patUp:' + stUp + ';'
	goSave(stAtt)

}
function loadDatiCbl(idImp) {
    idImpianto = idImp
    goSave('')
}

function goSave(dati) {
    redy = false
    iniReq()
    req.open("GET", 'docum/netMap/saveCbl.asp?dati=' + dati, false);
    req.send(null);
    var r = req.responseText
    sqlDati = r
    creaOggetti();
    fCh = false
    fEdit = false
    redy = true
    refreshWinCbl()
}

function refreshWinCbl() {
    if(winAtt)esegui(winAtt, 'refCbl();');
    for (var i = 0; i < aWin.length; i++) {
        var w = aWin[i]
        if (!w.closed) if (w.refCbl) esegui(w, 'refCbl();'); 
    }
}


function annulla(idApp, fEdit) { goSave('') }

function esegui(w,comando) {
    if (navigator.appVersion.indexOf('MSIE') > 0) w.execScript(comando)
    else w.eval(comando)
}


function chiudiWin(){
	for (i=0; i<aWin.length; i++) if (!aWin[i].closed) aWin[i].close();
}

function iniReq() {
    try { req = new ActiveXObject("Msxml2.XMLHTTP"); }
    catch (e) { try { r = new ActiveXObject("Microsoft.XMLHTTP"); } catch (oc) { req = null; } }
    if (!req && typeof XMLHttpRequest != "undefined") { req = new XMLHttpRequest(); }
}

