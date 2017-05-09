import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { ColorPickerModule } from 'ngx-color-picker';

import { AppComponent } from './app.component';
import { ImageService } from './menu-bar/draw-area/image/image.service';
import { ImageComponent } from './menu-bar/draw-area/image/image.component';
import { DrawAreaComponent } from './menu-bar/draw-area/draw-area.component';
import { ToolsBoxComponent } from './menu-bar/draw-area/tools-box/tools-box.component';
import { MenuBarComponent } from './menu-bar/menu-bar.component';

@NgModule({
  declarations: [
    AppComponent,
    ImageComponent,
    DrawAreaComponent,
    ToolsBoxComponent,
    MenuBarComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    ColorPickerModule
  ],
  providers: [ImageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
