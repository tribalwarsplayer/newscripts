javascript:

if (typeof gap == 'undefined') {
    alert("NO GAP SET! Setting a standard gap of 15 seconds");
    var gap = 15;
}
if (typeof filterFakes == 'undefined') {
    var filterFakes = false;
}
gap*=1000;
var months = ["Január", "Február", "Március", "Április", "Május", "Június",
    "Július", "Augusztus", "Szeptember", "Október", "November", "December"];

var returningCommands = [];
var incomingCommands = [];
var backtimes = [];
var backgroundColor = "#36393f";
var borderColor = "#3e4147";
var headerColor = "#202225";
var titleColor = "#ffffdf";
$("#backtimeFinderSophie").remove();
$.get("/game.php?&screen=overview_villages&type=return&mode=commands&group=0&", function (data) {
    //collect all returning commands
    temp = $(data).find("#commands_table .nowrap");
    for (var i = 0; i < temp.length; i++) {
        time = stringToUTC(temp[i].children[2].innerText);
        villageHTML = temp[i].children[1].innerHTML.trim();
        if (temp[i].children[5].innerText > 200) {
            //more than 200 axe returning
            type = "nuke";
        }
        else {
            //fake
            type = "fake";
        }
        returningCommands.push({ "time": time, "homeVillage": villageHTML, "type": type });
    }
})
    .done(function () {
        $.get("/game.php?&screen=overview_villages&subtype=attacks&mode=incomings&group=0&", function (incoming) {
            temp2 = $(incoming).find("#incomings_table .nowrap");
            for (var j = 0; j < temp2.length; j++) {
                //grab all incomings
                destination = temp2[j].children[1].innerHTML.trim();
                origin = temp2[j].children[2].innerHTML.trim();
                time = stringToUTC(temp2[j].children[5].innerText);
                incomingCommands.push({ "time": time, "origin": origin, "destination": destination });
            }
            console.log(returningCommands);
            console.log(incomingCommands);
        }).done(function () {
            findBacktimes(returningCommands, incomingCommands);
        })
    })

