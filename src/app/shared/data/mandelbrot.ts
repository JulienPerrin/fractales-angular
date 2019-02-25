import { Dessin } from './dessin';
import { Coordonnees } from './coordonnees';
import { DessinInteractif } from './dessin-interactif';

const max = 100;

export class Mandelbrot extends DessinInteractif {
  public nbMaxIterations: number;

  constructor(canvas: HTMLCanvasElement, center: Coordonnees, scale: number) {
    super(canvas, center, scale);
    this.nbMaxIterations = max;
  }

  reset() {
    const ratio = 200 / this.canvas.width;
    this.canvas.width *= ratio;
    this.canvas.height *= ratio;
    this.nbMaxIterations = max;
  }

  affiche() {
    if (this.contexte) {
      const width = this.canvas.width;
      const height = this.canvas.height;

      const id = this.contexte.createImageData(1, 1); // only do this once per page
      const d = id.data; // only do this once per page
      d[0] = 0; // r
      d[1] = 0; // g
      d[2] = 0; // b
      d[3] = 255; // a: transparency, 0..255

      for (let row = 0; row < height; row++) {
        for (let col = 0; col < width; col++) {
          const iteration = this.itereZ(col, row, width, height);
          if (iteration < this.nbMaxIterations) {
            const h = iteration / this.nbMaxIterations;
            // const h = (h0 - (h_max + h_min) / 2) / (h_max - h_min) + 1 / 2;
            const s = 1;
            const b = iteration / (iteration + 8);
            // ici, on cherche à eviter d'avoir une brillance trop faible
            // const b = ((b0 - (b_max + b_min) / 2) * 0.8) / (b_max - b_min) + 1.2 / 2;
            const hsbToRgb = HSVtoRGB(h, s, b);
            d[0] = hsbToRgb.r; // r
            d[1] = hsbToRgb.g; // g
            d[2] = hsbToRgb.b; // b
          } else {
            d[0] = 0; // r
            d[1] = 0; // g
            d[2] = 0; // b
          }

          this.contexte.putImageData(id, col, row);
          // console.log(iteration);
        }
      }
      // ajoutLegende(ctx, width, height, x_mean, y_mean, scale, max);
    }

    // return [h_min, h_max, b_min, b_max, iteration_min, iteration_max];
  }

  private itereZ(col: number, row: number, width: number, height: number) {
    const cRe =
      ((this.scale / 2.0) * (col - width / 2.0) * 4.0) / width + this.center.x;
    const cIm =
      ((this.scale / 2.0) * (height / 2.0 - row) * 4.0) / width + this.center.y;
    let x = 0;
    let y = 0;
    let iteration = 0;
    while (x * x + y * y <= 4 && iteration < this.nbMaxIterations) {
      const xNew = x * x - y * y + cRe;
      y = 2 * x * y + cIm;
      x = xNew;
      iteration++;
    }
    return iteration;
  }
}

function HSVtoRGB(h, s, v) {
  let r: number;
  let g: number;
  let b: number;
  let i: number;
  let f: number;
  let p: number;
  let q: number;
  let t: number;
  if (arguments.length === 1) {
    (s = h.s), (v = h.v), (h = h.h);
  }
  i = Math.floor(h * 6);
  f = h * 6 - i;
  p = v * (1 - s);
  q = v * (1 - f * s);
  t = v * (1 - (1 - f) * s);
  switch (i % 6) {
    case 0:
      (r = v), (g = t), (b = p);
      break;
    case 1:
      (r = q), (g = v), (b = p);
      break;
    case 2:
      (r = p), (g = v), (b = t);
      break;
    case 3:
      (r = p), (g = q), (b = v);
      break;
    case 4:
      (r = t), (g = p), (b = v);
      break;
    case 5:
      (r = v), (g = p), (b = q);
      break;
  }
  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  };
}
