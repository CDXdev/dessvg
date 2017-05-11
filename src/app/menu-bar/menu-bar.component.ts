import { Component, OnInit, ViewChild } from '@angular/core';

import { DrawAreaComponent } from './draw-area/draw-area.component';

@Component({
  selector: 'app-menu-bar',
  templateUrl: './menu-bar.component.html',
  styleUrls: ['./menu-bar.component.css']
})
export class MenuBarComponent implements OnInit {

  public lineProperties: { thickness: string };
  public color;
  public name = 'Untitled.svg';

  public labels = { view: { showGrid: 'Hide grid',  showXml: 'Show XML'} };

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
    this.drawArea.deleteSelectedElement();
    const image: SVGSVGElement = this.drawArea.getImageComponent().getImage();
    const pom = document.createElement('a');
    pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(image.outerHTML));
    pom.setAttribute('download', this.name);

    if (document.createEvent) {
      const event = document.createEvent('MouseEvents');
      event.initEvent('click', true, true);
      pom.dispatchEvent(event);
    } else {
      pom.click();
    }
  }

  showXml() {
    this.drawArea.getImageComponent().showXml();
    if (this.labels.view.showXml === 'Show XML') {
      this.labels.view.showXml = 'Hide XML';
    } else {
      this.labels.view.showXml = 'Show XML';
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
