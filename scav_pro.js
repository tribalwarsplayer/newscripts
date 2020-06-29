let link = ["https://" + window.location.host + "/game.php?" + "village=", "&screen=place&mode=scavenge"];

async function loadCheese() {
    console.log('load cheese');
    (window.TwCheese && TwCheese.tryUseTool('ASS'))
        || $.ajax('https://cheesasaurus.github.io/twcheese/launch/ASS.js?'
        +~~((new Date())/3e5),{cache:1});
    await new Promise(r => setTimeout(r, 3000));
}

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

async function run() {
    console.log('run');
    let button = $(".btn.btn-default.free_send_button");
	  let ongoing = document.getElementsByClassName("return-countdown").length;
    console.log('Ongoing: ' + ongoing);
    if (!ongoing) {
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
		await new Promise(r => setTimeout(r, 5000));
}

async function getNextVillage() {
    let html = link[0] + "n" + window.top.game_data.village.id + link[1];
    console.log('get ' + html);
    window.top.$.ajax({
        type: "GET",
        url: html,
        dataType: "html",
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
		let mode = getCookie("mode");
		if (mode != "scavenging") {
      //wait 2 min
			if (mode == "") {
				document.cookie = "mode=scavenging";
			} else {
				console.log("thread is inactive...");
				await new Promise(r => setTimeout(r, 2*60*1000));
				continue;
			}
		} else {
			let villages = parseInt(window.game_data.player.villages);
			let counter = 0;
			while (counter < villages) {
					++counter;
					await run();
			}
			document.cookie = "mode=lae";
			console.log('wait 10 min');
			await new Promise(r => setTimeout(r, 10*60*1000));
			window.partialReload();
			console.log('wait 5s');
			await new Promise(r => setTimeout(r, 5000));
		}
	}
}

scavenge();