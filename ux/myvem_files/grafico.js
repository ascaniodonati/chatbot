
//<--CHART NO DATA [BEGIN]
var removeNoData = function (jqueryChartContainerID) {

    var div1 = null;

    try {
        //rimuove il div [dati non disponibili]

        var ccontainerID = jqueryChartContainerID;

        div1 = document.getElementById(ccontainerID + "DivLoader");

        var nodataid = "char_nodata_" + ccontainerID;
        var nodataph = document.getElementById(nodataid);
        if (nodataph != null) {
            div1.parentNode.removeChild(nodataph);
        }
    }
    catch (e) {
        alert(e);

    }

    //ritorna divloader
    return div1;
};

var testNoData = function (chartObj, jqueryChartContainerID) {
    var noData = false;

    try {

        var ccontOBJ = $("#" + jqueryChartContainerID);

        var div1 = removeNoData(jqueryChartContainerID);
        var nodataid = "char_nodata_" + jqueryChartContainerID;

        if (chartObj.dataSource.data().length == 0) //chart has data?
        {
            //no data
            ccontOBJ.css("visibility", "hidden");

            ccontOBJ.parent().css("background-color", "white");
            if (!ccontOBJ.data("kendoChart").chartcanvarResized) {
                //canvas ha 30 px di offset fuori cornice(causa titolo?)
                ccontOBJ.parent().css("height", (ccontOBJ.parent().height() - 30) + 'px');
                ccontOBJ.data("kendoChart").chartcanvarResized = true;
            }

            //clone perchè il div spinner è già posizionato al centro
            var cloned = div1.cloneNode(false); //clone without childs
            cloned.style.width = '100%';
            cloned.style.backgroundImage = '';
			//cloned.style.backgroundColor='#f00';
			//cloned.style.margin = 'auto';
			
            cloned.style.textAlign = 'center';
            cloned.id = nodataid;
            cloned.innerHTML = 'No data';

            cloned.style.position = 'relative';
			cloned.style.cssFloat="left";
            cloned.style.padding=0;
            cloned.style.top = '-' + $('#' + jqueryChartContainerID).parent().height() / 2 + 'px';
            //cloned.style.cssFloat="right";
            //cloned.style.clear="left";

			//alert(div1.getAttribute('id'));
			
            div1.parentNode.appendChild(cloned);

            noData = true;
        }
        else {
            //data
            ccontOBJ.css("visibility", "visible");
        }

    }
    catch (e) {
        alert(e);
    }

    return noData;
}
//<--CHART NO DATA [END]


var dataBoundScatterEv = function (chartObj, chartContainerID, myChartProps) {

    var minY=null;
    var maxY=null;

//    var culture = kendo.culture();
//    console.log('dataBoundScatterEv: ' + culture.name);
    try {
        getDatiCustom(chartObj.options.series, chartContainerID);
    }
    catch (e) {

    }
    try {
        getInfoGrafico(chartObj, chartContainerID, myChartProps);
    }
    catch (e) {

    }

    if (!testNoData(chartObj, chartContainerID)) {

        try {

            //legge l'url del grafico
            var qs = chartObj.dataSource.transport.options.read.url;

            var artmp = qs.split('?');
            var old_qs = artmp[1];

            var arparams = old_qs.split('&');
            var i;

            //valorizza le due proprietà del grafico [this.current_unixtime1] + [this.current_unixtime2]
            for (i = 0; i < arparams.length; i++) {
                artmp = arparams[i].split('=');
                var paramName = artmp[0];
                var paramVal = artmp[1];

                switch (paramName) {
                    case 'di':
                        chartObj.current_unixtime1 = paramVal;
                        break;
                    case 'df':
                        chartObj.current_unixtime2 = paramVal;
                        break;
                    default:
                        break;
                }
            }

            chartObj.refreshXaxisLabelsScatter(chartObj.current_unixtime1, chartObj.current_unixtime2);

            // individuo massimo e minimo dell'asse Y

           // alert('inizio');

            for (i = 0; i < chartObj.options.series.length; i++) {
                for (j = 0; j < chartObj.options.series[i].data.length; j++) {
                    if (chartObj.options.series[i].data[j][chartObj.options.series[i].yField] != null)
                    {
                        if (minY != null){
                            if (chartObj.options.series[i].data[j][chartObj.options.series[i].yField] < minY) {
                                minY = chartObj.options.series[i].data[j][chartObj.options.series[i].yField];
                            }
                        }
                        else {
                            minY = chartObj.options.series[i].data[j][chartObj.options.series[i].yField];
                        }

                        if (maxY != null){
                            if (chartObj.options.series[i].data[j][chartObj.options.series[i].yField] > maxY) {
                                maxY = chartObj.options.series[i].data[j][chartObj.options.series[i].yField];
                            }
                        }
                        else {
                            maxY = chartObj.options.series[i].data[j][chartObj.options.series[i].yField];
                        }
                    }
                }
            }

                

            // calcolo il numero di decimali necessari considerando che sull'asse Y siano visualizzati fino a 10 valori 
            // fa max e min
            var passo;

            if (chartObj.options.yAxis.majorUnit == 0){ // passo non specificato

                if (minY > 0)
                {
                    minY=0;
                }

                if (maxY != minY){
                    passo = (maxY - minY)/10;
                }else {
                    passo = minY;
                }
            }else {
                passo = chartObj.options.yAxis.majorUnit;
            }

            var nDecimali = 0;
            var nIter = 0;
            if (passo != 0 && passo != null && nIter < 50) {
                while (passo < 1) {
                    passo = passo * 10;
                    nDecimali++;
                    nIter++;
                }
            } else {
                nDecimali = 1;
            }

            if (myChartProps.classe.indexOf("MyVemCS.Link.Componenti.GraficoLineeUtilizzoLink") >= 0 ||
                myChartProps.classe.indexOf("MyVemCS.VpnL2L.Componenti.GraficoLineeUtilizzoVpn") >= 0 ){
                chartObj.options.yAxis.labels.template = "#= kendo.toString(value, 'N0' ,'it-IT' ).replace('.000.000.000','G').replace('.000.000','M').replace('.000','K') #";
            }
            else{
                chartObj.options.yAxis.labels.template = "#= kendo.toString(value, 'N" + nDecimali + "' , 'it-IT') #";
            }

            // Il grafico linee potenza può avere dei valori negativi, setto forzatamente il minimo al valore minimo calcolato
            // Volendo si può allargare a tutti eliminando il limite su questo grafico
            if (minY < 0 && 
                (myChartProps.classe.indexOf("MyVemCS.EnergyMonitoring.Componenti.GraficoLineePotenzaAttivaTotale") >= 0 ||
                myChartProps.classe.indexOf("MyVemCS.EnergyMonitoring.Componenti.GraficoLineePotenzaReattivaTotale") >= 0)
                )
            {
                chartObj.options.yAxis.min = minY;
            }
        }
        catch (e) {
        }
    }
}


