let link = ["https://" + window.location.host + "/game.php?" + "village=", "&screen=place&mode=scavenge"];

async function loadCheese() {
    console.log('load cheese');
    (window.TwCheese && TwCheese.tryUseTool('ASS'))
        || $.ajax('https://cheesasaurus.github.io/twcheese/launch/ASS.js?'
        +~~((new Date())/3e5),{cache:1},dataType:"script");
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
    await new Promise(r => setTimeout(r, 250));
    window.partialReload();
    console.log('wait 5s');
}

async function scavenge() {
    await loadCheese();
    while(true) {
        let villages = parseInt(window.game_data.player.villages);
        let counter = 0;
        while (counter < villages) {
            ++counter;
            await run();
            await new Promise(r => setTimeout(r, 5000));
        }
        console.log('wait 2 min');
        await new Promise(r => setTimeout(r, 2*60*1000));
    }
}

scavenge();
