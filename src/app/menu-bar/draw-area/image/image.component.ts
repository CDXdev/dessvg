import {Component, ViewChild, ElementRef} from '@angular/core';

declare var ace: any;
declare var vkbeautify: any;

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.css']
})
export class ImageComponent {

  private isXmlShown = false;
  private isGridOn = true;

  constructor() {
  }

  isImageShown() {
    return !this.isXmlShown;
  }

  getImage(): Element {
    return document.getElementById("image");
  }

  getImageContainer(): Element {
    return document.getElementById("imageContainer");
  }

  append(element: Element) {
    this.getImage().appendChild(element);
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

}