var dataBoundEv = function (chartObj, chartContainerID, myChartProps) {

  //  kendo.culture('it-IT');

//    var culture = kendo.culture();
//    console.log('dataBoundEv: ' + culture.name);
    try {
        getDatiCustom(chartObj.options.series[0], chartContainerID);
    }
    catch (e) {

    }

    try {
        getInfoGrafico(chartObj, chartContainerID, myChartProps);
    }
    catch (e) {

    }

    if (!testNoData(chartObj, chartContainerID)) {

        try {

            if (myChartProps.classe.indexOf("GraficoBarre") >= 0 ){
                delete chartObj.options.valueAxis.max;
            } 
            else{
                if (chartObj.options.valueAxis.max == -1){
                    delete chartObj.options.valueAxis.max;
                }
            }

            //legge l'url del grafico
            var qs = chartObj.dataSource.transport.options.read.url;

            var artmp = qs.split('?');
            var old_qs = artmp[1];

            var arparams = old_qs.split('&');
            var i;

            //valorizza le due proprietà del grafico [this.current_unixtime1] + [this.current_unixtime2]
            for (i = 0; i < arparams.length; i++) {
                artmp = arparams[i].split('=');
                var paramName = artmp[0];
                var paramVal = artmp[1];

                switch (paramName) {
                    case 'di':
                        chartObj.current_unixtime1 = paramVal;
                        break;
                    case 'df':
                        chartObj.current_unixtime2 = paramVal;
                        break;
                    default:
                        break;
                }
            }

            chartObj.refreshXaxisLabels(chartObj.current_unixtime1, chartObj.current_unixtime2);

        }
        catch (e) {
        }


        if (this.p_classe == "MyVemCS.EnergyMonitoring.Componenti.GraficoColonneObiettivi") {
            //eccezione
            try {
                chartObj.options.series[1].color = "#818285";

                if (chartObj.options.series[0].data[0].y1 > chartObj.options.series[0].data[0].y2)
                    chartObj.options.series[0].color = "#C31F3F"; // effettivo > obiettivo
                else
                    chartObj.options.series[0].color = "#ACC42A";
            }
            catch (e) {
                // alert(e);
            }

        }else {

            try {
                max = 0;

                for (i = 0; i < chartObj.options.series.length; i++) {
                    for (j = 0; j < chartObj.options.series[i].data.length; j++) {
                        if (chartObj.options.series[i].data[j][chartObj.options.series[i].field] > max) {
                            max = chartObj.options.series[i].data[j][chartObj.options.series[i].field];
                        }
                    }
                }

//                console.log('max: ' + max);
//                console.log('majorUnit: ' + chartObj.options.valueAxis.majorUnit);

                if (chartObj.options.valueAxis.majorUnit == 0) {  // passo non specificato

                    var nDecimali = 0;

                    if (max == 0 ){
                        max = 5;
                    }

                    if (max < 1) {
                        nDecimali = 3;
                    } else if (max <= 5) {
                        nDecimali = 1;
                    } else {
                        nDecimali = 0;
                    }

                    //console.log('format: ' + chartObj.options.valueAxis.labels.format);
                    chartObj.options.valueAxis.labels.format = "N" + nDecimali;

                    chartObj.options.valueAxis.labels.template = "#= kendo.toString(value, 'N" + nDecimali + "' , 'it-IT') #"
                } 
                else {  // passo intero specificato 

                    chartObj.options.valueAxis.labels.format = "N0";

                    if (myChartProps.classe.indexOf("GraficoColonneSegnaleClient") > 0){
                        chartObj.options.valueAxis.labels.template = "#= kendo.toString(value - 100, 'N0' , 'it-IT') #"
                    }
                    else{
                        chartObj.options.valueAxis.labels.template = "#= kendo.toString(value, 'N0' , 'it-IT') #"
                    }

                    // obiettivo fare minimo 5 righe max 10 perchè altrimenti è brutto e lento

                    if (max > 10)
                    {
                        var minPasso =  max / 10 ;
                        var passo = 1;
                        var ultimoStep = 5;

                        while (passo < minPasso)
                        {
                            if (ultimoStep == 2){
                                passo = passo * 5;
                                ultimoStep = 5;
                            }else {
                                passo = passo * 2;
                                ultimoStep = 2;    
                            }
                        }

                        chartObj.options.valueAxis.majorUnit = passo;

                    }
                    else {
                        chartObj.options.valueAxis.majorUnit = 1;
                    }
                }
            }
            catch (e) {
            }
       }

       if (myChartProps.classe.indexOf("MyVemCS.Wireless.GraficoColonneClientAP") >= 0)
       {
            if(selectedRangePreset=='1W' || selectedRangePreset=='1M')
            {
                chartObj.options.xAxis.labels.template = "#= kendo.toString(value, 'dd/MM' , 'it-IT') #";
            }
            else if(selectedRangePreset=='1D')
            {
                chartObj.options.xAxis.labels.template = "#= kendo.toString(value, 'HH:mm' , 'it-IT') #";
            }
       }


    } //testNoData
}

