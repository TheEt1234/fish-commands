import { FishPlayer } from "./players"
import { Rank } from "./ranks"


export function loadTracer(){
    const server=Vars.netServer
    const allPlayers=Groups.player

    Events.on(EventType.PlayerJoin,e=>{
        const player=e.player
        if(player.admin) return;
        let moderators:Array<mindustryPlayer>=[]
        Groups.player.each((p:mindustryPlayer)=>{
            if(FishPlayer.get(p).rank==Rank.mod) moderators.push(p)
        })
        for(let moderator of moderators) trace(moderator,player)
    })

}


function trace(player:mindustryPlayer,target:mindustryPlayer){
    try{
        const target_info=target.info
        const target_infos=Vars.netServer.admins.findByName(target_info.lastName)
        const target_name="[#"+target.color+"]"+target.plainName()+"[]"
        const target_names=target_info.names.map((value:string,_index:any,_array:any)=>{
            return '"'+Strings.stripColors(value)+'"'
        })+""
        player.sendMessage(`TRACE OF ${target_name}`)
        player.sendMessage(`${target_info.timesKicked} times kicked, ${target_info.timesJoined} times joined`)
        player.sendMessage(`${target_name}'s names (no colors, sepeared by ",", contained in double quotes): ${target_names}`)
        player.sendMessage(`${target_name} has changed ip addresses ${target_info.ips.size-1} times (Keep in mind it could just be a dyn ip)`)
        if(target_infos.size>0) player.sendMessage(`They've changed uuid ${target_infos.size-1} times (that screws up the trace, also it could just be their mobile account)`)
    }catch(e:any){
        Log.err(e)
        if(player.admin) player.sendMessage(e)
    }
}