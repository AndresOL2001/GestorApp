import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EstatusComponent } from './estatus/estatus.component';
import { HomeComponent } from './home/home.component';
import { ImportarComponent } from './importar/importar.component';

const routes: Routes = [
  {
  path:'dashboard', component:HomeComponent
  },
  {
    path:'estados',component:EstatusComponent
  },
  {
    path:'dashboard/:id',component:HomeComponent
  },
  {
    path:'importar',component:ImportarComponent
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
