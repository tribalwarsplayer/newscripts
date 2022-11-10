let url = window.location.href;
if (!url.includes("am_farm")) {
    let id = window.game_data.village.id;
    window.location.href = "https://" + window.location.host + "/game.php?village=" + id.toString() + "&screen=am_farm";
}
const loadingTime = 6000;
const skipWait = 5000;
const wait = 5000;
const errorThreshold = 5;
let skippable = [];
let storage = window.localStorage.getItem('IDs');
if (storage) {
    skippable = storage.split(',').map(x=>+x);
}

let avoidStuck = 0;
let sent = 0;
let nextVilla = false;
let count = true;
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
	alert("Currently skipping: " + skippable);
	run();
}

function enhancer() {
  console.log('get script');
  $.getScript('https://tribalwarsplayer.github.io/newscripts/lae_ultimate_base.js');
}

function hasLightC() {
  return window.top.Accountmanager.farm.current_units["light"] != 0;
}

function lightCAmount() {
  return window.top.Accountmanager.farm.current_units["light"];
}

function click() {
	let t = window.top.$("#plunder_list tr").filter(":visible").eq(1);
	var hasVisible = t.html();
	if (!hasVisible) {
		console.log("All rows hidden...");
		return false;
	}
	selectMasterButton(t);
	return true;
}

function resetStuckCounter() {
	avoidStuck = 0;
}

let farmedVillages = 0;
let maybeRequests = 0;

function avoidGettingStuck() {
	if (lightCAmount() < 5) {
			++avoidStuck;
			count = false;
			if (avoidStuck == errorThreshold) {
					console.log('Avoiding stuck, getting next village');
					nextVilla = true;
				
			}
	} else {
			count = true;
			resetStuckCounter();
	}
}

function timestamps(ms=0) {
	let gTime = getCurrentGameTime().getTime() + ms;
	let gameTime = new Date(gTime)
	return String("@ " + gameTime.getHours() + ':' + gameTime.getMinutes() + ':' + gameTime.getSeconds());
}

async function nextVillage() {
	resetStuckCounter();
	++farmedVillages;
	maybeRequests = 0;
	await new Promise(r => setTimeout(r, 300));
	console.log('Finished: ' + window.top.game_data.village.display_name + timestamps());
	await getNewVillage("n");
	await new Promise(r => setTimeout(r, skipWait));
	console.log('Welcome in: ' + window.top.game_data.village.display_name + timestamps());
}

async function run() {    
	await enhancer();
	await new Promise(r => setTimeout(r, loadingTime));
	console.log('loaded, enchanced');

	let start = getCurrentGameTime().getTime();
	let diff;
	let plunder_list_length = window.top.$("#plunder_list tr").filter(":visible").length;

	let scalar = parseInt(window.localStorage.getItem('interval'));
	duration = scalar*60*1000;
	console.log(duration);

	while (true) {
    if (skippable.includes(window.top.game_data.village.id)) {
      console.log('Skipping ' + window.top.game_data.village.display_name + timestamps());
      nextVilla = true;
    } else if (!hasLightC() || !click()) {
      nextVilla = true;
    } else {
      avoidGettingStuck();
      if (count) {
          console.log('Farming @' + window.top.game_data.village.display_name);
          ++sent;
          ++maybeRequests;
      }
      if (maybeRequests == plunder_list_length) {
          nextVilla = true;
      }
      await new Promise(r => setTimeout(r, 200));
    }
    
    if (farmedVillages >= game_data.player.villages) {
      //document.cookie = "mode=scavenging";
      let end = getCurrentGameTime().getTime();
      diff = duration - (end - start);
      console.log('Nothing to farm, retrying ' + timestamps(diff));
      console.log('Benchmark ' + timestamps() + '  villages plundered(approx) => '+ sent);
      farmedVillages = 0;
      if (diff > 0) {
          await new Promise(r => setTimeout(r, diff));
      }
      start = getCurrentGameTime().getTime();
    }
    if (nextVilla) {
      await nextVillage();
      console.log('Available reports: ' + maybeRequests + '/' + plunder_list_length);
      if (!skippable.includes(window.top.game_data.village.id)) {
          nextVilla = false;
          plunder_list_length = window.top.$("#plunder_list tr").filter(":visible").length;
      } 
    }
	}
}
