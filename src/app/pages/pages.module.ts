import { LOCALE_ID, NgModule } from '@angular/core';
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
import { registerLocaleData } from '@angular/common';

// importar locales
import localePy from '@angular/common/locales/es-PY';
import localePt from '@angular/common/locales/pt';
import localeEn from '@angular/common/locales/en';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import * as moment from 'moment';
moment.locale('es');
registerLocaleData(localePy, 'es');
registerLocaleData(localePt, 'pt');
registerLocaleData(localeEn, 'en')

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
    FormsModule,
    NgxDaterangepickerMd.forRoot({
      separator: ' - ',
      applyLabel: 'Aplicar',
      daysOfWeek: moment.weekdaysMin(),
      monthNames: moment.monthsShort(),
      firstDay: moment.localeData().firstDayOfWeek(),
  })

    
  ],
  providers: [DatePipe,{ provide: LOCALE_ID, useValue: 'es' }]
})
export class PagesModule { }
