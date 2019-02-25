interface CouleurRVB {
    rouge: number;
    vert: number;
    bleu: number;
}

export class Dessin {

    constructor(protected contexte: CanvasRenderingContext2D, public couleur: CouleurRVB) {
        this.contexte = contexte;
        this.couleur = couleur;
    }

    affiche() {
        const maChaine: string = `rgb(${this.couleur.rouge}, ${this.couleur.vert}, ${this.couleur.bleu})`;
        this.contexte.fillStyle = maChaine;
    }
}

export class DessinMystere extends Dessin {
    constructor(contexte: CanvasRenderingContext2D, couleur: CouleurRVB, public angle: number) {
        super(contexte, couleur);
        this.angle = angle;
    }

    affiche() {
        let x = 230, y = 200, a: number;
        const coins =
            [{ x: 230, y: 10 }, { x: 10, y: 390 }, { x: 450, y: 390 - this.angle }];
        for (let i = 0; i < 50000; i++) {
            this.contexte.fillRect(x, y, 1, 1);
            a = Math.floor(Math.random() * 3);
            x = (x + coins[a].x) / 2;
            y = (y + coins[a].y) / 2;
        }
    }
}