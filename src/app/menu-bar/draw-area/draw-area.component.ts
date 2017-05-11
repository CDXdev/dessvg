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

  ngOnInit() {
  }

  @HostListener('document:keydown', ['$event'])
  onKeyPressed(event: KeyboardEvent) {
    this.lastKeyEvent = event.key;
    this.actions(event);
  }

  @HostListener('mouseup', ['$event'])
  onMouseup(event: MouseEvent) {
    if (this.getImageComponent().isImageShown()) {
      this.lastMouseEvent = 'mouseUp';
      this.isMouseDown = false;
      this.actions(event);
    }
  }

  @HostListener('mousemove', ['$event'])
  onMousemove(event: MouseEvent) {
    if (this.getImageComponent().isImageShown()) {
      this.lastMouseEvent = 'mouseMove';
      this.updateCoords(event);
      this.actions(event);

    }
  }

  @HostListener('mousedown', ['$event'])
  onMouseDown(event) {
    if (this.getImageComponent().isImageShown()) {
      this.lastMouseEvent = 'mouseDown';
      this.isMouseDown = true;
      this.actions(event);
    }
  }

  updateCoords(event: MouseEvent) {
    const rect = this.image.getImageContainer().getBoundingClientRect();
    this.coords = [event.clientX - rect.left, event.clientY - rect.top];
  }

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

  isCursorOnImage(event: Event) {
    return this.cursorOnImage;
  }

  setSelectedElement() {
    this.selectedElement = this.image.getElementAt(this.coords);
    this.getImageComponent().setSelectedElement(this.selectedElement);
  }

  setGivenSelectedElement(element: Element) {
    this.selectedElement = element;
    this.getImageComponent().setSelectedElement(this.selectedElement);
  }

  updateSelectedElement() {
    this.getImageComponent().updateSelectedElement(this.selectedElement);
  }

  deleteSelectedElement() {
    this.selectedElement = null;
    this.getImageComponent().deleteSelectedElement();
  }

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

  deleteAction() {

    switch (this.lastMouseEvent) {
      case 'mouseDown':
        const element = this.image.getElementAt(this.coords);
        if (element !== null) {
          element.outerHTML = '';
        }
        break;
    }
  }

  newImage() {
    this.image.newImage();
  }

  getImageComponent() {
    return this.image;
  }
}
