"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerConsole = exports.register = exports.fail = exports.formatArg = exports.Perm = exports.consoleCommandList = exports.commandList = exports.allCommands = void 0;
var menus_1 = require("./menus");
var players_1 = require("./players");
var ranks_1 = require("./ranks");
var utils_1 = require("./utils");
exports.allCommands = {};
var commandArgTypes = ["string", "number", "boolean", "player", "menuPlayer", "team", "time"];
/** Use this to get the correct type for command lists. */
var commandList = function (list) { return list; };
exports.commandList = commandList;
/** Use this to get the correct type for command lists. */
var consoleCommandList = function (list) { return list; };
exports.consoleCommandList = consoleCommandList;
/** Represents a permission that is required to do something. */
var Perm = /** @class */ (function () {
    function Perm(name, check, color, unauthorizedMessage) {
        if (color === void 0) { color = ""; }
        if (unauthorizedMessage === void 0) { unauthorizedMessage = "You do not have the required permission (".concat(name, ") to execute this command"); }
        this.name = name;
        this.check = check;
        this.color = color;
        this.unauthorizedMessage = unauthorizedMessage;
    }
    Perm.fromRank = function (rank) {
        return new Perm(rank.name, function (fishP) { return fishP.ranksAtLeast(rank); }, rank.color);
    };
    Perm.none = new Perm("all", function (fishP) { return true; }, "[sky]");
    Perm.mod = Perm.fromRank(ranks_1.Rank.mod);
    Perm.admin = Perm.fromRank(ranks_1.Rank.admin);
    Perm.member = new Perm("member", function (fishP) { return fishP.hasFlag("member") && !fishP.marked(); }, "[pink]", "You must have a [scarlet]Fish Membership[yellow] to use this command. Subscribe on the [sky]/discord[yellow]!");
    Perm.chat = new Perm("chat", function (fishP) { return (!fishP.muted && !fishP.autoflagged) || fishP.ranksAtLeast(ranks_1.Rank.mod); });
    Perm.bypassChatFilter = new Perm("bypassChatFilter", function (fishP) { return fishP.ranksAtLeast(ranks_1.Rank.admin); });
    Perm.seeMutedMessages = new Perm("seeMutedMessages", function (fishP) { return fishP.muted || fishP.autoflagged || fishP.ranksAtLeast(ranks_1.Rank.mod); });
    Perm.play = new Perm("play", function (fishP) { return (!fishP.marked() && !fishP.autoflagged) || fishP.ranksAtLeast(ranks_1.Rank.mod); });
    Perm.seeErrorMessages = new Perm("seeErrorMessages", function (fishP) { return fishP.ranksAtLeast(ranks_1.Rank.admin); });
    Perm.blockTrolling = new Perm("blockTrolling", function (fishP) { return fishP.rank === ranks_1.Rank.pi; });
    Perm.bulkLabelPacket = new Perm("bulkLabelPacket", function (fishP) { return fishP.ranksAtLeast(ranks_1.Rank.mod); });
    Perm.bypassVoteFreeze = new Perm("bypassVoteFreeze", function (fishP) { return fishP.ranksAtLeast(ranks_1.Rank.trusted); });
    Perm.changeTeam = new Perm("changeTeam", function (fishP) {
        return Vars.state.rules.mode().name() === "sandbox" ? fishP.ranksAtLeast(ranks_1.Rank.trusted)
            : Vars.state.rules.mode().name() === "attack" ? fishP.ranksAtLeast(ranks_1.Rank.admin)
                : Vars.state.rules.mode().name() === "pvp" ? fishP.ranksAtLeast(ranks_1.Rank.mod)
                    : fishP.ranksAtLeast(ranks_1.Rank.admin);
    });
    return Perm;
}());
exports.Perm = Perm;
/**Takes an arg string, like `reason:string?` and converts it to a CommandArg. */
function processArgString(str) {
    //this was copypasted from mlogx haha
    var matchResult = str.match(/(\w+):(\w+)(\?)?/);
    if (!matchResult) {
        throw new Error("Bad arg string ".concat(str, ": does not match pattern word:word(?)"));
    }
    var _a = __read(matchResult, 4), name = _a[1], type = _a[2], isOptional = _a[3];
    if (commandArgTypes.includes(type)) {
        return { name: name, type: type, isOptional: !!isOptional };
    }
    else {
        throw new Error("Bad arg string ".concat(str, ": invalid type ").concat(type));
    }
}
function formatArg(a) {
    var isOptional = a.at(-1) == "?";
    var brackets = isOptional ? ["[", "]"] : ["<", ">"];
    return brackets[0] + a.split(":")[0] + brackets[1];
}
exports.formatArg = formatArg;
/** Joins multi-word arguments that have been groups with quotes. Ex: turns [`"a`, `b"`] into [`a b`]*/
function joinArgs(rawArgs) {
    var e_1, _a;
    var outputArgs = [];
    var groupedArg = null;
    try {
        for (var rawArgs_1 = __values(rawArgs), rawArgs_1_1 = rawArgs_1.next(); !rawArgs_1_1.done; rawArgs_1_1 = rawArgs_1.next()) {
            var arg = rawArgs_1_1.value;
            if (arg.startsWith("\"") && groupedArg == null) {
                groupedArg = [];
            }
            if (groupedArg) {
                groupedArg.push(arg);
                if (arg.endsWith("\"")) {
                    outputArgs.push(groupedArg.join(" ").slice(1, -1));
                    groupedArg = null;
                }
            }
            else {
                outputArgs.push(arg);
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (rawArgs_1_1 && !rawArgs_1_1.done && (_a = rawArgs_1.return)) _a.call(rawArgs_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    if (groupedArg != null) {
        //return `Unterminated string literal.`;
        outputArgs.push(groupedArg.join(" "));
    }
    return outputArgs;
}
/**Takes a list of joined args passed to the command, and processes it, turning it into a kwargs style object. */
function processArgs(args, processedCmdArgs, allowMenus) {
    var e_2, _a;
    if (allowMenus === void 0) { allowMenus = true; }
    var outputArgs = {};
    var unresolvedArgs = [];
    try {
        for (var _b = __values(processedCmdArgs.entries()), _c = _b.next(); !_c.done; _c = _b.next()) {
            var _d = __read(_c.value, 2), i = _d[0], cmdArg = _d[1];
            if (!(i in args) || args[i] === "") {
                //if the arg was not provided or it was empty
                if (cmdArg.isOptional) {
                    outputArgs[cmdArg.name] = null;
                }
                else if (cmdArg.type == "player" && allowMenus) {
                    outputArgs[cmdArg.name] = null;
                    unresolvedArgs.push(cmdArg);
                }
                else
                    return { error: "No value specified for arg ".concat(cmdArg.name, ". Did you type two spaces instead of one?") };
                continue;
            }
            //Deserialize the arg
            switch (cmdArg.type) {
                case "player":
                    var output = players_1.FishPlayer.getOneByString(args[i]);
                    if (output == "none")
                        return { error: "Player \"".concat(args[i], "\" not found.") };
                    else if (output == "multiple")
                        return { error: "Name \"".concat(args[i], "\" could refer to more than one player.") };
                    outputArgs[cmdArg.name] = output;
                    break;
                case "menuPlayer":
                    return { error: "menuPlayer argtype is not yet implemented" };
                    break;
                case "team":
                    var team = (0, utils_1.getTeam)(args[i]);
                    if (team == null)
                        return { error: "\"".concat(args[i], "\" is not a valid team name.") };
                    outputArgs[cmdArg.name] = team;
                    break;
                case "number":
                    var number = parseInt(args[i]);
                    if (isNaN(number))
                        return { error: "Invalid number \"".concat(args[i], "\"") };
                    outputArgs[cmdArg.name] = number;
                    break;
                case "time":
                    var milliseconds = (0, utils_1.parseTimeString)(args[i]);
                    if (milliseconds == null)
                        return { error: "Invalid time string \"".concat(args[i], "\"") };
                    outputArgs[cmdArg.name] = milliseconds;
                    break;
                case "string":
                    outputArgs[cmdArg.name] = args[i];
                    break;
                case "boolean":
                    switch (args[i].toLowerCase()) {
                        case "true":
                        case "yes":
                        case "yeah":
                        case "ya":
                        case "ye":
                        case "t":
                        case "y":
                        case "1":
                            outputArgs[cmdArg.name] = true;
                            break;
                        case "false":
                        case "no":
                        case "nah":
                        case "nay":
                        case "nope":
                        case "f":
                        case "n":
                        case "0":
                            outputArgs[cmdArg.name] = false;
                            break;
                        default: return { error: "Argument ".concat(args[i], " is not a boolean. Try \"true\" or \"false\".") };
                    }
                    break;
            }
        }
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_2) throw e_2.error; }
    }
    return { processedArgs: outputArgs, unresolvedArgs: unresolvedArgs };
}
function outputFail(message, sender) {
    sender.sendMessage("[scarlet]\u26A0 [yellow]".concat(message));
}
function outputSuccess(message, sender) {
    sender.sendMessage("[#48e076]\u2714 ".concat(message));
}
function outputMessage(message, sender) {
    sender.sendMessage(message);
}
var CommandError = (function () { });
Object.setPrototypeOf(CommandError.prototype, Error.prototype);
//Shenanigans necessary due to odd behavior of Typescript's compiled error subclass
function fail(message) {
    var err = new Error(message);
    Object.setPrototypeOf(err, CommandError.prototype);
    throw err;
}
exports.fail = fail;
/**Converts the CommandArg[] to the format accepted by Arc CommandHandler */
function convertArgs(processedCmdArgs, allowMenus) {
    return processedCmdArgs.map(function (arg, index, array) {
        var isOptional = (arg.isOptional || (arg.type == "player" && allowMenus)) && !array.slice(index + 1).some(function (c) { return !c.isOptional; });
        var brackets = isOptional ? ["[", "]"] : ["<", ">"];
        //if the arg is a string and last argument, make it variadic (so if `/warn player a b c d` is run, the last arg is "a b c d" not "a")
        return brackets[0] + arg.name + (["player", "string"].includes(arg.type) && index + 1 == array.length ? "..." : "") + brackets[1];
    }).join(" ");
}
/**
 * Registers all commands in a list to a client command handler.
 **/
function register(commands, clientHandler, serverHandler) {
    var e_3, _a;
    var _loop_1 = function (name, data) {
        //Process the args
        var processedCmdArgs = data.args.map(processArgString);
        clientHandler.removeCommand(name); //The function silently fails if the argument doesn't exist so this is safe
        clientHandler.register(name, convertArgs(processedCmdArgs, true), data.description, new Packages.arc.util.CommandHandler.CommandRunner({ accept: function (unjoinedRawArgs, sender) {
                var _a;
                var fishSender = players_1.FishPlayer.get(sender);
                //Verify authorization
                //as a bonus, this crashes if data.perm is undefined
                if (!data.perm.check(fishSender)) {
                    outputFail((_a = data.customUnauthorizedMessage) !== null && _a !== void 0 ? _a : data.perm.unauthorizedMessage, sender);
                    return;
                }
                //closure over processedCmdArgs, should be fine
                //Process the args
                var rawArgs = joinArgs(unjoinedRawArgs);
                var output = processArgs(rawArgs, processedCmdArgs);
                if ("error" in output) {
                    //if args are invalid
                    outputFail(output.error, sender);
                    return;
                }
                //Recursively resolve unresolved args (such as players that need to be determined through a menu)
                resolveArgsRecursive(output.processedArgs, output.unresolvedArgs, fishSender, function () {
                    //Run the command handler
                    try {
                        data.handler({
                            rawArgs: rawArgs,
                            args: output.processedArgs,
                            sender: fishSender,
                            outputFail: function (message) { return outputFail(message, sender); },
                            outputSuccess: function (message) { return outputSuccess(message, sender); },
                            output: function (message) { return outputMessage(message, sender); },
                            execServer: function (command) { return serverHandler.handleMessage(command); },
                            allCommands: exports.allCommands
                        });
                    }
                    catch (err) {
                        if (err instanceof CommandError) {
                            //If the error is a command error, then just outputFail
                            outputFail(err.message, sender);
                        }
                        else {
                            sender.sendMessage("[scarlet]\u274C An error occurred while executing the command!");
                            if (fishSender.hasPerm("seeErrorMessages"))
                                sender.sendMessage(err.toString());
                        }
                    }
                });
            } }));
        exports.allCommands[name] = data;
    };
    try {
        for (var _b = __values(Object.entries(commands)), _c = _b.next(); !_c.done; _c = _b.next()) {
            var _d = __read(_c.value, 2), name = _d[0], data = _d[1];
            _loop_1(name, data);
        }
    }
    catch (e_3_1) { e_3 = { error: e_3_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_3) throw e_3.error; }
    }
}
exports.register = register;
function registerConsole(commands, serverHandler) {
    var e_4, _a;
    var _loop_2 = function (name, data) {
        //Cursed for of loop due to lack of object.entries
        //Process the args
        var processedCmdArgs = data.args.map(processArgString);
        serverHandler.removeCommand(name); //The function silently fails if the argument doesn't exist so this is safe
        serverHandler.register(name, convertArgs(processedCmdArgs, false), data.description, new Packages.arc.util.CommandHandler.CommandRunner({ accept: function (rawArgs) {
                //closure over processedCmdArgs, should be fine
                //Process the args
                var output = processArgs(rawArgs, processedCmdArgs, false);
                if ("error" in output) {
                    //ifargs are invalid
                    Log.warn(output.error);
                    return;
                }
                try {
                    data.handler({
                        rawArgs: rawArgs,
                        args: output.processedArgs,
                        outputFail: function (message) { return Log.err("".concat(message)); },
                        outputSuccess: function (message) { return Log.info("".concat(message)); },
                        output: function (message) { return Log.info(message); },
                        execServer: function (command) { return serverHandler.handleMessage(command); },
                    });
                }
                catch (err) {
                    if (err instanceof CommandError) {
                        Log.warn("\u26A0 ".concat(err.message));
                    }
                    else {
                        Log.err("&lrAn error occured while executing the command!&fr");
                        Log.err(err);
                    }
                }
            } }));
    };
    try {
        for (var _b = __values(Object.entries(commands)), _c = _b.next(); !_c.done; _c = _b.next()) {
            var _d = __read(_c.value, 2), name = _d[0], data = _d[1];
            _loop_2(name, data);
        }
    }
    catch (e_4_1) { e_4 = { error: e_4_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_4) throw e_4.error; }
    }
}
exports.registerConsole = registerConsole;
/**Recursively resolves args. This function is necessary to handle cases such as a command that accepts multiple players that all need to be selected through menus. */
function resolveArgsRecursive(processedArgs, unresolvedArgs, sender, callback) {
    if (unresolvedArgs.length == 0) {
        callback(processedArgs);
    }
    else {
        var argToResolve_1 = unresolvedArgs.shift();
        var optionsList_1 = [];
        //TODO Dubious implementation
        switch (argToResolve_1.type) {
            case "player":
                Groups.player.each(function (player) { return optionsList_1.push(player); });
                break;
            default: throw new Error("Unable to resolve arg of type ".concat(argToResolve_1.type));
        }
        (0, menus_1.menu)("Select a player", "Select a player for the argument \"".concat(argToResolve_1.name, "\""), optionsList_1, sender, function (_a) {
            var option = _a.option;
            processedArgs[argToResolve_1.name] = players_1.FishPlayer.get(option);
            resolveArgsRecursive(processedArgs, unresolvedArgs, sender, callback);
        }, true, function (player) { return player.name; });
    }
}
