import {ImageComponent} from './image/image.component';
import {PropertiesComponent} from './properties/properties.component';
import {ToolsBoxComponent} from './tools-box/tools-box.component';
import {Component, OnInit, ViewChild, AfterContentInit, HostListener, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-draw-area',
  templateUrl: './draw-area.component.html',
  styleUrls: ['./draw-area.component.css']
})
export class DrawAreaComponent implements OnInit {

  public cursorOnImage = false;
  public coords = [0, 0];
  private isMouseDown = false;
  private lastMouseEvent = '';
  private lastKeyEvent = '';
  private x1: number;
  private y1: number;
  private x2: number;
  private y2: number;
  private selectedElement = null;
  private selectedTransform: SVGTransform;

  @ViewChild(ImageComponent)
  private image: ImageComponent;

  @ViewChild(ToolsBoxComponent)
  private toolsBox: ToolsBoxComponent;

  @ViewChild(PropertiesComponent)
  private properties: PropertiesComponent;

  private initPointerY: number;
  private initPointerX: number;
  private initTranslateX: number;
  private initTranslateY: number;
  private initRotateX: number;
  private initRotateY: number;
  private initAngle: number;
  private isDrawing = false;

  constructor() {
  }

  /**
   * Called when page is initialised
   */
  ngOnInit() {
  }

  /**
   * Create a keydown event listener and stores the key in the local variable lastKeyEvent
   * Call the actions method
   * 
   * @see actions
   */
  @HostListener('document:keydown', ['$event'])
  onKeyPressed(event: KeyboardEvent) {
    this.lastKeyEvent = event.key;
    this.actions(event);
  }

  /**
   * Create a mouseup event listener and change the local variable lastMouseEvent to 'mouseUp'
   * Call the actions method
   * 
   * @see actions
   */
  @HostListener('mouseup', ['$event'])
  onMouseup(event: MouseEvent) {
    if (this.getImageComponent().isImageShown()) {
      this.lastMouseEvent = 'mouseUp';
      this.isMouseDown = false;
      this.actions(event);
    }
  }

  /**
   * Create a mousemove event listener and change the local variable lastMouseEvent to 'mouseMove'
   * Call the actions method
   * 
   * @see actions
   */
  @HostListener('mousemove', ['$event'])
  onMousemove(event: MouseEvent) {
    if (this.getImageComponent().isImageShown()) {
      this.lastMouseEvent = 'mouseMove';
      this.updateCoords(event);
      this.actions(event);

    }
  }

  /**
   * Create a mousedown event listener and change the local variable lastMouseEvent to 'mouseDown'
   * Call the actions method
   * 
   * @see actions
   */
  @HostListener('mousedown', ['$event'])
  onMouseDown(event) {
    if (this.getImageComponent().isImageShown()) {
      this.lastMouseEvent = 'mouseDown';
      this.isMouseDown = true;
      this.actions(event);
    }
  }

  /**
   * Update the value of the local variable coords with the mouse coordinates
   * Get the binding to the displayed coordinates
   */
  updateCoords(event: MouseEvent) {
    const rect = this.image.getImageContainer().getBoundingClientRect();
    this.coords = [event.clientX - rect.left, event.clientY - rect.top];
  }

