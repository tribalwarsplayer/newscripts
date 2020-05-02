let percent = 100,
spear = true,
sword = false,
axe = true,
archer = false,
lightC = false,
mountedArcher = true,
heavyC = true,
spearAmount = [],
swAmount = [],
axeAmount = [],
archerAmount = [],
lightCAmount = [],
mountedAAmount = [],
hcAmount = [],
world_units = ["spear", "sword", "axe", "archer", "light", "marcher", "heavy"],
world_units_amount = [spearAmount, swAmount, axeAmount, archerAmount, lightCAmount, mountedAAmount, hcAmount],
selected_units = [spear, sword, axe, archer, lightC, mountedArcher, heavyC],
base = percent / 100,
x = 0,
odds = 1,
sum = 0,
storageSum = 0,
numbers = [1, 20, 300, 4000];
button = $(".btn.btn-default.free_send_button");
let success = 0;

function getUnits() {
    $(world_units).each(function (key, val) {
        world_units_amount[key] = ($("[data-unit~='"+val+"']:last").text().replace("(", "").replace(")", "") * selected_units[key]);
        if(key == 4 || key == 5 || key == 6)    {
            odds = key;
        }
        sum += Number($("[data-unit~='"+val+"']:last").text().replace("(", "").replace(")", "") * selected_units[key] * odds);
        if(!sessionStorage[val])    {
            sessionStorage[val] = world_units_amount[key] - (world_units_amount[key] * base);
        }
        storageSum = sum * base;
    });
}
function getScavengeOptions() {
    $(".preview").each(function (key, val)  {
        if(!$(val).find(".return-countdown").length){
            if((key == 3 && sum*base/13>10) || (key == 2 && sum*base/8>10) || (key == 1 && sum*base/3.5>10) || (key == 0 && sum*base>10)){
                x += numbers[key];
                }
            }
        }
    );
}

let link = ["https://" + window.location.host + "/game.php?" + "village=", "&screen=place&mode=scavenge"];

async function getNextVillage() {
    console.log('Get new village');
    let html = link[0] + "n" + window.top.game_data.village.id + link[1];
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
    await new Promise(r => setTimeout(r, 5000));
    resetSettings();
    success = 0;
    button = $(".btn.btn-default.free_send_button");
}


function sendGroup(c, d) {
    $(world_units).each(function (key, val) {
        if(percent == 100 && sum / c > 10) {
            $("input[name~='"+val+"']").val(world_units_amount[key] / c).change();
        } else if(percent < 100 && storageSum / c > 10) {
            $("input[name~='"+val+"']").val(Math.abs(sessionStorage[val] - world_units_amount[key]) / c).change();
            sessionStorage.removeItem(val)
        } else {
            console.log('cant');
        }
    });
    button.eq(d).trigger("click");
}

async function decide() {
    switch(x) {
        case 4321:
            sendGroup(13, 3);
            break;
        case 4320: case 4301: case 4021:
            sendGroup(8, 3);
            break;
        case 4300: case 4020: case 4001:
            sendGroup(3.5, 3);
            break;
        case 4000:
            sendGroup(1, 3);
            break;
        case 321:
            sendGroup(8, 2);
            break;
        case 320: case 301:
            sendGroup(3.5, 2);
            break;
        case 300:
            sendGroup(1, 2);
            break;
        case 21:
            sendGroup(3.5, 1);
            break;
        case 20:
            sendGroup(1 1);
            break;
        case 1:
            sendGroup(1 0);
            break;
        case 0:
            getNextVillage();
            break;
        }   
}

async function scavenge() {   
    await getUnits();
    await getScavengeOptions();
    await decide();
}

scavenge();