import {Component, AfterViewInit} from '@angular/core';

declare var ace: any;
declare var vkbeautify: any;

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.css']
})
export class ImageComponent implements AfterViewInit {

  private isXmlShown = false;
  private isGridOn = true;
  private image: SVGSVGElement;
  private selection: SVGGraphicsElement;

  constructor() {
  }

  ngAfterViewInit() {
    this.image = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    this.image.setAttribute("id", "image");
    this.image.setAttribute("xmlns","http://www.w3.org/2000/svg");
    this.selection = document.createElementNS("http://www.w3.org/2000/svg", "g");
    this.selection.setAttribute("id", "selection");
    this.image.appendChild(this.selection);
    this.getImageContainer().appendChild(this.image);
  }

  isImageShown() {
    return !this.isXmlShown;
  }

  getSelection(): SVGGraphicsElement {
    return this.selection;
  }

  getImage(): SVGSVGElement {
    return this.image;
  }

  getImageContainer(): Element {
    return document.getElementById("imageContainer");
  }

  append(element: Element) {
    this.getImage().appendChild(element);
  }

  getImageBounds() {
    return this.getImage().getBoundingClientRect();
  }

  getElementAt(coords: number[]): HTMLElement {
    const rect = this.getImage().getBoundingClientRect();
    const element = <HTMLElement>document.elementFromPoint(coords[0] + rect.left, coords[1] + rect.top);
    if (this.isPartOfImage(element)) {
      return element;
    }
    return null;
  }

  isPartOfImage(element: Element) {
    const children = this.getImage().children;
    for (let i = 0; i < children.length; i++) {
      if (children[i].tagName === element.tagName) {
        return true;
      }
    }
    return false;
  }

  newImage() {
    this.getImage().innerHTML = '';
  }

  showGrid() {
    if (this.isGridOn === true) {
      this.getImageContainer().setAttribute('style', 'background-image: none;');
      this.isGridOn = false;
    } else {
      this.getImageContainer().setAttribute('style', '');
      this.isGridOn = true;
    }
  }

  showXml() {
    var editor = ace.edit("editor");

    if (this.isXmlShown === false) {
      this.isXmlShown = true;
      editor.setTheme("ace/theme/dreamweaver");
      editor.getSession().setMode("ace/mode/html");
      editor.setValue(vkbeautify.xml(this.getImage().innerHTML));
    }
    else {
      this.isXmlShown = false;
      this.getImage().innerHTML = editor.getValue();
    }

  }

  setSelectedElement(element: HTMLElement) {
    this.deleteSelectedElement();
    let elementBounds = element.getBoundingClientRect();
    let imageBounds = this.getImageBounds();
    this.createSelectionRect(elementBounds.left - imageBounds.left, elementBounds.top - imageBounds.top, elementBounds.width, elementBounds.height);
  }

  createSelectionRect(elementX: number, elementY: number, elementW: number, elementH: number) {
    let x = elementX - 5;
    let y = elementY - 5;
    let w = elementW + 10;
    let h = elementH + 10;
    let selectionRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    selectionRect.setAttribute('x', x.toString());
    selectionRect.setAttribute('y', y.toString());
    selectionRect.setAttribute('width', w.toString());
    selectionRect.setAttribute('height', h.toString());
    selectionRect.setAttribute('stroke-width', '1');
    selectionRect.setAttribute('stroke', '#4F80FF');
    selectionRect.setAttribute('fill', 'none');
    this.selectionAppend(selectionRect);

    let selectionRectNW = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    selectionRectNW.setAttribute('x', (x - 4).toString());
    selectionRectNW.setAttribute('y', (y - 4).toString());
    selectionRectNW.setAttribute('width', '8');
    selectionRectNW.setAttribute('height', '8');
    selectionRectNW.setAttribute('stroke', 'rgba(0,0,0,0)');
    selectionRectNW.setAttribute('fill', '#4F80FF');
    selectionRectNW.setAttribute('style', 'cursor: nw-resize');
    selectionRectNW.setAttribute('pointer-event', 'all');
    this.selectionAppend(selectionRectNW);

    let selectionRectNE = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    selectionRectNE.setAttribute('x', (x - 4 + w).toString());
    selectionRectNE.setAttribute('y', (y - 4).toString());
    selectionRectNE.setAttribute('width', '8');
    selectionRectNE.setAttribute('height', '8');
    selectionRectNE.setAttribute('stroke', 'rgba(0,0,0,0)');
    selectionRectNE.setAttribute('fill', '#4F80FF');
    selectionRectNE.setAttribute('style', 'cursor: ne-resize');
    selectionRectNE.setAttribute('pointer-event', 'all');
    this.selectionAppend(selectionRectNE);

    let selectionRectSE = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    selectionRectSE.setAttribute('x', (x - 4 + w).toString());
    selectionRectSE.setAttribute('y', (y - 4 + h).toString());
    selectionRectSE.setAttribute('width', '8');
    selectionRectSE.setAttribute('height', '8');
    selectionRectSE.setAttribute('stroke', 'rgba(0,0,0,0)');
    selectionRectSE.setAttribute('fill', '#4F80FF');
    selectionRectSE.setAttribute('style', 'cursor: se-resize');
    selectionRectSE.setAttribute('pointer-event', 'all');
    this.selectionAppend(selectionRectSE);

    let selectionRectSW = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    selectionRectSW.setAttribute('x', (x - 4).toString());
    selectionRectSW.setAttribute('y', (y - 4 + h).toString());
    selectionRectSW.setAttribute('width', '8');
    selectionRectSW.setAttribute('height', '8');
    selectionRectSW.setAttribute('stroke', 'rgba(0,0,0,0)');
    selectionRectSW.setAttribute('fill', '#4F80FF');
    selectionRectSW.setAttribute('style', 'cursor: sw-resize');
    selectionRectSW.setAttribute('pointer-event', 'all');
    this.selectionAppend(selectionRectSW);
  }

  updateSelectedElement(element: HTMLElement) {
    this.deleteSelectedElement();
    this.setSelectedElement(element);
  }

  deleteSelectedElement(){
    this.getSelection().innerHTML = "";
  }

  selectionAppend(element: SVGElement) {
    this.getSelection().appendChild(element);
  }

}
