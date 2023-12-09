import CONSTANTS from "./constants.js";
export class SafetyCardWindow extends Application {
  constructor(title, description) {
    super({
      resizable: false,
      template: `modules/${CONSTANTS.MODULE_NAME}/templates/card.hbs`,
      title,
      height: 647,
      width: 400,
    });
    this.getData = () => {
      return {
        description: this.description,
        icon: this.icon,
      };
    };
    this.description = description;
  }
}
