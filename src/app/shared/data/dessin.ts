export abstract class Dessin {
  protected contexte: CanvasRenderingContext2D;

  constructor(public canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const contexte = canvas.getContext('2d');
    this.contexte = contexte;
  }

  abstract affiche();

  clear(): void {
    this.contexte.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}
