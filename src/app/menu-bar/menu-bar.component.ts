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

  /**
   * Called when page is initialised
   */
  ngOnInit() {
  }

  /**
   * Method called when the "New" button is pressed
   * 
   * Set doc name to Untitled.svg and call newImage method from drawArea
   * 
   * @see drawArea.newImage
   */
  newImage() {
    this.drawArea.newImage();
    this.name = 'Untitled.svg';
  }

  /**
   * Method called when the "Save" button is pressed
   * 
   * Create a link tag linked to the svg element and generate a click event on it to start the download
   */
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

  /**
   * Method called when the "Show XML" or "Hide XML" button is pressed
   * 
   * Change the button text ("Show XML" => "Hide XML" or "Hide XML" => "Show XML")
   * And call the showXml method from image
   * 
   * @see image.showXml
   */
  showXml() {
    this.drawArea.getImageComponent().showXml();
    if (this.labels.view.showXml === 'Show XML') {
      this.labels.view.showXml = 'Hide XML';
    } else {
      this.labels.view.showXml = 'Show XML';
    }
  }

  /**
   * Method called when the "Open" button is pressed
   * 
   * Generate a click event on the hidden openFile input tag with type="file" attribute to open a file picker message box
   */
  open() {
    document.getElementById('openFile').click();
  }

  /**
   * Method used after the "Open" button is pressed
   * 
   * Manage the file picker message box events
   * The selected file is read and its content is written instead of the svg tag of the HTML document
   * 
   * @param event
   *        The event occured in the file picker message box
   * 
   * @see open
   */
  handleFileSelect(event) {
    const reader = new FileReader();
    const file = event.target.files[0];
    reader.readAsText(file);
    this.name = file.name;

    reader.onload = function(event: Event) {
      document.getElementById('imageContainer').innerHTML = reader.result;

    };
  }

  /**
   * Method used after the "Show grid" or "Hide grid" button is pressed
   * 
   * Change the button text ("Show grid" => "Hide grid" or "Hide grid" => "Show grid")
   * And call the shoxGrid method from image
   * 
   * @see image.showGrid
   */
  showGrid() {
    this.drawArea.getImageComponent().showGrid();
    if (this.labels.view.showGrid === 'Show grid') {
      this.labels.view.showGrid = 'Hide grid';
    } else {
      this.labels.view.showGrid = 'Show grid';
    }
  }
}
