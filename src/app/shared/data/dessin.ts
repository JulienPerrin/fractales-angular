export abstract class Dessin {
  protected contexte: CanvasRenderingContext2D;

  constructor(public canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.contexte = canvas.getContext('2d');
    this.contexte.imageSmoothingEnabled = false;
    this.contexte.imageSmoothingQuality = 'high';
  }

  abstract affiche();

  clear(): void {
    this.contexte.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}