var chartProcess = function (chartContainerObj, chartContainerID, thisChartProps) {

    var thischart = chartContainerObj.data("kendoChart");

    if (thischart) //<--gestione thischart [begin]
    {
        thischart.p_classe = thisChartProps.classe;
        addChart(chartContainerID);
        createLoaderDiv(thischart, chartContainerID, thisChartProps);

        refreshChartXaxis(thischart);

    } //<--gestione thischart [end]
}

var refreshChartXaxis = function (thischart) {

    thischart.refreshXaxisLabels = function (unixtime1, unixtime2) {

        var xAxisFormatLabel;
        var xAxisStep;
        var xAxisBaseUnit=null;
        var xAxisBaseUnitStep=null;
        
        var unixTimespan = unixtime2 - unixtime1;
        

        var timespanTab = this.xAxisRulesArray;

        if (timespanTab.length > 0){

            var x;
            for (x = 0; x < timespanTab.length; x++) {

                var currentTS = timespanTab[x][0];

            
                xAxisFormatLabel = timespanTab[x][1][0];
                xAxisStep = timespanTab[x][1][1];

                if (timespanTab[x][1].length > 2) {
                    xAxisBaseUnit = timespanTab[x][1][2];
                    xAxisBaseUnitStep = timespanTab[x][1][3];
                }

                if (unixTimespan <= currentTS) {
                    break;
                }
            }

            //x-axis change
            this.options.categoryAxis.labels.format = xAxisFormatLabel;
            this.options.categoryAxis.labels.step = xAxisStep;
        

            if (this.options.categoryAxis.majorGridLines.step && this.options.categoryAxis.majorTicks.step)
            {
                if (xAxisStep > 10){
                    this.options.categoryAxis.majorGridLines.step=xAxisStep/2;
                    this.options.categoryAxis.majorTicks.step=xAxisStep;
                }else {
                    this.options.categoryAxis.majorGridLines.step=1;
                    this.options.categoryAxis.majorTicks.step=1;
                }
            }

            if(xAxisBaseUnit!=null) this.options.categoryAxis.baseUnit = xAxisBaseUnit;
            if (xAxisBaseUnitStep != null) this.options.categoryAxis.baseUnitStep = xAxisBaseUnitStep;
        }
    }


    thischart.refreshXaxisLabelsScatter = function (unixtime1, unixtime2) {

        var xAxisFormatLabel;
        var xAxisStep;
        var xAxisBaseUnit=null;
        var xAxisBaseUnitStep=null;
        var minX = null;
        var maxX = null;
        
        var unixTimespan = unixtime2 - unixtime1;
        // alert(unixTimespan); 

        var timespanTab = this.xAxisRulesArray;

        var x;
        for (x = 0; x < timespanTab.length; x++) {

            var currentTS = timespanTab[x][0];

            
            xAxisFormatLabel = timespanTab[x][1][0];
            xAxisStep = timespanTab[x][1][1];

            if (timespanTab[x][1].length > 2) {
                xAxisBaseUnit = timespanTab[x][1][2];
                xAxisBaseUnitStep = timespanTab[x][1][3];
            }

            if (unixTimespan <= currentTS) {
                break;
            }
        }

        for (i = 0; i < this.options.series.length; i++) {
            for (j = 0; j < this.options.series[i].data.length; j++) {

                if (maxX!= null)
                {
                    if (this.options.series[i].data[j].x > maxX) {
                        maxX = this.options.series[i].data[j].x;
                    }
                }
                else
                {
                    maxX = this.options.series[i].data[j].x;
                }

                if (minX != null)
                {
                    if (this.options.series[i].data[j].x < minX) {
                        minX = this.options.series[i].data[j].x;
                    }
                }
                else
                {
                    minX = this.options.series[i].data[j].x;
                }
            }
        }

        //x-axis change

        this.options.xAxis.min = minX;
        this.options.xAxis.max = maxX;
        this.options.xAxis.labels.format = xAxisFormatLabel;
        this.options.xAxis.labels.step = xAxisStep;

        if(xAxisBaseUnit!=null) this.options.xAxis.baseUnit = xAxisBaseUnit;
    }
}

