var keyToEdit, current_units, version = "1.13.1 Fixed By Ibra", scriptName = "LA Enhancer (1.13.1) - Fixed by Ibra Gonza II", scriptURL = "https://scripts.ibragonza.nl/enhancer/", updateNotesURL = "https://forum.tribalwars.net/index.php?threads/ntoombs19s-fa-filter.266604/page-15#post-7053294", working = !0, resourcesLoaded = !1, scriptLoaded = !1, pagesLoaded = !1, filtersApplied = !1, cansend = !0, keySetMode = !1, hideRow = !1, editingKey = !1, troubleshoot = !1, clearProfiles = !1, reason = [], currentGameTime = getCurrentGameTime(), sitter = "";
"0" != window.top.game_data.player.sitter && (sitter = "t=" + window.top.game_data.player.id + "&");
var userset, link = ["https://" + window.location.host + "/game.php?" + sitter + "village=", "&screen=am_farm"], s = {
    start_page: 0,
    end_page: 1,
    order_by: 2,
    direction: 3,
    all_none: 4,
    blue: 5,
    green: 6,
    yellow: 7,
    red_yellow: 8,
    red_blue: 9,
    red: 10,
    hide_recent_farms: 11,
    sent_time_filter: 12,
    hide_recent_time: 13,
    enable_hauls: 14,
    full: 15,
    partial: 16,
    enable_attacks: 17,
    attack_operator: 18,
    attack_value: 19,
    enable_walls: 20,
    wall_operator: 21,
    wall_value: 22,
    enable_distances: 23,
    distance_operator: 24,
    distance_value: 25,
    enable_scout: 26,
    scout_report_operator: 27,
    haul_value: 28,
    continent_display: 29,
    continents_list: 30,
    enable_time: 31,
    attack_time_filter: 32,
    time_value: 33,
    enable_auto_run: 34,
    next_village_no_farms: 35,
    next_village_scouts: 36,
    scouts_left: 37,
    next_village_farming_troops: 38,
    farming_troops_left: 39,
    next_village_units: 40
}, keycodes = {
    a: 65,
    b: 66,
    c: 67,
    skip: 83,
    right: 39,
    left: 37,
    master: 77
}, keyPressSettings = {
    a_code: 65,
    a_char: "A",
    b_code: 66,
    b_char: "B",
    c_code: 67,
    c_char: "C",
    master_code: 77,
    master_char: "M",
    skip_code: 83,
    skip_char: "S",
    left_code: 37,
    left_char: "â†",
    right_code: 39,
    right_char: "â†’",
    priorityOneEnabled: !0,
    priorityOneProfile: "Default",
    priorityOneButton: "Skip",
    priorityTwoEnabled: !0,
    priorityTwoProfile: "Default",
    priorityTwoButton: "Skip",
    priorityThreeEnabled: !0,
    priorityThreeProfile: "Default",
    priorityThreeButton: "Skip",
    defaultButton: "Skip"
}, availableLangs = ["en", "es", "el", "ar", "it"];
function run() {
    console.log("run"),
    checkVersion(),
    checkWorking(),
    setVersion(),
    makeItPretty(),
    showSettings(),
    turnOnHotkeys(),
    hotkeysOnOff(),
    0 != userset[s.enable_auto_run] && applySettings()
}
function checkVersion() {
    if (getVersion() != version)
        if (buttons = [{
            text: "OK",
            callback: null,
            confirm: !0
        }],
        clearProfiles) {
            var e = window.top.$.jStorage.get("profileList");
            window.top.$.each(e, function(e, t) {
                window.top.$.jStorage.deleteKey("profile:" + t)
            }),
            window.top.$.jStorage.set("keyPressSettings", keyPressSettings),
            Dialog.show("update_dialog", "This script has recently been updated to version <span style='font-weight:bold;'>" + version + "</span> and in order for the new version to work, all profiles and settings must be reset. Sorry for any inconvenience.<br /><br/><a href='" + updateNotesURL + "' target='_blank'>See what's new</a>.</br>I removed the difference between the original and the Alt version of the script. Both are now equally fast and even faster than either script was before. Should you  enounter any issues, please contact me on the forum! </br></br>Enjoy!</br>Ibra Gonza II")
        } else
            Dialog.show("update_dialog", "This script has recently been updated to version <span style='font-weight:bold;'>" + version + "</span><br /><br/><a href='" + updateNotesURL + "' target='_blank'>See what's new</a>.</br>I removed the difference between the original and the Alt version of the script. Both are now equally fast and even faster than either script was before. Should you  enounter any issues, please contact me on the forum! </br></br>Enjoy!</br>Ibra Gonza II")
}
function checkWorking() {
    var e = window.top.$.jStorage.get("working");
    null == e && window.top.$.jStorage.set("working", !1),
    getVersion() != version && window.top.$.jStorage.set("working", !1),
    0 == working && 0 == e && (buttons = [{
        text: "OK",
        callback: null,
        confirm: !0
    }],
    window.top.UI.ConfirmationBox("An error has been discovered in this version. You may continue testing the script if you haven't noticed the error.", buttons, !1, []),
    window.top.$.jStorage.set("working", !0))
}
function setVersion() {
    window.top.$.jStorage.set("version", version)
}
function getVersion() {
    var e = window.top.$.jStorage.get("version");
    return null == e ? (setVersion(),
    version) : e
}
function showAllRows() {
    var e = window.top.$.trim(window.top.$("#plunder_list_nav tr:first td:last").children().last().html().replace(/\D+/g, ""));
    "max" == window.top.$("#end_page").val() && window.top.$("#end_page").text(e),
    window.top.$("#am_widget_Farm tr:last").remove(),
    e > parseInt(window.top.$("#end_page").val(), 10) && (e = parseInt(window.top.$("#end_page").val(), 10)),
    setTimeout(function() {
        getPage(parseInt(window.top.$("#start_page").val(), 10) - 1, e)
    }, 1)
}
function getPage(t, o) {
    if (t < o) {
        changeHeader(filter_41 + " " + (t + 1) + "/" + o + " <img src='graphic/throbber.gif' height='24' width='24'></img>");
        var e = link[0] + window.top.game_data.village.id + "&order=" + userset[s.order_by] + "&dir=" + userset[s.direction] + "&Farm_page=" + t + "&screen=am_farm";
        window.top.$.ajax({
            type: "GET",
            url: e,
            dataType: "html",
            error: function(e, t, o) {
                console.log("Get page failed with error: " + o)
            },
            success: function(e) {
                window.top.$("#plunder_list tr", e).slice(2).each(function() {
                    window.top.$("#plunder_list tr:last").after("<tr>" + window.top.$(this).html() + "</tr>")
                }),
                setTimeout(function() {
                    getPage(t + 1, o)
                }, 1)
            }
        })
    } else
        setTimeout(function() {
            addTableInfo(),
            applyFilters(),
            changeHeader(filter_40),
            highlightRows()
        }, 1),
        window.top.$("#plunder_list").show(),
        window.top.Accountmanager.initTooltips(),
        cansend = pagesLoaded = !0
}
function changeHeader(e) {
    window.top.$("h3:first").html(e)
}
function highlightRows() {
    window.top.$("#am_widget_Farm table").each(function() {
        window.top.$("tr:even:gt(0) td", this).not("table:first").css("backgroundColor", "#FFF5DA"),
        window.top.$("tr:odd:gt(0) td", this).not("table:first").css("backgroundColor", "#F0E2BE")
    })
}
function getNewVillage(e) {
    "n" == e ? window.top.UI.InfoMessage("Switching to next village...", 500) : window.top.UI.InfoMessage("Switching to previous village...", 500),
    window.onkeydown = function() {}
    ,
    filtersApplied = cansend = !1,
    Timing.pause(),
    fadeThanksToCheese(),
    openLoader();
    var t = link[0] + e + window.top.game_data.village.id + link[1];
    window.top.$.ajax({
        type: "GET",
        url: t,
        dataType: "html",
        error: function(e, t) {
            alert("Error: " + t),
            window.top.$("#fader").remove(),
            window.top.$("#loaders").remove()
        },
        success: function(e) {
            var t = window.top.$(e)
              , o = /<\s*title\s*>([^<]+)<\/title\s*>/g.exec(e)[1]
              , i = window.top.$.parseJSON(e.split("TribalWars.updateGameData(")[1].split(");")[0]);
            window.top.game_data = i,
            "undefined" != typeof history && "function" == typeof history.pushState && history.pushState({}, window.top.game_data.village.name + " - Loot Assistant", "https://" + window.top.location.host + game_data.link_base_pure + "am_farm"),
            window.top.$("#header_info").html(window.top.$("#header_info", t).html()),
            window.top.$("#topContainer").html(window.top.$("#topContainer", t).html()),
            window.top.$("#contentContainer").html(window.top.$("#contentContainer", t).html()),
            window.top.$("#quickbar_inner").html(window.top.$("#quickbar_inner", t).html()),
            window.top.$("head").find("title").html(o),
            window.top.$("#fader").remove(),
            window.top.$("#loaders").remove(),
            Timing.resetTickHandlers(),
            //Timing.pause(),
            cansend = pagesLoaded = !1,
            run()
        }
    })
}
function showSettings() {
    window.top.$("head").append("<link type='text/css' rel='stylesheet' href='" + scriptURL + "css/style.css' />"),
    window.top.$("#contentContainer h3").eq(0).after(window.top.$("<div class='vis'id='settingsDiv'><table class='settingsTable'><thead><tr><th colspan='5'class='vis'style='padding:0px;'><h4> " + scriptName + " - <a href='http://forum.tribalwars.net/showthread.php?266604-ntoombs19-s-FA-Filter'target='_blank'>" + filter_02 + "</a> - " + filter_42 + ": <select id='language'style='margin:0px;'onchange='loadLanguage(window.top.$(&quot;#language&quot;).val())'></select><span style='font-size:10px;float:right;font-weight:normal;font-style:normal'>" + filter_03 + " <a href='http://forum.tribalwars.net/member.php?22739-ntoombs19'target='_blank'>ntoombs19</a>&nbsp;<div class='vis'style='float:right;text-align:center;line-height:100%;width:12px;height:12px;margin:0px 0px 0px 0px;position:relative;background-color:tan;opacity:.7'><a href='#'num='2'onclick='uglyHider(window.top.$(this));return false;'>-</a></div></span></h4></th></tr></thead><tbody id='settingsBody'><tr><td class='col1'style='min-width:200px'><span>" + filter_04 + "</span>&nbsp;<input type='text'value=''size='2'maxlength='3'id='start_page'>&nbsp;<span>" + filter_05 + "</span>&nbsp;<input type='text'value=''size='2'maxlength='3'id='end_page'></td><td colspan='3'><span style='font-weight:bold'>" + filter_06 + "</span>&nbsp;<img src='graphic/questionmark.png'width='13'height='13'id='enable_help'></td><td rowspan='5'valign='top'><form><input type='checkbox'id='all_none'>&nbsp;<label for='all_none'style='font-weight:bold'>" + filter_07 + "</label>&nbsp;<img src='graphic/questionmark.png'width='13'height='13'id='report_help'><br><input type='checkbox'id='blue'><label for='blue'><img src='graphic/dots/blue.png'>&nbsp;" + filter_08 + "</label><br><input type='checkbox'id='green'><label for='green'><img src='graphic/dots/green.png'>&nbsp;" + filter_09 + "</label><br><input type='checkbox'id='yellow'><label for='yellow'><img src='graphic/dots/yellow.png'>&nbsp;" + filter_10 + "</label><br><input type='checkbox'id='red_yellow'><label for='red_yellow'><img src='graphic/dots/red_yellow.png'>&nbsp;" + filter_11 + "</label><br><input type='checkbox'id='red_blue'><label for='red_blue'><img src='graphic/dots/red_blue.png'>&nbsp;" + filter_12 + "</label><br><input type='checkbox'id='red'><label for='red'><img src='graphic/dots/red.png'>&nbsp;" + filter_13 + "</label></form></td></tr><tr><td rowspan='2'><label for='order_by'>" + filter_14 + ":</label>&nbsp;<select id='order_by'val='distance'><option value='distance'>" + filter_15 + "</option><option value='date'>" + filter_16 + "</option></select><br><label for='direction'>" + filter_17 + ":</label>&nbsp;<select id='direction'val='desc'><option value='asc'>" + filter_18 + "</option><option value='desc'>" + filter_19 + "</option></select></td><td style='width:26px'><input type='checkbox'id='enable_hauls'></td><td style='width:110px'><label for='enable_hauls'>" + filter_20 + "</label></td><td><input type='radio'name='hauls'id='full'><label for='full'><img src='graphic/max_loot/1.png'>" + filter_21 + "</label>&nbsp;<input type='radio'name='hauls'id='partial'><label for='partial'><img src='graphic/max_loot/0.png'>" + filter_22 + "</label></td></tr><tr><td><input type='checkbox'id='enable_attacks'></td><td><label for='enable_attacks'>" + filter_23 + "</label></td><td><select id='attack_operator'><option value='greater_than'>" + filter_24 + "</option><option value='less_than'>" + filter_25 + "</option><option value='equal_to'>" + filter_26 + "</option></select>&nbsp;<input type='text'id='attack_value'size='2'maxlength='2'value=''></td></tr><tr><td rowspan='1'><span style='font-weight:bold;'>" + filter_43 + "</span></td><td><input type='checkbox'id='enable_walls'></td><td><label for='enable_walls'>" + filter_30 + "</label></td><td><select id='wall_operator'><option value='greater_than'>" + filter_24 + "</option><option value='less_than'>" + filter_25 + "</option><option value='equal_to'>" + filter_26 + "</option></select>&nbsp;<input type='text'id='wall_value'size='2'maxlength='2'value=''></td></tr><tr><td><input type='checkbox'id='next_village_no_farms'><label for='next_village_no_farms'>" + filter_39 + "</label></td><td><input type='checkbox'id='enable_distances'></td><td><label for='enable_distances'>" + filter_31 + "</label></td><td><select id='distance_operator'val='greater_than'><option value='greater_than'>" + filter_24 + "</option><option value='less_than'>" + filter_25 + "</option><option value='equal_to'>" + filter_26 + "</option></select>&nbsp;<input type='text'id='distance_value'size='2'maxlength='2'value=''></td></tr><tr><td><input type='checkbox' id='next_village_units' />" + filter_44 + "</td><td><input type='checkbox' id='enable_continents' /><td colspan='3'><select id='continent_display'><option value='hide'>" + filter_32 + "</option><option value='show'>" + filter_33 + "</option></select>&nbsp;<label for='continents_list'>" + filter_34 + "</label>&nbsp;<input type='text'size='2'maxlength='150'id='continents_list'value=''>&nbsp;<img src='graphic/questionmark.png'height='13'id='continent_help'></td></tr><tr><td><input type='checkbox' id='next_village_scouts' /><input type='text' size='2' id='scouts_left' /> " + filter_45 + "</td><td><input type='checkbox'id='enable_scout'></td><td colspan='3'><label for='enable_scout'>" + filter_35 + "</label>&nbsp;<select id='scout_report_operator'val='greater_than'><option value='greater_than'>" + filter_24 + "</option><option value='less_than'>" + filter_25 + "</option><option value='equal_to'>" + filter_26 + "</option></select>&nbsp;<input type='text'id='haul_value'size='9'maxlength='7'value=''></td></tr><tr><td><input type='checkbox' id='next_village_farming_troops' /><input type='text' size='2' id='farming_troops_left' /> " + filter_46 + "</td><td><input type='checkbox'id='enable_time'></td><td colspan='3'><select id='attack_time_filter'val='hide'><option value='hide'>" + filter_32 + "</option><option value='show'>" + filter_33 + "</option></select>&nbsp;<label for='enable_time'>" + filter_36 + "</label>&nbsp;<input type='text'id='time_value'size='2'maxlength='4'value=''><span>" + filter_37 + "</span></td></tr><tr><td><input type='checkbox'id='enable_auto_run'><label for='enable_autoRun'>" + filter_38 + "</label></td><td><input type='checkbox' id='hide_recent_farms' /></td><td colspan='3'><select id='sent_time_filter'val='hide'><option value='hide'>" + filter_32 + "</option><option value='show'>" + filter_33 + "</option></select>&nbsp;" + filter_47 + " <input type='text' size='2' id='hide_recent_time' /> " + filter_48 + "</td></tr><tr><th>" + filter_49 + "</th><th colspan='4'>" + filter_50 + "</th></tr><tr><td rowspan='4'><table><tr class='hotkey_values'><td><a href='#'onclick='return setKeyEditMode(\"A\")'id='button_a'class='farm_icon farm_icon_a'></a></td><td><a href='#'onclick='return setKeyEditMode(\"B\")'id='button_b'class='farm_icon farm_icon_b'></a></td><td><a href='#'onclick='return setKeyEditMode(\"C\")'id='button_c'class='farm_icon farm_icon_c'></a></td><td><a href='#'onclick='return setKeyEditMode(\"Master\")'id='button_master'class='farm_icon farm_icon_m'></a></td></tr><tr class='hotkey_values'><td><input type='text'class='hotkey_value' READONLY id='hotkey_value_a'value='A'></td><td><input type='text'class='hotkey_value' READONLY id='hotkey_value_b'value='B'></td><td><input type='text'class='hotkey_value' READONLY id='hotkey_value_c'value='C'></td><td><input type='text'class='hotkey_value' READONLY id='hotkey_value_master'value='M'></td></tr><tr class='hotkey_values'><td colspan='2'><input class='btn tooltip'onclick='return setKeyEditMode(\"Skip\")'type='button'value='Skip'style='margin:0px 0px 0px 0px'title='" + filter_51 + "'></td><td><input class='btn tooltip'onclick='return setKeyEditMode(\"Left\")'type='button'value='â‡š'style='margin:0px 0px 0px 0px'title='" + filter_52 + "'></td><td><input class='btn tooltip'type='button'onclick='return setKeyEditMode(\"Right\")'value='â‡›'style='margin:0px 0px 0px 0px'title='" + filter_53 + "'></td></tr><tr class='hotkey_values'><td colspan='2'><input type='text'class='hotkey_value' READONLY id='hotkey_value_skip'value='S'></td><td><input type='text'class='hotkey_value' READONLY id='hotkey_value_left'value='&#8592;'></td><td><input type='text'class='hotkey_value' READONLY id='hotkey_value_right'value='&#8594;'></td></tr></table></td><td><input type='checkbox' onchange='return updateKeypressSettings();' id='priorityOneEnabled'/></td><td colspan='3'>" + filter_54 + " <select id='priorityOneProfile' onchange='return updateKeypressSettings();'></select> " + filter_55 + " <select id='priorityOneButton' onchange='return updateKeypressSettings();'><option val='" + filter_56 + "'>" + filter_56 + "</option><option val='" + filter_57 + "'>" + filter_57 + "</option><option val='" + filter_58 + "'>" + filter_58 + "</option><option val='" + filter_59 + "'>" + filter_59 + "</option></select></td></tr><tr><td><input type='checkbox' onchange='return updateKeypressSettings();' id='priorityTwoEnabled'/></td><td colspan='3'>" + filter_54 + " <select id='priorityTwoProfile' onchange='return updateKeypressSettings();'></select> " + filter_55 + " <select id='priorityTwoButton' onchange='return updateKeypressSettings();'><option val='" + filter_56 + "'>" + filter_56 + "</option><option val='" + filter_57 + "'>" + filter_57 + "</option><option val='" + filter_58 + "'>" + filter_58 + "</option><option val='" + filter_59 + "'>" + filter_59 + "</option></select></td></tr><tr><td><input type='checkbox' onchange='return updateKeypressSettings();' id='priorityThreeEnabled'/></td><td colspan='3'>" + filter_54 + " <select id='priorityThreeProfile' onchange='return updateKeypressSettings();'></select> " + filter_55 + " <select id='priorityThreeButton' onchange='return updateKeypressSettings();'><option val='" + filter_56 + "'>" + filter_56 + "</option><option val='" + filter_57 + "'>" + filter_57 + "</option><option val='" + filter_58 + "'>" + filter_58 + "</option><option val='" + filter_59 + "'>" + filter_59 + "</option></select></td></tr><tr><td colspan='4'>" + filter_60 + " <select id='defaultButton' onchange='return updateKeypressSettings();'><option val='" + filter_56 + "'>" + filter_56 + "</option><option val='" + filter_57 + "'>" + filter_57 + "</option><option val='" + filter_58 + "'>" + filter_58 + "</option><option val='" + filter_59 + "'>" + filter_59 + "</option></select></td></tr><tr><td colspan='5'><div style='float:left'><input type='submit'value='" + profile_02 + "'onclick='applySettings()'>&nbsp;<input type='submit'value='" + profile_03 + "'onclick='resetTable()'></div><div style='float:right'><img src='graphic/questionmark.png'width='13'height='13'id='profile_help'>&nbsp;<label for='settingsProfile'>" + profile_01 + ":</label>&nbsp;<select id='settingsProfile'onchange='changeProfile(window.top.$(&quot;#settingsProfile&quot;).val())'></select>&nbsp;<input type='submit'value='" + profile_04 + "'onclick='createProfile()'>&nbsp;<input type='submit'value='" + profile_05 + "'onclick='setDefaultProfile()'>&nbsp;<input type='submit'value='" + profile_06 + "'onclick='deleteProfile()'>&nbsp;<input type='submit'value='" + profile_07 + "'onclick='updateProfile()'>&nbsp;<input type='submit'value='" + profile_08 + "'onclick='exportProfile()'>&nbsp;<input type='submit'value='" + profile_09 + "'onclick='importProfile()'></div></td></tr></tbody></table></div>")),
    formatSettings(),
    addLanguages(),
    window.top.$("#language option[value='" + window.top.$.jStorage.get("language") + "']").attr("selected", "selected")
}
function formatSettings() {
    window.top.$("#all_none").bind("click", function() {
        window.top.$(this).closest("form").find(":checkbox").prop("checked", this.checked)
    });
    var e = window.top.$("#report_help");
    e.attr("title", instructions_01),
    window.top.UI.ToolTip(e);
    var t = window.top.$("#enable_help");
    t.attr("title", instructions_02),
    window.top.UI.ToolTip(t);
    var o = window.top.$("#continent_help");
    o.attr("title", instructions_03),
    window.top.UI.ToolTip(o);
    var i = window.top.$("#recent_help");
    i.attr("title", instructions_04),
    window.top.UI.ToolTip(i);
    var n = window.top.$("#profile_help");
    n.attr("title", instructions_05),
    window.top.UI.ToolTip(n),
    loadDefaultProfile(),
    fillProfileList(),
    fillMasterSettings(),
    fillKeypressSettings()
}
function removeFirstPage() {
    window.top.$("#plunder_list tr:gt(0)").remove(),
    window.top.$("#plunder_list_nav").hide()
}
function customSendUnits(e, n, t, r) {
    if (!checkIfNextVillage()) {
        if (r.closest("tr").hide(),
        (e = window.top.$(e)).hasClass("farm_icon_disabled"))
            return !1;
        var o = {
            target: n,
            template_id: t,
            source: window.top.game_data.village.id
        };
        return window.top.$.post(window.top.Accountmanager.send_units_link, o, function(e) {
            if (e.error) {
                if (userset[s.next_village_units] && "Not enough units available" == e.error)
                    return cansend && filtersApplied && getNewVillage("n"),
                    !1;
                window.top.UI.ErrorMessage(e.error),
                r.closest("tr").show()
            } else {
                if (setLocalStorageRow(n),
                void 0 !== window.top.$(r).prop("tooltipText"))
                    var t = window.top.$(r).prop("tooltipText");
                var o = window.top.$("<div></div>").append(window.top.$(t))
                  , i = (window.top.$(o).find('img[src*="res.png"]').eq(0).attr("src"),
                t.split(/<br\s*?\/?>/gi));
                i.splice(i.length - 2, 1),
                window.top.UI.SuccessMessage(i.join(" "), 100),
                window.top.Accountmanager.farm.updateOwnUnitsAvailable(e.current_units)
            }
        }, "json"),
        !1
    }
}
function customSendUnitsFromReport(e, n, t, r) {
    if (!checkIfNextVillage()) {
        if (r.closest("tr").hide(),
        (e = window.top.$(e)).hasClass("farm_icon_disabled"))
            return !1;
        var o = {
            report_id: t
        };
        return window.top.$.post(window.top.Accountmanager.send_units_link_from_report, o, function(e) {
            if (e.error) {
                if (userset[s.next_village_units] && "Not enough units available" == e.error)
                    return cansend && filtersApplied && getNewVillage("n"),
                    !1;
                window.top.UI.ErrorMessage(e.error),
                r.closest("tr").show()
            } else if (setLocalStorageRow(n),
            "string" == typeof e.success) {
                if (void 0 !== window.top.$(r).prop("tooltipText"))
                    var t = window.top.$(r).prop("tooltipText");
                var o = window.top.$("<div></div>").append(window.top.$(t))
                  , i = (window.top.$(o).find('img[src*="res.png"]').eq(0).attr("src"),
                t.split(/<br\s*?\/?>/gi));
                i.splice(i.length - 2, 1),
                window.top.UI.SuccessMessage(i.join(" "), 100),
                window.top.Accountmanager.farm.updateOwnUnitsAvailable(e.current_units)
            }
        }, "json"),
        !1
    }
}
function setOnclick(e) {
    var t = e.find("a").attr("onclick");
    if (void 0 !== t) {
        var o = t.slice(t.indexOf("(") + 1, t.indexOf(")"))
          , i = o.split(",");
        -1 == t.indexOf("FromReport") ? e.find("a").attr("onclick", "return customSendUnits(" + o + ", window.top.$(this))") : e.find("a").attr("onclick", "return customSendUnitsFromReport(" + o + "))"),
        e.closest("tr").attr("name", window.top.$.trim(i[1]))
    }
}
function addTableInfo() {
    window.top.$("#am_widget_Farm tr th").slice(0, 1).after("<th></th>"),
    window.top.$("#am_widget_Farm tr:not(:first-child)").each(function(n) {
        window.top.$(this).children("td").each(function(e) {
            switch (e) {
            case 1:
                window.top.$(this).filter(":first").before("<td style='width:10px;font-weight:bold;' id='rowNum'>" + (n + 1) + "</td>");
                break;
            case 3:
                var t = window.top.$(this).find("img")
                  , o = window.top.$(this).find("img").prop("tooltipText");
                if (void 0 !== o) {
                    var i = o.replace(/\D/g, "");
                    t.after("<span style='font-weight:bold;'> (" + i + ")</span>")
                }
                break;
            case 8:
            case 9:
            case 10:
                setOnclick(window.top.$(this))
            }
        })
    })
}
function checkIfNextVillage() {
    if ((current_units = window.top.Accountmanager.farm.current_units,
    userset[s.next_village_scouts]) && current_units.spy <= parseInt(userset[s.scouts_left]))
        return getNewVillage("n"),
        !0;
    if (userset[s.next_village_farming_troops]) {
        var o = 0;
        if (window.top.$(".fm_unit input:checked").each(function(e) {
            var t = window.top.$(this).attr("name");
            o += parseInt(current_units[t])
        }),
        o <= parseInt(userset[s.farming_troops_left]))
            return getNewVillage("n"),
            !0
    }
    if (userset[s.next_village_no_farms] && 0 == window.top.$("#plunder_list tr:not(:first-child):visible").length)
        return getNewVillage("n"),
        !0
}
function applySettings() {
    pagesLoaded ? applyFilters() : (setTimeout(showAllRows(), 1),
    removeFirstPage())
}
function applyFilters() {
    window.top.$("#am_widget_Farm tr:gt(0)").each(function(e) {
        (hideRow = checkRowToHide(window.top.$(this), userset)) && window.top.$(this).hide()
    }),
    changeHeader(filter_40);
    var e = 0;
    "fixed" == window.top.$("#topContainer").css("position") && (e = window.top.$("#topContainer").height()),
    window.top.$('*:contains("Bot Protection")').length ? (window.top.$("html, body").animate({
        scrollTop: window.top.$('*:contains("Bot Protection")').offset().top - e
    }, 500),
    "function" == typeof showNotification && showNotification("custom", ["LA Enhancer has encountered bot protection. Please respond to captcha to continue farming."], null, "Bot Protection"),
    cansend = !1) : window.top.$("html, body").animate({
        scrollTop: window.top.$("#farm_units").offset().top - e
    }, 500),
    filtersApplied = !0
}
function checkRowToHide(e, t) {
    return hideRow = !1,
    e.children("td").each(function(e) {
        switch (e) {
        case 2:
            reportSettings(window.top.$(this), t);
            break;
        case 3:
            haulSettings(window.top.$(this), t);
            break;
        case 4:
            hideRecentlyFarmed(window.top.$(this), t),
            attackSettings(window.top.$(this), t),
            continentSettings(window.top.$(this), t);
            break;
        case 5:
            hideTime(window.top.$(this), t);
            break;
        case 6:
            scoutReportSettings(window.top.$(this), t);
            break;
        case 7:
            wallSettings(window.top.$(this), t);
            break;
        case 8:
            distanceSettings(window.top.$(this), t)
        }
    }),
    !!hideRow && (troubleshoot && console.log(e.find("#rowNum").html() + ": (" + reason.join(",") + ")"),
    reason = [],
    !0)
}
function resetTable() {
    window.top.$("#plunder_list tr").each(function(e) {
        window.top.$(this).show()
    })
}
function setLocalStorageRow(e) {
    var t = "sitter:" + sitter + ", village:" + e + ", world:" + getURL()[0];
    window.top.$.jStorage.set(t, getCurrentGameTime())
}
function reportSettings(e, t) {
    return 0 <= e.html().indexOf("blue") && t[s.blue] ? (reason.push("Report is blue"),
    void (hideRow = !0)) : 0 <= e.html().indexOf("green") && t[s.green] ? (reason.push("Report is green"),
    void (hideRow = !0)) : 0 <= e.html().indexOf("yellow") && t[s.yellow] ? (reason.push("Report is yellow"),
    void (hideRow = !0)) : 0 <= e.html().indexOf("red_yellow") && t[s.red_yellow] ? (reason.push("Report is red_yellow"),
    void (hideRow = !0)) : 0 <= e.html().indexOf("red_blue") && t[s.red_blue] ? (reason.push("Report is red_blue"),
    void (hideRow = !0)) : 0 <= e.html().indexOf("red") && t[s.red] ? (reason.push("Report is red"),
    void (hideRow = !0)) : void 0
}
function haulSettings(e, t) {
    if (t[s.enable_hauls]) {
        if (0 <= e.html().indexOf("max_loot/1") && t[s.full])
            return reason.push("Haul is full"),
            void (hideRow = !0);
        if (0 <= e.html().indexOf("max_loot/0") && t[s.partial])
            return reason.push("Haul is partial"),
            void (hideRow = !0);
        if (-1 == e.html().indexOf("max_loot") && t[s.full])
            return reason.push("No haul graphic"),
            void (hideRow = !0)
    }
}
function hideRecentlyFarmed(e, t) {
    if (t[s.hide_recent_farms]) {
        var o = e.closest("tr").attr("name");
        localTitle = "sitter:" + sitter + ", village:" + o + ", world:" + getURL()[0];
        var i = new Date(window.top.$.jStorage.get(localTitle))
          , n = currentGameTime.getTime() - i.getTime()
          , r = Math.abs(parseInt(n / 1e3 / 60));
        switch (t[s.sent_time_filter]) {
        case "hide":
            if (r < parseInt(t[s.hide_recent_time]))
                return reason.push("Village was recently sent to " + r + " minutes ago"),
                void (hideRow = !0);
            break;
        case "show":
            if (r > parseInt(t[s.hide_recent_time]))
                return reason.push("Village was not recently sent to"),
                void (hideRow = !0)
        }
    }
}
function attackSettings(e, t) {
    var o, i = e.find("img");
    if (o = void 0 !== i.prop("tooltipText") ? parseInt(i.prop("tooltipText").replace(/\D/g, "")) : 0,
    t[s.enable_attacks])
        switch (t[s.attack_operator]) {
        case "greater_than":
            if (o > parseInt(t[s.attack_value]))
                return reason.push("Outgoing attacks is too many"),
                void (hideRow = !0);
            break;
        case "less_than":
            if (o < parseInt(t[s.attack_value]))
                return reason.push("Outgoing attacks is too few"),
                void (hideRow = !0);
            break;
        case "equal_to":
            if (o == parseInt(t[s.attack_value]))
                return reason.push("Outgoing attacks is equal"),
                void (hideRow = !0)
        }
}
function continentSettings(e, t) {
    var o = e.find("a").html();
    if (void 0 !== o) {
        o = o.substr(o.length - 2);
        var i = t[s.continents_list].split(".");
        if (0 <= window.top.$.inArray(o, i) && "hide" == t[s.continent_display])
            return reason.push("Continent is set to hide"),
            void (hideRow = !0);
        if (-1 == window.top.$.inArray(o, i) && "show" == t[s.continent_display])
            return reason.push("Continent is not set to show"),
            void (hideRow = !0)
    }
}
function hideTime(e, t) {
    if (t[s.enable_time]) {
        var o = currentGameTime
          , i = getVillageAttackedTime(e)
          , n = o.getTime() - i.getTime()
          , r = Math.abs(parseInt(n / 1e3 / 60));
        switch (t[s.attack_time_filter]) {
        case "hide":
            if (r < parseInt(t[s.time_value]))
                return reason.push("Village attacked " + r + " minutes ago."),
                void (hideRow = !0);
            break;
        case "show":
            if (r > parseInt(t[s.time_value]))
                return reason.push("Village attacked " + r + " minutes ago."),
                void (hideRow = !0)
        }
    }
}
function scoutReportSettings(e, t) {
    var o;
    if (t[s.enable_scout]) {
        if ("?" == window.top.$.trim(e.find("span").html()))
            o = 0;
        else
            o = parseInt(e.children("span").eq(0).html().replace(/\D+/g, "")) + parseInt(e.children("span").eq(1).html().replace(/\D+/g, "")) + parseInt(e.children("span").eq(2).html().replace(/\D+/g, ""));
        switch (t[s.scout_report_operator]) {
        case "greater_than":
            if (o > parseInt(t[s.haul_value]))
                return reason.push("Too many resources"),
                void (hideRow = !0);
            break;
        case "less_than":
            if (o < parseInt(t[s.haul_value]))
                return reason.push("Not enough resources"),
                void (hideRow = !0);
            break;
        case "equal_to":
            if (o == parseInt(t[s.haul_value]))
                return reason.push("Exact resources"),
                void (hideRow = !0)
        }
    }
}
function wallSettings(e, t) {
    if (t[s.enable_walls]) {
        var o = parseInt(e.html());
        switch ("?" == o && (o = 0),
        window.top.$.trim(t[s.wall_operator])) {
        case "greater_than":
            if (o > parseInt(t[s.wall_value]))
                return reason.push("Wall too high"),
                void (hideRow = !0);
            break;
        case "less_than":
            if (o < parseInt(t[s.wall_value]))
                return reason.push("Wall too low"),
                void (hideRow = !0);
            break;
        case "equal_to":
            if (o == parseInt(t[s.wall_value]))
                return reason.push("Wall is exact"),
                void (hideRow = !0)
        }
    }
}
function distanceSettings(e, t) {
    if (t[s.enable_distances]) {
        var o = e.html();
        switch (window.top.$.trim(t[s.distance_operator])) {
        case "greater_than":
            if (parseFloat(o) > parseFloat(t[s.distance_value]))
                return reason.push("Village too far"),
                void (hideRow = !0);
            break;
        case "less_than":
            if (parseFloat(o) < parseFloat(t[s.distance_value]))
                return reason.push("Village too close"),
                void (hideRow = !0);
            break;
        case "equal_to":
            if (parseFloat(o) == parseFloat(t[s.distance_value]))
                return reason.push("Village exact distance"),
                void (hideRow = !0)
        }
    }
}
function deleteRecentlyFarmed() {
    window.top.$("#am_widget_Farm tr:gt(0)").each(function(e) {
        window.top.$(this).children("td").each(function(e) {
            4 == e && (reportLinkText = window.top.$.trim(window.top.$(this).children("a").html()),
            localTitle = "sitter:" + sitter + ", village:" + reportLinkText + ", world:" + getURL()[0],
            null != window.top.$.jStorage.get(localTitle) && window.top.$.jStorage.deleteKey(localTitle))
        })
    })
}
function getCurrentGameTime() {
    var e = window.top.$("#serverTime").html().split(":")
      , t = window.top.$("#serverDate").html().split("/");
    return new Date(t[2],t[1] - 1,t[0],e[0],e[1],e[2],0)
}
function getVillageAttackedTime(e) {
    for (var t, o, i = (c = e.html()).split(" "), n = 0; n < i.length; n++)
        -1 < (e = window.top.$.trim(i[n])).indexOf(".") ? t = e : e == filter_61 ? t = filter_61 : e == filter_62 && (t = filter_62),
        -1 < e.indexOf(":") && (o = e);
    if (t == filter_61 || t == filter_62) {
        var r = currentGameTime.getDate();
        t == filter_62 && r--;
        var a = currentGameTime.getMonth()
          , s = currentGameTime.getFullYear()
          , l = (c = o.split(":"))[0]
          , p = c[1]
          , d = c[2];
        return new Date(s,a,r,l,p,d,0)
    }
    var w = t.split(".");
    r = w[0],
    a = w[1] - 1;
    if (0 == currentGameTime.getMonth() && 11 == a)
        s = currentGameTime.getFullYear() - 1;
    else
        s = currentGameTime.getFullYear();
    var c;
    l = (c = o.split(":"))[0],
    p = c[1],
    d = c[2];
    return new Date(s,a,r,l,p,d,0)
}
function loadDefaultProfile() {
    null == window.top.$.jStorage.get("profile:" + profile_10) && (window.top.$.jStorage.set("profile:" + profile_10, ["1", "1", "distance", "asc", !1, !1, !1, !1, !1, !1, !1, !1, "hide", "", !1, !1, !1, !1, "greater_than", "", !1, "greater_than", "", !1, "greater_than", "", !1, "greater_than", "", "hide", "", !1, "hide", "", !1, !1, !1, "", !1, "", !1]),
    window.top.$.jStorage.deleteKey("profileList"),
    window.top.$.jStorage.set("profileList", [profile_10])),
    userset = window.top.$.jStorage.get("profile:" + profile_10),
    loadProfile(profile_10),
    window.top.$("#settingsProfile").val(profile_10)
}
function setDefaultProfile() {
    if (window.top.$("#settingsProfile").val() == profile_10) {
        if (!confirm(dialog_02))
            return !1;
        createProfile(),
        setDefaultProfile()
    } else {
        var e = window.top.$.jStorage.get("profile:" + window.top.$("#settingsProfile").val());
        window.top.$.jStorage.set("profile:" + profile_10, e)
    }
}
function fillProfileList() {
    var e = window.top.$.jStorage.get("profileList");
    window.top.$.each(e, function(e, t) {
        window.top.$("#settingsProfile").append("<option value='" + t + "'>" + t + "</option>")
    }),
    window.top.$("#settingsProfile").val(window.top.$.jStorage.get("DefaultProfile"))
}
function createProfile() {
    var e = prompt(dialog_03 + ":");
    if (-1 != window.top.$.inArray(e, window.top.$.jStorage.get("profileList")))
        return alert(dialog_04),
        createProfile(),
        !1;
    if ("" == e)
        return alert(dialog_05),
        createProfile(),
        !1;
    if (null != e && "" != e) {
        var t = [];
        t.push(window.top.$("#start_page").val()),
        t.push(window.top.$("#end_page").val()),
        t.push(window.top.$("#order_by").val()),
        t.push(window.top.$("#direction").val()),
        t.push(window.top.$("#all_none").prop("checked")),
        t.push(window.top.$("#blue").prop("checked")),
        t.push(window.top.$("#green").prop("checked")),
        t.push(window.top.$("#yellow").prop("checked")),
        t.push(window.top.$("#red_yellow").prop("checked")),
        t.push(window.top.$("#red_blue").prop("checked")),
        t.push(window.top.$("#red").prop("checked")),
        t.push(window.top.$("#hide_recent_farms").prop("checked")),
        t.push(window.top.$("#sent_time_filter").val()),
        t.push(window.top.$("#hide_recent_time").val()),
        t.push(window.top.$("#enable_hauls").prop("checked")),
        t.push(window.top.$("#full").prop("checked")),
        t.push(window.top.$("#partial").prop("checked")),
        t.push(window.top.$("#enable_attacks").prop("checked")),
        t.push(window.top.$("#attack_operator").val()),
        t.push(window.top.$("#attack_value").val()),
        t.push(window.top.$("#enable_walls").prop("checked")),
        t.push(window.top.$("#wall_operator").val()),
        t.push(window.top.$("#wall_value").val()),
        t.push(window.top.$("#enable_distances").prop("checked")),
        t.push(window.top.$("#distance_operator").val()),
        t.push(window.top.$("#distance_value").val()),
        t.push(window.top.$("#enable_scout").prop("checked")),
        t.push(window.top.$("#scout_report_operator").val()),
        t.push(window.top.$("#haul_value").val()),
        t.push(window.top.$("#continent_display").val()),
        t.push(window.top.$("#continents_list").val()),
        t.push(window.top.$("#enable_time").prop("checked")),
        t.push(window.top.$("#attack_time_filter").val()),
        t.push(window.top.$("#time_value").val()),
        t.push(window.top.$("#enable_auto_run").prop("checked")),
        t.push(window.top.$("#next_village_no_farms").prop("checked")),
        t.push(window.top.$("#next_village_scouts").prop("checked")),
        t.push(window.top.$("#scouts_left").val()),
        t.push(window.top.$("#next_village_farming_troops").prop("checked")),
        t.push(window.top.$("#farming_troops_left").val()),
        t.push(window.top.$("#next_village_units").prop("checked")),
        window.top.$.jStorage.set("profile:" + e, t);
        var o = window.top.$.jStorage.get("profileList");
        o.push(e),
        window.top.$.jStorage.set("profileList", o),
        window.top.$("#settingsProfile").append("<option value='" + e + "'>" + e + "</option>"),
        window.top.$("#priorityOneProfile").append("<option value='" + e + "'>" + e + "</option>"),
        window.top.$("#priorityTwoProfile").append("<option value='" + e + "'>" + e + "</option>"),
        window.top.$("#priorityThreeProfile").append("<option value='" + e + "'>" + e + "</option>"),
        window.top.$("#settingsProfile").val(e)
    }
}
function loadProfile(e) {
    var t = window.top.$.jStorage.get("profile:" + e);
    userset = t,
    window.top.$("#start_page").val(t[0]),
    window.top.$("#end_page").val(t[1]),
    window.top.$("#order_by").val(t[2]),
    window.top.$("#direction").val(t[3]),
    window.top.$("#all_none").prop("checked", t[4]),
    window.top.$("#blue").prop("checked", t[5]),
    window.top.$("#green").prop("checked", t[6]),
    window.top.$("#yellow").prop("checked", t[7]),
    window.top.$("#red_yellow").prop("checked", t[8]),
    window.top.$("#red_blue").prop("checked", t[9]),
    window.top.$("#red").prop("checked", t[10]),
    window.top.$("#hide_recent_farms").prop("checked", t[11]),
    window.top.$("#sent_time_filter").val(t[12]),
    window.top.$("#hide_recent_time").val(t[13]),
    window.top.$("#enable_hauls").prop("checked", t[14]),
    window.top.$("#full").prop("checked", t[15]),
    window.top.$("#partial").prop("checked", t[16]),
    window.top.$("#enable_attacks").prop("checked", t[17]),
    window.top.$("#attack_operator").val(t[18]),
    window.top.$("#attack_value").val(t[19]),
    window.top.$("#enable_walls").prop("checked", t[20]),
    window.top.$("#wall_operator").val(t[21]),
    window.top.$("#wall_value").val(t[22]),
    window.top.$("#enable_distances").prop("checked", t[23]),
    window.top.$("#distance_operator").val(t[24]),
    window.top.$("#distance_value").val(t[25]),
    window.top.$("#enable_scout").prop("checked", t[26]),
    window.top.$("#scout_report_operator").val(t[27]),
    window.top.$("#haul_value").val(t[28]),
    window.top.$("#continent_display").val(t[29]),
    window.top.$("#continents_list").val(t[30]),
    window.top.$("#enable_time").prop("checked", t[31]),
    window.top.$("#attack_time_filter").val(t[32]),
    window.top.$("#time_value").val(t[33]),
    window.top.$("#enable_auto_run").prop("checked", t[34]),
    window.top.$("#next_village_no_farms").prop("checked", t[35]),
    window.top.$("#next_village_scouts").prop("checked", t[36]),
    window.top.$("#scouts_left").val(t[37]),
    window.top.$("#next_village_farming_troops").prop("checked", t[38]),
    window.top.$("#farming_troops_left").val(t[39]),
    window.top.$("#next_village_units").prop("checked", t[40])
}
function changeProfile(e) {
    loadProfile(e),
    resetTable(),
    applyFilters()
}
function deleteProfile() {
    var e = window.top.$("#settingsProfile").val();
    if (e == profile_10)
        alert(dialog_06);
    else {
        var t = window.top.$.jStorage.get("profileList");
        t.splice(t.indexOf(e), 1),
        window.top.$.jStorage.set("profileList", t),
        window.top.$.jStorage.deleteKey("profile:" + e),
        window.top.$("#settingsProfile option[value='" + e + "']").remove(),
        window.top.$("#priorityOneProfile option[value='" + e + "']").remove(),
        window.top.$("#priorityTwoProfile option[value='" + e + "']").remove(),
        window.top.$("#priorityThreeProfile option[value='" + e + "']").remove(),
        loadDefaultProfile(profile_10)
    }
}
function updateProfile() {
    var e = window.top.$("#settingsProfile").val()
      , t = [];
    t.push(window.top.$("#start_page").val()),
    t.push(window.top.$("#end_page").val()),
    t.push(window.top.$("#order_by").val()),
    t.push(window.top.$("#direction").val()),
    t.push(window.top.$("#all_none").prop("checked")),
    t.push(window.top.$("#blue").prop("checked")),
    t.push(window.top.$("#green").prop("checked")),
    t.push(window.top.$("#yellow").prop("checked")),
    t.push(window.top.$("#red_yellow").prop("checked")),
    t.push(window.top.$("#red_blue").prop("checked")),
    t.push(window.top.$("#red").prop("checked")),
    t.push(window.top.$("#hide_recent_farms").prop("checked")),
    t.push(window.top.$("#sent_time_filter").val()),
    t.push(window.top.$("#hide_recent_time").val()),
    t.push(window.top.$("#enable_hauls").prop("checked")),
    t.push(window.top.$("#full").prop("checked")),
    t.push(window.top.$("#partial").prop("checked")),
    t.push(window.top.$("#enable_attacks").prop("checked")),
    t.push(window.top.$("#attack_operator").val()),
    t.push(window.top.$("#attack_value").val()),
    t.push(window.top.$("#enable_walls").prop("checked")),
    t.push(window.top.$("#wall_operator").val()),
    t.push(window.top.$("#wall_value").val()),
    t.push(window.top.$("#enable_distances").prop("checked")),
    t.push(window.top.$("#distance_operator").val()),
    t.push(window.top.$("#distance_value").val()),
    t.push(window.top.$("#enable_scout").prop("checked")),
    t.push(window.top.$("#scout_report_operator").val()),
    t.push(window.top.$("#haul_value").val()),
    t.push(window.top.$("#continent_display").val()),
    t.push(window.top.$("#continents_list").val()),
    t.push(window.top.$("#enable_time").prop("checked")),
    t.push(window.top.$("#attack_time_filter").val()),
    t.push(window.top.$("#time_value").val()),
    t.push(window.top.$("#enable_auto_run").prop("checked")),
    t.push(window.top.$("#next_village_no_farms").prop("checked")),
    t.push(window.top.$("#next_village_scouts").prop("checked")),
    t.push(window.top.$("#scouts_left").val()),
    t.push(window.top.$("#next_village_farming_troops").prop("checked")),
    t.push(window.top.$("#farming_troops_left").val()),
    t.push(window.top.$("#next_village_units").prop("checked")),
    window.top.$.jStorage.set("profile:" + e, t),
    userset = t
}
function exportProfile() {
    var e = window.top.$("#settingsProfile").val()
      , t = window.top.$.jStorage.get("profile:" + e);
    if (e == profile_10)
        alert(dialog_07);
    else
        prompt(dialog_08, dialog_09A + "" + e + dialog_09B + e + "," + t + dialog_09C)
}
function importProfile() {
    var e = prompt(dialog_10 + ":", dialog_11)
      , t = (e = e.split(","))[0];
    e.shift();
    var o = window.top.$.jStorage.get("profileList");
    if (-1 != window.top.$.inArray(t, o))
        return alert(dialog_12),
        !1;
    for (i = 0; i <= e.length; i++)
        "false" !== e[i] && "true" !== e[i] || (e[i] = parseBool(e[i]));
    window.top.$.jStorage.set("profile:" + t, e),
    o.push(t),
    window.top.$.jStorage.set("profileList", o),
    window.top.$("#settingsProfile").append("<option value='" + t + "'>" + t + "</option>"),
    window.top.$("#settingsProfile").val(t),
    loadProfile(t)
}
function hotkeysOnOff() {
    window.top.$("#settingsBody tr:lt(9) input,#settingsBody tr:lt(9) select").focusin(function() {
        window.onkeydown = function() {}
    }),
    window.top.$("#settingsBody tr:lt(9) input,#settingsBody tr:lt(9) select").focusout(function() {
        turnOnHotkeys()
    })
}
function turnOnHotkeys() {
    window.onkeydown = function(e) {
        if (editingKey)
            editKey(e);
        else {
            var t = window.top.$("#plunder_list tr").filter(":visible").eq(1)
              , o = t.children("td").eq(9).children("a")
              , i = t.children("td").eq(10).children("a")
              , n = t.children("td").eq(11).children("a");
            switch (e.which) {
            case keycodes.a:
                tryClick(o);
                break;
            case keycodes.b:
                tryClick(i);
                break;
            case keycodes.c:
                tryClick(n);
                break;
            case keycodes.skip:
                t.hide();
                break;
            case keycodes.master:
                cansend && filtersApplied && selectMasterButton(t);
                break;
            case keycodes.left:
                getNewVillage("p");
                break;
            case keycodes.right:
                getNewVillage("n");
                break;
            default:
                return
            }
        }
        e.preventDefault()
    }
}
function tryClick(e) {
    cansend && filtersApplied && (checkIfNextVillage() || (console.log(e.html()),
    e.hasClass("farm_icon_disabled") || null == e.html() ? (window.top.UI.ErrorMessage("That button is not selectable. Skipping row...", 500),
    e.closest("tr").hide()) : (e.click(),
    userset[s.next_village_scouts] || userset[s.next_village_farming_troops],
    doTime(200))))
}
function doTime(e) {
    cansend = !1,
    setTimeout(function() {
        cansend = !0
    }, e)
}
function editKey(e) {
    if (e.keyCode <= 37 && 40 <= e.keyCode || e.keyCode <= 48 && 90 <= e.keyCode)
        window.top.UI.ErrorMessage("You can only enter letters, numbers, or arrows. Plese try another key.", 1500);
    else {
        var t = String.fromCharCode(e.keyCode);
        switch (37 == e.keyCode && (t = "â†"),
        38 == e.keyCode && (t = "â†‘"),
        39 == e.keyCode && (t = "â†’"),
        40 == e.keyCode && (t = "â†“"),
        keyToEdit) {
        case "A":
            keycodes.a = e.keyCode,
            window.top.$("#hotkey_value_a").val(t);
            break;
        case "B":
            keycodes.b = e.keyCode,
            window.top.$("#hotkey_value_b").val(t);
            break;
        case "C":
            keycodes.c = e.keyCode,
            window.top.$("#hotkey_value_c").val(t);
            break;
        case "Master":
            keycodes.master = e.keyCode,
            window.top.$("#hotkey_value_master").val(t);
            break;
        case "Skip":
            keycodes.skip = e.keyCode,
            window.top.$("#hotkey_value_skip").val(t);
            break;
        case "Left":
            keycodes.left = e.keyCode,
            window.top.$("#hotkey_value_left").val(t);
            break;
        case "Right":
            keycodes.right = e.keyCode,
            window.top.$("#hotkey_value_right").val(t);
            break;
        default:
            return
        }
        window.top.UI.SuccessMessage(t + " is now mapped to the " + keyToEdit + " button."),
        updateKeypressSettings(),
        editingKey = !1
    }
}
function updateKeypressSettings() {
    keyPressSettings.a_code = keycodes.a,
    keyPressSettings.a_char = window.top.$("#hotkey_value_a").val(),
    keyPressSettings.b_code = keycodes.b,
    keyPressSettings.b_char = window.top.$("#hotkey_value_b").val(),
    keyPressSettings.c_code = keycodes.c,
    keyPressSettings.c_char = window.top.$("#hotkey_value_c").val(),
    keyPressSettings.master_code = keycodes.master,
    keyPressSettings.master_char = window.top.$("#hotkey_value_master").val(),
    keyPressSettings.skip_code = keycodes.skip,
    keyPressSettings.skip_char = window.top.$("#hotkey_value_skip").val(),
    keyPressSettings.left_code = keycodes.left,
    keyPressSettings.left_char = window.top.$("#hotkey_value_left").val(),
    keyPressSettings.right_code = keycodes.right,
    keyPressSettings.right_char = window.top.$("#hotkey_value_right").val(),
    keyPressSettings.priorityOneEnabled = window.top.$("#priorityOneEnabled").prop("checked"),
    keyPressSettings.priorityOneProfile = window.top.$("#priorityOneProfile").val(),
    keyPressSettings.priorityOneButton = window.top.$("#priorityOneButton").val(),
    keyPressSettings.priorityTwoEnabled = window.top.$("#priorityTwoEnabled").prop("checked"),
    keyPressSettings.priorityTwoProfile = window.top.$("#priorityTwoProfile").val(),
    keyPressSettings.priorityTwoButton = window.top.$("#priorityTwoButton").val(),
    keyPressSettings.priorityThreeEnabled = window.top.$("#priorityThreeEnabled").prop("checked"),
    keyPressSettings.priorityThreeProfile = window.top.$("#priorityThreeProfile").val(),
    keyPressSettings.priorityThreeButton = window.top.$("#priorityThreeButton").val(),
    keyPressSettings.defaultButton = window.top.$("#defaultButton").val(),
    window.top.$.jStorage.set("keyPressSettings", keyPressSettings)
}
function fillKeypressSettings() {
    null == window.top.$.jStorage.get("keyPressSettings") && window.top.$.jStorage.set("keyPressSettings", keyPressSettings),
    keyPressSettings = window.top.$.jStorage.get("keyPressSettings"),
    keycodes.a = keyPressSettings.a_code,
    window.top.$("#hotkey_value_a").val(keyPressSettings.a_char),
    keycodes.b = keyPressSettings.b_code,
    window.top.$("#hotkey_value_b").val(keyPressSettings.b_char),
    keycodes.c = keyPressSettings.c_code,
    window.top.$("#hotkey_value_c").val(keyPressSettings.c_char),
    keycodes.master = keyPressSettings.master_code,
    window.top.$("#hotkey_value_master").val(keyPressSettings.master_char),
    keycodes.skip = keyPressSettings.skip_code,
    window.top.$("#hotkey_value_skip").val(keyPressSettings.skip_char),
    keycodes.left = keyPressSettings.left_code,
    window.top.$("#hotkey_value_left").val(keyPressSettings.left_char),
    keycodes.right = keyPressSettings.right_code,
    window.top.$("#hotkey_value_right").val(keyPressSettings.right_char),
    window.top.$("#priorityOneEnabled").prop("checked", keyPressSettings.priorityOneEnabled),
    window.top.$("#priorityOneProfile").val(keyPressSettings.priorityOneProfile),
    window.top.$("#priorityOneButton").val(keyPressSettings.priorityOneButton),
    window.top.$("#priorityTwoEnabled").prop("checked", keyPressSettings.priorityTwoEnabled),
    window.top.$("#priorityTwoProfile").val(keyPressSettings.priorityTwoProfile),
    window.top.$("#priorityTwoButton").val(keyPressSettings.priorityTwoButton),
    window.top.$("#priorityThreeEnabled").prop("checked", keyPressSettings.priorityThreeEnabled),
    window.top.$("#priorityThreeProfile").val(keyPressSettings.priorityThreeProfile),
    window.top.$("#priorityThreeButton").val(keyPressSettings.priorityThreeButton),
    window.top.$("#defaultButton").val(keyPressSettings.defaultButton)
}
function setKeyEditMode(e) {
    return editingKey = !0,
    keyToEdit = e,
    window.top.UI.InfoMessage("Press any number, letter, or arrow key to set the hotkey for the <span style='font-weight:bold;'>" + e + "</span> button", 1500),
    !1
}
function fillMasterSettings() {
    var e = window.top.$.jStorage.get("profileList");
    window.top.$.each(e, function(e, t) {
        window.top.$("#priorityOneProfile").append("<option value='" + t + "'>" + t + "</option>"),
        window.top.$("#priorityTwoProfile").append("<option value='" + t + "'>" + t + "</option>"),
        window.top.$("#priorityThreeProfile").append("<option value='" + t + "'>" + t + "</option>")
    })
}
function selectMasterButton(e) {
    var t, o = window.top.$.jStorage.get("profile:" + keyPressSettings.priorityOneProfile), i = window.top.$.jStorage.get("profile:" + keyPressSettings.priorityTwoProfile), n = window.top.$.jStorage.get("profile:" + keyPressSettings.priorityThreeProfile), r = e.children("td").eq(9).children("a"), a = e.children("td").eq(10).children("a"), s = e.children("td").eq(11).children("a");
    switch (t = keyPressSettings.defaultButton,
    keyPressSettings.priorityThreeEnabled && !checkRowToHide(e, n) && (t = keyPressSettings.priorityThreeButton),
    keyPressSettings.priorityTwoEnabled && !checkRowToHide(e, i) && (t = keyPressSettings.priorityTwoButton),
    keyPressSettings.priorityOneEnabled && !checkRowToHide(e, o) && (t = keyPressSettings.priorityOneButton),
    t) {
    case "A":
        tryClick(r);
        break;
    case "B":
        tryClick(a);
        break;
    case "C":
        tryClick(s);
        break;
    default:
        e.hide()
    }
}
function setDefaultLanguage() {
    var e = getURL();
    switch (3 == e.length && e.shift(),
    e.join(".")) {
    case "fyletikesmaxes.gr":
        window.top.$.jStorage.set("language", "el");
        break;
    case "tribals.it":
        window.top.$.jStorage.set("language", "it");
        break;
    case "guerrastribales.es":
        window.top.$.jStorage.set("language", "es");
        break;
    case "tribalwars.ae":
        window.top.$.jStorage.set("language", "ar");
        break;
    default:
        window.top.$.jStorage.set("language", "en")
    }
}
function loadLanguage(e) {
    window.top.$.jStorage.set("language", e);
    var t = window.top.$.jStorage.get("profileList")
      , o = window.top.$.jStorage.get("profile:" + profile_10);
    window.top.$.inArray(e, availableLangs) < 0 && (e = "en");
    var i = scriptURL + "lang/" + e + ".js";
    window.top.$.getScript(i, function() {
        window.top.$("#settingsDiv").remove(),
        t[0] = profile_10,
        window.top.$.jStorage.set("profileList", t),
        window.top.$.jStorage.set("profile:" + profile_10, o),
        changeHeader(filter_40),
        showSettings()
    })
}
function addLanguages() {
    window.top.$("#language").append("<option value='en'>English</option>"),
    window.top.$("#language").append("<option value='el'>Î•Î»Î»Î·Î½Î¹ÎºÎ¬</option>"),
    window.top.$("#language").append("<option value='it'>Italiano</option>"),
    window.top.$("#language").append("<option value='es'>EspaÃ±ol</option>"),
    window.top.$("#language").append("<option value='ar'>Ø§Ù„Ù„ØºØ© Ø§Ù„Ø¹Ø±Ø¨ÙŠØ©</option>")
}
function parseBool(e) {
    return void 0 !== e && "true" === e.replace(/^\s+|\s+window.top.$/g, "").toLowerCase()
}
function getURL() {
    var e = window.location.hostname;
    return e = e.split(".")
}
function checkPage() {
    console.log("checkPage"),
    "am_farm" !== window.top.game_data.screen ? getFA() : run()
}
function getFA() {
    console.log("getFA"),
    fadeThanksToCheese(),
    openLoader();
    var e = link[0] + window.top.game_data.village.id + link[1];
    window.top.$.getScript("https://" + window.top.location.host + "/js/game/Accountmanager.js", function() {
        window.top.$.ajax({
            type: "GET",
            url: e,
            dataType: "html",
            error: function(e, t, o) {
                alert("Get LA error: " + o),
                window.top.$("#fader").remove(),
                window.top.$("#loaders").remove()
            },
            success: function(e) {
                var t = window.top.$(e)
                  , o = /<\s*title\s*>([^<]+)<\/title\s*>/g.exec(e)[1]
                  , i = window.top.$.parseJSON(e.split("TribalWars.updateGameData(")[1].split(");")[0]);
                window.top.game_data = i,
                "undefined" != typeof history && "function" == typeof history.pushState && history.pushState({}, window.top.game_data.village.name + " - Loot Assistant", "https://" + window.top.location.host + game_data.link_base_pure + "am_farm"),
                window.top.$("#header_info").html(window.top.$("#header_info", t).html()),
                window.top.$("#topContainer").html(window.top.$("#topContainer", t).html()),
                window.top.$("#contentContainer").html(window.top.$("#contentContainer", t).html()),
                window.top.$("head").find("title").html(o),
                window.top.$("#fader").remove(),
                window.top.$("#loaders").remove(),
                console.log("getFA"),
                run()
            }
        })
    })
}
function fadeThanksToCheese() {
    var e = window.top.document.createElement("div");
    e.id = "fader",
    e.style.position = "fixed",
    e.style.height = "100%",
    e.style.width = "100%",
    e.style.backgroundColor = "black",
    e.style.top = "0px",
    e.style.left = "0px",
    e.style.opacity = "0.6",
    e.style.zIndex = "12000",
    window.top.document.body.appendChild(e)
}
function openLoader() {
    var e = window.top.document.createElement("div");
    e.id = "loaders",
    e.style.position = "fixed",
    e.style.width = "24px",
    e.style.height = "24px",
    e.style.top = "50%",
    e.style.left = "50%",
    window.top.$(e).css("margin-left", "-12px"),
    window.top.$(e).css("margin-top", "-12px"),
    e.style.zIndex = 13e3,
    window.top.$(e).append(window.top.$("<img src='graphic/throbber.gif' height='24' width='24'></img>")),
    window.top.$("#contentContainer").append(window.top.$(e))
}
function makeItPretty() {
    window.top.$(".row_a").css("background-color", "rgb(216, 255, 216)"),
    window.top.$("#plunder_list tr").eq(0).remove(),
    window.top.$("#plunder_list").find("tr:gt(0)").each(function(e) {
        window.top.$(this).removeClass("row_a"),
        window.top.$(this).removeClass("row_b"),
        e % 2 == 0 ? window.top.$(this).addClass("row_a") : window.top.$(this).addClass("row_b")
    }),
    hideStuffs(),
    console.log("makeItPretty")
}
function hideStuffs() {
    window.top.$("#plunder_list").hide(),
    window.top.$("#plunder_list_nav").hide(),
    window.top.$("#contentContainer").find('div[class="vis"]').eq(0).children().eq(0).append(window.top.$("<div class='vis' style='float:right;text-align:center;line-height:100%;width:12px;height:12px;margin:0px 0px 0px 0px;position:relative;background-color:tan;opacity:.7'><a href='#' num='0' onclick='uglyHider(window.top.$(this));return false;'>+</a></div>")),
    window.top.$("#contentContainer").find('div[class="vis"]').eq(0).children().eq(1).hide(),
    window.top.$("#am_widget_Farm").find("h4").eq(0).append(window.top.$("<div class='vis' style='float:right;text-align:center;line-height:100%;width:12px;height:12px;margin:0px 0px 0px 0px;position:relative;background-color:tan;opacity:.7'><a href='#' num='1' onclick='uglyHider(window.top.$(this));return false;'>+</a></div>")),
    window.top.$("#plunder_list_filters").hide()
}
function uglyHider(e) {
    var t;
    t = 0 < window.top.$("#settingsBody").length ? 2 : 1,
    "+" === window.top.$(e).text() ? window.top.$(e).text("-") : window.top.$(e).text("+"),
    0 == parseInt(window.top.$(e).attr("num")) ? window.top.$("#contentContainer").find('div[class="vis"]').eq(t).children().eq(1).toggle() : 1 == parseInt(window.top.$(e).attr("num")) ? window.top.$("#plunder_list_filters").toggle() : 2 == parseInt(window.top.$(e).attr("num")) && window.top.$("#settingsBody").toggle()
}
window.top.$.getScript(scriptURL + "lib/jstorage.js", function() {
    window.top.$.getScript(scriptURL + "resources.js", function() {
        null == window.top.$.jStorage.get("language") && setDefaultLanguage(),
        window.top.$.getScript(scriptURL + "lang/" + window.top.$.jStorage.get("language") + ".js", function() {
            console.log("init"),
            checkPage()
        })
    }),
    window.top.$.getScript(scriptURL + "notify.js")
}),
window.top.$(document).off();
