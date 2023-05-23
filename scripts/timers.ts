import { FishPlayer } from "./players";
import { getStaffMessages } from './api'
import * as config from "./config";


export function initializeTimers(){
	//Autosave
	Timer.schedule(
		() => {
			const file = Vars.saveDirectory.child('1' + '.' + Vars.saveExtension);
			Core.app.post(() => {
				SaveIO.save(file);
				FishPlayer.saveAll();
				Call.sendMessage('[#4fff8f9f]Game saved.');
			});
		},
		10,
		300
	);
	//Trails
	Timer.schedule(
		() => FishPlayer.forEachPlayer(p => p.displayTrail()),
		5,
		0.15
	);
	//Staff chat
	if(!config.localDebug)
		Timer.schedule(() => {
			getStaffMessages((messages) => {
				if(messages.length) FishPlayer.messageStaff(messages);
			})
		},
		5,
		3
	);
	//Replacing blacklisting with a kick 
	//because blacklisting causes problems for administration
	Timer.schedule(
		() => { try{
				const blacklist:ObjectSet<string>=Vars.netServer.admins.dosBlacklist
				const admins=Vars.netServer.admins
				if(blacklist.isEmpty()) return;
				blacklist.forEach((b:string) => {
					const ips:ObjectSet<any>=admins.findByIPs(b)
					admins.handleKicked(ips.get(ips.size-1),b,60*1000)
					Log.info("Unblacklisted, but kicked for one minute this fella: "+b)
					blacklist.remove(b)
				});
			}catch(e:any){Log.info(e)}
		},
		3.15,
		2
	)
}