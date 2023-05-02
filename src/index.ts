import { SafetyToolsLayer } from "./scripts/SafetyToolsLayer.js";
import { SafetyTools } from "./scripts/SafetyTools.js";
import type API from "./scripts/api.js";
import { SafetyCardName } from "./scripts/SafetyCardName.js";
import CONSTANTS from "./scripts/constants.js";

// export const MODULE_NAME = "safety-tools";
// export const EVENT_KEY = `module.${MODULE_NAME}`;

export interface SafetyCardEvent {
	readonly card: SafetyCardName;
}

export enum SafetyCardViewOptions {
	Disabled = "Disabled",
	ShowAsIcon = "ShowAsIcon",
	ShowAsText = "ShowAsText"
}

export const CARD_ICON_CLASSES: Record<SafetyCardName, { ShowAsIcon: string; ShowAsText: string }> = {
	[SafetyCardName.X]: {
		[SafetyCardViewOptions.ShowAsIcon]: "fas fa-hand-paper",
		[SafetyCardViewOptions.ShowAsText]: "x-card"
	},
	[SafetyCardName.O]: {
		[SafetyCardViewOptions.ShowAsIcon]: "fas fa-thumbs-up",
		[SafetyCardViewOptions.ShowAsText]: "o-card"
	},
	[SafetyCardName.N]: {
		[SafetyCardViewOptions.ShowAsIcon]: "fas fa-exclamation-triangle",
		[SafetyCardViewOptions.ShowAsText]: "n-card"
	},
	[SafetyCardName.Pause]: {
		[SafetyCardViewOptions.ShowAsIcon]: "fas fa-pause",
		[SafetyCardViewOptions.ShowAsText]: "pause-card"
	},
	[SafetyCardName.Resume]: {
		[SafetyCardViewOptions.ShowAsIcon]: "fas fa-play",
		[SafetyCardViewOptions.ShowAsText]: "resume-card"
	},
	[SafetyCardName.FastForward]: {
		[SafetyCardViewOptions.ShowAsIcon]: "fas fa-forward",
		[SafetyCardViewOptions.ShowAsText]: "fast-forward-card"
	},
	[SafetyCardName.Rewind]: {
		[SafetyCardViewOptions.ShowAsIcon]: "fas fa-backward",
		[SafetyCardViewOptions.ShowAsText]: "rewind-card"
	}
};

const safetyTools = new SafetyTools();

Hooks.once("init", () => {
	safetyTools.onInit();
});
Hooks.once("setup", () => {
	safetyTools.onSetup();
});
Hooks.on("ready", () => {
	safetyTools.onReady();
});

Hooks.on("getSceneControlButtons", (buttons) => {
	safetyTools.onGetSceneControlButtons(buttons);
});

/* ------------------------------------ */
/* Other Hooks							*/
/* ------------------------------------ */

Hooks.once("devModeReady", ({ registerPackageDebugFlag }) => {
	registerPackageDebugFlag(CONSTANTS.MODULE_NAME);
});

export interface SafetyToolsModuleData {
	api: typeof API;
	socket: any;
}

/**
 * Initialization helper, to set API.
 * @param api to set to game module.
 */
export function setApi(api: typeof API): void {
	const data = game.modules.get(CONSTANTS.MODULE_NAME) as unknown as SafetyToolsModuleData;
	data.api = api;
}

/**
 * Returns the set API.
 * @returns Api from games module.
 */
export function getApi(): typeof API {
	const data = game.modules.get(CONSTANTS.MODULE_NAME) as unknown as SafetyToolsModuleData;
	return data.api;
}

/**
 * Initialization helper, to set Socket.
 * @param socket to set to game module.
 */
export function setSocket(socket: any): void {
	const data = game.modules.get(CONSTANTS.MODULE_NAME) as unknown as SafetyToolsModuleData;
	data.socket = socket;
}

/*
 * Returns the set socket.
 * @returns Socket from games module.
 */
export function getSocket() {
	const data = game.modules.get(CONSTANTS.MODULE_NAME) as unknown as SafetyToolsModuleData;
	return data.socket;
}