  /**
   * Depending on the generated event and the selected toolbox tool, call the appropriate method
   * 
   * @param event
   *        Keyboard and mouse events generated by the user
   * 
   * @see translateAction
   * @see rotateAction
   * @see drawLineAction
   * @see drawCircleAction
   * @see drawEllipseAction
   * @see drawRectAction
   * @see drawPathAction
   * @see deleteAction
   * @see drawPolygonAction
   * @see drawPolylineAction
   * @see drawTextAction
   * 
   */
  actions(event: Event) {
    if (this.isCursorOnImage(event)) {
      if (this.isMouseDown === true) {
        switch (this.toolsBox.getSelectedTool()) {
          case 'translate':
            this.translateAction();
            break;
          case 'rotate':
            this.rotateAction();
            break;
          case 'drawLine':
            this.drawLineAction();
            break;
          case 'drawCircle':
            this.drawCircleAction();
            break;
          case 'drawEllipse':
            this.drawEllipseAction();
            break;
          case 'drawRect':
            this.drawRectAction();
            break;
          case 'drawPath':
            this.drawPathAction();
            break;
          case 'delete':
            this.deleteAction();
            break;
        }
      }
      switch (this.toolsBox.getSelectedTool()) {
        case 'drawPolygon':
          this.drawPolygonAction(event);
          break;
        case 'drawPolyline':
          this.drawPolylineAction(event);
          break;
        case 'drawText':
          this.drawTextAction(event);
          break;
      }
    }
  }

  /**
   * Called to know if the cursor is on the image
   * 
   * @return cursorOnImage
   *        The boolean used to know if the cursor is on the image
   */
  isCursorOnImage(event: Event) {
    return this.cursorOnImage;
  }

  /**
   * Call the getElementAt method from image to know which element is at the cursor position
   * Call the setSelectedElement method from image to set the returned element as the selected element
   * 
   * @see image.getElementAt
   * @see image.setSelectedElement
   */
  setSelectedElement() {
    this.selectedElement = this.image.getElementAt(this.coords);
    this.getImageComponent().setSelectedElement(this.selectedElement);
  }

  /**
   * Similar to the setSelectedElement.
   * This time the element to be set as the selected element is given as a parameter
   * 
   * @param element
   *        The element to be set as the selected element
   * 
   * @see setSelectedElement
   */
  setGivenSelectedElement(element: Element) {
    this.selectedElement = element;
    this.getImageComponent().setSelectedElement(this.selectedElement);
  }

  /**
   * Similar to the setSelectedElement.
   * This time the element to be set as the selected element stays the same but its bounds is not redefined
   * 
   * @see setSelectedElement
   */
  updateSelectedElement() {
    this.getImageComponent().updateSelectedElement(this.selectedElement);
  }

  /**
   * Unselect the selected element
   * Call the deleteSelectedElement from image to remove the selection rectangle
   * 
   * @see image.deleteSelectedElement
   */
  deleteSelectedElement() {
    this.selectedElement = null;
    this.getImageComponent().deleteSelectedElement();
  }

  /**
   * Define what to do when mouse events are captured and the toolbox tool selected is translation
   * 
   * When a mouseDown event is captured :
   *      select the element
   *      memorize the coordinates of the cursor
   *      creates a transform attribute on the selected SVG element
   * When a mouseMove event is captured :
   *      update the transform attribute using initial and current coordinates of the cursor
   * 
   * @see image.getElementAt
   * @see deleteSelectedElement
   * @see setSelectedElement
   * @see image.createSVGTransform
   * @see SVGTransform.setTranslate
   * @see updateSelectedElement
   * 
   * @see <a href="https://www.w3schools.com/graphics/svg_intro.asp">W3C SVG Documentation</a>
   */
  translateAction() {
    switch (this.lastMouseEvent) {
      case 'mouseDown':
        if (this.image.getElementAt(this.coords) === null) {
          this.deleteSelectedElement();
        }
        else {
          this.setSelectedElement();
          this.initPointerX = this.coords[0];
          this.initPointerY = this.coords[1];
          const transformArray: SVGTransformList = this.selectedElement.transform.baseVal;
          let createNewTranslate = true;
          for (let i = 0; i < transformArray.numberOfItems; i++) {
            if (transformArray.getItem(i).type === SVGTransform.SVG_TRANSFORM_TRANSLATE) {
              createNewTranslate = false;
              this.selectedTransform = transformArray.getItem(i);
              this.initTranslateX = this.selectedTransform.matrix.e;
              this.initTranslateY = this.selectedTransform.matrix.f;
              break;
            }
          }
          if (createNewTranslate === true) {
            this.selectedTransform = this.image.getImage().createSVGTransform();
            this.initTranslateX = 0;
            this.initTranslateY = 0;
            this.selectedTransform.setTranslate(0, 0);
            transformArray.appendItem(this.selectedTransform);
          }
        }
        break;

      case 'mouseMove':
        if (this.selectedElement == null) {
          break;
        }
        this.updateSelectedElement();
        this.selectedTransform.setTranslate(this.coords[0] - this.initPointerX + this.initTranslateX, this.coords[1] - this.initPointerY + this.initTranslateY);
        break;

      case 'mouseUp':
        break;
    }

  }

