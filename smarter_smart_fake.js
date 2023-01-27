javascript:

//$.getScript('https://media.innogamescdn.com/com_DS_HU/scripts/supp_hotkeys.js');
/*Smart Fake script*/

//FUNCTIONS

//"logic" functions

/*Functions used to obtain some data*/

//download the time window from a given url
function getArrivalDate(urll){
	let dates;
	if(sessionStorage.getItem("smart_fake_date") != null){
		dates = sessionStorage.getItem("smart_fake_date").split(",");
	}else{
		$.ajax({url: urll, async: false, success: function(result){
			dates = $(result).find(".post > .text").eq(0).text().match(/\d+:\d+:\d+:\d+:\d+:\d+:\d+/g);
		}})	
		sessionStorage.setItem("smart_fake_date", dates);
	}
	let min=dates[0].split(':');
	let max=dates[1].split(':');
	let min_time = new Date(parseInt(min[0]),parseInt(min[1])-1,parseInt(min[2]),parseInt(min[3]),parseInt(min[4]),parseInt(min[5]),parseInt(min[6]));
	let max_time = new Date(parseInt(max[0]),parseInt(max[1])-1,parseInt(max[2]),parseInt(max[3]),parseInt(max[4]),parseInt(max[5]),parseInt(max[6]));
	arrival = [min_time,max_time];
	return arrival;
}

//read a text file uploaded somewhere 
function getCoordsByUrl(urll){
	let coords;
	if(sessionStorage.getItem("smart_fake_coords") != null){
		coords = sessionStorage.getItem("smart_fake_coords");
	}else{
		$.ajax({url: urll, async: false, success: function(result){
		coords = $(result).find(".post > .text").eq(0).text().match(/\d+,\d+/g);
			for(let x = 0; x < coords.length; x++){
				coords[x] = coords[x].replace(",", "|");
			}
			coords = coords.join(" ");
		}})	
		sessionStorage.setItem("smart_fake_coords", coords);
	}
	return coords;
}

//get unit infos (speed and pop)
function fnAjaxRequest(url,sendMethod,params,type){
    let error=null,payload=null;
 
    window.$.ajax({
        "async":false,
        "url":url,
        "data":params,
        "dataType":type,
        "type":String(sendMethod||"GET").toUpperCase(),
        "error":function(req,status,err){error="ajax: " + status;},
        "success":function(data,status,req){payload=data;}});
 
    if(error){
        throw(error);
    }
 
    return payload;
}
function fnCreateConfig(name){return window.$(fnAjaxRequest("/interface.php","GET",{"func":name},"xml")).find("config");}

//find speed of a specific unit (m/field)
function getSpeed(unit){
	return parseFloat(unitConfig.find(unit+" speed").text());
}

//find pop of a specific unit
function getPop(unit){
	return parseFloat(unitConfig.find(unit+" pop").text());
}

//find base build time of a specific unit
function getBuildTime(unit){
	return parseFloat(unitConfig.find(unit+" build_time").text());
}

//get current village coord
function currentCoord(){
	return game_data.village.coord;
	}


/*simple calculation*/

// find the distance between two given coords
function distance(source, target){
	let fields = Math.sqrt(Math.pow(source[1]-target[1],2)+Math.pow(source[0]-target[0],2));
	return fields;
	}
	
//find travel time between two given coords for a specific unit
function travelTime(source, target, unit){
	let unitSpeed = getSpeed(unit);
	let fields=distance(source,target);
	let tt=unitSpeed*fields;
	return tt;
}

//add time (in minutes) to a date
function addTime(date,time){
	let date_ms=date.getTime();
	time=time*1000*60;
	newDate=date_ms+time;
	newDate=new Date(newDate);
	return newDate;
}

/*Core functions*/

//get a list of coords whith the rigth traveltime
function getGoodCoords(coords,slowestUnit,minTime,maxTime){
	let goodCoords=[];
	let servertime = window.$("#serverTime").html().match(/\d+/g);
	let serverDate = window.$("#serverDate").html().match(/\d+/g);
	serverTime = new Date(serverDate[1]+"/"+serverDate[0]+"/"+serverDate[2]+" "+servertime.join(":"));
	coords = coords.split(' ');
	closest=60*500;
	far=0;
	
	for(i=0;i<coords.length-1;i++){
			coordsSplit = coords[i].split('|');
			travel=travelTime(coordsSplit, currentCoord().split("|"), slowestUnit);
			arrival=addTime(serverTime,travel);
			if (travel<closest){
				closest=travel;
			}
			else if (travel>far){
				far=travel;
			}
			if (arrival>minTime && arrival<maxTime)
			{
				goodCoords.push(coords[i]);
			}
		}
		
		if(goodCoords.length>0){
			index=Math.round(Math.random() * (goodCoords.length - 1));
			while(goodCoords.length>0 && alreadySent(currentCoord(),goodCoords[index])){
				goodCoords.splice(index,1);
				index=Math.round(Math.random() * (goodCoords.length - 1));
			}
			if(goodCoords.length>0){
				fillInCoords(goodCoords[index]);
				return goodCoords[index];
				}
			else{
				UI.ErrorMessage("Már minden fake kordira küldtél támadást, próbáld később vagy válts egység típusokat",5000);
				return null;
			}
		}
		else{
			UI.ErrorMessage("Egy faluba se csapódnál a megadott idősáv között."+"\n"+" Ekkor futtasd a scriptet: "+addTime(minTime,(-1)*far).toString()+ " és " +addTime(maxTime,(-1)*closest).toString(),6000);
			return null;
		}
}

