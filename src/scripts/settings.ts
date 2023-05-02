import API from "./api";
import type { SafetyCard } from "./SafetyCard";
import { SafetyCardName } from "./SafetyCardName";
import CONSTANTS from "./constants";
import { SafetyCardViewOptions } from "../index";

// export const registerKeybindings = function(): void {

//     // Hand
//     game.keybindings.register(CONSTANTS.MODULE_NAME, "raiseHand", {
//         name: 'Raise Hand',
//         hint: 'Toogle Raise Hand',
//         editable: [{ key: "KeyH", modifiers: []}],
//         onDown: () => {
//             API.toggle();
//         },
//         onUp: () => {

//         },
//         restricted: false,  // Restrict this Keybinding to gamemaster only?
//         reservedModifiers: [],
//         precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL
//     });
//     // X-Card
//     game.keybindings.register(CONSTANTS.MODULE_NAME, "xCard", {
//         name: 'X Card',
//         hint: 'This will open the X-Card.',
//         editable: [{ key: "KeyX", modifiers: []}],
//         onDown: () => {
//             if ( game.settings.get(CONSTANTS.MODULE_NAME, "xcard") ) {
//                 API.showXCardDialogForEveryoneSocket();
//             }
//         },
//         onUp: () => {

//         },
//         restricted: false,  // Restrict this Keybinding to gamemaster only?
//         reservedModifiers: [],
//         precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL
//     });
// }

export const registerSettings = function (): void {
	game.settings.registerMenu(CONSTANTS.MODULE_NAME, "resetAllSettings", {
		name: `${CONSTANTS.MODULE_NAME}.setting.reset.name`,
		hint: `${CONSTANTS.MODULE_NAME}.setting.reset.hint`,
		icon: "fas fa-coins",
		type: ResetSettingsDialog,
		restricted: true
	});

	// =====================================================================

	game.settings.register(CONSTANTS.MODULE_NAME, "GMOnly", {
		name: `${CONSTANTS.MODULE_NAME}.Settings.GMOnly.Name`,
		hint: `${CONSTANTS.MODULE_NAME}.Settings.GMOnly.Hint`,
		scope: "world",
		config: true,
		type: Boolean,
		default: false,
		onChange: (newValue) => {
			this.cards.forEach((card: SafetyCard) => {
				card.setGmOnly(newValue.valueOf());
			});
		}
	});

	Object.values(SafetyCardName).map((cardName) => {
		// new SafetyCard(ui, cardName, game)
		const settingName = `${cardName}CardType`;
		game.settings.register(CONSTANTS.MODULE_NAME, settingName, {
			name: `${CONSTANTS.MODULE_NAME}.Settings.${settingName}.Name`,
			hint: `${CONSTANTS.MODULE_NAME}.Settings.${settingName}.Hint`,
			scope: "world",
			config: true,
			type: String,
			choices: {
				[SafetyCardViewOptions.Disabled]: `${CONSTANTS.MODULE_NAME}.SettingsValue.Disabled`,
				[SafetyCardViewOptions.ShowAsText]: `${CONSTANTS.MODULE_NAME}.SettingsValue.ShowAsText`,
				[SafetyCardViewOptions.ShowAsIcon]: `${CONSTANTS.MODULE_NAME}.SettingsValue.ShowAsIcon`
			},
			default: SafetyCardViewOptions.ShowAsIcon,
			onChange: (newValue: SafetyCardViewOptions): void => {
				this.viewOption = newValue;
				this.updateIcon();
				ui?.controls?.render(true);
			}
		});
		const settingSoundName = `${cardName}CardSound`;
		game.settings.register(CONSTANTS.MODULE_NAME, settingSoundName, {
			name: `${CONSTANTS.MODULE_NAME}.Settings.${settingName}.Sound.Name`,
			hint: `${CONSTANTS.MODULE_NAME}.Settings.${settingName}.Sound.Hint`,
			scope: "world",
			config: true,
			type: String,
			// This should be constrained to audio in the filepicker, but this is
			// absent from the SettingConfig type apparently?
			// filePicker: "audio",
			default: `modules/${CONSTANTS.MODULE_NAME}/defaultSounds/alert.wav`
		});
	});

	// ========================================================================

	game.settings.register(CONSTANTS.MODULE_NAME, "debug", {
		name: `${CONSTANTS.MODULE_NAME}.setting.debug.name`,
		hint: `${CONSTANTS.MODULE_NAME}.setting.debug.hint`,
		scope: "client",
		config: true,
		default: false,
		type: Boolean
	});
};

class ResetSettingsDialog extends FormApplication<FormApplicationOptions, object, any> {
	constructor(...args) {
		//@ts-ignore
		super(...args);
		//@ts-ignore
		return new Dialog({
			title: game.i18n.localize(`${CONSTANTS.MODULE_NAME}.dialogs.resetsettings.title`),
			content:
				'<p style="margin-bottom:1rem;">' +
				game.i18n.localize(`${CONSTANTS.MODULE_NAME}.dialogs.resetsettings.content`) +
				"</p>",
			buttons: {
				confirm: {
					icon: '<i class="fas fa-check"></i>',
					label: game.i18n.localize(`${CONSTANTS.MODULE_NAME}.dialogs.resetsettings.confirm`),
					callback: async () => {
						//@ts-ignore
						for (let setting of game.settings.storage
							.get("world")
							.filter((setting) => setting.key.startsWith(`${CONSTANTS.MODULE_NAME}.`))) {
							console.log(`Reset setting '${setting.key}'`);
							await setting.delete();
						}
						//window.location.reload();
					}
				},
				cancel: {
					icon: '<i class="fas fa-times"></i>',
					label: game.i18n.localize(`${CONSTANTS.MODULE_NAME}.dialogs.resetsettings.cancel`)
				}
			},
			default: "cancel"
		});
	}

	async _updateObject(event: Event, formData?: object): Promise<any> {
		// do nothing
	}
}
