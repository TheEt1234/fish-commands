import { FishPlayer } from "./players";
import { Rank } from "./ranks";

const procs={
    "400":true, //microProcessor
    "401":true, //logicProcessor
    "402":true, //hyperProcessor
}

const ActionType = Packages.mindustry.net.Administration.ActionType;
export const validateUnitBuild=()=>{ //past
    Vars.netServer.admins.addActionFilter((action:PlayerAction)=>{
        if(action.type==ActionType.configure){ // UPDATE: does NOT fire on logic build
            const player=action.player
            const tile=action.tile
            Core.app.post(()=>{ 
//explenation: the config gives you bytes, which i can't figure out how to convert to a string, so i just use this scuffed method of getting the future tile
                try{validateProcessor(tile,player)}catch(e){}
            })
            return true
        }
        return true
    })
    
    Events.on(EventType.BlockBuildEndEvent, (e)=>{
        try{
            const { breaking, tile, unit } = e;
            const block=tile.block();
            if(breaking) return;
            //@ts-ignore
            if(!procs[block.id]) return;
            if(!unit.isPlayer()) { setNetAir(tile); return }
            validateProcessor(tile, unit.player)
        } catch(e:any){
            Log.info(e)
        }
    })
}

function validateProcessor(tile:Tile,originalPlayer:mindustryPlayer){ // future
    const fishPlayer=FishPlayer.get(originalPlayer)
    const code=tile.build.code
    const includesBuild=code.includes("ucontrol build")
    if(includesBuild &&  !fishPlayer.ranksAtLeast(Rank.trusted)){
        originalPlayer.sendMessage("Hey hey, you're trying to place logic which contains unit build, you need to gain trusted to do that")
        setNetAir(tile)
    }
}

function setNetAir(tile:Tile){
    Core.app.post(()=>{tile.setNet(Blocks.air)})
}