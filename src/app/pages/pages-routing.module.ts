import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EstatusComponent } from './estatus/estatus.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  {
  path:'dashboard', component:HomeComponent
  },
  {
    path:'estados',component:EstatusComponent
  },
  {
    path:'**',redirectTo:'dashboard'
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
