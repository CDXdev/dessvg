import { Component, OnInit, Output, EventEmitter, ViewChild} from '@angular/core';

import { DrawAreaComponent } from './draw-area/draw-area.component';

@Component({
  selector: 'app-menu-bar',
  templateUrl: './menu-bar.component.html',
  styleUrls: ['./menu-bar.component.css']
})
export class MenuBarComponent implements OnInit {

  private selectedTool: string;
  public lineProperties: { thickness: string };
  public color;
  public name: String = 'Untitled.svg';

  @ViewChild(DrawAreaComponent)
  private drawArea: DrawAreaComponent;

  constructor() { }

  ngOnInit() {
  }

  newImage(){
    this.drawArea.newImage();
    this.name = 'Untitled.svg';
  }

  save(){
    let image = document.getElementsByTagName("svg")[0].outerHTML;
    var pom = document.createElement('a');
    pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(image));
    pom.setAttribute('download', "svg.svg");

    if (document.createEvent) {
        var event = document.createEvent('MouseEvents');
        event.initEvent('click', true, true);
        pom.dispatchEvent(event);
    }
    else {
        pom.click();
    }
  }

   open() {
       document.getElementById("openFile").click();
    }

    handleFileSelect(event) {
      var reader = new FileReader();
      let file = event.target.files[0];
      reader.readAsText(file);
      this.name = file.name;

      reader.onload = function(event)
        {
            document.getElementById('imageContainer').innerHTML = reader.result;       
            
        };
    }
}