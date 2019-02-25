import {
  Component,
  OnInit,
  AfterViewInit,
  ElementRef,
  ViewChild
} from '@angular/core';
import { Mandelbrot } from '../shared/data/mandelbrot';
import { Coordonnees } from '../shared/data/coordonnees';

const scale0 = 2;
const xMean0 = 0;
const yMean0 = 0;
const realWidth = 600;

@Component({
  selector: 'app-mandelbrot',
  templateUrl: './mandelbrot.component.html',
  styleUrls: ['./mandelbrot.component.css']
})
export class MandelbrotComponent implements OnInit, AfterViewInit {
  @ViewChild('cnv') cnv: ElementRef;
  monDessinMystere: Mandelbrot;

  dragStart: boolean;
  dragged: boolean;
  lastCoordinates: Coordonnees;
  lastMouseDownLocation: Coordonnees;
  ratio: number;

  constructor() {}

  ngOnInit() {
    this.dragStart = false;
    this.dragged = false;
    const canvas = this.cnv.nativeElement;
    canvas.style.width = realWidth + 'px';
    canvas.style.height = Math.ceil(canvas.height * this.ratio) + 'px';
    this.monDessinMystere = new Mandelbrot(
      canvas,
      { x: xMean0, y: yMean0 },
      scale0
    );
    this.ratio = this.calculerRatio();
    document.body.style.webkitUserSelect = document.body.style.userSelect =
      'none';
  }

  ngAfterViewInit(): void {
    this.monDessinMystere.affiche();
  }

  dessine() {
    this.ratio = this.calculerRatio();
    this.monDessinMystere.affiche();
  }

  verouille(event: MouseEvent) {
    if (event.button === 0) {
      console.log(event);
      this.refreshIfTooMuchTimeToDraw();
      this.lastCoordinates = this.calculeCoordonnees(event);
      this.dragStart = true;
      this.dragged = false;
    }
  }
  deplace(event: MouseEvent) {
    if (this.dragStart) {
      this.dragged = true;
      this.lastMouseDownLocation = this.calculeCoordonnees(event);
      this.monDessinMystere.translate(
        this.lastMouseDownLocation.x - this.lastCoordinates.x,
        this.lastMouseDownLocation.y - this.lastCoordinates.y
      );
    }
  }
  deverouille(event: MouseEvent) {
    this.dragStart = false;
    this.dragged = false;
    // si l'on souhaite centrer la figure sur le click
    // if (!this.dragged) {
    //   this.monDessinMystere.zoom(1, this.calculeCoordonnees(event));
    // }
  }

  zoom(event: MouseEvent) {
    this.refreshIfTooMuchTimeToDraw();
    this.monDessinMystere.zoom(2, this.calculeCoordonnees(event));
  }

  handleScroll(evt: WheelEvent) {
    const delta = evt.deltaY ? -evt.deltaY / 40 : evt.detail ? -evt.detail : 0;
    if (delta) {
      this.refreshIfTooMuchTimeToDraw();
      this.monDessinMystere.zoom(delta, this.calculeCoordonnees(evt));
    }
    evt.preventDefault();
  }

  private refreshIfTooMuchTimeToDraw() {
    if (this.tooMuchTimeToDraw()) {
      this.monDessinMystere.reset();
      this.ratio = this.calculerRatio();
    }
  }

  private tooMuchTimeToDraw(): boolean {
    return this.estimateChargeTime() > 100000000;
  }

  private estimateChargeTime(): number {
    return (
      this.monDessinMystere.nbMaxIterations *
      this.monDessinMystere.canvas.width *
      this.monDessinMystere.canvas.height
    );
  }

  private calculeCoordonnees(event: MouseEvent): Coordonnees {
    const evtx =
      event.offsetX || event.pageX - this.monDessinMystere.canvas.offsetLeft;
    const evty =
      event.offsetY || event.pageY - this.monDessinMystere.canvas.offsetTop;
    const x =
      ((2 * evtx) / this.ratio / this.cnv.nativeElement.width - 1) *
        this.monDessinMystere.scale +
      this.monDessinMystere.center.x;
    const y =
      ((this.cnv.nativeElement.height - (2 * evty) / this.ratio) /
        this.cnv.nativeElement.height) *
        this.monDessinMystere.scale +
      this.monDessinMystere.center.y;
    return { x, y };
  }

  private calculerRatio(): number {
    return realWidth / this.monDessinMystere.canvas.width;
  }
}
