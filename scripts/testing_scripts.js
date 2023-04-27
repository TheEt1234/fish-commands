"use strict";
/*delete this, those are mine scripts used for testing the votekick */

function fakePlayer(name) {	
    let con = Player.create();

	con.name = name;
	con.color = Color.lime;
	con.con = extend(NetConnection, Math.random(), {});

	con.con.uuid = name + "AAAABB==";

	con.add();
	Vars.netServer.connectConfirm(con);

	Events.fire(PlayerConnect(con));

	return con;
	/*all credit for this goes to SMOLKEYS*/
}
function impersonate(player, text) {
	NetClient.sendChatMessage(player, text);
}

// "use strict";/*delete this, those are mine scripts used for testing the votekick */function fakePlayer(name) {    let con = Player.create();con.name = name;con.color = Color.lime;con.con = extend(NetConnection, Math.random(), {});con.con.uuid = name + "AAAABB==";con.add();Vars.netServer.connectConfirm(con);Events.fire(PlayerConnect(con));return con;/*all credit for this goes to SMOLKEYS*/}function impersonate(player, text) {NetClient.sendChatMessage(player, text);}