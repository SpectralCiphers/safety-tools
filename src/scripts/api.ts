import { SafetyCard } from "./SafetyCard";
import { SafetyCardName } from "./SafetyCardName";

const API = {
	showCardArr(...inAttributes) {
		if (!Array.isArray(inAttributes)) {
			console.error("Safety Tools | showCardArrArr | inAttributes must be of type array");
		}
		const [cardName] = inAttributes;
		this.showCard(cardName);
	},

	showCard(cardName: string) {
		console.log(`Safety Tools | Received ${cardName}`);
		// const target = <SafetyCard>this.cards.find((card: SafetyCard) => card.name === cardName);
		const cards = Object.values(SafetyCardName).map((cardName) => new SafetyCard(ui, cardName, game));
		const target = <SafetyCard>cards.find((card: SafetyCard) => card.name === cardName);
		target?.show();
	},
};

export default API;
