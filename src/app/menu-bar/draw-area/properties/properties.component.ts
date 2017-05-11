import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-properties',
  templateUrl: './properties.component.html',
  styleUrls: ['./properties.component.css']
})
export class PropertiesComponent implements OnInit {

  public lineProperties: { thickness: string };
  public color;
  public colorStroke;
  public fontProperties: { size: string };

  constructor() {
    this.lineProperties = { thickness: '10' };
    this.color = '#000';
    this.colorStroke = '#f00';
    this.fontProperties =  { size: '30'};
  }

  ngOnInit() {
  }

  getLineProperties() {
    return this.lineProperties;
  }

  getColor() {
    return this.color;
  }

  getColorStroke() {
    return this.colorStroke;
  }

  getFontProperties() {
    return this.fontProperties;
  }
}