  /**
   * Define what to do when mouse events are captured and the toolbox tool selected is rotation
   * 
   * When a mouseDown event is captured :
   *      select the element
   *      memorize the coordinates of the cursor
   *      creates a rotate attribute on the selected SVG element
   * When a mouseMove event is captured :
   *      update the transform attribute using initial and current coordinates of the cursor
   * 
   * @see image.getElementAt
   * @see deleteSelectedElement
   * @see setSelectedElement
   * @see image.createSVGTransform
   * @see SVGTransform.setTranslate
   * @see updateSelectedElement
   * 
   * @see <a href="https://www.w3schools.com/graphics/svg_intro.asp">W3C SVG Documentation</a>
   */
  rotateAction() {
    switch (this.lastMouseEvent) {

      case 'mouseDown':
        if (this.image.getElementAt(this.coords) === null) {
          break;
        }
        this.setSelectedElement();
        this.initPointerX = this.coords[0];
        this.initPointerY = this.coords[1];
        const transformArray: SVGTransformList = this.selectedElement.transform.baseVal;
        this.selectedTransform = this.image.getImage().createSVGTransform();
        this.initAngle = 0;
        this.initRotateX = this.coords[0];
        this.initRotateY = this.coords[1];
        this.selectedTransform.setRotate(0, this.coords[0], this.coords[1]);
        transformArray.appendItem(this.selectedTransform);
        break;

      case 'mouseMove':
        if (this.selectedElement == null) {
          break;
        }
        this.updateSelectedElement();
        this.selectedTransform.setRotate(Math.sqrt(Math.pow(this.coords[0] - this.initPointerX, 2) + Math.pow(this.coords[1] - this.initPointerY, 2)), this.initRotateX, this.initRotateY);
        break;

      case 'mouseUp':
        break;
    }
  }

  /**
   * Define what to do when mouse events are captured and the toolbox tool selected is line
   * 
   * When a mouseDown event is captured :
   *      create a line SVG element
   *      define the element attributes : x1, y1, x2, y2, stroke-width, stroke based on the cursor coordinates and the property values
   * When a mouseMove event is captured :
   *      update the x2 and y2 attribute using current coordinates of the cursor
   * When a mouseUp event is captured :
   *      unselect the element
   * 
   * @see setGivenSelectedElement
   * @see image.append
   * 
   * @see <a href="https://www.w3schools.com/graphics/svg_line.asp">W3C SVG Line Documentation</a>
   */
  drawLineAction() {

    switch (this.lastMouseEvent) {

      case 'mouseDown':
        this.selectedElement = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        this.selectedElement.setAttribute('x1', this.coords[0].toString());
        this.selectedElement.setAttribute('y1', this.coords[1].toString());
        this.selectedElement.setAttribute('x2', this.coords[0].toString());
        this.selectedElement.setAttribute('y2', this.coords[1].toString());
        this.selectedElement.setAttribute('stroke-width', this.properties.getLineProperties().thickness);
        this.selectedElement.setAttribute('stroke', this.properties.getColor());
        this.image.append(this.selectedElement);
        this.setGivenSelectedElement(this.selectedElement);

        break;

      case 'mouseMove':
        this.selectedElement.setAttribute('x2', this.coords[0].toString());
        this.selectedElement.setAttribute('y2', this.coords[1].toString());
        this.updateSelectedElement();
        break;

      case 'mouseUp':
        this.selectedElement = null;
        break;
    }

  }

