//@ts-ignore
export class SafetyToolsLayer extends InteractionLayer {
  constructor() {
    super();
    console.log("Safety Tools | Loaded into canvas");
  }
  activate() {
    super.activate();
    console.log("Safety Tools | Activated");
    return this;
  }
  deactivate() {
    super.deactivate();
    console.log("Safety Tools | Deactivated");
    return this;
  }
  async draw() {
    await super.draw();
    console.log("Safety Tools | Drawing");
    return this;
  }
  async tearDown() {
    await super.tearDown();
    console.log("Safety Tools | Tearing down!");
    return this;
  }
}