var createLoaderDiv = function (thischart, chartContainerID, thisChartProps) {

    thischart.loaderDivInitialization = function () {

        var idChartDOM = chartContainerID;
        var thisChartDiv = document.getElementById(idChartDOM);

        var thisChartDivloader = document.createElement('div');

        thisChartDivloader.style.top = '-' + $('#' + chartContainerID).height() / 2 + 'px';
        thisChartDivloader.style.position = 'relative';

        //SPINNER EVAL - BEGIN
        var charspinner = "";
        if (document.URL.toLowerCase().indexOf('monitorbak') > -1)
            charspinner = '/monitorbak/images/ajax-loader1.gif';
        else
            charspinner = '/images/ajax-loader1.gif';

        var imagespinner = "url(" + charspinner + ")";
        //SPINNER EVAL - END

        thisChartDivloader.style.backgroundImage = imagespinner;
        thisChartDivloader.style.width = '31px';
        thisChartDivloader.style.height = '31px';
        thisChartDivloader.style.zIndex = 1000;
        thisChartDivloader.id = idChartDOM + "DivLoader";
        thisChartDivloader.style.margin = 'auto';
        thisChartDiv.parentElement.appendChild(thisChartDivloader);
    }

    thischart.loaderDivInitialization();

    thischart.xAxisRulesArray = thisChartProps.timespan_assex_format;
    thischart.refreshvem = function (unixtime1, unixtime2) {

        removeNoData(chartContainerID);

        var idDivLoader = chartContainerID + "DivLoader";

        $("#" + idDivLoader).show();

        var qs = this.dataSource.transport.options.read.url;

        var new_url;
        var artmp;

        artmp = qs.split('?');

        var pagedest = artmp[0];
        var old_qs = artmp[1];

        var arparams = old_qs.split('&');

        var new_qs = '';
        var i;

        var dpr_present = false;

        for (i = 0; i < arparams.length; i++) {
            artmp = arparams[i].split('=');
            var paramName = artmp[0];
            var paramVal = artmp[1];

            switch (paramName) {
                case 'di':
                    paramVal = unixtime1;
                    break;
                case 'df':
                    paramVal = unixtime2;
                    break;
                case 'dpr':
                    paramVal = selectedRangePreset;
                    dpr_present = true;
                    break;
                default:
                    // cerco nell'oggetto selectorValues
                    try {
                        for (var selectorParamName in selectorValues) {
                            if (paramName == selectorParamName) {
                                paramName = selectorParamName;
                                paramVal = selectorValues[selectorParamName];
                            }
                        }
                    }
                    catch (e) { }
                    break;
            }

            new_qs += (((new_qs.length == 0) ? '?' : '&') + paramName + "=" + paramVal);
        }

        new_url = pagedest + new_qs

        if (!dpr_present) new_url += ('&dpr=' + selectedRangePreset);

        //alert(new_url);

        //url change
        this.dataSource.transport.options.read.url = new_url;

        var xAxisFormatLabel;
        var xAxisStep;

        var unixTimespan = unixtime2 - unixtime1;

        var timespanTab = this.xAxisRulesArray;

        //reload chart
        this.dataSource.read();
    }
}

var addChart = function (chartContainerID) {

    if (chartsList) {
        chartsList.push(chartContainerID);
    }

}

