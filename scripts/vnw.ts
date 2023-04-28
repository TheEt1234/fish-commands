import { Perm } from "./commands";
import { FishCommandsList } from "./types";

const cooldown:number=60


let vnwData:{
    isVoteOngoing:boolean,
    voteRequirements:number
    wavesToSkip:number,
    atOnce:boolean,
    votes:Array<Array<any>>,
    task:any

}={
    isVoteOngoing:false,
    voteRequirements:0,
    wavesToSkip:0,
    atOnce:false,
    votes:[[]],
    task:null
}

export const commands:FishCommandsList={
    svnw:{
        description:"S - start V - vote for NW - new wave, start vote for new wave",
        args:["waves_to_skip:number","at_once:boolean"],
        perm:Perm.notGriefer,
        handler({args,sender,outputFail}){
            if(vnwData.isVoteOngoing){
                outputFail("A vote is already ongoing");
                return
            }
            if(args.waves_to_skip>8||(args.waves_to_skip>3&&args.at_once)){
                outputFail(
`That's too many waves to skip 
${args.at_once?"[lightgrey]especially at once... the limit is 3 there":"[lightgrey]the limit is 8 here..."}
`);                return;
            }
            if(args.waves_to_skip<=0){
                outputFail("what")
                return;
            }
            start_vnw(sender.player,args.waves_to_skip,args.at_once)

        }
    },
    vnw:{
        description:"V - vote N - new W - wave, vote for a new wave",
        args:["yes_or_naw:boolean"],
        perm:Perm.notGriefer,
        handler({args,outputFail,sender}){
            if(!vnwData.isVoteOngoing){
                outputFail("There is no vote to vote on")
                return;
            }
            vote(sender.player,args.yes_or_naw)
        }
    }
}


function start_vnw(playerToStartTheVote:mindustryPlayer,wavesToSkip:number,atOnce:boolean){
    vnwData.isVoteOngoing=true;
    vnwData.voteRequirements=Math.floor(Groups.player.size()/2);
    vnwData.wavesToSkip=wavesToSkip;
    vnwData.atOnce=atOnce;
    vnwData.votes=[playerToStartTheVote,true]

    Call.sendMessage("[lime]Notice me![]")
    Call.sendMessage(`${getPlayerNameHowIWant(playerToStartTheVote)} has started a vote for a new wave`)
    Call.sendMessage(`${countVotes()}/${vnwData.voteRequirements} [lightgrey]vote with /vnw`)
    setupVoteTask()
}

function vote(who:mindustryPlayer,what:boolean){
    let changedOpinion=false
    for(let i=0;i<vnwData.votes.length;i++){
        const vote=vnwData.votes[i]
        if(vote[0]==who) changedOpinion=true;
        vote[1]=what;
    }
    if(!changedOpinion){
        vnwData.votes.push([who,what])
    }
    Call.sendMessage(
`${getPlayerNameHowIWant(who)} ${changedOpinion?"has changed their opinion to ":"has said"} ${what?"[lime]yes":"[scarlet]No"} for skipping ${vnwData.wavesToSkip} waves`
    )
    Call.sendMessage("[lightgrey]You can vote by doing /vnw y/n")

}

function getPlayerNameHowIWant(player:mindustryPlayer){
    return `[#${player.color}]${player.plainName()}[]`
}


function countVotes(){
    let votes=0
    for(let i=0;i<vnwData.votes.length;i++){
        const vote=vnwData.votes[i]
        if(vote){
            votes++
        }else{
            votes--
        }
    }
    return votes
}

function setupVoteTask(){
    vnwData.task=Timer.schedule(()=>{
        vnwData.isVoteOngoing=false;
        const votes=countVotes()
        Call.sendMessage("[lime]VNW ENDED")
        if(votes>=vnwData.voteRequirements){
            Call.sendMessage(`${vnwData.wavesToSkip} waves will be skipped ${vnwData.atOnce?"(at once)":0}`)
            if(vnwData.atOnce){
                for(let i=0;i<vnwData.wavesToSkip;i++){
                    Vars.logic.runWave()
                }
            }else{
                Vars.state.wave+=vnwData.wavesToSkip
            }
        }else{
            Call.sendMessage("waves won't be skipped")
        }
    },cooldown)
}