"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commands = void 0;
var commands_1 = require("./commands");
var cooldown = 60;
var vnwData = {
    isVoteOngoing: false,
    voteRequirements: 0,
    wavesToSkip: 0,
    atOnce: false,
    votes: [[]],
    task: null
};
exports.commands = {
    svnw: {
        description: "S - start V - vote for NW - new wave, start vote for new wave",
        args: ["waves_to_skip:number", "at_once:boolean"],
        perm: commands_1.Perm.notGriefer,
        handler: function (_a) {
            var args = _a.args, sender = _a.sender, outputFail = _a.outputFail;
            if (vnwData.isVoteOngoing) {
                outputFail("A vote is already ongoing");
                return;
            }
            if (args.waves_to_skip > 8 || (args.waves_to_skip > 3 && args.at_once)) {
                outputFail("That's too many waves to skip \n".concat(args.at_once ? "[lightgrey]especially at once... the limit is 3 there" : "[lightgrey]the limit is 8 here...", "\n"));
                return;
            }
            if (args.waves_to_skip <= 0) {
                outputFail("what");
                return;
            }
            start_vnw(sender.player, args.waves_to_skip, args.at_once);
        }
    },
    vnw: {
        description: "V - vote N - new W - wave, vote for a new wave",
        args: ["yes_or_naw:boolean"],
        perm: commands_1.Perm.notGriefer,
        handler: function (_a) {
            var args = _a.args, outputFail = _a.outputFail, sender = _a.sender;
            if (!vnwData.isVoteOngoing) {
                outputFail("There is no vote to vote on");
                return;
            }
            vote(sender.player, args.yes_or_naw);
        }
    }
};
function start_vnw(playerToStartTheVote, wavesToSkip, atOnce) {
    vnwData.isVoteOngoing = true;
    vnwData.voteRequirements = Math.floor(Groups.player.size() / 2);
    vnwData.wavesToSkip = wavesToSkip;
    vnwData.atOnce = atOnce;
    vnwData.votes = [playerToStartTheVote, true];
    Call.sendMessage("[lime]Notice me![]");
    Call.sendMessage("".concat(getPlayerNameHowIWant(playerToStartTheVote), " has started a vote for a new wave"));
    Call.sendMessage("".concat(countVotes(), "/").concat(vnwData.voteRequirements, " [lightgrey]vote with /vnw"));
    setupVoteTask();
}
function vote(who, what) {
    var changedOpinion = false;
    for (var i = 0; i < vnwData.votes.length; i++) {
        var vote_1 = vnwData.votes[i];
        if (vote_1[0] == who)
            changedOpinion = true;
        vote_1[1] = what;
    }
    if (!changedOpinion) {
        vnwData.votes.push([who, what]);
    }
    Call.sendMessage("".concat(getPlayerNameHowIWant(who), " ").concat(changedOpinion ? "has changed their opinion to " : "has said", " ").concat(what ? "[lime]yes" : "[scarlet]No", " for skipping ").concat(vnwData.wavesToSkip, " waves"));
    Call.sendMessage("[lightgrey]You can vote by doing /vnw y/n");
}
function getPlayerNameHowIWant(player) {
    return "[#".concat(player.color, "]").concat(player.plainName(), "[]");
}
function countVotes() {
    var votes = 0;
    for (var i = 0; i < vnwData.votes.length; i++) {
        var vote_2 = vnwData.votes[i];
        if (vote_2) {
            votes++;
        }
        else {
            votes--;
        }
    }
    return votes;
}
function setupVoteTask() {
    vnwData.task = Timer.schedule(function () {
        vnwData.isVoteOngoing = false;
        var votes = countVotes();
        Call.sendMessage("[lime]VNW ENDED");
        if (votes >= vnwData.voteRequirements) {
            Call.sendMessage("".concat(vnwData.wavesToSkip, " waves will be skipped ").concat(vnwData.atOnce ? "(at once)" : 0));
            if (vnwData.atOnce) {
                for (var i = 0; i < vnwData.wavesToSkip; i++) {
                    Vars.logic.runWave();
                }
            }
            else {
                Vars.state.wave += vnwData.wavesToSkip;
            }
        }
        else {
            Call.sendMessage("waves won't be skipped");
        }
    }, cooldown);
}
