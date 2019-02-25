import { Dessin } from './dessin';
import { CouleurRVB } from './couleur-rvb';

export class DessinMonocolore extends Dessin {
  constructor(canvas: HTMLCanvasElement, public couleur: CouleurRVB) {
    super(canvas);
    this.couleur = couleur;
  }

  affiche() {
    const maChaine = `rgb(${this.couleur.rouge},${this.couleur.vert},${
      this.couleur.bleu
    })`;
    this.contexte.fillStyle = maChaine;
  }

  changeCouleur(change: (min: number, max: number) => number): void {
    this.couleur.rouge = change(100, 255);
    this.couleur.vert = change(100, 255);
    this.couleur.bleu = change(100, 255);
    this.affiche();
  }
}
