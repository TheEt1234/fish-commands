// balam i'm sorry if i would accidentally torture you with my shitty codestyle
// ok update, i've tried prettify using a prettyifier and it uh kinda just... fucked up my code to a point you might as well use a minifier
// really sorry for that...
// i wouldn't be surprized if you said "screw this imma make my own votekick"
// also this isn't like... finished at all
// there are like actually broken things inside this
// tl;dr sorry balam :pleading_face:

// also balam can you like, make players have their own individual votekick cooldown, that would be really nice
import { Perm } from "./commands";
import { FishPlayer } from "./players";
import { Rank } from "./ranks";
import { FishCommandsList } from "./types";
import * as api from "./api";

const voteDelay: number = 1 * 60;
const requiredNumberOfPlayersToStartAVotekick:number=3
let votekick_info: {
	voteIsInProgress: boolean;
	target: mindustryPlayer | null;
	votekicker: mindustryPlayer | null;
	votes: Array<Array<any>>;
	voteRequirement: number;
	votekickTask:any | null
} = {
	voteIsInProgress: false,
	target: null,
	votekicker: null,
	votes: [],
	voteRequirement: 0,
	votekickTask:null
}; // balam im sorry


//balam the .plainName() is there for a reason, it ensures that people cant render their name invisible by having [black] in it for example

export const commands: FishCommandsList = {
	votekick: {
		//this command is *really* scuffed, it's to make vanilla work
		args: ["id:string"],
		description:
			"Votekicks a player **BY ID**, see votekick_name for votekick by name",
		perm: Perm.notGriefer,
		handler({ args, sender, outputSuccess, outputFail }) {
			const true_id: number = args.id.replace("#", "");
			if (!args.id.startsWith("#")) {
				outputFail('Id must start with "#", if you\'re planning to votekick by name use votekick_name \nThis was done because vanilla mindustry tries to use /votekick with an id');
				return;
			}
			if (Object.is(Number(true_id),NaN))/*checks if the number is valid */ {
				outputFail("The id isn't a number");
				return;
			}

			const target: mindustryPlayer = Groups.player.getByID(true_id);
			if (target == null) {
				outputFail("That player does not exist");
				return;
			}

            check_if_votekick_valid_and_votekick(target,sender.player,outputFail,outputSuccess)
		},
	},
    votekick_name:{
        args:["target:player"],
        description:"Votekicks a player by name",
        perm: Perm.notGriefer,
        handler({args,sender,outputSuccess,outputFail}){
			check_if_votekick_valid_and_votekick(args.target.player,sender.player,outputFail,outputSuccess)
        }
    },

	vote: {
		args: ["yes_or_naw:boolean"],
		description: "Allows you to vote in a votekick",
		perm: Perm.notGriefer,
		handler({ args, sender, outputFail }) {

			if (!votekick_info.voteIsInProgress) {
				outputFail("There is no votekick to vote in");
				return;
			}
			if(votekick_info.target==sender.player){
				outputFail("[scarlet]Can't vote on your own trial");
				return;
			}
			const playerVote: boolean = args.yes_or_naw;
			vote(sender.player, playerVote);
		},
	},

};

//balam i'm again, sorry

function vote(player: mindustryPlayer, option: boolean) {
	let changed_opinion:boolean = false;
	let changed_opinion_vote_index:number = 0;
	for (let i = 0; i < votekick_info.votes.length; i++) {
		const vote:Array<any> = votekick_info.votes[i];
		if (vote[0] == player) {
			changed_opinion = true;
			changed_opinion_vote_index = i;
		}
	}
	if (!changed_opinion) {
		votekick_info.votes.push([
			player,
			FishPlayer.get(player).ranksAtLeast(Rank.trusted),
			option,
		]);
	} else {
        if(votekick_info.votekicker==player){
            Call.sendMessage("[scarlet]VOTE CANCELED BY THE VOTEKICKER[]")
            votekick_info.voteIsInProgress=false;
			votekick_info.votekickTask.cancel();
			FishPlayer.get(votekick_info.target).free("api")
            return
        }
		votekick_info.votes[changed_opinion_vote_index][2] = option;
	}
	Call.sendMessage(
		`[#${player.color}]${player.plainName()}[] has ${
			changed_opinion
				? "[lime]changed their opinion on kicking the target and their new opinion is[]"
				: "voted"
		} ${
			option ? "[scarlet]Yes[]" : "[green]No[]"
		} on kicking ${getTargetName()} 
${countVotes()}/${votekick_info.voteRequirement}`
	);
}

