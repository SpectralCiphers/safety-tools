import { registerSocket, safetyToolsSocket } from "./socket";
import { SafetyCardEvent, setApi } from "../index";
import { SafetyCard } from "./SafetyCard";
import { SafetyToolsLayer } from "./SafetyToolsLayer";
import API from "./api";
import { SafetyCardName } from "./SafetyCardName";
import { registerSettings } from "./settings";
import CONSTANTS from "./constants";

export class SafetyTools {
	private cards: SafetyCard[];

	public readonly onInit = (): void => {
		registerSettings();

		Hooks.once("socketlib.ready", registerSocket);
		// TODO not enter on socketlib.ready
		registerSocket();
	};

	public readonly onSetup = (): void => {
		console.log("Safety Tools | Registering layer v2");

		setApi(API);

		(CONFIG.Canvas as any).layers[CONSTANTS.MODULE_NAME] = {
			group: "interface",
			layerClass: SafetyToolsLayer,
		};

		// console.log("Safety Tools | Registering event listener");
		//   game.socket.on(EVENT_KEY, this.showCardEvent);

		console.log("Safety Tools | Generating cards");
		if (!this.cards) {
			this.cards = Object.values(SafetyCardName).map((cardName) => new SafetyCard(ui, cardName, game));
		}
	};

	// private readonly showCardEvent = (event: SafetyCardEvent) => {
	//   console.log(`Safety Tools | Received ${event.card}`)
	//   const target = <SafetyCard>this.cards.find((card:SafetyCard) => card.name === event.card);
	//   void target?.show();
	// }

	public readonly onGetSceneControlButtons = (buttons: SceneControl[]): void => {
		console.log("Safety Tools | Adding scene controls");

		if (!this.cards) {
			this.cards = Object.values(SafetyCardName).map((cardName) => new SafetyCard(ui, cardName, game));
		}

		const safetyToolController = {
			name: CONSTANTS.MODULE_NAME,
			title: `${CONSTANTS.MODULE_NAME}.Control.Title`,
			activeTool: "",
			visible: true,
			tools: this.cards,
			icon: "fas fa-hard-hat",
			layer: CONSTANTS.MODULE_NAME,
		};
		buttons.push(safetyToolController);
	};

	public readonly onReady = (): void => {
		console.log(`Safety Tools | If your friends don't dance,`);
		console.log(`Safety Tools | They're no friends of mine!`);
	};
}
