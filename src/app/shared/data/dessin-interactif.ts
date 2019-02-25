import { Dessin } from './dessin';
import { Coordonnees } from './coordonnees';

const scaleFactor = 1.1;

export abstract class DessinInteractif extends Dessin {
  constructor(
    canvas: HTMLCanvasElement,
    public center: Coordonnees,
    public scale: number
  ) {
    super(canvas);
    this.center = center;
    this.scale = scale;
  }

  deplace(newCenter: Coordonnees) {
    this.center = newCenter;
    this.affiche();
  }

  translate(x: number, y: number) {
    this.center.x -= x;
    this.center.y -= y;
    this.affiche();
  }

  zoom(delta: number, zoomPoint: Coordonnees) {
    const multiplicateur = Math.pow(scaleFactor, -delta);
    const nouveauCentre: Coordonnees = baryCentre(
      zoomPoint,
      this.center,
      1 - multiplicateur,
      multiplicateur
    );
    this.scale *= multiplicateur;
    this.deplace(nouveauCentre);
  }
}

function baryCentre(
  a: Coordonnees,
  b: Coordonnees,
  multiplicateurA: number,
  multiplicateurB: number
): Coordonnees {
  return {
    x:
      (a.x * multiplicateurA + b.x * multiplicateurB) /
      (multiplicateurA + multiplicateurB),
    y:
      (a.y * multiplicateurA + b.y * multiplicateurB) /
      (multiplicateurA + multiplicateurB)
  };
}
