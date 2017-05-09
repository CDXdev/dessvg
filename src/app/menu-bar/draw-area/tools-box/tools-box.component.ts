import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tools-box',
  templateUrl: './tools-box.component.html',
  styleUrls: ['./tools-box.component.css']
})
export class ToolsBoxComponent implements OnInit {

  private selectedTool: string;
  public lineProperties: { thickness: string };
  public color;

  constructor() { }

  ngOnInit() {
    this.selectedTool = 'translate';
    this.lineProperties = { thickness: '1' };
  }

  getSelectedTool() {
    return this.selectedTool;
  }

  getLineProperties() {
    return this.lineProperties;
  }

  clickColor(colorPicker) {
    this.color = (<HTMLInputElement> document.getElementById('html5colorpicker')).value;
    console.log(this.color.value);
  }
}
