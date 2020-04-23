const loadingTime = 6000;
const skipWait = 10000;
const wait = 25000;
const duration = 1250000;
const errorThreshold = 10;
const skippable = [3476, 3293, 4312];

let FAvillas;
let avoidStuck = 0;
let sent = 0;
let nextVilla = false;
let doNotReport = false;


function enhancer() {
  console.log('get script');
  $.get('https://tribalwarsplayer.github.io/newscripts/lae_ultimate_base.js');
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

function avoidGettingStuck() {
    if (lightCAmount() == 1) {
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

function handleInput() {
    FAvillas = parseInt(prompt("How many villas should farm?"));
    if (FAvillas == null || isNaN(FAvillas)) {
        alert('Whoops, invalid value or cancelled! Page reloading after ok...');
        throw new Error('Whoops!');
    }
    if (FAvillas > window.top.game_data.player.villages) {
        alert('You only have ' + window.top.game_data.player.villages + ' villages...');
        throw new Error('Whoops!');
    }
}

function timestamps(ms=0) {
    let gTime = getCurrentGameTime().getTime() + ms;
    let gameTime = new Date(gTime)
    return String("@ " + gameTime.getHours() + ':' + gameTime.getMinutes() + ':' + gameTime.getSeconds());
}

async function nextVillage() {
    resetStuckCounter();
    await new Promise(r => setTimeout(r, 300));
    console.log('Leaving from: ' + window.top.game_data.village.display_name + timestamps());
    getNewVillage("n");
    await new Promise(r => setTimeout(r, 300));
    console.log('Welcome in: ' + window.top.game_data.village.display_name + timestamps());
}

async function run() {
    
    try {
        handleInput();
    } catch (err) {
        window.location.reload();
    }
    
    await enhancer();
    await new Promise(r => setTimeout(r, loadingTime));
    console.log('loaded, enchanced');
    
    let couldNotSend = 0;
    let start = getCurrentGameTime().getTime();
    let diff;
    
    while (true) {
        if (nextVilla) {
            await nextVillage();
            if (!skippable.includes(window.top.game_data.village.id)) {
                nextVilla = false;
                if (lightCAmount() < 5 && lightCAmount() != 0) {
                    console.log('Waiting 25s...');
                    await new Promise(r => setTimeout(r, wait));
                }
            } 
        }
        if (skippable.includes(window.top.game_data.village.id)) {
            console.log('Skipping ' + window.top.game_data.village.display_name + timestamps());
            nextVilla = true;
        } else if (!hasLightC() || !click()) {
            nextVilla = true;
            ++couldNotSend;
        } else {
            avoidGettingStuck();
            couldNotSend = 0;
            if (!doNotReport) {
                console.log('Farming @' + window.top.game_data.village.display_name);
                ++sent;
            }
            await new Promise(r => setTimeout(r, 300));
        }
        if (couldNotSend > FAvillas*2) {
            let end = getCurrentGameTime().getTime();
            diff = duration - (end - start);
            console.log('Nothing to farm, retrying ' + timestamps(diff));
            console.log('Benchmark ' + timestamps() + '  total(approx) => '+ sent);
            couldNotSend = 0;
            if (diff > 0) {
                await new Promise(r => setTimeout(r, diff));
            }
            start = getCurrentGameTime().getTime();
        }
    }
}

$(function() {
  run();
});