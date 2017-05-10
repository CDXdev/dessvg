import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';

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
