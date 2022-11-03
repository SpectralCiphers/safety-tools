import { registerSocket, safetyToolsSocket } from "./socket";
import { MODULE_NAME, SafetyCardEvent, setApi } from "../index";
import { SafetyCardName } from "src/scripts/SafetyCardName";
import { SafetyCard } from "./SafetyCard";
import { SafetyToolsLayer } from "./SafetyToolsLayer";
import API from "./api";

export class SafetyTools {
	private cards: SafetyCard[];

	public readonly onInit = (): void => {
		Hooks.once("socketlib.ready", registerSocket);
		// TODO not enter on socketlib.ready
		registerSocket();
	};

	public readonly onSetup = (): void => {
		console.log("Safety Tools | Registering layer v2");

		setApi(API);
		//   if (!(game instanceof Game)) {
		//     throw new Error('Attempt to use game global before init.');
		//   }
		// needed for lambda when setting up cards
		// const theGame = game;
		// if (theGame.data.version?.startsWith('0.8')) {
		//   console.log('Safety Tools | Register as version 0.8 layer');
		//   (CONFIG.Canvas as any).layers[MODULE_NAME] = SafetyToolsLayer;
		// } else {
		//   console.log('Safety Tools | Register as version 9 layer');
		//   (CONFIG.Canvas as any).layers[MODULE_NAME] = {
		//     "group": "interface",
		//     "layerClass": SafetyToolsLayer,
		//   }
		// }

		(CONFIG.Canvas as any).layers[MODULE_NAME] = {
			group: "interface",
			layerClass: SafetyToolsLayer,
		};

		console.log("Safety Tools | Registering event listener");
		//   game.socket.on(EVENT_KEY, this.showCardEvent);
		//   safetyToolsSocket.executeForEveryone("showCard", )

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

		console.log("Safety Tools | Generating cards");
		this.cards = Object.values(SafetyCardName).map((cardName) => new SafetyCard(ui, cardName, game));
	};

	// private readonly showCardEvent = (event: SafetyCardEvent) => {
	//   console.log(`Safety Tools | Received ${event.card}`)
	//   const target = <SafetyCard>this.cards.find((card:SafetyCard) => card.name === event.card);
	//   void target?.show();
	// }

	public readonly onGetSceneControlButtons = (buttons: SceneControl[]): void => {
		console.log("Safety Tools | Adding scene controls");
		const safetyToolController = {
			name: MODULE_NAME,
			title: "SAFETY_TOOLS.Control.Title",
			activeTool: "",
			visible: true,
			tools: this.cards,
			icon: "fas fa-hard-hat",
			layer: MODULE_NAME,
		};
		buttons.push(safetyToolController);
	};

	public readonly onReady = (): void => {
		console.log(`Safety Tools | If your friends don't dance,`);
		console.log(`Safety Tools | They're no friends of mine!`);
	};
}
