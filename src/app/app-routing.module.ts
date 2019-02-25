import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MandelbrotComponent } from './mandelbrot/mandelbrot.component';
import { SierpinskyComponent } from './sierpinsky/sierpinsky.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';

const routes: Routes = [
  { path: 'sierpinsky', component: SierpinskyComponent },
  { path: 'mandelbrot', component: MandelbrotComponent },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
  { path: '**', redirectTo: 'sierpinsky' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
