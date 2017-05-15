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

  /**
   * Called when page is initialised
   * 
   * Select tool translate just after the page is loaded
   */
  ngOnInit() {
    this.selectedTool = 'translate';
  }

  /**
   * selectedTool getter
   * 
   * @return selectedTool
   */
  getSelectedTool() {
    return this.selectedTool;
  }

  /**
   * selectedTool setter
   * 
   * Set a tool as selected
   * Change pressed button style
   * 
   * @param {string} tool - the tool to set
   * @param {Event} event - event to see if a button has been pressed and which one
   */
  private setSelectedTool(tool: string, event: Event) {
    this.selectedTool = tool;
    if (!(this.lastPressedButton == null)) {
      this.lastPressedButton.setAttribute('style', 'background: #fff');
    }
    this.lastPressedButton = (<Element>event.currentTarget);
    this.lastPressedButton.setAttribute('style', 'background: #e7e7e7');
  }
}
