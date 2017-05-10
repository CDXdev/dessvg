import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-properties',
  templateUrl: './properties.component.html',
  styleUrls: ['./properties.component.css']
})
export class PropertiesComponent implements OnInit {

  public lineProperties: { thickness: string };
  public color;

  constructor() {
    this.lineProperties = { thickness: '1' };
    this.color = '#000';
  }

  ngOnInit() {
  }

  getLineProperties() {
    return this.lineProperties;
  }

  getColor() {
    return this.color;
  }
}
