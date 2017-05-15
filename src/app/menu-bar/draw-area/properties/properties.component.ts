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

  /**
   * Define default property values
   */
  constructor() {
    this.lineProperties = { thickness: '5' };
    this.color = '#000';
    this.colorStroke = '#f00';
    this.fontProperties =  { size: '30'};
  }

  /**
   * Called when page is initialised
   */
  ngOnInit() {
  }

  /**
   * lineProperty getter
   * 
   * @return lineProperties
   */
  getLineProperties() {
    return this.lineProperties;
  }

  /**
   * color getter
   * 
   * @return color
   */
  getColor() {
    return this.color;
  }

  /**
   * colorStroke getter
   * 
   * @return colorStroke
   */
  getColorStroke() {
    return this.colorStroke;
  }

  /**
   * fontProperty getter
   * 
   * @return fontProperty
   */
  getFontProperties() {
    return this.fontProperties;
  }
}
