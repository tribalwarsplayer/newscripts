let url = window.location.href;
if (!url.includes("am_farm")) {
    let id = window.game_data.village.id;
    window.location.href = "https://" + window.location.host + "/game.php?village=" + id.toString() + "&screen=am_farm";
}
const loadingTime = 6000;
const skipWait = 15000;
const wait = 20000;
const errorThreshold = 10;
let skippable = [];
let storage = window.localStorage.getItem('IDs');
if (storage) {
    skippable = storage.split(',').map(x=>+x);
}

let FAvillas;
let avoidStuck = 0;
let sent = 0;
let nextVilla = false;
let doNotReport = false;
let duration;

function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}



let laeUltimateProContext=
`<div id="lae_ultimate_pro_context">
    <tr>
        <label for="villageIDs"><b>Villages to skip:</b></label>
        <tr class="tooltip">
        </tr>
        <style>
            .tooltip .tooltiptext { 
                visibility: hidden; 
                width: 200px; 
                background: linear-gradient(to bottom, #e3c485 0%,#ecd09a 100%); 
                color: black; 
                text-align: center; 
                padding: 5px 10px; 
                border-radius: 6px; 
                border: 1px solid #804000; 
                position: absolute; 
                z-index: 1; 
            } 
            .tooltip:hover .tooltiptext { 
                visibility: visible; 
            }
        </style> 
        <span class="tooltip"><img src="https://tribalwarsplayer.github.io/newscripts//tooltip_icon2.png" style="max-width:13px"/><span class="tooltiptext"><b>Add villages in the following format: <em>'villageID,villageID,...'</em></b> To get village ID Run <b><em>window.game_data.village.id</em></b></span></span>
        <input type="text" id="villageIDs" name="villageIDs">
        <input type="button" id="saveButton" value="Save">
    </tr>
    <tr>
        <label for=addNew"><b>Add new ID:</b></label>
        <input type=text" id="newID" name="newID">
        <input type="button" id="addButton" value="Add">
    </tr>
</div>
<div>
    <tr>
        <label for=timeinterval"><b>Time interval:</b></label>
        <input type=text" id="interval" name="interval">
        <input type="button" id="btn-interval" value="Set Interval">
    </tr>
    <tr>
        <a id="startButton" class="btn" style="cursor:pointer;">Start LA Ultimate Pro</a>
    </tr>
</div>`;

let settingsTable = document.getElementById("content_value");
settingsTable.insertAdjacentHTML("afterbegin", laeUltimateProContext);

document.getElementById("saveButton").onclick = function() {
	let IDs = document.getElementById("villageIDs").value;
	window.localStorage.setItem('IDs', IDs);
	alert("Currently skipping: " + window.localStorage.getItem('IDs').split(',').map(x=>+x));
}

document.getElementById("addButton").onclick = function() {
	let newID = document.getElementById("newID").value;
	if (newID == 0 || skippable.includes(newID)) {
			alert('Value already in set or invalid');
			return;
	}
	let exists = window.localStorage.getItem('IDs');
	let data = exists ? exists + "," + newID : newID;
	window.localStorage.setItem('IDs', data);
	alert("Currently skipping: " + window.localStorage.getItem('IDs').split(',').map(x=>+x));
}

document.getElementById("btn-interval").onclick = function() {
	let interval = document.getElementById("interval").value;
	window.localStorage.setItem('interval', interval);
}

document.getElementById("startButton").onclick = function() {
	$("#lae_ultimate_pro_context").remove();
	let skips = window.localStorage.getItem('IDs');
	skippable = skips.split(',').map(x=>+x);
	FAvillas = skippable.length;
	console.log(FAvillas);
	alert("Currently skipping: " + skippable);
	run();
}

function enhancer() {
  console.log('get script');
  $.getScript('https://tribalwarsplayer.github.io/newscripts/lae_ultimate_base.js');
}

const AccountManager = window.top.Accountmanager;
const GameData = window.top.game_data;