function votekick(player: mindustryPlayer, target: mindustryPlayer) {
	votekick_info.voteIsInProgress = true;
	votekick_info.votekicker = player;
	votekick_info.target = target;
	votekick_info.votes = [
		[player, FishPlayer.get(player).ranksAtLeast(Rank.trusted), true],
	];
	votekick_info.voteRequirement = Math.floor(Groups.player.size() / 2);
	Call.sendMessage(
		`--[scarlet] NOTICE ME[] -- 
[#${player.color}]${player.plainName()}[] **started a votekick** on [#${target.color}]${target.plainName()}[]
${countVotes()}/${votekick_info.voteRequirement} [lightgrey](trusted people contribute 2 votes to the votekick)[]
`
	);
    timedStop(FishPlayer.get(votekick_info.target),voteDelay)
    make_result_anouncer()

}

function countVotes() {
	let voteAmount: number = 0;
	for (let i: number = 0; i < votekick_info.votes.length; i++) {
		const vote = votekick_info.votes[i];
		const trusted = vote[1];
		const yes_i_want_to_votekick = vote[2];
		const votekickPower = trusted ? 2 : 1;
		if (yes_i_want_to_votekick) voteAmount += votekickPower;
		else voteAmount -= votekickPower;
	}
	return voteAmount;
}

function getTargetName() {
	return `[#${votekick_info.target.color}]${votekick_info.target.plainName()}[]`;
}

function make_result_anouncer(){
	votekick_info.votekickTask=Timer.schedule(() => {
		Call.sendMessage(`VOTEKICK RESULTS:\n ${countVotes()}/${votekick_info.voteRequirement}`);
		if (countVotes() >= votekick_info.voteRequirement) {
			Call.sendMessage(`${getTargetName()} will be stopped for 60 minutes`);
            timedStop(FishPlayer.get(votekick_info.target),60*60)
		} else {
			Call.sendMessage(`${getTargetName()} won't be stopped`);
		}
		votekick_info.voteIsInProgress = false;

	}, voteDelay);
}

function timedStop(player:FishPlayer,seconds:number){
    player.stop("api")
    player.player.sendMessage("You've been stopped for "+seconds+" seconds")
    Timer.schedule(()=>{
        player.free("api")
		api.free(player.uuid) 
    },seconds)
}

function check_if_votekick_valid_and_votekick(target:mindustryPlayer,votekicker:mindustryPlayer,outputFail:any,outputSuccess:any){

	if(target==votekicker){
		outputSuccess("Sucesfully kicked yourself! Didn't even have to ask");votekicker.kick("Sucesfully kicked yourself! Didn't even have to ask!",0);return
	}

	const staff_is_there: mindustryPlayer = Groups.player.some(
		(p: mindustryPlayer) => p.admin && !FishPlayer.get(p).afk
	);

	if (staff_is_there != null) {
		outputFail("Staff is here, go ask them to stop that griefer");
		return;
	}

	const targetP:FishPlayer=FishPlayer.get(target)
	if(targetP.stopped){
		outputFail("They are already a griefer..");
		return;
	}
	if(Groups.player.size()<requiredNumberOfPlayersToStartAVotekick){
		outputFail("At least 3 players are required to start a votekick, if a griefer is here use [blue]/discord[]");
		return;
	}

	if(targetP.canModerate(FishPlayer.get(votekicker),true)) {outputFail("Do you seriously think that would work..");return}
	if (votekick_info.voteIsInProgress) {
		outputFail("There is a votekick in progress");
		return;
	}
	votekick(votekicker,target)

}