  /**
   * Define what to do when mouse events are captured and the toolbox tool selected is circle
   * 
   * When a mouseDown event is captured :
   *      create a circle SVG element
   *      define the element attributes : cx, cy, r, stroke-width, stroke ,fill based on the cursor coordinates and the property values
   * When a mouseMove event is captured :
   *      update the r attribute using current coordinates of the cursor
   * When a mouseUp event is captured :
   *      unselect the element
   * 
   * @see setGivenSelectedElement
   * @see updateSelectedElement
   * @see image.append
   * 
   * @see <a href="https://www.w3schools.com/graphics/svg_circle.asp">W3C SVG Circle Documentation</a>
   */
  drawCircleAction() {

    switch (this.lastMouseEvent) {

      case 'mouseDown':
        this.selectedElement = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        this.x1 = this.coords[0];
        this.y1 = this.coords[1];
        this.selectedElement.setAttribute('cx', this.x1.toString());
        this.selectedElement.setAttribute('cy', this.y1.toString());
        this.selectedElement.setAttribute('r', '0');
        this.selectedElement.setAttribute('stroke-width', this.properties.getLineProperties().thickness);
        this.selectedElement.setAttribute('stroke', this.properties.getColorStroke());
        this.selectedElement.setAttribute('fill', this.properties.getColor());
        this.image.append(this.selectedElement);
        this.setGivenSelectedElement(this.selectedElement);

        break;

      case 'mouseMove':
        this.x2 = this.coords[0];
        this.y2 = this.coords[1];
        const radius = Math.sqrt(Math.pow(this.x2 - this.x1, 2) + Math.pow(this.y2 - this.y1, 2));
        this.selectedElement.setAttribute('r', radius.toString());
        this.updateSelectedElement();
        break;

      case 'mouseUp':
        this.selectedElement = null;
        break;
    }

  }

  /**
   * Define what to do when mouse events are captured and the toolbox tool selected is ellipse
   * 
   * When a mouseDown event is captured :
   *      create an ellipse SVG element
   *      define the element attributes : cx, cy, rx, ry, stroke-width, stroke, fill based on the cursor coordinates and the property values
   * When a mouseMove event is captured :
   *      update the rx and ry attribute using current coordinates of the cursor
   *      if the rx or ry is negative (cursor left or above the initial mouseDown), set current cursor coordinates as the cx and cy attributes
   * When a mouseUp event is captured :
   *      unselect the element
   * 
   * @see setGivenSelectedElement
   * @see image.append
   * 
   * @see <a href="https://www.w3schools.com/graphics/svg_ellipse.asp">W3C SVG Ellipse Documentation</a>
   */
  drawEllipseAction() {

    switch (this.lastMouseEvent) {

      case 'mouseDown':
        this.selectedElement = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
        this.x1 = this.coords[0];
        this.y1 = this.coords[1];
        this.selectedElement.setAttribute('cx', this.x1.toString());
        this.selectedElement.setAttribute('cy', this.y1.toString());
        this.selectedElement.setAttribute('rx', '0');
        this.selectedElement.setAttribute('ry', '0');
        this.selectedElement.setAttribute('stroke-width', this.properties.getLineProperties().thickness);
        this.selectedElement.setAttribute('stroke', this.properties.getColorStroke());
        this.selectedElement.setAttribute('fill', this.properties.getColor());
        this.image.append(this.selectedElement);
        this.setGivenSelectedElement(this.selectedElement);

        break;

      case 'mouseMove':
        this.x2 = this.coords[0];
        this.y2 = this.coords[1];
        const rx = (this.x1 <= this.x2) ? this.x2 - this.x1 : this.x1 - this.x2;
        const ry = (this.y1 <= this.y2) ? this.y2 - this.y1 : this.y1 - this.y2;
        this.selectedElement.setAttribute('rx', rx.toString());
        this.selectedElement.setAttribute('ry', ry.toString());
        this.setGivenSelectedElement(this.selectedElement);
        break;

      case 'mouseUp':
        this.selectedElement = null;
        break;
    }
  }

