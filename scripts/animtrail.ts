import { Perm } from "./commands";
import { FishPlayer } from "./players";
import { FishCommandsList } from "./types";
import { getColor } from "./utils";

let frame=1 //all that really matters is that it increases over time, not the value
let colorChangeSpeed=1/500
let colorPointer=0
export const startIncrementingTheFrame:Function=()=>{
    Timer.schedule(()=>{
        if(frame>10000000000) frame=0 //i dont want any problems with it becoming Infinity even though that's like... now that i think about it you probably would need years of uptime... whatever
        frame+=1/10
    },0,1/10)
}

export const commands:FishCommandsList={
    animtrail:{
        description:"A more advanced trail command",
        perm:Perm.notGriefer,
        args:["type:string?","color:string?","three_dimensions:boolean?"],
        handler({sender, args, output, outputFail, outputSuccess}){
            let extraDimensional=1
            if(args.three_dimensions) {extraDimensional=1.5}
            if(sender.trail!=null){
                sender.trail=null
                output(`Your trail has been reset`);return
            }
            if(args.type==undefined){
                output(`[yellow]
Types:
1) squareSpiral
2) spiral
3) wannaBeSquareSpiral
4) circle
5) square
[sky]
Example usage: 
- /animtrail 1 #ffffff false
- /animtrail wannaBeSquareSpiral pink false
Color can be [color/r,g,b/#hex] 
The 3d argument toggles 3d rotation (it's not real 3d of course)
[grey]Suggestions go to frog
                `);return
            }
            let color
            if(args.color!="rainbow"){
                color = args.color ? getColor(args.color) : Color.green;
                if(!(color instanceof Color)) {outputFail("That isn't a valid color\nA color can be [color/r,g,b/#hex]");return}
            }else{
                color="rainbow"
                outputSuccess("don't tell anyone lmfao")
            }
            switch (args.type) {
                case "1":
                case "squareSpiral":{
                    sender.trail={
                        type:"custom",
                        color:Color.white
                    }
                    renderTrail(sender.player,color,(i:number)=>{
                        return new Vec2(
                            Math.sin(i*Math.PI+frame)*i*8,
                            Math.cos(i*Math.PI+(frame/extraDimensional))*i*8
                        )
                    },0.5)
                    break;
                }
                case "2":
                case "spiral":{
                    sender.trail={
                        type:"custom",
                        color:Color.white
                    }
                    renderTrail(sender.player,color,(i:number)=>{
                        return new Vec2(
                            Math.sin(i+frame)*i*7,
                            Math.cos(i+(frame/extraDimensional))*i*7
                        )
                    },0.5)
                    break;
                }
                case "3":
                case "wannaBeSquareSpiral":{
                    sender.trail={
                        type:"custom",
                        color:Color.white
                    }
                    renderTrail(sender.player,color,(i:number)=>{
                        return new Vec2(
                            Math.sin(i*2.9+frame)*i*8,
                            Math.cos(i*2.9+(frame/extraDimensional))*i*8
                        )
                    },0.5)
                    break;
                }
                case "4":
                case "circle":{
                    sender.trail={
                        type:"custom",
                        color:Color.white
                    }
                    renderTrail(sender.player,color,(i:number)=>{
                        return new Vec2(
                            Math.sin(i+frame)*10*8,
                            Math.cos(i+(frame/extraDimensional))*10*8
                        )
                    },1,24)
                    break;
                }
                case "5":
                    case "square":{
                        sender.trail={
                            type:"custom",
                            color:Color.white
                        }
                        renderTrail(sender.player,color,(i:number)=>{
                            return new Vec2(
                                Math.sin(i*Math.PI+frame)*10*8,
                                Math.cos(i*Math.PI+(frame/extraDimensional))*10*8
                            )
                        },0.5,4)
                        break;
                    }
                
            
                default:{
                    outputFail("Not a valid trail type");
                    break;
                }
            }
        }
    }
}

function renderTrail(
    player: mindustryPlayer,
    color: any,
    math: Function,
    detail: number,
    size: number = 10
) {
    let start = new Vec2(0, 0);
    let end = new Vec2(0, 0);
    let playerP = new Vec2(0, 0);
    let task = Timer.schedule(() => {
            try {                   //@ts-ignore
                if (player.unit() == Nulls.unit) task.cancel();
                if (FishPlayer.get(player).trail == null) task.cancel();
                playerP.set(player.x, player.y);
                for (let i = 0; i < size; i += detail) {
                    start.set(math(i - detail)).add(playerP);
                    end.set(math(i)).add(playerP);
                    let endColor = color;
                    if (color == "rainbow") {
                        endColor = getRainbowAlready();
                    }
                    Call.effect(Fx.pointBeam, start.x, start.y, 0, endColor, end);
                }
            } catch (e: any) {
                Log.info(e);
                task.cancel();
            }
        }, 0,1 / 10
    );
    return task;
}

// this is scuffed
function getRainbow(i:number) {
    const colors:Color[] = [Color.red, Color.orange, Color.yellow, Color.green, Color.blue, Color.purple, Color.pink, Color.pink, Color.red]
    if (colors.length < i + 1) {
        return Color.black
    }
    let color:number = Math.floor(i)
    let firstColor = new Color(colors[color])
    let secondColor = new Color(colors[color + 1])
    firstColor.lerp(secondColor, i-color)

    return firstColor
}

function getRainbowAlready() {
    colorPointer += colorChangeSpeed

    let color = getRainbow(colorPointer)
    if (color == Color.black) {
        colorPointer = 0
        color = getRainbow(colorPointer)
    }
    return color
}