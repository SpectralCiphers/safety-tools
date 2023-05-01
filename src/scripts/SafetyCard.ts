import { CARD_ICON_CLASSES, SafetyCardViewOptions } from "../index";
import type { SafetyCardName } from "./SafetyCardName";
import { SafetyCardWindow } from "./SafetyCardWindow";
import CONSTANTS from "./constants";
import { safetyToolsSocket } from "./socket";

export class SafetyCard implements SceneControlToolNoToggle {
	public readonly name: SafetyCardName;
	public readonly title: string;
	public icon: string;
	public readonly button: boolean;
	public visible: boolean;
	private viewOption: SafetyCardViewOptions;
	private readonly window: SafetyCardWindow;
	private readonly game: Game;
	private gmOnly: boolean;

	public readonly onClick = async (): Promise<void> => {
		console.log(`Safety Tools | Handle click on ${this.name}`);
		//this.game.socket.emit(EVENT_KEY, {card: this.name});
		//@ts-ignore
		safetyToolsSocket.executeForEveryone("showCard", this.name);
		// await this.show();
	};

	public constructor(ui: { controls?: SceneControls }, name: SafetyCardName, game: Game) {
		this.game = game;
		this.gmOnly = (this.game.settings.get(CONSTANTS.MODULE_NAME, "GMOnly") as Boolean).valueOf();
		const cardName = this.game.i18n.localize(`${CONSTANTS.MODULE_NAME}.Cards.${name}.Name`);
		const cardDescription = this.game.i18n.localize(`${CONSTANTS.MODULE_NAME}.Cards.${name}.Description`);

		this.name = name;
		this.title = cardDescription;
		this.button = true;
		this.window = new SafetyCardWindow(cardName, cardDescription);

		const settingName = `${this.name}CardType`;
		// game.settings.register(MODULE_NAME, settingName, {
		// 	name: `${CONSTANTS.MODULE_NAME}.Settings.${settingName}.Name`,
		// 	hint: `${CONSTANTS.MODULE_NAME}.Settings.${settingName}.Hint`,
		// 	scope: "world",
		// 	config: true,
		// 	type: String,
		// 	choices: {
		// 		[SafetyCardViewOptions.Disabled]: "${CONSTANTS.MODULE_NAME}.SettingsValue.Disabled",
		// 		[SafetyCardViewOptions.ShowAsText]: "${CONSTANTS.MODULE_NAME}.SettingsValue.ShowAsText",
		// 		[SafetyCardViewOptions.ShowAsIcon]: "${CONSTANTS.MODULE_NAME}.SettingsValue.ShowAsIcon",
		// 	},
		// 	default: SafetyCardViewOptions.ShowAsIcon,
		// 	onChange: (newValue: SafetyCardViewOptions): void => {
		// 		this.viewOption = newValue;
		// 		this.updateIcon();
		// 		ui?.controls?.render(true);
		// 	},
		// });
		this.viewOption = game.settings.get(CONSTANTS.MODULE_NAME, settingName) as SafetyCardViewOptions;
		this.updateIcon();
	}

	private updateIcon = () => {
		if (this.viewOption === SafetyCardViewOptions.Disabled) {
			this.visible = false;
			void this.window.close();
			return;
		}
		this.visible = true;
		this.icon = CARD_ICON_CLASSES[this.name][this.viewOption];
		this.window.icon = this.icon;
		this.window.render(false);
	};

	public show = async (): Promise<void> => {
		// Do not show the card if the GM-only setting is set and the user is not
		// a GM/Assistant
		if (this.gmOnly && !this.game.user?.isGM) {
			return;
		}
		console.log(`Safety Tools | Showing ${this.name}`);
		const sound = this.game.settings?.get(CONSTANTS.MODULE_NAME, `${this.name}CardSound`) as string;
		if (sound) {
			console.log(`Safety Tools | Playing ${sound}`);
			AudioHelper.play({ src: sound, loop: false, autoplay: true });
		}
		this.window.render(true, { focus: true });
	};

	public setGmOnly = (gmOnly: boolean): void => {
		this.gmOnly = gmOnly;
		if (this.gmOnly && !this.game.user?.isGM) {
			void this.window.close();
		}
	};
}
