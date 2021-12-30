import {SafetyToolsLayer} from "./SafetyToolsLayer.js";
import {CardName} from "./CardName.js";

const MODULE_NAME = 'safety-tools';
const EVENT_KEY = `module.${MODULE_NAME}`;

interface SafetyCardEvent {
  readonly card: CardName;
}

enum CardViewOptions {
  Disabled = 'Disabled',
  ShowAsIcon = 'ShowAsIcon',
  ShowAsText = 'ShowAsText',
}

const CARD_ICON_CLASSES: Record<CardName, { ShowAsIcon: string, ShowAsText: string }> = {
  [CardName.X]: {
    [CardViewOptions.ShowAsIcon]: 'fas fa-hand-paper',
    [CardViewOptions.ShowAsText]: 'x-card',
  },
  [CardName.O]: {
    [CardViewOptions.ShowAsIcon]: 'fas fa-thumbs-up',
    [CardViewOptions.ShowAsText]: 'o-card',
  },
  [CardName.N]: {
    [CardViewOptions.ShowAsIcon]: 'fas fa-exclamation-triangle',
    [CardViewOptions.ShowAsText]: 'n-card',
  },
  [CardName.Pause]: {
    [CardViewOptions.ShowAsIcon]: 'fas fa-pause',
    [CardViewOptions.ShowAsText]: 'pause-card',
  },
  [CardName.Resume]: {
    [CardViewOptions.ShowAsIcon]: 'fas fa-play',
    [CardViewOptions.ShowAsText]: 'resume-card',
  },
  [CardName.FastForward]: {
    [CardViewOptions.ShowAsIcon]: 'fas fa-forward',
    [CardViewOptions.ShowAsText]: 'fast-forward-card',
  },
  [CardName.Rewind]: {
    [CardViewOptions.ShowAsIcon]: 'fas fa-backward',
    [CardViewOptions.ShowAsText]: 'rewind-card',
  },
}

class CardWindow extends Application {
  public icon: string;
  private readonly description: string;

  public constructor(title: string,
                     description: string) {
    super({
      resizable: false,
      template: `modules/${MODULE_NAME}/templates/card.hbs`,
      title,
      height: 647,
      width: 400,
    });
    this.description = description;
  }

  readonly getData = () => {
    return {
      description: this.description,
      icon: this.icon,
    };
  }
}

class Card implements SceneControlTool {
  public readonly name: CardName;
  public readonly title: string;
  public icon: string;
  public readonly button: boolean;
  public visible: boolean;
  private viewOption: CardViewOptions;
  private readonly window: CardWindow;
  private readonly game: Game;
  private gmOnly: boolean;

  public readonly onClick = async (): Promise<void> => {
    console.log(`Safety Tools | Handle click on ${this.name}`)
    this.game.socket.emit(EVENT_KEY, {card: this.name});
    await this.show();
  }

  public constructor(ui: { controls?: SceneControls },
                     name: CardName,
                     game: Game) {
    this.game = game;
    this.gmOnly = (this.game.settings.get(MODULE_NAME, 'GMOnly') as Boolean).valueOf();
    const cardName = this.game.i18n.localize(`SAFETY_TOOLS.Cards.${name}.Name`);
    const cardDescription = this.game.i18n.localize(`SAFETY_TOOLS.Cards.${name}.Description`);

    this.name = name;
    this.title = cardDescription;
    this.button = true;
    this.window = new CardWindow(cardName, cardDescription);

    const settingName = `${this.name}CardType`;
    game.settings.register(MODULE_NAME, settingName, {
      name: `SAFETY_TOOLS.Settings.${settingName}.Name`,
      hint: `SAFETY_TOOLS.Settings.${settingName}.Hint`,
      scope: 'world',
      config: true,
      type: String,
      choices: {
        [CardViewOptions.Disabled]: 'SAFETY_TOOLS.SettingsValue.Disabled',
        [CardViewOptions.ShowAsText]: 'SAFETY_TOOLS.SettingsValue.ShowAsText',
        [CardViewOptions.ShowAsIcon]: 'SAFETY_TOOLS.SettingsValue.ShowAsIcon',
      },
      default: CardViewOptions.ShowAsIcon,
      onChange: (newValue: CardViewOptions): void => {
        this.viewOption = newValue;
        this.updateIcon();
        ui?.controls?.render(true);
      },
    });
    this.viewOption = game.settings.get(MODULE_NAME, settingName) as CardViewOptions;
    this.updateIcon();
  }

