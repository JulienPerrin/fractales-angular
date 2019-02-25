import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  AfterContentInit
} from '@angular/core';
import { Sierpinsky } from '../shared/data/sierpinsky';
import { Observable, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { distinctUntilChanged } from 'rxjs/operators';
import { take } from 'rxjs/operators';
import { switchMap } from 'rxjs/operators';

const realWidth = 700;
const numberOfPixels = 100;

@Component({
  selector: 'app-sierpinsky',
  templateUrl: './sierpinsky.component.html',
  styleUrls: ['./sierpinsky.component.css']
})
export class SierpinskyComponent implements OnInit, AfterContentInit {
  @ViewChild('cnv') cnv: ElementRef;
  monDessinMystere: Sierpinsky;
  monDessinMystereSub: Subscription;

  // tslint:disable-next-line:variable-name
  private _duration: number;

  modifiable: boolean;

  timeLeft: number;
  interval: NodeJS.Timer;

  startTimer() {
    this.timeLeft = Math.ceil(
      (this.monDessinMystere.interval *
        this.monDessinMystere.countNbIterations()) /
        1000
    );
    this.interval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        this.timeLeft = 0;
      }
    }, 1000);
  }

  pauseTimer() {
    clearInterval(this.interval);
  }

  ngOnInit() {
    const canvas = this.cnv.nativeElement;
    canvas.style.width = realWidth + 'px';
    this.monDessinMystere = new Sierpinsky(
      canvas,
      { rouge: 256, vert: 0, bleu: 0 },
      Math.ceil(Math.sqrt(numberOfPixels)),
      false,
      null
    );
    this._duration = NaN;
  }

  ngAfterContentInit(): void {
    this.dessine();
  }

  dessine() {
    this.monDessinMystere.clear();
    const t0 = new Date().getTime();
    this.verouille();
    this.startTimer();
    this.monDessinMystereSub = this.monDessinMystere
      .affiche()
      .pipe(take(1))
      .subscribe(
        (s: Sierpinsky) => {},
        err => console.error(err),
        () => {
          const t1 = new Date().getTime();
          this._duration = t1 - t0;
          this.deverouille();
          this.pauseTimer();
          this.timeLeft = 0;
        }
      );
  }

  verouille() {
    this.modifiable = false;
  }

  deverouille() {
    this.modifiable = true;
  }

  duration(): string {
    return `${this._duration} ms`;
  }
}
