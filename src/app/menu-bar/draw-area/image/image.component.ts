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
  private savedSelectionElement: string;

  constructor() {
  }

  /**
   * Called when page is initialised
   *
   * Create the image (svg tag)
   * Create and append the select rectangle to the image
   * Append all in DOM
   */
  ngAfterViewInit() {
    this.image = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this.image.setAttribute('id', 'image');
    this.image.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    this.selection = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    this.selection.setAttribute('id', 'selection');
    this.image.appendChild(this.selection);
    this.getImageContainer().appendChild(this.image);
  }

  /**
   * isXmlShown getter
   *
   * Tell whether the image or the Xml is shown
   *
   * @return {bool} isXmlShown
   */
  isImageShown() {
    return !this.isXmlShown;
  }

  /**
   * selection getter
   *
   * @return {SVGGraphicsElement} selection - blue selection rectangle
   */
  getSelection(): SVGGraphicsElement {
    return this.selection;
  }

  /**
   * image getter
   *
   * @return {SVGSVGElement} image - the SVG tag
   */
  getImage(): SVGSVGElement {
    return this.image;
  }

  /**
   * imageContainer getter
   *
   * The image container is the parent div tag of the image
   *
   * @return {Element} $(#imageContainer)
   */
  getImageContainer(): Element {
    return document.getElementById('imageContainer');
  }

  /**
   * Name refactorisation to improve code visibility
   *
   * @param {Element} element - the element to add to the image
   */
  append(element: Element) {
    this.getImage().appendChild(element);
  }

  /**
   * Image bounds getter
   *
   * Return the element top, bottom, right, left describing the bounds of the image
   *
   * @return {DOMRect} imageBounds
   */
  getImageBounds() {
    return this.getImage().getBoundingClientRect();
  }

  /**
   * Return if an element is present in precified coordinates
   *
   * @param {number[]} coords - the coordinates to be checked
   *
   * @return {HTMLElement} ElementAtCoords - the first element at the given coordinates. null if no elements are found at the coordinates
   */
  getElementAt(coords: number[]): HTMLElement {
    const rect = this.getImage().getBoundingClientRect();
    const element = <HTMLElement>document.elementFromPoint(coords[0] + rect.left, coords[1] + rect.top);
    if (this.isPartOfImage(element)) {
      return element;
    }
    return null;
  }

  /**
   * Return if at least one element in the image is of the same type as a given element
   *
   * @param {Element} element
   *
   * @return {bool} partOfImage - true if the given element is of the same type as one of elements in the image
   */
  isPartOfImage(element: Element) {
    const children = this.getImage().children;
    for (let i = 0; i < children.length; i++) {
      if (children[i].tagName === element.tagName) {
        return true;
      }
    }
    return false;
  }

  /**
   * Clear the svg tag
   */
  newImage() {
    this.getImage().innerHTML = '';
  }

  /**
   * Hide/show the image grid
   *
   * If the grid is shown, it is now hidden
   * If the grid is hidden, it is now shown
   */
  showGrid() {
    if (this.isGridOn === true) {
      this.getImageContainer().setAttribute('style', 'background-image: none;');
      this.isGridOn = false;
    } else {
      this.getImageContainer().setAttribute('style', '');
      this.isGridOn = true;
    }
  }

  /**
   * Hide/show the image XML text
   *
   * If the XML text is shown, it is now hidden and the image is displayed
   * If the XML text is hidden, it is now shown and the image is hidden
   */
  showXml() {
    var editor = ace.edit('editor');
    if (this.isXmlShown === false) {
      if (document.getElementById('selection') != null) {
        document.getElementById('selection').outerHTML = '';
      }
      this.isXmlShown = true;
      editor.setTheme('ace/theme/dreamweaver');
      editor.getSession().setMode('ace/mode/html');
      this.deleteSelectedElement();
      editor.setValue(vkbeautify.xml(this.getImage().innerHTML));
    }
    else {
      this.selection = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      this.selection.setAttribute('id', 'selection');
      this.image.appendChild(this.selection);
      this.isXmlShown = false;
      //this.getImage().getElementById('selection').outerHTML = this.savedSelectionElement;
      this.getImage().innerHTML = editor.getValue();
    }

  }

  /**
   * selectedElement setter
   *
   * Unselect the selected element
   * The blue selection rectangle is created around the element given in parameter
   *
   * @param {HTMLElement} element
   */
  setSelectedElement(element: HTMLElement) {
    this.deleteSelectedElement();
    let elementBounds = element.getBoundingClientRect();
    let imageBounds = this.getImageBounds();
    this.createSelectionRect(elementBounds.left - imageBounds.left, elementBounds.top - imageBounds.top, elementBounds.width, elementBounds.height);
  }

    /**
     * Create the blue selection rectangle using x, y, width, heigth given as parameters
     *
     * @param {number} ElementX - abscissa of the left top of the blue selection rectangle
     * @param {number} ElementY - ordinate of the left top of the blue selection rectangle
     * @param {number} ElementW - width of the left top of the blue selection rectangle
     * @param {number} ElementH - heigth of the left top of the blue selection rectangle
     */
  createSelectionRect(elementX: number, elementY: number, elementW: number, elementH: number) {
    if (document.getElementById('selection') === null) {
      this.selection = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      this.selection.setAttribute('id', 'selection');
      this.image.appendChild(this.selection);
    }
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

  /**
   * Update the selected element
   *      delete the unselect the element given as a parameter
   *      call setSelectedElement
   *
   * @param {HTMLElement} element - element to update selection
   *
   * @see deleteSelectedElement
   * @see setSelectedElement
   */
  updateSelectedElement(element: HTMLElement) {
    this.deleteSelectedElement();
    this.setSelectedElement(element);
  }

  /**
   * Delete the blue selection rectangle
   */
  deleteSelectedElement() {
    if (document.getElementById('selection') != null) {
      document.getElementById('selection').innerHTML = '';
    }
  }

  /**
   * Append an element given as parameter in the blue selection rectangle
   *
   * @param {SVGElement} element - the element to be appended
   */
  selectionAppend(element: SVGElement) {
    this.getSelection().appendChild(element);
  }

}
