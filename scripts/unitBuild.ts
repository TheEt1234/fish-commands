import { FishPlayer } from "./players";
import { Rank } from "./ranks";


const ActionType = Packages.mindustry.net.Administration.ActionType;
export const validateUnitBuild=()=>{ //past
    Vars.netServer.admins.addActionFilter((action:PlayerAction)=>{
        if(action.type==ActionType.configure){ //fires on logic build too
            const player=action.player
            const tile=action.tile
            Core.app.post(()=>{ 
//explenation: the config gives you bullshit bytes, which i can't figure out how to convert to a string, so i just use this scuffed method of getting the future tile
                try{validateProcessor(tile,player)}catch(e){}
            })
            return true
        }
        return true
    })
}

function validateProcessor(tile:Tile,originalPlayer:mindustryPlayer ){ // future
    const fishPlayer=FishPlayer.get(originalPlayer)
    const code=tile.build.code
    const includesBuild=code.includes("ucontrol build")
    if(includesBuild&&!fishPlayer.ranksAtLeast(Rank.trusted)){
        originalPlayer.sendMessage("Hey hey, you're trying to place logic which contains unit build, you need to gain trusted to do that")
        tile.setNet(Blocks.air)
    }
}