var checkSeries = function (chartContainerObj, paramSerie) {

    var seriesError = false;

    //<--condizione anomala inizializzazione grafico [begin]
    if (paramSerie == '') {
        chartContainerObj.text("errore grafico ");
        seriesError = true;
    }
    //-->condizione anomala inizializzazione grafico [end]

    return seriesError;
}

var hideChartLoader = function (chartContainerID) {
    var idDivLoader = chartContainerID + "DivLoader";
    $("#" + idDivLoader).hide();
}

var graficoBarre = function (chartContainerObj, chartContainerID, myChartProps) 
{

//    var culture = kendo.culture();
//    alert('prima costruzione grafico: ' + culture.name);

    var chartobj;
    if(myChartProps.altezza > 0){
        chartobj = {
                height: myChartProps.altezza,
                width: myChartProps.larghezza
            }
    }
    else{
        chartobj = {
        }
    }
    if(checkSeries(chartContainerObj, myChartProps.serie))
    {
        return;
    }

    chartContainerObj.kendoChart({
        theme: 'default',
        seriesColors: myChartProps.colori,
        dataSource: {
            transport: {
                read: {
                    url: myChartProps.url,
                    dataType: "json"
                }
            },

            schema: {
                model: {
                    fields: myChartProps.campi_schema
                }
            }
        },

        legend: {
            position: "bottom"
        },

        chartArea: chartobj,

        seriesDefaults: {
            type: "bar",
            stack: true
        },

        series: myChartProps.serie,

        categoryAxis: {

            title: {
                text: myChartProps.legenda_categorie
            },
            type: myChartProps.tipo_categoria,
            field: "x"/*,
            labels: {
                culture: "it-IT"
                format: myChartProps.formato_label_categorie,
                step: myChartProps.step_label_categorie
            }
            */
        },

        valueAxis: {

            title: {
                text: myChartProps.legenda_valori,
                font: "12px Arial,Helvetica,sans-serif"
            },

            labels: {
                format: myChartProps.formato_label_valori,
                template: myChartProps.formato_template_valori
            },

            majorUnit: myChartProps.unita_valori,
            min: 0,
            max:5
        },

        tooltip: {
            color: '#fff',
            visible: true,
            template: myChartProps.tooltip_template
        },

        dataBound: function () {
            dataBoundEv(this, chartContainerID, myChartProps);
            hideChartLoader(chartContainerID);
        }
    });

//    culture = kendo.culture();
//    alert('dopo costruzione grafico: ' + culture.name);

    //<--CUSTOM PROPS FOR BAR-CHART - BEGIN
    var thischart = chartContainerObj.data("kendoChart");
        
    if (thischart) //<--gestione thischart [begin]
    {
        for (i = 0; i < thischart.options.series.length; i++) {
            thischart.options.series[i].timespan_fra_serie = 0;
            thischart.options.series[i].dettaglio = 0;
        }

        if (myChartProps.timespan_fra_serie != 0) {
            thischart.options.series[0].timespan_fra_serie = myChartProps.timespan_fra_serie;
            thischart.options.series[0].dettaglio = myChartProps.dettaglio;
        }
    }
    //-->CUSTOM PROPS FOR BAR-CHART - END

    chartProcess(chartContainerObj, chartContainerID, myChartProps);
}

var graficoLinee = function (chartContainerObj, chartContainerID, myChartProps) 
{
    var chartobj;
    if(myChartProps.altezza > 0){
        chartobj = {
                height: myChartProps.altezza,
                width: myChartProps.larghezza,
                background:myChartProps.sfondo
            }
    }
    else{
        chartobj = {
                background:myChartProps.sfondo,
        }
    }

    if (checkSeries(chartContainerObj, myChartProps.serie)) {
        return;
    }

    chartContainerObj.kendoChart({
        theme: 'default',
        seriesColors: myChartProps.colori,
        dataSource: {
            transport: {
                read: {
                    url: myChartProps.url,
                    dataType: "json"
                }
            },

            schema: {
                model: {
                    fields: myChartProps.campi_schema
                }
            }
        },

        /*
        title: {
        text: myChartProps.titolo
        },*/

        legend: {
            position: "bottom"/*,
            offsetX: myChartProps.larghezza - 140,
            offsetY: myChartProps.altezza / 2 - p_serie.length * 5*/
        },
        chartArea: chartobj,

        seriesDefaults: {
            type: "line"
        },

        series: myChartProps.serie,

        xAxis: {

                title: {
                    text: myChartProps.legenda_categorie
                },
                type: myChartProps.tipo_categoria,
                labels: {
                    culture: "it-IT",
                    format: myChartProps.formato_label_categorie //,
                   //step: myChartProps.step_label_categorie
                },

                majorGridLines:{
                    visible: true
                },

                minorGridLines: {
                    visible: true
                }
            },

            yAxis: {

                title: {
                    text: myChartProps.legenda_valori,
                    font: "12px Arial,Helvetica,sans-serif"
                },

                labels: {
                    culture: "it-IT",
                    format: myChartProps.formato_label_valori,
                    template: myChartProps.formato_template_valori
                }

                ,majorUnit: myChartProps.unita_valori
                ,min: 0
                //,max: myChartProps.massimo_valori
            },

        tooltip: {
            color: '#fff',
            visible: true,
            template: myChartProps.tooltip_template
        },

        dataBound: function () {

            dataBoundEv(this, chartContainerID, myChartProps);
            var d = document.getElementById('div' + chartContainerID )
            //alert(this._plotArea.axisX.box.x1);
            //alert(this._plotArea.axisX.box.y1);
            //alert(a.a.a);
            hideChartLoader(chartContainerID);
            //$("#containerGrafico1 > svg > path:nth-child(3)").attr('fill','red');
            //$("#containerGrafico2 > svg > path:nth-child(3)").attr('fill','red');
        }
    });

    chartProcess(chartContainerObj, chartContainerID, myChartProps);
}

