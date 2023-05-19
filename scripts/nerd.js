"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nerdApocalipse = void 0;
function nerdApocalipse() {
    Events.on(EventType.PlayerChatEvent, function (e) {
        var player = e.player;
        var message = e.message;
        var nerdTriggers = message.match(/(\w\W+!)/g);
        if (nerdTriggers == null)
            return;
        var nerdTrigger = nerdTriggers.map(function (e) {
            return e.replace("!", "");
        }).map(function (e) {
            if (!Object.is(Number(e), NaN) && Number(e) <= 10000)
                return Number(e);
        });
        if (nerdTrigger.length == 0)
            return;
        if (nerdTrigger[0] == undefined)
            return;
        if (Groups.player.find(function (f) { return f.con.address == "NERD"; }))
            return;
        //@ts-ignore wow plenty of problems can be solved that way
        Timer.schedule(function () { summonNerd(nerdTrigger[0]); }, 1);
    });
}
exports.nerdApocalipse = nerdApocalipse;
function fakePlayer(name) {
    var con = Player.create();
    con.name = name;
    con.color = Color.cyan;
    con.con = extend(NetConnection, "NERD", {});
    con.con.uuid = name + "AAAABB==";
    con.add();
    Vars.netServer.connectConfirm(con);
    Events.fire(PlayerConnect(con));
    return con;
}
function impersonate(player, text) {
    NetClient.sendChatMessage(player, text);
}
function summonNerd(num) {
    var nerd = fakePlayer("NERD");
    nerd.typing = true;
    var numArr = [];
    var result = 1;
    for (var i = 1; i <= num; i++) {
        result *= i;
        numArr.push(i);
    }
    Timer.schedule(function () {
        if (numArr.length > 5) {
            numArr = numArr.slice(0, 5);
            numArr.push("...");
        }
        try {
            impersonate(nerd, "".concat(num, "! (").concat(numArr.join("×"), ") equals ").concat(result, " "));
        }
        catch (eggs) { }
        Call.playerDisconnect(nerd.id);
        nerd.remove();
    }, 1);
}
