import type { ActorData } from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs";
import type { SafetyCard } from "./SafetyCard";

const API = {
	showCardArr(...inAttributes) {
		if (!Array.isArray(inAttributes)) {
			console.error("Safety Tools | showCardArrArr | inAttributes must be of type array");
		}
		const [cardName] = inAttributes;
		this.showCard();
	},

	showCard(cardName: string) {
		console.log(`Safety Tools | Received ${cardName}`);
		const target = <SafetyCard>this.cards.find((card: SafetyCard) => card.name === cardName);
		void target?.show();
	},
};

export default API;