  /**
   * Define what to do when mouse events are captured and the toolbox tool selected is rectangle
   * 
   * When a mouseDown event is captured :
   *      create a rect SVG element
   *      define the element attributes : x, y, width, height, stroke-width, stroke, fill based on the cursor coordinates and the property values
   * When a mouseMove event is captured :
   *      update the width and height attribute using current coordinates of the cursor
   *      if the width or height is negative (cursor left or above the initial mouseDown), set current cursor coordinates as the x and y attributes
   * When a mouseUp event is captured :
   *      unselect the element
   * 
   * @see setGivenSelectedElement
   * @see image.append
   * @see updateSelectedElement
   * 
   * @see <a href="https://www.w3schools.com/graphics/svg_rect.asp">W3C SVG Rectangle Documentation</a>
   */
  drawRectAction() {

    switch (this.lastMouseEvent) {

      case 'mouseDown':
        this.selectedElement = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        this.x1 = this.coords[0];
        this.y1 = this.coords[1];
        this.selectedElement.setAttribute('x', this.x1.toString());
        this.selectedElement.setAttribute('y', this.y1.toString());
        this.selectedElement.setAttribute('width', '0');
        this.selectedElement.setAttribute('height', '0');
        this.selectedElement.setAttribute('stroke-width', this.properties.getLineProperties().thickness);
        this.selectedElement.setAttribute('stroke', this.properties.getColorStroke());
        this.selectedElement.setAttribute('fill', this.properties.getColor());
        this.image.append(this.selectedElement);
        this.setGivenSelectedElement(this.selectedElement);

        break;

      case 'mouseMove':
        this.x2 = this.coords[0];
        this.y2 = this.coords[1];
        let width;
        let height;
        if (this.x1 <= this.x2) {
          width = this.x2 - this.x1;
        } else {
          width = this.x1 - this.x2;
          this.selectedElement.setAttribute('x', this.x2.toString());
        }
        if (this.y1 <= this.y2) {
          height = this.y2 - this.y1;
        } else {
          height = this.y1 - this.y2;
          this.selectedElement.setAttribute('y', this.y2.toString());
        }
        this.selectedElement.setAttribute('height', height.toString());
        this.selectedElement.setAttribute('width', width.toString());
        this.updateSelectedElement();
        break;

      case 'mouseUp':
        this.selectedElement = null;
        break;
    }

  }

  /**
   * Define what to do when mouse events are captured and the toolbox tool selected is path (free drawing)
   * 
   * When a mouseDown event is captured :
   *      create a path SVG element
   *      define the element attributes : d, stroke-width, stroke, fill based on the cursor coordinates and the property values
   * When a mouseMove event is captured :
   *      add the current coordinates of the cursor to the d attributes
   *      each point defined in the d attribute is linked by curved segments
   * When a mouseUp event is captured :
   *      unselect the element
   * 
   * @see setGivenSelectedElement
   * @see image.append
   * 
   * @see <a href="https://www.w3schools.com/graphics/svg_path.asp">W3C SVG Path Documentation</a>
   */
  drawPathAction() {

    switch (this.lastMouseEvent) {

      case 'mouseDown':
        this.selectedElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        this.x1 = this.coords[0];
        this.y1 = this.coords[1];
        this.selectedElement.setAttribute('d', 'M' + this.x1 + ',' + this.y1 + ' C ' + this.x1 + ',' + this.y1);
        this.selectedElement.setAttribute('stroke-width', this.properties.getLineProperties().thickness);
        this.selectedElement.setAttribute('stroke', this.properties.getColor());
        this.selectedElement.setAttribute('fill', 'none');
        this.image.append(this.selectedElement);
        this.setGivenSelectedElement(this.selectedElement);

        break;

      case 'mouseMove':
        let theD = this.selectedElement.getAttribute('d');
        const posL = theD.indexOf('L');
        if ((posL !== -1)) {
          theD = theD.substring(0, posL) + theD.substring(posL + 2);
        }
        this.selectedElement.setAttribute('d', theD + ' L ' + this.coords[0] + ',' + this.coords[1]);
        this.setGivenSelectedElement(this.selectedElement);
        break;

      case 'mouseUp':
        this.selectedElement = null;
        break;
    }

  }

