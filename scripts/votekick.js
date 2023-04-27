"use strict";
// balam i'm sorry if i would accidentally torture you with my shitty codestyle
// ok update, i've tried prettify using a prettyifier and it uh kinda just... fucked up my code to a point you might as well use a minifier
// really sorry for that...
// i wouldn't be surprized if you said "screw this imma make my own votekick"
// also this isn't like... finished at all
// there are like actually broken things inside this
// tl;dr sorry balam :pleading_face:
Object.defineProperty(exports, "__esModule", { value: true });
exports.commands = void 0;
// also balam can you like, make players have their own individual votekick cooldown, that would be really nice
var commands_1 = require("./commands");
var players_1 = require("./players");
var ranks_1 = require("./ranks");
var votekick_info = {
    voteIsInProgress: false,
    target: null,
    votekicker: null,
    votes: [],
    voteRequirement: 0,
}; // balam im sorry
var voteDelay = 1 * 60;
//balam the .plainName() is there for a reason, it ensures that people cant render their name invisible by having [black] in it for example
exports.commands = {
    votekick: {
        //this command is *really* scuffed, it's to make vanilla work
        args: ["id:string"],
        description: "Votekicks a player **BY ID**, see votekick_name for votekick by name",
        perm: commands_1.Perm.notGriefer,
        handler: function (_a) {
            var args = _a.args, sender = _a.sender, outputSuccess = _a.outputSuccess, outputFail = _a.outputFail;
            var true_id = args.id.replace("#", "");
            var staff_is_there = Groups.player.find(function (p) { return p.admin && !players_1.FishPlayer.get(p).afk; });
            if (staff_is_there != null) {
                outputFail("Staff is here, go ask them to stop that griefer");
                return;
            }
            if (!args.id.startsWith("#")) {
                outputFail('Id must start with "#", if you\'re planning to votekick by name use votekick_name \nThis was done because vanilla mindustry tries to use /votekick with an id');
                return;
            }
            if (Object.is(Number(true_id), NaN)) {
                outputFail("The id isn't a number");
                return;
            }
            var target = Groups.player.getByID(true_id);
            if (target == sender.player) {
                outputSuccess("Sucesfully kicked yourself! Didn't even have to ask");
                sender.player.kick("Sucesfully kicked yourself! Didn't even have to ask!", 0);
                return;
            }
            if (target == null) {
                outputFail("That player does not exist");
                return;
            }
            if (target.griefer) {
                outputFail("They are already a griefer..");
                return;
            }
            if (players_1.FishPlayer.get(Groups.player.getByID(true_id)).canModerate(sender, true)) {
                outputFail("Do you seriously think that would work..");
                return;
            }
            if (votekick_info.voteIsInProgress) {
                outputFail("There is a votekick in progress");
                return;
            }
            votekick(sender.player, target);
        },
    },
    votekick_name: {
        args: ["target:player"],
        description: "Votekicks a player by name",
        perm: commands_1.Perm.notGriefer,
        handler: function (_a) {
            var args = _a.args, sender = _a.sender, outputSuccess = _a.outputSuccess, outputFail = _a.outputFail;
            if (args.target == sender) {
                outputSuccess("Sucesfully kicked yourself! Didn't even have to ask");
                sender.player.kick("Sucesfully kicked yourself! Didn't even have to ask!", 0);
                return;
            }
            var staff_is_there = Groups.player.find(function (p) { return p.admin && !players_1.FishPlayer.get(p).afk; });
            if (staff_is_there != null) {
                outputFail("Staff is here, go ask them to stop that griefer");
                return;
            }
            if (args.target.griefer) {
                outputFail("They are already a griefer..");
                return;
            }
            if (args.target.canModerate(sender, true)) {
                outputFail("Do you seriously think that would work..");
                return;
            }
            if (votekick_info.voteIsInProgress) {
                outputFail("There is a votekick in progress");
                return;
            }
            votekick(sender.player, args.target.player);
        }
    },
    vote: {
        args: ["yes_or_naw:boolean"],
        description: "Allows you to vote in a votekick",
        perm: commands_1.Perm.notGriefer,
        handler: function (_a) {
            var args = _a.args, sender = _a.sender, outputFail = _a.outputFail;
            if (!votekick_info.voteIsInProgress) {
                outputFail("There is no votekick to vote in");
                return;
            }
            var playerVote = args.yes_or_naw;
            vote(sender.player, playerVote);
        },
    },
};
//balam i'm again, sorry
function vote(player, option) {
    var changed_opinion = false;
    var changed_opinion_vote_index = 0;
    for (var i = 0; i < votekick_info.votes.length; i++) {
        var vote_1 = votekick_info.votes[i];
        if (vote_1[0] == player) {
            changed_opinion = true;
            changed_opinion_vote_index = i;
        }
    }
    if (!changed_opinion) {
        votekick_info.votes.push([
            player,
            players_1.FishPlayer.get(player).ranksAtLeast(ranks_1.Rank.trusted),
            option,
        ]);
    }
    else {
        if (votekick_info.votekicker == player) {
            Call.sendMessage("[scarlet]VOTE CANCELED BY THE VOTEKICKER[]");
            votekick_info.voteIsInProgress = false;
            return;
        }
        votekick_info.votes[changed_opinion_vote_index][2] = option;
    }
    Call.sendMessage("[#".concat(player.color, "]").concat(player.plainName(), "[] has ").concat(changed_opinion
        ? "changed their opinion on kicking the target and their new opinion is"
        : "voted", " ").concat(option ? "[scarlet]Yes[]" : "[green]No[]", " on kicking ").concat(getTargetName(), " \n").concat(countVotes(), "/").concat(votekick_info.voteRequirement));
}
function votekick(player, target) {
    votekick_info.voteIsInProgress = true;
    votekick_info.votekicker = player;
    votekick_info.target = target;
    votekick_info.votes = [
        [player, players_1.FishPlayer.get(player).ranksAtLeast(ranks_1.Rank.trusted), true],
    ];
    votekick_info.voteRequirement = Math.floor(Groups.player.size() / 2);
    Call.sendMessage("--[scarlet] NOTICE ME[] -- \n[#".concat(player.color, "]").concat(player.plainName(), "[] **started a votekick** on [#").concat(target.color, "]").concat(target.plainName(), "[]\n").concat(countVotes(), "/").concat(votekick_info.voteRequirement, " [lightgrey](trusted people contribute 2 votes to the votekick)[]\n"));
    timedStop(players_1.FishPlayer.get(votekick_info.target), voteDelay);
    make_result_anouncer();
}
function countVotes() {
    var voteAmount = 0;
    for (var i = 0; i < votekick_info.votes.length; i++) {
        var vote_2 = votekick_info.votes[i];
        var trusted = vote_2[1];
        var yes_i_want_to_votekick = vote_2[2];
        var votekickPower = trusted ? 2 : 1;
        if (yes_i_want_to_votekick)
            voteAmount += votekickPower;
        else
            voteAmount -= votekickPower;
    }
    return voteAmount;
}
function getTargetName() {
    return "[#".concat(votekick_info.target.color, "]").concat(votekick_info.target.plainName(), "[]");
}
function make_result_anouncer() {
    Timer.schedule(function () {
        Call.sendMessage("VOTEKICK RESULTS:\n ".concat(countVotes(), "/").concat(votekick_info.voteRequirement));
        if (countVotes() >= votekick_info.voteRequirement) {
            Call.sendMessage("".concat(getTargetName(), " will be stopped for 60 minutes"));
            timedStop(players_1.FishPlayer.get(votekick_info.target), 60 * 60);
        }
        else {
            Call.sendMessage("".concat(getTargetName(), " won't be stopped"));
        }
        votekick_info.voteIsInProgress = false;
    }, voteDelay);
}
function timedStop(player, seconds) {
    player.stop("api");
    player.player.sendMessage("You've been stopped for " + seconds + " seconds");
    Timer.schedule(function () {
        player.free("api"); // TODO: doesnt work when the player disconnects
        //Thats like, really bad though
        //could be solved with using the api free maybe?
    }, seconds);
}