//insert given coords as target
function fillInCoords(coords){
	coordsSplit = coords.split('|');
    document.forms[0].x.value = coordsSplit[0];
    document.forms[0].y.value = coordsSplit[1];
    $('#place_target').find('input').val(coordsSplit[0] + '|' + coordsSplit[1]);
}

//save sent coords
function alreadySent(myCoords,target){
	if(sessionStorage.alreadySent){
		history=JSON.parse(sessionStorage.alreadySent);
		if (myCoords in history){
			if (history[myCoords].includes(target)){
				return true
			}
			else{
				history[myCoords].push(target);
				return false
			}
		}
		else{
			history[myCoords]=[target];
			sessionStorage.alreadySent=JSON.stringify(history);
			return false
		}
	}
	else{
		history={}
		history[myCoords]=[target];
		sessionStorage.alreadySent=JSON.stringify(history);
		return false
	}
	
}

function fillInTroops(troopCounts, troopPreferences){
  //find the slowest selected unit
	let slowest = null;
	let slowestSpeed = 0;
	for (const [troopT, requested] of Object.entries(troopPreferences)) {
		if (requested) {
			let currentSpeed;
			if (slowest == null && requested && troopCounts[troopT] > 0) {
				slowest = troopT;
				slowestSpeed = getSpeed(slowest);
			}
			else if ((currentSpeed = getSpeed(troopT)) > slowestSpeed) {
				slowestSpeed = currentSpeed;
				slowest = troopT;        
			}
		}
	}

	if (!slowest) {
		UI.ErrorMessage("Nincsenek egységek a fakezéshez...");
		return null;
	}

	let fakePopNeeded = Math.ceil(game_data.village.points / 100); //how to fetch world setting from api?
	if (no_fake_limit) {
		// Do stuff
		fakePopNeeded = 10; //cat + spy at most on no limit words
	}
	console.log(fakePopNeeded);
	let troopsToSend = {};
	Object.keys(troopPreferences).map(k => troopsToSend[k] = 0 );
	troopsToSend[slowest] = 1;
	fakePopNeeded -= getPop(slowest);
	barrackTs = findFasterBuild(troopPreferences)[0];
	stableTs = findFasterBuild(troopPreferences)[1];

	function fillRequestedTroops(troopArray) {
		let troopT = troopArray.length ? troopArray[0] : null;
		if (troopT && troopCounts[troopT] > troopsToSend[troopT]) {
			++troopsToSend[troopT];
			fakePopNeeded -= getPop(troopT);
		} else {
			troopArray.shift();
		}

		return fakePopNeeded > 0;
	}
	
	while (true) {
		if (!fillRequestedTroops(barrackTs)) {
			break;
		}
		if (!fillRequestedTroops(stableTs)) {
			break;
		}
		//no options left
		if (!barrackTs.length && !stableTs.length) {
			break;
		}
	}

	if (Object.values(troopsToSend).some(x => x > 0)) {
		Object.entries(troopsToSend).map(entry => {
			const troopT = entry[0];
			const troopCount = entry[1];
			if (troopCount > 0) { 
				document.forms[0][troopT].value = troopCount
			}
		});
		return slowest;
	}
	UI.ErrorMessage("Nincsenek egységek a fakezéshez");
	return null;
}


//find the unit whith the fastest base build time
function findFasterBuild(troopArray){
	let keys=Object.keys(troopArray);
	let barracks=[];
	let stable=[];
	let workshop=[];
	keys.sort(function sortByBuildTime(a,b){return getBuildTime(a)-getBuildTime(b);});
	for(i=0;i<keys.length;i++){
		if(troopArray[keys[i]]){
			if(getPop(keys[i])==1){
				barracks.push(keys[i]);
			}
			else if(keys[i]=="ram" || keys[i]=="catapult"){
				workshop.push(keys[i]);
			}
			else {
				stable.push(keys[i]);
			}
		}
	}
	return [barracks,stable, workshop];
}