  /**
   * Define what to do when mouse and keyboard events are captured and the toolbox tool selected is polygon
   * 
   * When the first mouseDown event is captured :
   *      create a polygon SVG element
   *      define the element attributes : points, stroke-width, stroke, fill based on the cursor coordinates and the property values
   * When a mouseMove event is captured :
   *      replace the last coordinates in the points attribute with current cursor coordinates
   * When a mouseUp event is captured :
   *      define current cursor coordinates as a new point
   * The element is unselected and its last point is deleted when the Escape key is pressed
   * 
   * @see setGivenSelectedElement
   * @see image.append
   * 
   * @see <a href="https://www.w3schools.com/graphics/svg_polygon.asp">W3C SVG Polygon Documentation</a>
   */
  drawPolygonAction(event: Event) {
    if (event instanceof MouseEvent) {
      switch (event.type) {

        case 'mousedown':
          if (this.isDrawing === false) {
            this.selectedElement = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
            this.x1 = this.coords[0];
            this.y1 = this.coords[1];
            this.selectedElement.setAttribute('points', this.x1 + ',' + this.y1);
            this.selectedElement.setAttribute('stroke-width', this.properties.getLineProperties().thickness);
            this.selectedElement.setAttribute('stroke', this.properties.getColorStroke());
            this.selectedElement.setAttribute('fill', this.properties.getColor());
            this.image.append(this.selectedElement);
            this.setGivenSelectedElement(this.selectedElement);
          }
          this.isDrawing = true;
          break;

        case 'mousemove':
          if (this.selectedElement !== null) {
            let thePoints = this.selectedElement.getAttribute('points');
            const posSpace = thePoints.lastIndexOf(' ');
            if ((posSpace !== -1)) {
              thePoints = thePoints.substring(0, posSpace);
            }
            this.selectedElement.setAttribute('points', thePoints + ' ' + this.coords[0] + ',' + this.coords[1]);
            this.updateSelectedElement();
          }
          break;

        case 'mouseup':
          this.selectedElement.setAttribute('points', this.selectedElement.getAttribute('points') + ' ' + this.coords[0] + ',' + this.coords[1]);
          break;
      }
    }

    if (event instanceof KeyboardEvent && event.key === 'Escape') {
      let thePoints = this.selectedElement.getAttribute('points');
      thePoints = thePoints.substring(0, thePoints.lastIndexOf(' '));
      this.selectedElement.setAttribute('points', thePoints);
      this.selectedElement = null;
      this.isDrawing = false;
    }

  }

