import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  ElementRef
} from '@angular/core';
import { VERSION } from '@angular/core';
import { Sierpinsky } from './shared/data/sierpinsky';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = this.ajouterVersion(VERSION.full);

  ajouterVersion(versionAngular: string): string {
    return `Ma première appli Angular ${versionAngular}`;
  }

  ngOnInit() {}
}
