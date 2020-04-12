let waves = 0;
let delay = 10000; /*10s*/
let barbs;
let loadingTime = 3000;
let waveTimer;
let multiplier;

async function enhancer() {
  console.log('get script');
  $.get('https://scripts.ibragonza.nl/enhancer/enhancer.js');
}

async function reset() {
    setTimeout(function() {
        console.log('resetting:' + waves);
        resetTable();
        ++waves;
    }, 1500);
}

async function maybeLightCAmount() {
  let domElement = $("#units_home tr")[1].innerText;
  return parseInt(domElement.match(/\d+/g)[5]);
}

function msToMS(ms) {
    let seconds = ms / 1000;
    let hours = parseInt( seconds / 3600 );
    seconds = seconds % 3600;
    let minutes = parseInt( seconds / 60 );
    seconds = seconds % 60;
    seconds = seconds.toFixed(0);
    console.log('Time elapsed in wave ' + waves + ' => ' + minutes + ":" + seconds);
}

function random(min, max) {
  return Math.random() * (max - min) + min;
}

async function wave() {
    let unit = await maybeLightCAmount();
    let startTime = new Date().getTime();
    let called = 0;
    let reflex = 0;
    let done = false;
    let interval = random(250, 325);
    let keyPress = setInterval(function() {
        $(function() {
            ++called;
            if (!done) {
                let t = window.top.$("#plunder_list tr").filter(":visible").eq(1)
                ,   i = t.children("td").eq(10).children("a")
                ,   village = t[0].innerText.match(/\d+/g)[0],
                v = parseInt(village);
                console.log('Village: ' + v + ' is in queue!');
                if (v < barbs) {
                    if (unit > 0) {
                        reflex = 0;
                        t = window.top.$("#plunder_list tr").filter(":visible").eq(1)
                        ,   i = t.children("td").eq(10).children("a")
                        ,   village = t[0].innerText.match(/\d+/g)[0];
                        v = parseInt(village);
                        tryClick(i);
                        console.log('Available LC: ' + unit);
                    } else {
                        if (reflex == 0) {
                            console.log('Waiting for units...')
                        }
                        ++reflex;
                        if (reflex % 100 == 0) {
                            t = window.top.$("#plunder_list tr").filter(":visible").eq(1)
                            ,   i = t.children("td").eq(10).children("a")
                            ,   village = t[0].innerText.match(/\d+/g)[0];
                            v = parseInt(village);
                            tryClick(i);
                            console.log('Available LC: ' + unit);
                        }
                    }
                } else {
                   done = true;
                }
            }
            // not exact due to value refresh only after keypress event
            unit = maybeLightCAmount();
            let current = new Date().getTime() - startTime;
            if (called % 200 == 0) {
                msToMS(current);
            }
            if (current > waveTimer) {
                clearInterval(keyPress);
                let time = new Date();
                console.log('Wave: ' + waves + ' finished @ ' + time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds());
                console.log('Plundered: ' + barbs + ' ');
                reset();
            }
        });
    }, interval);
}

function handleInput() {
    barbs = parseInt(prompt("How many barbs would you like to farm?"));
    if (barbs == null || isNaN(barbs)) {
        alert('Whoops, invalid value or cancelled! Page reloading after ok...');
        throw new Error('Whoops!');
    }
    multiplier = parseInt(prompt("How often should there be a wave?"));
    if (multiplier == null || isNaN(multiplier)) {
        alert('Whoops, invalid value or cancelled! Page reloading after ok...');
        throw new Error('Whoops!');
    }
}

async function run() {
    try {
        handleInput();
    } catch (err) {
        window.location.reload();
    }
    waveTimer = multiplier*60*1000; /*waveMultiplier = min*/
    await enhancer();
    console.log('loaded, enchanced');
    setTimeout(function() {
        let time = new Date();
        console.log('Wave: ' + waves + ' started @ ' + time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds());
        wave();
    }, loadingTime);
    let waveInterval = setInterval(function() {
       let time = new Date();
       console.log('Wave: ' + waves + ' started @ ' + time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds());
       wave();
       if (waves == 30) {
          console.log('waves finished happy farming!');
          clearInterval(waveInterval);
       }
    }, waveTimer+delay);
}

$(function() {
  run(); 
});