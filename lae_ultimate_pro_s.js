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

let totalSent = 0;
let nextVillage = false;

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
  <div>
    <tr>
        <label for=timeinterval"><b>Time interval:</b></label>
        <input type=text" id="interval" name="interval" value="${cachedInterval}">
        <input type="button" id="btn-interval" value="Set Interval">
    </tr>
    <tr>
        <a id="startButton" class="btn" style="cursor:pointer;">Start LA Ultimate Pro</a>
    </tr>
	</div>
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
	blacklisted = blacklist ? blacklist.split(',').map(x=>+x) : [];
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

let farmedVillages = 0;
let requestForCurrentVillage = 0;

function nextVillageCallback() {
	++farmedVillages;
	nextVillage = true;
}

const LCThreshold = Math.max(+$('td [name^="light["]')[0].value, $('td [name^="light["]')[1].value);
console.log(`LCThreshold is ${LCThreshold}`);

function timestamps(ms=0) {
	let gTime = getCurrentGameTime().getTime() + ms;
	let gameTime = new Date(gTime)
	return String("@ " + gameTime.getHours() + ':' + gameTime.getMinutes() + ':' + gameTime.getSeconds());
}


async function loadNextVillage() {
	requestForCurrentVillage = 0;
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
	//get current village group count
	villageDock.open(event);
	await new Promise(r => setTimeout(r, 1000));
	let villageCount = $("#group_table tr").length-1;
	console.assert(villageCount >= 1, "Failed to get village count!");
	if (villageCount < 1) {
		vilalgeCount = game_data.player.villages;
	}
	await new Promise(r => setTimeout(r, 100));
	villageDock.close(event);
	await loadEnhancer();
	await waitForLoad();
	console.log('loaded enhancer');

	let start = getCurrentGameTime().getTime();
	let plunder_list_length = window.top.$("#plunder_list tr").filter(":visible").length;

	let minutes = parseFloat(window.localStorage.getItem('interval'));
	let duration = minutes*60*1000;
	console.log(duration);

	while (true) {
		let shouldSkip = blacklisted.includes(window.top.game_data.village.id);
    if (shouldSkip) {
      console.log('Skipping ' + window.top.game_data.village.display_name + timestamps());
    }
		
		if (shouldSkip || !hasLightC() || !click()) {
      nextVillageCallback();
    } else {
			let hasntGotEnoughUnits = lightCAmount() < LCThreshold;
      if (hasntGotEnoughUnits || requestForCurrentVillage == plunder_list_length) {
          nextVillageCallback();
      } else {
				++totalSent;
				++requestForCurrentVillage;
      }
      await new Promise(r => setTimeout(r, 200));
    }
    
    if (farmedVillages >= villageCount) {
      let end = getCurrentGameTime().getTime();
      let diff = duration - (end - start);
      console.log('Nothing to farm, retrying ' + timestamps(diff));
      console.log('Benchmark ' + timestamps() + '  villages plundered(approx) => '+ totalSent);
      farmedVillages = 0;
      if (diff > 0) {
          await new Promise(r => setTimeout(r, diff));
      }
      start = getCurrentGameTime().getTime();
    }
		//keep this last so at the end of the round the last village kept 
		//and after pause this will load the first village again
    if (nextVillage) {
      await loadNextVillage();
      await waitForLoad();
			console.log('Welcome in: ' + window.top.game_data.village.display_name + timestamps());
      console.log('Available reports: ' + plunder_list_length);
      if (!blacklisted.includes(window.top.game_data.village.id)) {
          nextVillage = false;
          plunder_list_length = window.top.$("#plunder_list tr").filter(":visible").length;
      } 
    }
	}
}
