import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { PagesRoutingModule } from './pages-routing.module';
import { HomeComponent } from './home/home.component';
import { EstatusComponent } from './estatus/estatus.component';
import { ImportarComponent } from './importar/importar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { NgxColorsModule } from 'ngx-colors';
import { SharedModule } from '../shared/shared.module';
import {NgxPaginationModule} from 'ngx-pagination';
import { ExportarComponent } from './exportar/exportar.component';

@NgModule({
  declarations: [HomeComponent, EstatusComponent, ImportarComponent, ExportarComponent],
  imports: [
    CommonModule,
    PagesRoutingModule,
    ReactiveFormsModule,
    CKEditorModule,
    NgxColorsModule,
    SharedModule,
    NgxPaginationModule,
    FormsModule
    
  ],
  providers: [DatePipe]
})
export class PagesModule { }
