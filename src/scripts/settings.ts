import { MODULE_NAME, SafetyCardViewOptions } from "src";
import API from "./api";
import type { SafetyCard } from "./SafetyCard";
import { SafetyCardName } from "./SafetyCardName";

// export const registerKeybindings = function(): void {

//     // Hand
//     game.keybindings.register(MODULE_NAME, "raiseHand", {
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
//     game.keybindings.register(MODULE_NAME, "xCard", {
//         name: 'X Card',
//         hint: 'This will open the X-Card.',
//         editable: [{ key: "KeyX", modifiers: []}],
//         onDown: () => {
//             if ( game.settings.get(MODULE_NAME, "xcard") ) {
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
	game.settings.registerMenu(MODULE_NAME, "resetAllSettings", {
		name: `${MODULE_NAME}.setting.reset.name`,
		hint: `${MODULE_NAME}.setting.reset.hint`,
		icon: "fas fa-coins",
		type: ResetSettingsDialog,
		restricted: true,
	});

	// =====================================================================

    game.settings.register(MODULE_NAME, "GMOnly", {
        name: `SAFETY_TOOLS.Settings.GMOnly.Name`,
        hint: `SAFETY_TOOLS.Settings.GMOnly.Hint`,
        scope: "world",
        config: true,
        type: Boolean,
        default: false,
        onChange: (newValue) => {
            this.cards.forEach((card: SafetyCard) => {
                card.setGmOnly(newValue.valueOf());
            });
        },
    });

    Object.values(SafetyCardName).map((cardName) => {
        // new SafetyCard(ui, cardName, game)
        const settingName = `${cardName}CardType`;
		game.settings.register(MODULE_NAME, settingName, {
			name: `SAFETY_TOOLS.Settings.${settingName}.Name`,
			hint: `SAFETY_TOOLS.Settings.${settingName}.Hint`,
			scope: "world",
			config: true,
			type: String,
			choices: {
				[SafetyCardViewOptions.Disabled]: "SAFETY_TOOLS.SettingsValue.Disabled",
				[SafetyCardViewOptions.ShowAsText]: "SAFETY_TOOLS.SettingsValue.ShowAsText",
				[SafetyCardViewOptions.ShowAsIcon]: "SAFETY_TOOLS.SettingsValue.ShowAsIcon",
			},
			default: SafetyCardViewOptions.ShowAsIcon,
			onChange: (newValue: SafetyCardViewOptions): void => {
				this.viewOption = newValue;
				this.updateIcon();
				ui?.controls?.render(true);
			},
		});
    });

	// ========================================================================

	game.settings.register(MODULE_NAME, "debug", {
		name: `${MODULE_NAME}.setting.debug.name`,
		hint: `${MODULE_NAME}.setting.debug.hint`,
		scope: "client",
		config: true,
		default: false,
		type: Boolean,
	});

	const settings = defaultSettings();
	for (const [settingName, settingValue] of Object.entries(settings)) {
		game.settings.register(MODULE_NAME, settingName, <any>settingValue);
	}

	// for (const [settingName, settingValue] of Object.entries(otherSettings)) {
	//     game.settings.register(MODULE_NAME, settingName, settingValue);
	// }
};

class ResetSettingsDialog extends FormApplication<FormApplicationOptions, object, any> {
	constructor(...args) {
		//@ts-ignore
		super(...args);
		//@ts-ignore
		return new Dialog({
			title: game.i18n.localize(`${MODULE_NAME}.dialogs.resetsettings.title`),
			content:
				'<p style="margin-bottom:1rem;">' +
				game.i18n.localize(`${MODULE_NAME}.dialogs.resetsettings.content`) +
				"</p>",
			buttons: {
				confirm: {
					icon: '<i class="fas fa-check"></i>',
					label: game.i18n.localize(`${MODULE_NAME}.dialogs.resetsettings.confirm`),
					callback: async () => {
						await applyDefaultSettings();
						window.location.reload();
					},
				},
				cancel: {
					icon: '<i class="fas fa-times"></i>',
					label: game.i18n.localize(`${MODULE_NAME}.dialogs.resetsettings.cancel`),
				},
			},
			default: "cancel",
		});
	}

	async _updateObject(event: Event, formData?: object): Promise<any> {
		// do nothing
	}
}

async function applyDefaultSettings() {
	const settings = defaultSettings(true);
	// for (const [name, settingData] of Object.entries(settings)) {
	//   await game.settings.set(MODULE_NAME, name, settingData.default);
	// }
	const settings2 = otherSettings(true);
	for (const [name, settingData] of Object.entries(settings2)) {
		//@ts-ignore
		await game.settings.set(MODULE_NAME, name, settingData.default);
	}
}

function defaultSettings(apply = false) {
	return {
		//
	};
}

function otherSettings(apply = false) {
	return {
		debug: {
			name: `${MODULE_NAME}.setting.debug.name`,
			hint: `${MODULE_NAME}.setting.debug.hint`,
			scope: "client",
			config: true,
			default: false,
			type: Boolean,
		},
	};
}

// export async function checkSystem() {
//   if (!SYSTEMS.DATA) {
//     if (game.settings.get(MODULE_NAME, 'systemNotFoundWarningShown')) return;

//     await game.settings.set(MODULE_NAME, 'systemNotFoundWarningShown', true);

//     return Dialog.prompt({
//       title: game.i18n.localize(`${MODULE_NAME}.dialogs.nosystemfound.title`),
//       content: dialogWarning(game.i18n.localize(`${MODULE_NAME}.dialogs.nosystemfound.content`)),
//       callback: () => {},
//     });
//   }

//   if (game.settings.get(MODULE_NAME, 'systemFound')) return;

//   game.settings.set(MODULE_NAME, 'systemFound', true);

//   if (game.settings.get(MODULE_NAME, 'systemNotFoundWarningShown')) {
//     return new Dialog({
//       title: game.i18n.localize(`${MODULE_NAME}.dialogs.systemfound.title`),
//       content: warn(game.i18n.localize(`${MODULE_NAME}.dialogs.systemfound.content`), true),
//       buttons: {
//         confirm: {
//           icon: '<i class="fas fa-check"></i>',
//           label: game.i18n.localize(`${MODULE_NAME}.dialogs.systemfound.confirm`),
//           callback: () => {
//             applyDefaultSettings();
//           },
//         },
//         cancel: {
//           icon: '<i class="fas fa-times"></i>',
//           label: game.i18n.localize('No'),
//         },
//       },
//       default: 'cancel',
//     }).render(true);
//   }

//   return applyDefaultSettings();
// }
