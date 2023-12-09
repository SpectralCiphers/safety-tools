import { SafetyCard } from "./SafetyCard.js";
import { SafetyCardName } from "./SafetyCardName.js";
const API = {
  showCardArr(...inAttributes) {
    if (!Array.isArray(inAttributes)) {
      console.error("Safety Tools | showCardArrArr | inAttributes must be of type array");
    }
    const [cardName] = inAttributes;
    this.showCard(cardName);
  },
  showCard(cardName) {
    console.log(`Safety Tools | Received ${cardName}`);
    // const target = <SafetyCard>this.cards.find((card: SafetyCard) => card.name === cardName);
    const cards = Object.values(SafetyCardName).map((cardName) => new SafetyCard(ui, cardName, game));
    const target = cards.find((card) => card.name === cardName);
    target?.show();
  },
};
export default API;
