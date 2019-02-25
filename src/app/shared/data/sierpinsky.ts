import { DessinMonocolore } from './dessin-monocolore';
import { CouleurRVB } from './couleur-rvb';
import { Observable, Subscriber } from 'rxjs';
import { Coordonnees } from './coordonnees';
import { constructDependencies } from '@angular/core/src/di/reflective_provider';

export class Sierpinsky extends DessinMonocolore {
  private dernierPointAffiche: Coordonnees;
  constructor(
    canvas: HTMLCanvasElement,
    couleur: CouleurRVB,
    width: number,
    public async: boolean,
    public interval: number
  ) {
    super(canvas, couleur);
    this.changeWidth(width);
    this.async = async;
    this.interval = interval;
  }

  changeWidth(width: number) {
    this.canvas.width = width;
    this.canvas.height = Math.ceil((this.canvas.width * Math.sqrt(3)) / 2);
  }

  changeHeight(height: number) {
    this.canvas.height = height;
    this.canvas.width = Math.ceil((this.canvas.height / Math.sqrt(3)) * 2);
  }

  affiche(): Observable<Sierpinsky> {
    return new Observable<Sierpinsky>(observer => {
      super.affiche();
      this.drawPoints(observer);

      // tslint:disable-next-line:no-shadowed-variable
      const clear = (x: Sierpinsky) => this.clear;

      return {
        unsubscribe() {
          console.log('unsubscribe');
        }
      };
    });
  }

  private drawPoints(observer: Subscriber<Sierpinsky>) {
    this.dernierPointAffiche = { x: 230, y: 200 };
    const hauteur = Math.floor((Math.sqrt(3) * this.canvas.width) / 2);
    const coins: Coordonnees[] = [
      { x: this.canvas.width / 2, y: this.canvas.height - hauteur },
      { x: 0, y: this.canvas.height },
      { x: this.canvas.width, y: this.canvas.height }
    ];
    if (this.async) {
      this.asyncIterate(observer, coins);
    } else {
      this.iterate(observer, coins);
    }
  }

  private async asyncIterate(
    observer: Subscriber<Sierpinsky>,
    coins: Coordonnees[]
  ) {
    const n = this.countNbIterations();
    for (let i = 0; i < n; i++) {
      await this.sleep(this.interval, () => {
        this.calculateNewPoint(coins);
        this.drawPoint(i);
        if (i === n - 1) {
          observer.next(this);
          observer.complete();
        }
      });
    }
  }

  private iterate(observer: Subscriber<Sierpinsky>, coins: Coordonnees[]) {
    for (let i = 0; i < this.countNbIterations(); i++) {
      this.calculateNewPoint(coins);
      this.drawPoint(i);
      observer.next(this);
      observer.complete();
    }
  }

  private calculateNewPoint(coins: Coordonnees[]) {
    const a = Math.floor(Math.random() * 3);
    this.dernierPointAffiche.x = (this.dernierPointAffiche.x + coins[a].x) / 2;
    this.dernierPointAffiche.y = (this.dernierPointAffiche.y + coins[a].y) / 2;
  }

  private sleep(ms: number, functionToExcecute: () => void) {
    return new Promise(resolve =>
      setTimeout(() => {
        functionToExcecute();
        resolve();
      }, ms)
    );
  }

  private drawPoint(i: number) {
    this.contexte.fillRect(
      this.dernierPointAffiche.x,
      this.dernierPointAffiche.y,
      1,
      1
    );
    this.changeCouleur(random(i));
    super.affiche();
  }

  countNbIterations(): number {
    return Math.round(
      this.canvas.width *
        this.canvas.width *
        Math.sqrt(3) *
        (3 / 4) ** (Math.log(this.canvas.width) / Math.log(3))
    );
  }
}

function random(seed: number): (min: number, max: number) => number {
  return (min: number, max: number) => {
    const x = Math.sin(seed++) * 10000;
    return (max - min) * (x - Math.floor(x)) + min;
  };
}
