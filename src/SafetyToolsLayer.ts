export class SafetyToolsLayer extends InteractionLayer {
  public constructor() {
    super();
    console.log('Safety Tools | Loaded into canvas');
  }

  public activate(): this {
    super.activate();
    console.log('Safety Tools | Activated');
    return this;
  }

  public deactivate(): this {
    super.deactivate();
    console.log('Safety Tools | Deactivated');
    return this;
  }

  public async draw(): Promise<this> {
    await super.draw();
    console.log('Safety Tools | Drawing');
    return this;
  }

  public async tearDown(): Promise<this> {
    await super.tearDown();
    console.log('Safety Tools | Tearing down!');
    return this;
  }
}
