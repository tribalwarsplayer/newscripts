const loadingTime = 4000;
let sent = 0;
const wait = 30000;
let FAvillas;
const duration = 1200000;

const skippable = [3476];


function enhancer() {
  console.log('get script');
  $.get('https://scripts.ibragonza.nl/enhancer/enhancer.js');
}

function hasLightC() {
  return window.top.Accountmanager.farm.current_units["light"] != 0;
}

function nextVillage() {
    getNewVillage("n");

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

function msToMS(ms) {
    let seconds = ms / 1000;
    let hours = parseInt( seconds / 3600 );
    seconds = seconds % 3600;
    let minutes = parseInt( seconds / 60 );
    seconds = seconds % 60;
    seconds = seconds.toFixed(0);
    return  minutes + ":" + seconds;
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
    let start = new Date().getTime();
    let diff;
    
    while (true) {
        if (skippable.includes(window.top.game_data.village.id)) {
            console.log('Skipping ' + window.top.game_data.village.display_name);
            await new Promise(r => setTimeout(r, 300));
            nextVillage();
            await new Promise(r => setTimeout(r, wait));
        } else if (!hasLightC() || !click()) {
            await new Promise(r => setTimeout(r, 300));
            nextVillage();
            ++couldNotSend;
            await new Promise(r => setTimeout(r, wait));
        } else {
            couldNotSend = 0;
            console.log('Farming @' + window.top.game_data.village.display_name);
            ++sent;
            await new Promise(r => setTimeout(r, 300));
        }
        if (couldNotSend > FAvillas*4) {
            let time = new Date();
            let end = time.getTime();
            diff = duration - (end - start);
            console.log('Nothing to farm, retrying after ' + msToMS(diff));
            console.log('Benchmark @'  + time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds() + '  total => '+ sent);
            couldNotSend = 0;
            await new Promise(r => setTimeout(r, diff));
            start = new Date().getTime();
        }
    }
}

$(function() {
  run();
});