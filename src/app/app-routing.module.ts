import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path:'',
    loadChildren: () => import('./pages/pages.module').then(m=>m.PagesModule)
  },
 /*  {
    path:'auth',
    loadChildren: () => import('./auth/auth.module').then(m=>m.AuthModule)
  },
  {
    path:'admin',
    loadChildren: () => import('./admin/admin.module').then(m=>m.AdminModule)
   , canActivate:[AuthGuard],
  }, */
  {
    path:'**',
    redirectTo:''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