var graficoLineeIrregolare = function (chartContainerObj, chartContainerID, myChartProps) 
{
        var chartobj;
        if(myChartProps.altezza > 0){
            chartobj = {
                    height: myChartProps.altezza,
                    width: myChartProps.larghezza
                }
        }
        else{
            chartobj = {}
        }

        if (checkSeries(chartContainerObj, myChartProps.serie)) {
            return;
        }

//        var culture = kendo.culture();
    //        alert('prima costruzione grafico: ' + culture.name);
        
        var minimoY = 0;
        
        if (myChartProps.classe.indexOf("MyVemCS.EnergyMonitoring.Componenti.GraficoLineeCosPhi") >= 0)
        {
            minimoY = -1;
        }

        chartContainerObj.kendoChart({
            theme: 'default',
            seriesColors: myChartProps.colori,
            dataSource: {
                transport: {
                    read: {
                        url: myChartProps.url,
                        dataType: "json"
                    }
                },

                schema: {
                    model: {
                        fields: myChartProps.campi_schema
                    }
                }
            },

            legend: {
                position: "bottom"
            },

            seriesDefaults: {
                type: "scatterLine"
            },

        
            chartArea: chartobj,
    

            series: myChartProps.serie,

            xAxis: {

                title: {
                    text: myChartProps.legenda_categorie
                },
                type: myChartProps.tipo_categoria,
                labels: {
                    culture: "it-IT",
                    format: myChartProps.formato_label_categorie //,
                   //step: myChartProps.step_label_categorie
                },

                majorGridLines:{
                    visible: true
                },

                minorGridLines: {
                    visible: true
                }
            },

            yAxis: {

                title: {
                    text: myChartProps.legenda_valori,
                    font: "12px Arial,Helvetica,sans-serif"
                },

                labels: {
                    culture: "it-IT",
                    format: myChartProps.formato_label_valori,
                    template: myChartProps.formato_template_valori
                }

                ,majorUnit: myChartProps.unita_valori
                , min: minimoY
                //,max: myChartProps.massimo_valori
            },

            tooltip: {
                color: '#fff',
                visible: true,
                template: myChartProps.tooltip_template
            },

            dataBound: function () {
                dataBoundScatterEv(this, chartContainerID, myChartProps);
                hideChartLoader(chartContainerID);
            }
        });

//        culture = kendo.culture();
//        alert('dopo costruzione grafico: ' + culture.name);

//    if(myChartProps.altezza > 0){ //Controllo se il grafico è responsive

//        chartContainerObj.data("kendoChart").options.chartArea.height=myChartProps.altezza;
//    }
//    if(myChartProps.larghezza > 0){

//        chartContainerObj.data("kendoChart").options.chartArea.width = myChartProps.larghezza;
//    }

    chartProcess(chartContainerObj, chartContainerID, myChartProps);
}


var graficoAnello = function (chartContainerObj, chartContainerID, myChartProps) 
{
    if(checkSeries(chartContainerObj, myChartProps.serie))
    {
        return;
    }
    var chartobj;
    if(myChartProps.altezza > 0){
        chartobj = {
                height: myChartProps.altezza,
                width: myChartProps.larghezza,
                margin: {
                    right: myChartProps.margine_destro,
                    bottom: myChartProps.margine_basso
                }
            }
    }
    else{
        chartobj = {
                background:myChartProps.sfondo
        }
    }
    chartContainerObj.kendoChart({
        theme: 'default',
        seriesColors: myChartProps.colori,
        dataSource: {
            transport: {
                read: {
                    url: myChartProps.url,
                    dataType: "json"
                }
            },

            schema: {
                model: {
                    fields: myChartProps.campi_schema
                }
            }
        },

        /*
        title: {
        text: p_titolo
        },*/

        legend: {
            position: myChartProps.legenda_posizione,

            labels: {
                template: myChartProps.template_label_legenda ,
            }
        },

        chartArea: chartobj,

        seriesDefaults: {
            type: "donut",
            labels: {
                visible: true,
                position: "outsideEnd",
                template: myChartProps.template_label_serie    //  "#= kendo.toString(value, 'N0' ) # MB (#= rimuoviZeri(kendo.format('{0:P}', percentage)) #)"
                //format: "#= kendo.toString(value, 'N2' )  #"
            }
        },
        plotArea: { margin: { top: 20, left: 5, right: 5, bottom: 5 } },

        series: myChartProps.serie,

        tooltip: {
            color: '#fff',
            visible: true,
            template: myChartProps.tooltip_template
        },

        dataBound: function () {

            dataBoundEv(this, chartContainerID, myChartProps);
            hideChartLoader(chartContainerID);

        }
    });

    chartProcess(chartContainerObj, chartContainerID, myChartProps);
}