/*------------------------------------------------------------------------------------------------------------*/
/*interface functions*/

function dateToIsoFormat(date){
	offset= -(new Date().getTimezoneOffset() / 60);
	date=new Date(date.getTime()+1000*60*60*offset);
	return date.toISOString().split(".")[0];
}

function setManual(){
	mode="manual";
	document.getElementById("coordsUrl").disabled=true;
	document.getElementById("arrivalUrl").disabled=true;
	document.getElementById("coords").disabled=false;
	document.getElementById("minDate").disabled=false;
	document.getElementById("maxDate").disabled=false;
}

function setByUrl(){
	mode="byUrl";
	document.getElementById("coords").disabled=true;
	document.getElementById("minDate").disabled=true;
	document.getElementById("maxDate").disabled=true;
	document.getElementById("coordsUrl").disabled=false;
	document.getElementById("arrivalUrl").disabled=false;
}

function getCoords(){
	coords=document.getElementById("coords").value.match(/\d\d\d\|\d\d\d/g);
}

function getCoordsUrl(){
	coordsUrl=document.getElementById("coordsUrl").value;
}

function getArrival(){
	minArrival=new Date(document.getElementById("minDate").value);
	maxArrival=new Date(document.getElementById("maxDate").value);
	document.getElementById("maxDate").min=document.getElementById("minDate").value;
	document.getElementById("minDate").max=document.getElementById("minDate").value;
}

function getArrivalUrl(){
	arrivalUrl=document.getElementById("arrivalUrl").value;
}

function updateUnits(){
	for(i=0;i<unitNames.length;i++){
		unitPreference[unitNames[i]]=document.getElementById(unitNames[i]+"Check").checked
	}
}

function saveSettings(){
	if (minArrival>maxArrival){
		UI.ErrorMessage('Helytelen érkezési dátum');
	}
	else if (coords==null){
		UI.ErrorMessage('Legalább 1 koordinátát írj be',5000);
	}
	else{
		if(mode=="manual"){
			localStorage.smartFakeSettings=mode+":::"+coords+":::"+minArrival+":::"+maxArrival+":::"+JSON.stringify(unitPreference);
		}
		else{
			localStorage.smartFakeSettings=mode+":::"+coordsUrl+":::"+arrivalUrl+":::"+JSON.stringify(unitPreference);
		}
		UI.SuccessMessage('Mentve', 3000);
	}
	
}

function reset(){
	localStorage.removeItem("smartFakeSettings");
	coords=[];
	coordsUrl="";
	minArrival=new Date();
	maxArrival=new Date(minArrival.getTime() + 1000*60*60);
	arrivalUrl="";
	unitPreference={};
	mode="manual";
	unitNames=[];
	openUI();
}


