//route to am_farm
let url = window.location.href;
if (!url.includes("am_farm")) {
	let id = window.game_data.village.id;
	window.location.href = "https://" + window.location.host + "/game.php?village=" + id.toString() + "&screen=am_farm";
}


const errorThreshold = 5;
let blacklisted = [];
let blacklist = window.localStorage.getItem('blacklist');
if (blacklist) {
    blacklisted = blacklist.split(',').map(x=>+x);
}

let avoidStuck = 0;
let sent = 0;
let nextVilla = false;
let count = true;

const cachedVillages = window.localStorage.getItem('blacklist') ?? "";
const cachedInterval = window.localStorage.getItem('interval') ?? "";

let laeUltimateProContext=
`<div id="lae_ultimate_pro_context">
   <div>
    <tr>
        <label for="blacklist"><b>Villages to skip:</b></label>
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
        <span class="tooltip"><img src="https://tribalwarsplayer.github.io/newscripts//tooltip_icon2.png" style="max-width:13px"/>
					<span class="tooltiptext">
						<b>Add villages in the following format: <em>'id,id,...'</em></b> 
						Run in dev console to get id 
						<b><em>window.game_data.village.id</em></b>
					</span>
				</span>
        <input type="text" id="blacklist" name="Blacklist" value="${cachedVillages}">
        <input type="button" id="saveButton" value="Save">
    </tr>
  </div>
  <div>
    <tr>
        <a class="btn" id="addButton" style="cursor:pointer;">Add ${game_data.village.display_name} to blacklist</a>
    </tr>
  </div>
  <div>
    <tr>
        <a class="btn" id="removeButton" style="cursor:pointer;">Remove ${game_data.village.display_name} from blacklist</a>
    </tr>
  </div>
</div>
<div>
    <tr>
        <label for=timeinterval"><b>Time interval:</b></label>
        <input type=text" id="interval" name="interval" value="${cachedInterval}">
        <input type="button" id="btn-interval" value="Set Interval">
    </tr>
    <tr>
        <a id="startButton" class="btn" style="cursor:pointer;">Start LA Ultimate Pro</a>
    </tr>
</div>`;

let settingsTable = document.getElementById("content_value");
settingsTable.insertAdjacentHTML("afterbegin", laeUltimateProContext);

document.getElementById("saveButton").onclick = function() {
	let blacklist = document.getElementById("blacklist").value;
	window.localStorage.setItem('blacklist', blacklist);
	alert("Currently skipping: " + blacklist.split(',').map(x=>+x));
}

document.getElementById("addButton").onclick = function() {
	blacklist = window.localStorage.getItem('blacklist');
	let result = game_data.village.id.toString();
	if (blacklist) {
		let arr = blacklist.split(",");
		if (arr.some(id => id == game_data.village.id)) {
			alert("Already blacklisted!");
			return;
		}
		arr.push(game_data.village.id.toString());
		result = arr.join(",");
	}
	window.localStorage.setItem('blacklist', result);
	document.getElementById("blacklist").value = result;
	alert("Currently skipping: " + result.split(',').map(x=>+x));
}

document.getElementById("removeButton").onclick = function() {
	blacklist = window.localStorage.getItem('blacklist');
	let removeID = game_data.village.id.toString();
	if (!blacklist) {
		alert("Blacklist is empty!");
		return;
	}
	
	let arr = blacklist.split(",");
	blacklist = arr.filter(id => id != removeID).join(',');
	window.localStorage.setItem('blacklist', blacklist);
	document.getElementById("blacklist").value = blacklist;
	alert("Removed village, currently skipping: " + blacklist.split(',').map(x=>+x));
}

document.getElementById("btn-interval").onclick = function() {
	let interval = document.getElementById("interval").value;
	window.localStorage.setItem('interval', interval);
}

document.getElementById("startButton").onclick = function() {
	$("#lae_ultimate_pro_context").remove();
	blacklisted = blacklist.split(',');
	alert("Currently skipping: " + blacklisted.map(x=>+x));
	run();
}

async function loadEnhancer() {
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

function nextVillageCallback() {
	++farmedVillages;
	nextVilla = true;
}

function avoidGettingStuck() {
	if (lightCAmount() < 5) {
			++avoidStuck;
			count = false;
			if (avoidStuck == errorThreshold) {
					console.log('Avoiding stuck, getting next village');
					nextVillageCallback();
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
	maybeRequests = 0;
	console.log('Finished: ' + window.top.game_data.village.display_name + timestamps());
	await getNewVillage("n");
	cansend = pagesLoaded = false;
}

async function waitForLoad() {
	let loaded = false;
	while(!loaded) {
		try {
			loaded = pagesLoaded && cansend;
		} catch (e) {
			console.log("Waiting for enhancer...");
		}
		await new Promise(r => setTimeout(r, 1000));
	} 
}

async function run() {
	await loadEnhancer();
	await waitForLoad();
	console.log('loaded enhancer');

	let start = getCurrentGameTime().getTime();
	let plunder_list_length = window.top.$("#plunder_list tr").filter(":visible").length;
	let startID = game_data.village.id;

	let minutes = parseInt(window.localStorage.getItem('interval'));
	let duration = minutes*60*1000;
	console.log(duration);

	while (true) {
    if (blacklisted.includes(window.top.game_data.village.id)) {
      console.log('Skipping ' + window.top.game_data.village.display_name + timestamps());
      nextVillageCallback();
    } else if (!hasLightC() || !click()) {
      nextVillageCallback();
    } else {
      avoidGettingStuck();
      if (count) {
          //console.log('Farming @' + window.top.game_data.village.display_name);
          ++sent;
          ++maybeRequests;
      }
      if (maybeRequests == plunder_list_length) {
          nextVillageCallback();
      }
      await new Promise(r => setTimeout(r, 200));
    }
    //if has more than 1 village check for farmedVillages otherwise just check id
    if ((+game_data.player.villages > 1 ? farmedVillages > 1 : true) && startID == game_data.village.id) {
      let end = getCurrentGameTime().getTime();
      let diff = duration - (end - start);
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
      await waitForLoad();
			console.log('Welcome in: ' + window.top.game_data.village.display_name + timestamps());
      console.log('Available reports: ' + maybeRequests + '/' + plunder_list_length);
      if (!blacklisted.includes(window.top.game_data.village.id)) {
          nextVilla = false;
          plunder_list_length = window.top.$("#plunder_list tr").filter(":visible").length;
      } 
    }
	}
}
