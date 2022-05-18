import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagesRoutingModule } from './pages-routing.module';
import { HomeComponent } from './home/home.component';
import { EstatusComponent } from './estatus/estatus.component';
import { ImportarComponent } from './importar/importar.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { NgxColorsModule } from 'ngx-colors';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [HomeComponent, EstatusComponent, ImportarComponent],
  imports: [
    CommonModule,
    PagesRoutingModule,
    ReactiveFormsModule,
    CKEditorModule,
    NgxColorsModule,
    SharedModule
    
  ],
})
export class PagesModule { }
