import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tools-box',
  templateUrl: './tools-box.component.html',
  styleUrls: ['./tools-box.component.css']
})
export class ToolsBoxComponent implements OnInit {

  private lastPressedButton: Element;
  private selectedTool: string;
  public lineProperties: { thickness: string };
  private color;

  constructor() { }

  ngOnInit() {
    this.selectedTool = 'translate';
    this.lineProperties = { thickness: '10' };
  }

  getSelectedTool() {
    return this.selectedTool;
  }

  getLineProperties() {
    return this.lineProperties;
  }

  getColor() {
    return this.color;
  }

  private setSelectedTool(tool: string, event: Event) {
    this.selectedTool = tool;
    if (!(this.lastPressedButton == null)) {
      this.lastPressedButton.setAttribute('style', 'background: #fff');
    }
    this.lastPressedButton = (<Element>event.currentTarget);
    this.lastPressedButton.setAttribute('style', 'background: #e7e7e7');
  }
}
