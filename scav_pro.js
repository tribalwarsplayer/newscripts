let link = ["https://" + window.location.host + "/game.php?" + "village=", "&screen=place&mode=scavenge"];

async function loadCheese() {
    console.log('load cheese');
    (window.TwCheese && TwCheese.tryUseTool('ASS'))
        || $.ajax('https://cheesasaurus.github.io/twcheese/launch/ASS.js?'
        +~~((new Date())/3e5),{cache:1});
    await new Promise(r => setTimeout(r, 3000));
}

async function run() {
    console.log('run');
    let button = $(".btn.btn-default.free_send_button");
	  let ongoing = document.getElementsByClassName("return-countdown").length;
    console.log('Ongoing: ' + ongoing);
    if (ongoing == 0) {
        await new Promise(r => setTimeout(r, 500));
        for (let i = button.length - 1; i > -1; --i) {
           await new Promise(r => setTimeout(r, 250));
           try {
               window.TwCheese.useTool('ASS').prepareBestOption();
           } catch {
               console.log('Prepared');
           }
           await new Promise(r => setTimeout(r, 250));
           button.eq(i).trigger("click");
			     console.log('Click');
        }
    }
    await new Promise(r => setTimeout(r, 250));
    await getNextVillage();
    console.log('wait 5s');
}

async function getNextVillage() {
    let html = link[0] + "n" + window.top.game_data.village.id + link[1];
    console.log('get ' + html);
    window.top.$.ajax({
        type: "GET",
        url: html,
        dataType: "html",
        error: function(e, t) {
            alert("Error: " + t)
        },
        success: function(e) {
            let t = window.top.$(e)
              , o = /<\s*title\s*>([^<]+)<\/title\s*>/g.exec(e)[1]
              , i = window.top.$.parseJSON(e.split("TribalWars.updateGameData(")[1].split(");")[0]);
            window.top.game_data = i;
            window.top.$("#header_info").html(window.top.$("#header_info", t).html()),
            window.top.$("#topContainer").html(window.top.$("#topContainer", t).html()),
            window.top.$("#contentContainer").html(window.top.$("#contentContainer", t).html()),
            window.top.$("#quickbar_inner").html(window.top.$("#quickbar_inner", t).html()),
            window.top.$("head").find("title").html(o);
        }
    });
}
async function scavenge() {
    await loadCheese();
    while(true) {
        let villages = parseInt(window.game_data.player.villages);
        let counter = 0;
        while (counter < villages+1) {
            ++counter;
            await run();
            await new Promise(r => setTimeout(r, 5000));
        }
        console.log('wait 2 min');
        await new Promise(r => setTimeout(r, 2*60*1000));
    }
}

scavenge();