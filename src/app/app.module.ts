import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { APP_BASE_HREF } from '@angular/common';

import { ColorPickerModule } from 'ngx-color-picker';

import { AppComponent } from './app.component';
import { ImageComponent } from './menu-bar/draw-area/image/image.component';
import { DrawAreaComponent } from './menu-bar/draw-area/draw-area.component';
import { ToolsBoxComponent } from './menu-bar/draw-area/tools-box/tools-box.component';
import { MenuBarComponent } from './menu-bar/menu-bar.component';
import { PropertiesComponent } from './menu-bar/draw-area/properties/properties.component';

@NgModule({
  declarations: [
    AppComponent,
    ImageComponent,
    DrawAreaComponent,
    ToolsBoxComponent,
    MenuBarComponent,
    PropertiesComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    ColorPickerModule
  ],
  providers: [
    { provide: APP_BASE_HREF, useValue: '/' }
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
