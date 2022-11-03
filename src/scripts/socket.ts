import API from "./api";
import { setSocket } from "../index";
import { MODULE_NAME } from "../index";

export let safetyToolsSocket;

export function registerSocket() {
	// debug("Registered safetyToolsSocket");
	if (safetyToolsSocket) {
		return safetyToolsSocket;
	}
	//@ts-ignore
	safetyToolsSocket = socketlib.registerModule(MODULE_NAME);

	safetyToolsSocket.register("showCard", (...args) => API.showCardArr(...args));

	setSocket(safetyToolsSocket);
	return safetyToolsSocket;
}
