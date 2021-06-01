export class SafetyToolsLayer extends CanvasLayer {
  public constructor() {
    super();
    console.log('Safety Tools | Loaded into canvas');
  }

  public activate(): void {
    super.activate();
    console.log('Safety Tools | Activated');
  }

  public deactivate(): void {
    super.deactivate();
    console.log('Safety Tools | Deactivated');
  }

  public async draw(): Promise<void> {
    await super.draw();
    console.log('Safety Tools | Drawing');
  }

  public tearDown(): void {
    super.tearDown();
    console.log('Safety Tools | Tearing down!');
  }
}