var graficoArea = function (chartContainerObj, chartContainerID, myChartProps) 
{
    if(checkSeries(chartContainerObj, myChartProps.serie))
    {
        return;
    } 
    var chartobj;
    if(myChartProps.altezza > 0){
        chartobj = {
                height: myChartProps.altezza,
                width: myChartProps.larghezza
                }
    }
    else{
        chartobj = {
        }
    }
    
    chartContainerObj.kendoChart({
        theme: 'default',
        seriesColors: myChartProps.colori,
        dataSource: {
            transport: {
                read: {
                    url: myChartProps.url,
                    dataType: "json"
                }
            },

            schema: {
                model: {
                    fields: myChartProps.campi_schema
                }
            }
        },


        legend: {
            position: "bottom"
        },
        chartArea: chartobj,

        seriesDefaults: {
            type: "area"
        },

        series: myChartProps.serie,

        categoryAxis: {

            title: {
                text: myChartProps.legenda_categorie
            },
            type: myChartProps.tipo_categoria,
            field: "x",
            labels: {
                culture: "it-IT",
                format: myChartProps.formato_label_categorie,
                step: myChartProps.step_label_categorie
            },
            baseUnit: myChartProps.unita_base_categorie,
            baseUnitStep: myChartProps.step_unita_base_categorie,

            majorGridLines: {
                step: myChartProps.step_label_categorie
            },

            majorTicks: {
                step: myChartProps.step_label_categorie
            }

        },

        valueAxis: {

            title: {
                text: myChartProps.legenda_valori,
                font: "12px Arial,Helvetica,sans-serif"
            },

            labels: {
                format: myChartProps.formato_label_valori,
                template: myChartProps.formato_template_valori
            }

            ,majorUnit: myChartProps.unita_valori
            ,min: 0
        },

        tooltip: {
            color: '#fff',
            visible: true,
            template: myChartProps.tooltip_template
        },

        dataBound: function () {

            dataBoundEv(this, chartContainerID, myChartProps);
            hideChartLoader(chartContainerID);
        }
    });
    
    chartProcess(chartContainerObj, chartContainerID, myChartProps);
}

var graficoColonne = function (chartContainerObj, chartContainerID, myChartProps) 
{
    var chartobj;
    if(myChartProps.altezza > 0){
        chartobj = {
                height: myChartProps.altezza,
                width: myChartProps.larghezza
            }
    }
    else{
        chartobj = {

        }
    }
    if(checkSeries(chartContainerObj, myChartProps.serie))
    {
        return;
    }

    chartContainerObj.kendoChart({
        theme: 'default',
        seriesColors: myChartProps.colori,
        dataSource: {
            transport: {
                read: {
                    url: myChartProps.url,
                    dataType: "json"
                }
            },

            schema: {
                model: {
                    fields: myChartProps.campi_schema
                }
            }
        },

        legend: {
            position: "bottom"
        },

        chartArea: chartobj,

        seriesDefaults: {
            type: "column",
            labels: {
                visible: myChartProps.label_serie_visibili,
                background: "transparent"
            }
        },

        series: myChartProps.serie,

        categoryAxis: {

            title: {
                text: myChartProps.legenda_categorie
            },
            type: myChartProps.tipo_categoria,
            field: "x",
            labels: {
                culture: "it-IT",
                format: myChartProps.formato_label_categorie,
                step: myChartProps.step_label_categorie,
                template: myChartProps.template_label_categorie,
                rotation: myChartProps.rotazione_label_categorie,
                visible: myChartProps.label_categorie_visibili
            },

            baseUnit: myChartProps.unita_base_categorie,
            baseUnitStep: myChartProps.step_unita_base_categorie
        },

        valueAxis: {

            title: {
                text: myChartProps.legenda_valori,
                font: "12px Arial,Helvetica,sans-serif"
            },

            labels: {
                format: myChartProps.formato_label_valori,
                template: myChartProps.formato_template_valori
            },

            majorUnit: myChartProps.unita_valori,
            min: 0,
            max: myChartProps.massimo_valori
        },

        tooltip: {
            color: '#fff',
            visible: true,
            template: myChartProps.tooltip_template
        },

        dataBound: function () {

            dataBoundEv(this, chartContainerID, myChartProps);
            hideChartLoader(chartContainerID);

        },

        plotAreaClick: myChartProps.plot_area_click
    });

    //<--CUSTOM PROPS FOR COLUMN-CHART - BEGIN
    var thischart = chartContainerObj.data("kendoChart");
    if (thischart) //<--gestione thischart [begin]
    {
        for (i = 0; i < thischart.options.series.length; i++) {
            thischart.options.series[i].timespan_fra_serie = 0;
            thischart.options.series[i].dettaglio = 0;
        }

        if (myChartProps.timespan_fra_serie != 0) {
            thischart.options.series[0].timespan_fra_serie = myChartProps.timespan_fra_serie;
            thischart.options.series[0].dettaglio = myChartProps.dettaglio;
        }
    }
    //-->CUSTOM PROPS FOR COLUMN-CHART - END

    chartProcess(chartContainerObj, chartContainerID, myChartProps);
}

