let link = ["https://" + window.location.host + "/game.php?" + "village=", "&screen=place&mode=scavenge"];

async function loadCheese() {
    console.log('load cheese');
    (window.TwCheese && TwCheese.tryUseTool('ASS'))
        || $.ajax('https://cheesasaurus.github.io/twcheese/launch/ASS.js?'
        +~~((new Date())/3e5),{cache:1,dataType:"script"});
    await new Promise(r => setTimeout(r, 3000));
}

async function run() {
    console.log('run');
    let button = $(".btn.btn-default.free_send_button");
    if (button.length >= 2) {
        await new Promise(r => setTimeout(r, 500));
        for (let i = button.length - 1; i > 0; --i) {
           await new Promise(r => setTimeout(r, 250));
           try {
               window.TwCheese.useTool('ASS').prepareBestOption();
           } catch {
               console.log('Prepared');
           }
           console.log('Click');
           await new Promise(r => setTimeout(r, 250));
           button.eq(i).trigger("click");
        }
    }
    await new Promise(r => setTimeout(r, 1000));
}

function parseTime(text) {
  let raw = text.split(":");
  let hours = parseInt(raw[0]) * 60 * 60 * 1000;
  let mins = parseInt(raw[1]) * 60 * 1000;
  let seconds = parseInt(raw[2]) * 1000;
  return hours + mins + seconds;
}

async function getWaitTime(html_collection) {
  let times_arr = Array.prototype.slice.call(html_collection);
  let countdowns = times_arr.map(elem => parseTime(elem.textContent));
  let max = Math.max(countdowns);
  let random = getRandomInt(200) + 10;
  console.log("Random s: " + random);
  return max + random * 1000;
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

async function scavenge() {
    await loadCheese();
    let villages = parseInt(window.game_data.player.villages);
    let hasOneVillage = (villages == 1);
    if (!hasOneVillage) {
        break;
    }
    while(true) {
      debugger;
      let html_collection = document.getElementsByClassName("return-countdown");
      if (html.collection.length) {
        let arr = Array.prototype.slice.call( document.getElementsByClassName("return-countdown") );
        let countdowns = arr.map(textContent => parseTime(textContent));
        let max = Math.max(countdowns);
        let random = Math.random() +
        await new Promise(r => setTimeout(r, getWaitTime(html_collection));
      } else {
        await run();
      }

      
    }
    /*
    while(true) {
        let villages = parseInt(window.game_data.player.villages);
        let hasOneVillage = (villages == 1);
        if (!hasOneVillage)
        while (counter < villages) {
            ++counter;
            await run();
            await new Promise(r => setTimeout(r, 5000));
        }
        console.log('wait 2 min');
        await new Promise(r => setTimeout(r, 2*60*1000));
    }*/
}

scavenge();
