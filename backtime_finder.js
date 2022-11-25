/***********QUICK BAR ENTRY*****
javascript:
var FORMAT = "#unit# from #coords# - #player# Backtime: #backtime#";
$.getScript('https://gistcdn.githack.com/filipemiguel97/6470af210c44fe3ad2838415ccfb5518/raw/commadTaggerWithBacktimeTime.js');
*******************************/
var countapikey = "renameWithBacktimeTime";
/* globals FORMAT, selectAll */
hitCountApi();
function hitCountApi(){
    $.getJSON(`https://api.countapi.xyz/hit/fmthemasterScripts/${countapikey}`, function(response) {
        console.log(`This script has been run ${response.value} times`);
    });
}

function main()
{
    if(window.location.href.indexOf("subtype=attacks")==-1)
    {
        window.location.href = window.location.pathname+ "?screen=overview_villages&mode=incomings&mode=incomings&subtype=attacks";
        return;
    }
    debugger;
    if (typeof FORMAT === 'undefined') 
        FORMAT = "#unit# from #coords# - #player# Backtime: #backtime#";
    FORMAT = FORMAT.replace(/#/g, "%");
    if(FORMAT.match(/%backtime%/g)!=null)
        FORMAT = ("`" + FORMAT + "`").replace(/%backtime%/, "%return%:${('00' + ((arrivalSeconds+parseInt('%duration%'.split(':')[2]))%60).toString()).slice(-2)}");

    console.log(FORMAT);
    $('input[name=label_format]').val(FORMAT);

    let tagRows =$("#incomings_table > tbody > tr").not(':first').not(':last');
    tagRows = $.grep(tagRows, (obj)=> $(".quickedit-label", obj)[0].innerText.match(/`.*`/g)!=null);

    if(tagRows.length >0)
        $.map(tagRows, (obj, key)=>setTimeout(()=>{
            evalTag(obj);
            /*if(key == tagRows.length -1)
                tagCommands();*/
        }, 250* key));
    else
        tagCommands();
}


function renameCommand(command, name)
{
    $('.rename-icon', command).click();
    $('.quickedit-edit input[type="text"]', command).val(name);
    $('.quickedit-edit input[type="button"]', command).click();
}

function evalTag(row)
{
    let command = $("td:nth-child(1)", row)[0];
    let arrivalTime = $("td:nth-child(6)", row)[0].innerText;
    let arrivalSeconds = parseInt(arrivalTime.split(":")[2]);
    let evalCommandTag;
    try
    {
        evalCommandTag = eval(command.innerText);
    }
    catch(err)
    {
        evalCommandTag = command.innerText;
    }
    renameCommand(command, evalCommandTag);
}

function tagCommands()
{
    if($("#incomings_form").length > 0)
    {
        selectAll($("#incomings_form")[0], true);
        $("[name='label']")[0].click();
    }
}

main();
main();