function openUI(){
	images="";
	checkBoxes="";

	if(localStorage.smartFakeSettings){
		savedSettings=localStorage.smartFakeSettings.split(":::");
		if(savedSettings[0]=="manual"){
			mode=savedSettings[0];
			coords=savedSettings[1].replace(/,/g," ");
			minArrival=new Date(savedSettings[2]);
			maxArrival=new Date(savedSettings[3]);
			unitPreference=JSON.parse(savedSettings[4]);
			}
		else{
			mode=savedSettings[0];
			coordsUrl=savedSettings[1];
			arrivalUrl=savedSettings[2];
			unitPreference=JSON.parse(savedSettings[3]);
		}
	}


	for (let i = 0; i < game_data.units.length; i++) {
		if (game_data.units[i] != "militia" && game_data.units[i] != "knigth") {
			unitNames.push(game_data.units[i]);
		}
	}
	for(i=0;i<unitNames.length;i++){
		images=images+'<td style={border: 1px solid black; }><img src="https://dsen.innogamescdn.com/asset/cf2959e7/graphic/unit/unit_'+unitNames[i]+'.png" title='+unitNames[i]+' class="unitImage"></td>';
		if(unitNames[i] in unitPreference && unitPreference[unitNames[i]]){
			checkBoxes=checkBoxes+'<td><input type="checkbox" id='+unitNames[i]+"Check"+' onchange="updateUnits()" checked="true"></input></td>';
		}
		else{
			checkBoxes=checkBoxes+'<td><input type="checkbox" id='+unitNames[i]+"Check"+' onchange="updateUnits()" ></input></td>';
		}
	}

 	let html =     ' <head></head><body>    <h1>Smart fake script</h1>    <form><fieldset><legend>A fakézás adatai</legend><h2>Válassz adat forrást</h2><p><input type="radio" id="manual" name="source" value="manual" checked="true" onchange="setManual()">Koordináták és érkezési idősávok manuális megadása</input></p><p><input type="radio" id="tribe" name="source" value="url" onchange="setByUrl()">Koordináták és érkezési idősávok beolvasása egy fórum témából</input></p></fieldset>      <fieldset>        <legend>Manuális beállítások</legend>         <p>         <h2>Fake koordináták</h2> <label>Koordináták:</label>          <textarea id = "coords"                  rows = "5"                  cols = "70" placeholder="Illeszd be a koordinátákat. Pld: 111|222 888|555" onchange="getCoords()"></textarea>        </p>        <p><h2>Érkezési idősávok</h2> <label>A fake parancsok </label> <input type="datetime-local" id="minDate" value="'+dateToIsoFormat(minArrival)+'" onchange="getArrival()"><label> és </label> <input type="datetime-local" id="maxDate" value="'+dateToIsoFormat(maxArrival)+'" onchange="getArrival()" ></input><label> között érkezzenek </label></p> </fieldset> <fieldset><legend>A fórum témák linkjei ahol az adatok megtalálhatóak</legend><p><h2>Fake koordinátákhoz vezető link</h2><label>Link: </label><input type="text" id="coordsUrl" placeholder="https://..." onchange="getCoordsUrl()" disabled="true"></input></p><p><h2>Érkezési idősávokhoz vezető link</h2><label>Link: </label><input type="text" id="arrivalUrl" placeholder="https://..." onchange="getArrivalUrl()" disabled="true"></input></p></fieldset></form> <fieldset><legend>Egység beállítások</legend><table id="checkboxesTable" border="1"><tr><h2>Válaszd ki az egységeket a fakezások</h2></tr><tr>'+images+'</tr><tr>'+checkBoxes+'</tr></table></fieldset><p><input type="button" class="btn evt-confirm-btn btn-confirm-yes" id="save" onclick="saveSettings()" value="Mentés"></input> <input type="button" class="btn evt-confirm-btn btn-confirm-no" id="reset" onclick="reset()" value="Reset settings"></input> </p></body>';

	Dialog.show("Script settings", html);
	if (mode == "manual"){
		document.getElementById("coordsUrl").disabled=true;
		document.getElementById("arrivalUrl").disabled=true;
		document.getElementById("coords").disabled=false;
		document.getElementById("minDate").disabled=false;
		document.getElementById("maxDate").disabled=false;
		document.getElementById("coords").value=coords;
		//document.getElementById("minDate").value=;
		//document.getElementById("maxDate").value=;
	}
	else{
		document.getElementById("coords").disabled=true;
		document.getElementById("minDate").disabled=true;
		document.getElementById("maxDate").disabled=true;
		document.getElementById("coordsUrl").disabled=false;
		document.getElementById("arrivalUrl").disabled=false;
		document.getElementById("coordsUrl").value=coordsUrl;
		document.getElementById("arrivalUrl").value=arrivalUrl;
		document.getElementById("tribe").checked=true;
	}
}



//ACTUAL CODE
if (game_data.screen == 'place') {
	unitConfig = fnCreateConfig("get_unit_info");
	const troopCounts = {};
    $('a[id^=units_entry_all_]').each(function (i, e) {
        let id = $(e).attr('id');
        let unit = id.match(/units_entry_all_(\w+)/)[1];
        let count = $(e).text().match(/\((\d+)\)/)[1];
        troopCounts[unit] = parseInt(count);
    });
	
	if(localStorage.smartFakeSettings){
		settings=localStorage.smartFakeSettings;
		mode=settings.split(":::")[0];
		if (mode == "manual"){
			coords=settings.split(":::")[1];
			minArrival=new Date(settings.split(":::")[2]);
			maxArrival=new Date(settings.split(":::")[3]);
			troopPreference=JSON.parse(settings.split(":::")[4]);
		}
		else if(mode == "byUrl"){
			coords=getCoordsByUrl(settings.split(":::")[1]);
			dates=getArrivalDate(settings.split(":::")[2]);
			minArrival=dates[0];
			maxArrival=dates[1];
			troopPreference=JSON.parse(settings.split(":::")[3]);
			
		}
		if (typeof slowest_unit === 'undefined') {
			slowest_unit = fillInTroops(troopCounts, troopPreference);
		}
		if (slowest_unit) {
			target = getGoodCoords(coords, slowest_unit, minArrival, maxArrival);
		}
	}
	else{
		let coords=[];
		let coordsUrl="";
		let minArrival=new Date();
		let maxArrival=new Date(minArrival.getTime() + 1000*60*60);
		let arrivalUrl="";
		let unitPreference={};
		let mode="manual";
		let unitNames=[];
		openUI();
	}
}

else{
	let coords=[];
	let coordsUrl="";
	let minArrival=new Date();
	let maxArrival=new Date(minArrival.getTime() + 1000*60*60);
	let arrivalUrl="";
	let unitPreference={};
	let mode="manual";
	let unitNames=[];

	openUI();
}