  private updateIcon = () => {
    if (this.viewOption === CardViewOptions.Disabled) {
      this.visible = false;
      void this.window.close();
      return;
    }
    this.visible = true;
    this.icon = CARD_ICON_CLASSES[this.name][this.viewOption];
    this.window.icon = this.icon;
    this.window.render(false);
  }

  public show = async (): Promise<void> => {
    // Do not show the card if the GM-only setting is set and the user is not
    // a GM/Assistant
    if (this.gmOnly && !this.game.user.isGM) {
      return;
    }
    console.log(`Safety Tools | Showing ${this.name}`)
    this.window.render(true, {focus: true});
  };

  public setGmOnly = (gmOnly: boolean): void => {
    this.gmOnly = gmOnly;
    if (this.gmOnly && !this.game.user.isGM) {
      void this.window.close();
    }
  }
}

class SafetyTools {
  private cards: Card[];

  public readonly onSetup = (): void => {
    console.log('Safety Tools | Registering layer v2');
    if (!(game instanceof Game)) {
      throw new Error('Attempt to use game global before init.');
    }
    // needed for lambda when setting up cards
    const theGame = game;
    if (theGame.data.version?.startsWith('0.8')) {
      console.log('Safety Tools | Register as version 0.8 layer');
      (CONFIG.Canvas as any).layers[MODULE_NAME] = SafetyToolsLayer;
    } else {
      console.log('Safety Tools | Register as version 9 layer');
      (CONFIG.Canvas as any).layers[MODULE_NAME] = {
        "group": "interface",
        "layerClass": SafetyToolsLayer,
      }
    }

    console.log('Safety Tools | Registering event listener');
    theGame.socket.on(EVENT_KEY, this.showCardEvent);

    theGame.settings.register(MODULE_NAME, 'GMOnly', {
      name: `SAFETY_TOOLS.Settings.GMOnly.Name`,
      hint: `SAFETY_TOOLS.Settings.GMOnly.Hint`,
      scope: 'world',
      config: true,
      type: Boolean,
      default: false,
      onChange: (newValue) => {
        this.cards.forEach((card) => {
          card.setGmOnly(newValue.valueOf());
        });
      },
    });

    console.log('Safety Tools | Generating cards');
    this.cards = Object.values(CardName).map((cardName) => new Card(ui, cardName, theGame));
  };

  private readonly showCardEvent = (event: SafetyCardEvent) => {
    console.log(`Safety Tools | Received ${event.card}`)
    const target = this.cards.find((card) => card.name === event.card);
    target?.show();
  }

  public readonly onGetSceneControlButtons = (buttons: SceneControl[]): void => {
    console.log('Safety Tools | Adding scene controls');
    const safetyToolController = {
      name: MODULE_NAME,
      title: 'SAFETY_TOOLS.Control.Title',
      activeTool: '',
      visible: true,
      tools: this.cards,
      icon: 'fas fa-hard-hat',
      layer: MODULE_NAME,
    };
    buttons.push(safetyToolController);
  };

  public readonly onReady = (): void => {
    console.log('Safety Tools | If your friends don’t dance,');
    console.log('Safety Tools | They’re no friends of mine!');
  };
}

const safetyTools = new SafetyTools();

Hooks.once('setup', safetyTools.onSetup);
Hooks.on('getSceneControlButtons', safetyTools.onGetSceneControlButtons);
Hooks.on('ready', safetyTools.onReady);