function findBacktimes(returning, incoming) {
    for (var i = 0; i < returning.length; i++) {
        //check for each returning command if there are incomings timed after
        for (var j = 0; j < incoming.length; j++) {
            if (returning[i].homeVillage.match(/\d+\|\d+/)[0] == incoming[j].destination.match(/\d+\|\d+/)[0]) {
                console.log("Found attack incoming on village with returning troops");
                console.log(incoming[j].time)
                console.log(returning[i].time)
                console.log(Math.floor((incoming[j].time - returning[i].time)));
                if (incoming[j].time >= returning[i].time && incoming[j].time <= (returning[i].time + gap)) {
                    gapThiscommand = Math.floor((incoming[j].time - returning[i].time) / 1000) + ":" + (incoming[j].time - returning[i].time) % 1000;
                    console.log("FOUND BACKTIME! Gap between the attack is " + gapThiscommand);
                    if (filterFakes != true) {
                        backtimes.push({ "gap": gapThiscommand, "source": incoming[j].origin, "target": incoming[j].destination, "type": returning[i].type })
                    }
                    else if(returning[i].type=="fake")
                    {
                        console.log("it's a fake, skipping")
                    }
                }
            }
        }
    }

    html = `
    <div id="backtimeFinderSophie" class="ui-widget-content" style="position:fixed;background-color:${backgroundColor};cursor:move;z-index:50;width:60%;">
        <table id="backtimeFinderSophieTable" class="vis" border="1" style="width: 100%;background-color:${backgroundColor};border-color:${borderColor};color:#000000">
            <tr>
                <td colspan="10" id="backtimeFinderSophieTitle" style="text-align:center; width:auto; background-color:${headerColor}">
                    <h2>
                        <center style="margin:10px"><u>
                                <font color="${titleColor}">Backtime finder</font>
                            </u>
                        </center>
                    </h2>
                </td>
            </tr>
            <tr style="background-color:${backgroundColor}">
                <td style="width:15%;text-align:center;background-color:${headerColor}"><font color="${titleColor}">Gap</font></td>
                <td style="width:35%;text-align:center;background-color:${headerColor}"><font color="${titleColor}">Enemy village</font></td>
                <td style="width:35%;text-align:center;background-color:${headerColor}"><font color="${titleColor}">Your village</font></td>
                <td style="width:15%;text-align:center;background-color:${headerColor}"><font color="${titleColor}">What is coming back</font></td>
            </tr>
                `

    //done calculating,make and display UI
    for (var i = 0; i < backtimes.length; i++) {
        html += ` <tr id="backtime+${i}" style="text-align:center; width:auto; background-color:${backgroundColor}">
                    <td style="text-align:center; width:auto; background-color:${backgroundColor}"><font color="${titleColor}">${backtimes[i].gap}</font></td>
                    <td style="text-align:center; width:auto; background-color:${backgroundColor}"><font color="${titleColor}">${backtimes[i].source}</font></td>
                    <td style="text-align:center; width:auto; background-color:${backgroundColor}"><font color="${titleColor}">${backtimes[i].target}</font></td>
                    <td style="text-align:center; width:auto; background-color:${backgroundColor}"><font color="${titleColor}">${backtimes[i].type}</font></td>
                </tr>`
    }
    if(backtimes.length==0)
    {
        html+=`<tr id="backtime+${i}" style="text-align:center; width:auto; background-color:${backgroundColor}">
        <td style="text-align:center; width:auto; background-color:${backgroundColor}" colspan=4><font color="${titleColor}"><h1>NO BACKTIMES FOUND</h1></font></td></tr>`
    }
    html += `</table>
            <hr>
            <br>
            <center><img id="sophieImg" class=" tooltip-delayed" title="Sophie -Shinko to Kuma-" src="https://dl.dropboxusercontent.com/s/bxoyga8wa6yuuz4/sophie2.gif" style="cursor:help; position: relative"></center>
            <br>
            <center>
            <p>
            <font color="${titleColor}">Creator: </font><a href="https://shinko-to-kuma.my-free.website/" style="text-shadow:-1px -1px 0 ${titleColor},1px -1px 0 ${titleColor},-1px 1px 0 ${titleColor},1px 1px 0 ${titleColor};" title="Sophie profile" target="_blank">Sophie "Shinko to Kuma"</a>
            </p>
            </center>
        </div>`;

    $("#contentContainer").eq(0).prepend(html);
    $("#mobileContent").eq(0).prepend(html);
    $("#backtimeFinderSophieTable a").css('color', "#40D0E0");
    $("#backtimeFinderSophie").draggable();
}


function stringToUTC(text) {
    currentYear = new Date().getFullYear();
    // incase it's not tomorrow or today
    if (text.indexOf("ma") > -1) {
        //today
        dataFormatted = text.match(/ma ekkor: (\d*:\d*:\d*:\d*)/);
        currentDay = new Date().getDay();
        currentMonth = new Date().getMonth() + 1;
        date = Date.parse(currentDay + " " + currentMonth + " " + currentYear + " " + dataFormatted[1]);
    }
    else if (text.indexOf("holnap") > -1) {
        //tomorrow
        dataFormatted = text.match(/holnap ekkor: (\d*:\d*:\d*:\d*)/);
        tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        month = tomorrow.getMonth() + 1;
        date = Date.parse(tomorrow.getDay() + " " + month + " " + currentYear + " " + dataFormatted[1]);
    }
    else {
        //after tomorrow
        //FIXME this might not work on HUN server
        dataFormatted = text.match(/ekkor: (\d*).(\d*)., ebben az időben: (\d*:\d*:\d*:\d*)/);
        date = Date.parse(dataFormatted[1] + " " + months[parseInt(dataFormatted[2])] + " " + currentYear + " " + dataFormatted[3]);
        console.log(dataFormatted);
    }
    return date;
}
