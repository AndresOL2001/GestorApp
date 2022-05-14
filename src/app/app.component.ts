import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery/dist/jquery.min.js';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  ngOnInit(): void {
    const editor = $('.js-editor');
    editor.each(function(){
        $(this).richText({
            // text alignment
            leftAlign: false,
            centerAlign: true,
            rightAlign: false,
            justify: false,

            // lists
            ol: false,
            ul: true,

            // title
            heading: false,

            // fonts
            fonts: false,
            fontColor: false,
            fontSize: false,

            // uploads
            imageUpload: false,
            fileUpload: false,

            // media
            videoEmbed: false,

            // tables
            table: false,

            // code
            removeStyles: false,
            code: false,
        });
    });
    
  }
  title = 'GestorApp';
}
