import { CARD_ICON_CLASSES, MODULE_NAME, SafetyCardViewOptions } from "../index";
import type { SafetyCardName } from "./SafetyCardName";
import { SafetyCardWindow } from "./SafetyCardWindow";
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
		this.gmOnly = (this.game.settings.get(MODULE_NAME, "GMOnly") as Boolean).valueOf();
		const cardName = this.game.i18n.localize(`SAFETY_TOOLS.Cards.${name}.Name`);
		const cardDescription = this.game.i18n.localize(`SAFETY_TOOLS.Cards.${name}.Description`);

		this.name = name;
		this.title = cardDescription;
		this.button = true;
		this.window = new SafetyCardWindow(cardName, cardDescription);

		const settingName = `${this.name}CardType`;
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
		this.viewOption = game.settings.get(MODULE_NAME, settingName) as SafetyCardViewOptions;
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
		this.window.render(true, { focus: true });
	};

	public setGmOnly = (gmOnly: boolean): void => {
		this.gmOnly = gmOnly;
		if (this.gmOnly && !this.game.user?.isGM) {
			void this.window.close();
		}
	};
}