var graficoMisuratore = function (chartContainerObj, chartContainerID, myChartProps) 
{

    if(checkSeries(chartContainerObj, myChartProps.serie))
    {
        return;
    }

    var chartobj;
    if(myChartProps.altezza > 0){
        chartobj = {
            height: myChartProps.altezza,
            width: myChartProps.larghezza
            }
    }
    else{
        chartobj = {
        }
    }

    chartContainerObj.kendoChart({
        theme: 'default',

        legend: {
            visible: true,
            position: "bottom"
        },

        seriesColors: myChartProps.colori,

        series: myChartProps.serie,

        dataSource: {
            transport: {
                read: {
                    url: myChartProps.url,
                    dataType: "json"
                }
            }
        },

        categoryAxis: {
            majorGridLines: {
                visible: false
            },
            majorTicks: {
                visible: false
            }
        },
        valueAxis: [{
            plotBands: [{
                from: myChartProps.inizio_verde, to: myChartProps.fine_verde, color: "#adda9f", opacity: .9
            }, {
                from: myChartProps.inizio_giallo, to: myChartProps.fine_giallo, color: "#fbefc5", opacity: .9
            }, {
                from: myChartProps.inizio_rosso, to: myChartProps.fine_rosso, color: "#fca295", opacity: .9
            }],
            majorGridLines: {
                visible: false
            },
            min: myChartProps.minimo,
            max: myChartProps.massimo,
            minorTicks: {
                visible: true
            }
        }],
        tooltip: {
            color: '#fff',
            visible: true,
            shared: true,
            template: myChartProps.tooltip_template
        },

        chartArea: chartobj,

        dataBound: function () {
            hideChartLoader(chartContainerID);
        }

    });

    chartProcess(chartContainerObj, chartContainerID, myChartProps);
}

function rimuoviZeri(s)
{
    if (s=='0,00%'){
        return '';
    }else {
        return s;
    } 
}

var graficoTorta = function (chartContainerObj, chartContainerID, myChartProps) 
{
    if (checkSeries(chartContainerObj, myChartProps.serie)) {
        return;
    }
    var chartobj;
    if(myChartProps.altezza > 0){
        chartobj = {
                height: myChartProps.altezza,
                width: myChartProps.larghezza,
                margin: {
                    right: myChartProps.margine_destro,
                    bottom: myChartProps.margine_basso
                }
            }
    }
    else{
        chartobj = {
        }
    }

    chartContainerObj.kendoChart({
        theme: 'default',
        seriesColors: myChartProps.colori,
        dataSource: {
            transport: {
                read: {
                    url: myChartProps.url,
                    dataType: "json"
                }
            },

            schema: {
                model: {
                    fields: myChartProps.campi_schema
                }
            }
        },

        legend: {
            position: myChartProps.legenda_posizione,

            labels: {
                template: myChartProps.template_label_legenda
            }
        },
        chartArea: chartobj,

        seriesDefaults: {
            type: "pie",
            labels: {
                visible: true,
                position: "outsideEnd",
                template: "#= rimuoviZeri(kendo.format('{0:P}', percentage)) #"
                //format: "#= kendo.toString(value, 'N2' )  #"
            }
        },

        plotArea: { margin: { top: 20, left: 5, right: 5, bottom: 5 } },

        series: myChartProps.serie,

        tooltip: {
            color: '#fff',
            visible: true,
            template: myChartProps.tooltip_template
        },

        dataBound: function () {

            dataBoundEv(this, chartContainerID, myChartProps);
            hideChartLoader(chartContainerID);

        },

        seriesClick: myChartProps.series_click    
    });

    chartProcess(chartContainerObj, chartContainerID, myChartProps);
}