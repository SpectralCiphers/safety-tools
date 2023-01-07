import API from "./api";
import { setSocket } from "../index";
import CONSTANTS from "./constants";

export let safetyToolsSocket;

export function registerSocket() {
	// debug("Registered safetyToolsSocket");
	if (safetyToolsSocket) {
		return safetyToolsSocket;
	}
	//@ts-ignore
	safetyToolsSocket = socketlib.registerModule(CONSTANTS.MODULE_NAME);

	safetyToolsSocket.register("showCard", (...args) => API.showCardArr(...args));

	setSocket(safetyToolsSocket);
	return safetyToolsSocket;
}
