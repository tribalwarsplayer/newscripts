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
        for (let i = button.length - 1; i >= 0; --i) {
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
  let max = Math.max(...countdowns);
  let random = getRandomInt(200) + 10;
  console.log("Random s: " + random);
  let wait = max + random * 1000;
  console.log("Trigger " + timestamp(wait));
  return wait;
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function getCurrentGameTime() {
    return new Date(Timing.getCurrentServerTime());
}

function timestamp(ms=0) {
	let gTime = getCurrentGameTime().getTime() + ms;
	let gameTime = new Date(gTime)
	return String("@ " + gameTime.getHours() + ':' + gameTime.getMinutes() + ':' + gameTime.getSeconds());
}

async function scavenge() {
    await loadCheese();
    let villages = parseInt(window.game_data.player.villages);
    let hasOneVillage = (villages == 1);
    if (!hasOneVillage) return;
    while(true) {
      let html_collection = document.getElementsByClassName("return-countdown");
      if (html_collection.length > 0) {
        let wait = await getWaitTime(html_collection);
        await new Promise(r => setTimeout(r, wait));
      } else {
        await run();
      }
    }
}

scavenge();
