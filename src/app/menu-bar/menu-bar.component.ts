import { Component, OnInit, ViewChild } from '@angular/core';

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
  public name = 'Untitled.svg';

  public labels = { view: { showGrid: 'Hide grid' } };

  @ViewChild(DrawAreaComponent)
  private drawArea: DrawAreaComponent;

  constructor() { }

  ngOnInit() {
  }

  newImage() {
    this.drawArea.newImage();
    this.name = 'Untitled.svg';
  }

  save() {
    const image = document.getElementsByTagName('svg')[0].outerHTML;
    const pom = document.createElement('a');
    pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(image));
    pom.setAttribute('download', this.name);

    if (document.createEvent) {
      const event = document.createEvent('MouseEvents');
      event.initEvent('click', true, true);
      pom.dispatchEvent(event);
    } else {
      pom.click();
    }
  }

  xml() {
    const smoke = document.createElement('div');
    smoke.setAttribute('style', 'z-index:2;position:static;margin:0;width:100%;height:100%;background-color:rgba(0,0,0,0.2);text-align:center;');
    smoke.onclick = function(){this.parentNode.removeChild(this); };
    const text = document.createElement('textarea');
    text.setAttribute('style', 'position:static;width:50%;height:70%;margin-top:20px;');
    const ok = document.createElement('button');
    ok.innerHTML = 'OK';
    ok.style.display = 'block';
    ok.style.margin = 'auto';
    ok.onclick = function(){
      // remplacer svg tag du dom
      smoke.parentNode.removeChild(smoke);
    };
    const cp = document.createElement('button');
    cp.innerHTML = 'Copier';
    cp.style.display = 'block';
    cp.style.margin = 'auto';
    cp.onclick = function(){
      // copie
    };
    smoke.appendChild(text).appendChild(document.createTextNode(document.getElementsByTagName('svg')[0].outerHTML.toString()));
    smoke.appendChild(ok);
    document.getElementsByTagName('body')[0].appendChild(smoke);
  }

  open() {
    document.getElementById('openFile').click();
  }

  handleFileSelect(event) {
    const reader = new FileReader();
    const file = event.target.files[0];
    reader.readAsText(file);
    this.name = file.name;

    reader.onload = function(event: Event) {
      document.getElementById('imageContainer').innerHTML = reader.result;

    };
  }

  showGrid() {
    this.drawArea.getImageComponent().showGrid();
    if (this.labels.view.showGrid === 'Show grid') {
      this.labels.view.showGrid = 'Hide grid';
    } else {
      this.labels.view.showGrid = 'Show grid';
    }
  }
}
