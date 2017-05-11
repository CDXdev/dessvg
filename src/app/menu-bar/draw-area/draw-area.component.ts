import { ImageComponent } from './image/image.component';
import { PropertiesComponent } from './properties/properties.component';
import { ToolsBoxComponent } from './tools-box/tools-box.component';
import { Component, OnInit, ViewChild, AfterContentInit, HostListener, EventEmitter } from '@angular/core';

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
  private x1: number;
  private y1: number;
  private x2: number;
  private y2: number;
  private coeffs: any;
  private oldValue;
  private selectedElement = null;

  @ViewChild(ImageComponent)
  private image: ImageComponent;

  @ViewChild(ToolsBoxComponent)
  private toolsBox: ToolsBoxComponent;

  @ViewChild(PropertiesComponent)
  private properties: PropertiesComponent;

  constructor() { }

  ngOnInit() {
  }

  @HostListener('mouseup', ['$event'])
  onMouseup(event: MouseEvent) {
    this.lastMouseEvent = 'mouseUp';
    this.isMouseDown = false;
    this.actions(event);
  }

  @HostListener('mousemove', ['$event'])
  onMousemove(event: MouseEvent) {
    this.lastMouseEvent = 'mouseMove';
    this.updateCoords(event);
    if (this.isMouseDown) {
      this.actions(event);
    }
  }

  @HostListener('mousedown', ['$event'])
  onMouseDown(event) {
    this.lastMouseEvent = 'mouseDown';
    this.isMouseDown = true;
    this.actions(event);
  }

  updateCoords(event: MouseEvent) {
    const rect = this.image.getImage().getBoundingClientRect();
    this.coords = [event.clientX - rect.left, event.clientY - rect.top];
  }

  actions(event: MouseEvent) {
    if (this.isCursorOnImage(event)) {
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
        case 'drawPolygon':
          this.drawPolygonAction();
          break;
        case 'drawPolyline':
          this.drawPolylineAction();
          break;
        case 'drawText':
          this.drawTextAction();
          break;
        case 'delete':
          this.deleteAction();
          break;
      }
    }
  }

  isCursorOnImage(event: MouseEvent) {
    return this.cursorOnImage;
  }

  translateAction() {
    if (this.image.getElementAt(this.coords) === null) {
      return;
    }
    switch (this.lastMouseEvent) {

      case 'mouseDown':
        this.selectedElement = this.image.getElementAt(this.coords);
        this.x2 = this.coords[0];
        this.y2 = this.coords[1];
        const transformArray: SVGTransformList = this.selectedElement.transform.baseVal;

        for (let i = 0; i < transformArray.numberOfItems; i++) {
          if (transformArray.getItem(i).type === SVGTransform.SVG_TRANSFORM_TRANSLATE) {
            console.log(true);

            break;
          }
        }
        // TODO
        // this.x1 = parseInt(this.coeffs[0]);
        // this.y1 = parseInt(this.coeffs[1]);
        break;

      case 'mouseMove':
        if (this.selectedElement == null) {
          break;
        }
        const x = this.coords[0];
        const y = this.coords[1];
        this.coeffs[0] = x + this.x1 - this.x2;
        this.coeffs[1] = y + this.y1 - this.y2;
        const chaine = 'translate(' + this.coeffs.join(' ') + ')';
        this.selectedElement.setAttribute('transform', chaine);
        break;

      case 'mouseUp':
        break;
    }

  }

  rotateAction() {

    switch (this.lastMouseEvent) {

      case 'mouseDown':
        this.selectedElement = this.image.getElementAt(this.coords);
        if (!(this.selectedElement.getAttribute('transform') == null)) {
          this.oldValue = this.selectedElement.getAttribute('transform');
        } else {
          this.oldValue = '';
        }
        this.x1 = this.coords[0];
        this.y1 = this.coords[1];
        break;

      case 'mouseMove':
        this.x2 = this.coords[0];
        this.y2 = this.coords[1];
        const value = Math.sqrt(Math.pow(this.x2 - this.x1, 2) + Math.pow(this.y2 - this.y1, 2));
        const rotate = this.oldValue + 'rotate(' + value + ' ' + this.x1 + ' ' + this.y1 + ' )';
        this.selectedElement.setAttribute('transform', rotate);
        break;

      case 'mouseUp':
        this.selectedElement = null;
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

        break;

      case 'mouseMove':
        this.selectedElement.setAttribute('x2', this.coords[0].toString());
        this.selectedElement.setAttribute('y2', this.coords[1].toString());
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

        break;

      case 'mouseMove':
        this.x2 = this.coords[0];
        this.y2 = this.coords[1];
        const radius = Math.sqrt(Math.pow(this.x2 - this.x1, 2) + Math.pow(this.y2 - this.y1, 2));
        this.selectedElement.setAttribute('r', radius.toString());
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

        break;

      case 'mouseMove':
        this.x2 = this.coords[0];
        this.y2 = this.coords[1];
        const rx = (this.x1 <= this.x2) ? this.x2 - this.x1 : this.x1 - this.x2;
        const ry = (this.y1 <= this.y2) ? this.y2 - this.y1 : this.y1 - this.y2;
        this.selectedElement.setAttribute('rx', rx.toString());
        this.selectedElement.setAttribute('ry', ry.toString());
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

        break;

      case 'mouseMove':
        this.x2 = this.coords[0];
        this.y2 = this.coords[1];
        let width; let height;
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
        break;

      case 'mouseUp':
        this.selectedElement = null;
        break;
    }

  }

  drawPathAction() {

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
        this.selectedElement.setAttribute('stroke', this.properties.getColor());
        this.image.append(this.selectedElement);

        break;

      case 'mouseMove':
        this.x2 = this.coords[0];
        this.y2 = this.coords[1];
        const width = this.x2 - this.x1;
        const height = this.y2 - this.y1;
        this.selectedElement.setAttribute('height', height.toString());
        this.selectedElement.setAttribute('width', width.toString());
        break;

      case 'mouseUp':
        this.selectedElement = null;
        break;
    }

  }

  drawPolygonAction() {

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
        this.image.append(this.selectedElement);

        break;

      case 'mouseMove':
        this.x2 = this.coords[0];
        this.y2 = this.coords[1];
        const width = this.x2 - this.x1;
        const height = this.y2 - this.y1;
        this.selectedElement.setAttribute('height', height.toString());
        this.selectedElement.setAttribute('width', width.toString());
        break;

      case 'mouseUp':
        this.selectedElement = null;
        break;
    }

  }

  drawPolylineAction() {

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
        this.selectedElement.setAttribute('stroke', this.properties.getColor());
        this.image.append(this.selectedElement);

        break;

      case 'mouseMove':
        this.x2 = this.coords[0];
        this.y2 = this.coords[1];
        const width = this.x2 - this.x1;
        const height = this.y2 - this.y1;
        this.selectedElement.setAttribute('height', height.toString());
        this.selectedElement.setAttribute('width', width.toString());
        break;

      case 'mouseUp':
        this.selectedElement = null;
        break;
    }

  }

  drawTextAction() {

    if (this.lastMouseEvent === 'mouseDown') {
      this.selectedElement = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      this.x1 = this.coords[0];
      this.y1 = this.coords[1];
      this.selectedElement.setAttribute('x', this.x1.toString());
      this.selectedElement.setAttribute('y', this.y1.toString());
      this.selectedElement.append(document.createTextNode('|'));
      this.selectedElement.setAttribute('fill', this.properties.getColor());
      this.selectedElement.setAttribute('font-size', this.properties.getFontProperties().size);
      this.image.append(this.selectedElement);
      /*@HostListener('keypress', ['$event'])
          onMouseup(event: MouseEvent) {
          this.lastMouseEvent = 'mouseUp';
          this.isMouseDown = false;
          this.actions(event);
      }
  switch(this.){

  }*/


      /*case 'mouseUp':
        this.selectedElement = null;
        break;*/
    }
  }

  deleteAction() {

    switch (this.lastMouseEvent) {
      case 'mouseDown':
        const element = this.image.getElementAt(this.coords);
        element.outerHTML = '';
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