function hasLight() {
  return AccountManager.farm.current_units["light"] > 0;
}

function hasEnoughSprearAndSword() {
  const units = AccountManager.farm.current_units;
  return units["spear"] >= 2 && units["sword"] >= 2;
}

function lightAmount() {
  return AccountManager.farm.current_units["light"];
}

function tryClick() {
  let t = window.top.$("#plunder_list tr").filter(":visible").eq(1);
  let isVisible = t.html();
	if (!isVisible) {
		console.log("All rows hidden...");
		return false;
	}
  let rows = window.top.$("#plunder_list tr").filter(":visible").length;
  selectMasterButton(t);
  let remainingRows = window.top.$("#plunder_list tr").filter(":visible").length;
  return remainingRows != rows;
}

function resetStuckCounter() {
	avoidStuck = 0;
}

function avoidGettingStuck() {
	if (lightAmount() < 5) {
			++avoidStuck;
			doNotReport = true;
			console.log('Warning: ' + avoidStuck + '/' + errorThreshold);
			if (avoidStuck == errorThreshold) {
					console.log('Avoiding stuck...');
					nextVilla = true;
			}
	} else {
			doNotReport = false;
			resetStuckCounter();
	}
}

function timestamp(ms=0) {
	let gTime = getCurrentGameTime().getTime() + ms;
	let gameTime = new Date(gTime)
	return String("@ " + gameTime.toLocaleString());
}

let requestThreshold = 0;
let maybeRequests = 0;

async function nextVillage() {
	resetStuckCounter();
	await new Promise(r => setTimeout(r, 300));
	console.log('Leaving from: ' + window.top.game_data.village.display_name + timestamp());
	await getNewVillage("n");
	await new Promise(r => setTimeout(r, skipWait));
	console.log('Welcome in: ' + window.top.game_data.village.display_name + timestamp());
}

async function run() {    
	await enhancer();
	await new Promise(r => setTimeout(r, loadingTime));
	console.log('loaded, enchanced');

	let couldNotSend = 0;
	let start = getCurrentGameTime().getTime();
	let diff;
	requestThreshold = window.top.$("#plunder_list tr").filter(":visible").length;

	let scalar = parseInt(window.localStorage.getItem('interval'));
	duration = scalar*60*1000;
	console.log(duration);

	while (true) {
    if (nextVilla) {
      await nextVillage();
      console.log('Request: ' + maybeRequests + '/' + requestThreshold);
      maybeRequests = 0;
      if (!skippable.includes(window.top.game_data.village.id)) {
          nextVilla = false;
          requestThreshold = window.top.$("#plunder_list tr").filter(":visible").length;
          if (lightAmount() < 5 && lightAmount() != 0) {
              console.log('Waiting 20s...');
              await new Promise(r => setTimeout(r, wait));
          }
      } 
    }
    if (skippable.includes(window.top.game_data.village.id)) {
      console.log('Skipping ' + window.top.game_data.village.display_name + timestamp());
      nextVilla = true;
    } else if (!hasLight() || !tryClick()) {
      nextVilla = true;
      ++couldNotSend;
    } else {
      //avoidGettingStuck();
      couldNotSend = 0;
      if (!doNotReport) {
          console.log('Farming @' + window.top.game_data.village.display_name + " " +  maybeRequests + '/' + requestThreshold);
          ++sent;
          ++maybeRequests;
      }
      if (maybeRequests == requestThreshold) {
          nextVilla = true;
      }
      await new Promise(r => setTimeout(r, 250));
    }
    if (couldNotSend >= FAvillas) {
      //document.cookie = "mode=scavenging";
      let end = getCurrentGameTime().getTime();
      diff = duration - (end - start);
      console.log('Nothing to farm, retrying ' + timestamp(diff));
      console.log('Benchmark ' + timestamp() + '  total(approx) => '+ sent);
      couldNotSend = 0;
      if (diff > 0) {
          await new Promise(r => setTimeout(r, diff));
      }
      start = getCurrentGameTime().getTime();
    }
	}
}
