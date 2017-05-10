import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tools-box',
  templateUrl: './tools-box.component.html',
  styleUrls: ['./tools-box.component.css']
})
export class ToolsBoxComponent implements OnInit {

  private lastPressedButton: Element;
  private selectedTool: string;

  constructor() { }

  ngOnInit() {
    this.selectedTool = 'translate';
  }

  getSelectedTool() {
    return this.selectedTool;
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
