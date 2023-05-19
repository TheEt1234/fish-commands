

export function nerdApocalipse(){
    Events.on(EventType.PlayerChatEvent,(e)=>{
        const player=e.player
        const message:String=e.message
        const nerdTriggers=message.match(/(\w\W+!)/g)
        if(nerdTriggers==null) return
        const nerdTrigger=nerdTriggers.map((e)=>{
            return e.replace("!","")
        }).map((e)=>{
            if(!Object.is(Number(e),NaN)&&Number(e)<=10000) return Number(e)
        })
        if(nerdTrigger.length==0) return;
        if(nerdTrigger[0]==undefined) return;
        if(Groups.player.find((f:mindustryPlayer)=>{return f.con.address=="NERD"})) return
        //@ts-ignore wow plenty of problems can be solved that way
        Timer.schedule(()=>{summonNerd(nerdTrigger[0])},1)

        
    
    })
}

function fakePlayer(name:String) { //this was made by smolkeys its briliant	
    let con= Player.create();

	con.name = name;
	con.color = Color.cyan;
	con.con = extend(NetConnection, "NERD", {});

	con.con.uuid = name + "AAAABB==";

	con.add();
	Vars.netServer.connectConfirm(con);

	Events.fire(PlayerConnect(con));

	return con;
}
function impersonate(player:mindustryPlayer, text:string) {
	NetClient.sendChatMessage(player, text);
}


function summonNerd(num:number){
    const nerd=fakePlayer("NERD")
    nerd.typing=true
    let numArr:any[]=[]
    let result=1
    for(let i=1;i<=num;i++){
        result*=i
        numArr.push(i)
    }
    Timer.schedule(()=>{
        if(numArr.length>5) {numArr=numArr.slice(0,5);numArr.push("...")}
        try{impersonate(nerd, `${num}! (${numArr.join("×")}) equals ${result} `)}catch(eggs){}
        Call.playerDisconnect(nerd.id)
        nerd.remove()
    },1)

}