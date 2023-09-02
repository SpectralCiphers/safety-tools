import "./scripts/SafetyToolsLayer.js";
import { SafetyTools } from "./scripts/SafetyTools.js";
import { SafetyCardName } from "./scripts/SafetyCardName.js";
import CONSTANTS from "./scripts/constants.js";
export var SafetyCardViewOptions;
(function (SafetyCardViewOptions) {
  SafetyCardViewOptions["Disabled"] = "Disabled";
  SafetyCardViewOptions["ShowAsIcon"] = "ShowAsIcon";
  SafetyCardViewOptions["ShowAsText"] = "ShowAsText";
})(SafetyCardViewOptions || (SafetyCardViewOptions = {}));
export const CARD_ICON_CLASSES = {
  [SafetyCardName.X]: {
    [SafetyCardViewOptions.ShowAsIcon]: "fas fa-hand-paper",
    [SafetyCardViewOptions.ShowAsText]: "x-card",
  },
  [SafetyCardName.O]: {
    [SafetyCardViewOptions.ShowAsIcon]: "fas fa-thumbs-up",
    [SafetyCardViewOptions.ShowAsText]: "o-card",
  },
  [SafetyCardName.N]: {
    [SafetyCardViewOptions.ShowAsIcon]: "fas fa-exclamation-triangle",
    [SafetyCardViewOptions.ShowAsText]: "n-card",
  },
  [SafetyCardName.Pause]: {
    [SafetyCardViewOptions.ShowAsIcon]: "fas fa-pause",
    [SafetyCardViewOptions.ShowAsText]: "pause-card",
  },
  [SafetyCardName.Resume]: {
    [SafetyCardViewOptions.ShowAsIcon]: "fas fa-play",
    [SafetyCardViewOptions.ShowAsText]: "resume-card",
  },
  [SafetyCardName.FastForward]: {
    [SafetyCardViewOptions.ShowAsIcon]: "fas fa-forward",
    [SafetyCardViewOptions.ShowAsText]: "fast-forward-card",
  },
  [SafetyCardName.Rewind]: {
    [SafetyCardViewOptions.ShowAsIcon]: "fas fa-backward",
    [SafetyCardViewOptions.ShowAsText]: "rewind-card",
  },
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
/**
 * Initialization helper, to set API.
 * @param api to set to game module.
 */
export function setApi(api) {
  const data = game.modules.get(CONSTANTS.MODULE_NAME);
  data.api = api;
}
/**
 * Returns the set API.
 * @returns Api from games module.
 */
export function getApi() {
  const data = game.modules.get(CONSTANTS.MODULE_NAME);
  return data.api;
}
/**
 * Initialization helper, to set Socket.
 * @param socket to set to game module.
 */
export function setSocket(socket) {
  const data = game.modules.get(CONSTANTS.MODULE_NAME);
  data.socket = socket;
}
/*
 * Returns the set socket.
 * @returns Socket from games module.
 */
export function getSocket() {
  const data = game.modules.get(CONSTANTS.MODULE_NAME);
  return data.socket;
}
