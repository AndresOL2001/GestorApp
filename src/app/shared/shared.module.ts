import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedRoutingModule } from './shared-routing.module';
import { NavComponent } from './nav/nav.component';
import { SidebarComponent } from './sidebar/sidebar.component';


@NgModule({
  declarations: [NavComponent, SidebarComponent],
  imports: [
    CommonModule,
    SharedRoutingModule
  ],
  exports:[NavComponent,SidebarComponent]
})
export class SharedModule { }