  /**
   * Define what to do when mouse and keyboard events are captured and the toolbox tool selected is polyline
   * 
   * When the first mouseDown event is captured :
   *      create a polyline SVG element
   *      define the element attributes : points, stroke-width, stroke, fill based on the cursor coordinates and the property values
   * When a mouseMove event is captured :
   *      replace the last coordinates in the points attribute with current cursor coordinates
   * When a mouseUp event is captured :
   *      define current cursor coordinates as a new point
   * The element is unselected and the last point is deleted when the Escape key is pressed
   * 
   * @see setGivenSelectedElement
   * @see image.append
   * 
   * @see <a href="https://www.w3schools.com/graphics/svg_polyline.asp">W3C SVG Polyline Documentation</a>
   */
  drawPolylineAction(event: Event) {
    if (event instanceof MouseEvent) {
      switch (event.type) {

        case 'mousedown':
          if (this.isDrawing === false) {
            this.selectedElement = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
            this.x1 = this.coords[0];
            this.y1 = this.coords[1];
            this.selectedElement.setAttribute('points', this.x1 + ',' + this.y1);
            this.selectedElement.setAttribute('stroke-width', this.properties.getLineProperties().thickness);
            this.selectedElement.setAttribute('stroke', this.properties.getColor());
            this.selectedElement.setAttribute('fill', 'none');
            this.image.append(this.selectedElement);
            this.setGivenSelectedElement(this.selectedElement);
          }
          this.isDrawing = true;
          break;

        case 'mousemove':
          if (this.selectedElement !== null) {
            let thePoints = this.selectedElement.getAttribute('points');
            const posSpace = thePoints.lastIndexOf(' ');
            if ((posSpace !== -1)) {
              thePoints = thePoints.substring(0, posSpace);
            }
            this.selectedElement.setAttribute('points', thePoints + ' ' + this.coords[0] + ',' + this.coords[1]);
            this.updateSelectedElement();
          }
          break;

        case 'mouseup':
          this.selectedElement.setAttribute('points', this.selectedElement.getAttribute('points') + ' ' + this.coords[0] + ',' + this.coords[1]);
          break;
      }
    }

    if (event instanceof KeyboardEvent && event.key === 'Escape') {
      let thePoints = this.selectedElement.getAttribute('points');
      thePoints = thePoints.substring(0, thePoints.lastIndexOf(' '));
      this.selectedElement.setAttribute('points', thePoints);
      this.selectedElement = null;
      this.isDrawing = false;
    }


  }

  /**
   * Define what to do when mouse and keyboard events are captured and the toolbox tool selected is text
   * 
   * When a mouseDown event is captured :
   *      create a text SVG element
   *      define the element attributes : x, y, stroke, fill, font-size based on the cursor coordinates and the property values
   * When a keyboard event is captured :
   *      if the key pressed is a letter or a number, the character is added to the text innerHTML
   * 
   * @see setGivenSelectedElement
   * @see image.append
   * @see updateSelectedElement
   * 
   * @see <a href="https://www.w3schools.com/graphics/svg_text.asp">W3C SVG Text Documentation</a>
   */
  drawTextAction(event: Event) {

    if (event instanceof MouseEvent && event.type === 'mouseup') {

      this.selectedElement = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      this.x1 = this.coords[0];
      this.y1 = this.coords[1];
      this.selectedElement.setAttribute('x', this.x1.toString());
      this.selectedElement.setAttribute('y', this.y1.toString());
      this.selectedElement.setAttribute('fill', this.properties.getColor());
      this.selectedElement.setAttribute('font-size', this.properties.getFontProperties().size);
      this.selectedElement.innerHTML = '';
      this.image.append(this.selectedElement);
      this.setGivenSelectedElement(this.selectedElement);
    }

    if (event instanceof KeyboardEvent && ((event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode >= 65 && event.keyCode <= 90) || (event.keyCode >= 96 && event.keyCode <= 105))) {
      this.selectedElement.innerHTML = this.selectedElement.innerHTML + event.key;
      this.updateSelectedElement();
    }
  }

  /**
   * Define what to do when mouse events are captured and the toolbox tool selected is the bin
   * 
   * When a mouseDown event is captured :
   *      deselect the selected element
   *      call the getElementAt method from image to know which element has been clicked on
   *      delete the element from the svg tag
   * 
   * @see image.getElementAt
   */
  deleteAction() {

    switch (this.lastMouseEvent) {
      case 'mouseDown':
        this.deleteSelectedElement();
        const element = this.image.getElementAt(this.coords);
        if (element !== null) {
          element.outerHTML = '';
        }
        break;
    }
  }

  /**
   * Call the newImage method from image to create a new image
   * 
   * @see image.newImage
   */
  newImage() {
    this.image.newImage();
  }

  /**
   * Method used to get the image object from this draw area
   * 
   * @return image
   */
  getImageComponent() {
    return this.image;
  }
}
