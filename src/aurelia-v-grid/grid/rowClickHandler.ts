// for typings only:
import { HtmlCache } from './htmlCache';
import { Controller } from './controller';

export class RowClickHandler {
  private element: Element;
  private htmlCache: HtmlCache;
  private selectionMode: string;
  private lastRowSelected: number;
  private lastKeyKodeUsed: string;
  private selectedRows: number;
  private controller: Controller;
  private selection: any; // create interface
  private manualSelection: boolean;


  constructor(element: Element, htmlCache: HtmlCache) {
    this.element = element;
    this.htmlCache = htmlCache;
    this.selectionMode = 'none';
    this.lastRowSelected = -1; // this need to be reset when filtering
    this.lastKeyKodeUsed = 'none'; // this ned to be reset when filtering
    this.selectedRows = 0;
  }


  public init(mode: boolean, manualSelection: boolean, controller: Controller): void {

    this.controller = controller;
    this.selection = controller.getSelectionContext();
    this.manualSelection = manualSelection;

    if (mode === false) {
      this.selectionMode = 'single';
    }
    if (mode === true) {
      this.selectionMode = 'multiple';
    }

    this.addEventlistener();
  }

  public updateSelectionOnAllRows(): void {

    let rowCache = this.htmlCache.rowCache;
    for (let i = 0; i < rowCache.length; i++) {
      let isSelected = this.selection.isSelected(rowCache[i].row);
      rowCache[i].bindingContext.selected = isSelected;
      rowCache[i].bindingContext.selected = isSelected;
      rowCache[i].bindingContext.selected = isSelected;

      if (isSelected) {
        if (!rowCache[i].selected) {
          rowCache[i].selected = true;
          rowCache[i].left.classList.add('avg-selected-row');
          rowCache[i].main.classList.add('avg-selected-row');
          rowCache[i].right.classList.add('avg-selected-row');
        }
      } else {
        if (rowCache[i].selected) {
          rowCache[i].selected = false;
          rowCache[i].left.classList.remove('avg-selected-row');
          rowCache[i].main.classList.remove('avg-selected-row');
          rowCache[i].right.classList.remove('avg-selected-row');
        }
      }
    }

  }

  public getSelectionMode(): string {
    return this.selection.getMode();
  }





  public removeEventlistener(): void {
    let avgLeftRows = this.htmlCache.avg_left_rows;
    let avgMainRows = this.htmlCache.avg_main_rows;
    let avgRightRows = this.htmlCache.avg_right_rows;

    for (let i = 0; i < avgLeftRows.length; i++) {
      avgLeftRows[i].onclick = null;
      avgLeftRows[i].ondblclick = null;
      avgMainRows[i].onclick = null;
      avgMainRows[i].ondblclick = null;
      avgRightRows[i].onclick = null;
      avgRightRows[i].ondblclick = null;
    }
  }

  private addEventlistener(): void {
    let avgLeftRows = this.htmlCache.avg_left_rows;
    let avgMainRows = this.htmlCache.avg_main_rows;
    let avgRightRows = this.htmlCache.avg_right_rows;

    for (let i = 0; i < avgLeftRows.length; i++) {
      avgLeftRows[i].onclick = this.singleClick.bind(this);
      avgLeftRows[i].ondblclick = this.doubleClick.bind(this);
      avgMainRows[i].onclick = this.singleClick.bind(this);
      avgMainRows[i].ondblclick = this.doubleClick.bind(this);
      avgRightRows[i].onclick = this.singleClick.bind(this);
      avgRightRows[i].ondblclick = this.doubleClick.bind(this);
    }
  }


  private getCache(target): any {
    let no = -1;
    this.htmlCache.rowCache.forEach((row, i) => {
      if (row.left === target) {
        no = i;
      }
      if (row.main === target) {
        no = i;
      }
      if (row.right === target) {
        no = i;
      }
      if (row.group === target) {
        no = i;
      }
    });
    if (no !== -1) {
      return this.htmlCache.rowCache[no];
    } else {
      return null;
    }

  }


  private singleClick(event: any): void {
    let cache = this.getCache(event.currentTarget) || {};
    if (!cache.isGroup) {
      this.highlightRow(event, cache.row);
      this.controller.select(cache.row);
    }
    if (!this.manualSelection) {
      this.controller.raiseEvent('v-row-onclick', {
        evt: event,
        data: null, // todo, row data ?
        row: cache.row
      });
    }
  }



  private doubleClick(event: any): void {
    let cache = this.getCache(event.currentTarget) || {};
    this.controller.raiseEvent('v-row-ondblclick', {
      evt: event,
      data: null, // todo, row data ?
      row: cache.row
    });
  }


  private isSelected(row: number): boolean {
    return this.selection.isSelected(row);
  }


  private deSelect(row: number): void {
    this.selection.deSelect(row);
  }


  private select(row: number, addToSelection: boolean): void {
    this.selection.select(row, addToSelection);
  }


  private selectRange(start: number, end: number): void {
    this.selection.selectRange(start, end);
  }


  private getSelectedRows(): Array<number> {
    return this.selection.getSelectedRows();
  }


  private setSelectedRows(newRows: Array<number>): void {
    this.selection.setSelectedRows(newRows);
  }








  private highlightRow(e: MouseEvent, currentRow: number): void {

    let isSel;
    let manualSel = this.manualSelection;
    if (!manualSel) {
      let currentselectedRows = this.getSelectedRows();
      let currentKeyKode = '';

      if (currentRow !== this.lastRowSelected || currentselectedRows[0] !== currentRow) {

        if (currentRow <= (this.controller.collectionLength() - 1)) { // do I need to check this?

          if (this.selectionMode === 'multiple') { // if multiselect duh!


            if (e.shiftKey) {
              currentKeyKode = 'shift';
              currentselectedRows = this.getSelectedRows();
              if (currentselectedRows.length > 0 && this.lastKeyKodeUsed === 'none') {
                this.lastRowSelected = currentselectedRows[0];
                this.lastKeyKodeUsed = 'shift';
              }
            }

            if (e.ctrlKey) {
              currentKeyKode = 'ctrl';
            }

            if (!e.ctrlKey && !e.shiftKey) {
              currentKeyKode = 'none';
            }

            switch (true) {
              case currentKeyKode === 'none':
                this.select(currentRow, false);
                break;
              case this.lastKeyKodeUsed === 'shift' && currentKeyKode === 'ctrl':

                isSel = this.isSelected(currentRow);
                if (isSel === true) {
                  this.deSelect(currentRow);
                } else {
                  this.select(currentRow, true);
                }
                this.lastRowSelected = currentRow;
                break;

              case this.lastKeyKodeUsed === 'ctrl' && currentKeyKode === 'shift':
                let oldSel = this.getSelectedRows();
                this.selectRange(this.lastRowSelected, currentRow);
                let newSel = this.getSelectedRows();
                this.setSelectedRows(oldSel.concat(newSel));

                break;

              case this.lastKeyKodeUsed === 'ctrl' && currentKeyKode === 'ctrl':

                isSel = this.isSelected(currentRow);
                if (isSel === true) {
                  this.deSelect(currentRow);
                } else {
                  this.select(currentRow, true);
                }
                this.lastRowSelected = currentRow;
                break;

              case this.lastKeyKodeUsed === 'none' && currentKeyKode === 'ctrl':

                isSel = this.isSelected(currentRow);
                if (isSel === true) {
                  this.deSelect(currentRow);
                } else {
                  this.select(currentRow, true);
                }
                this.lastRowSelected = currentRow;
                break;

              case this.lastKeyKodeUsed === 'shift' && currentKeyKode === 'shift':

                if (this.lastRowSelected > currentRow) {
                  this.selectRange(currentRow, this.lastRowSelected);
                } else {
                  this.selectRange(this.lastRowSelected, currentRow);
                }

                break;

              case this.lastKeyKodeUsed === 'none' && currentKeyKode === 'shift':

                if (this.lastRowSelected !== -1) {
                  if (this.lastRowSelected > currentRow) {
                    this.selectRange(currentRow, this.lastRowSelected);
                  } else {
                    this.selectRange(this.lastRowSelected, currentRow);
                  }
                } else {
                  this.lastRowSelected = currentRow;
                  this.select(currentRow, false);
                }
                break;
              default:
                console.error('error, this should not happen, debug selection');
            }
          } else {
            this.select(currentRow, false);
          }
          this.lastKeyKodeUsed = currentKeyKode;

          // update selection on rows
          this.updateSelectionOnAllRows();
        }
      } else {

        // same row clicked again
        if (e.ctrlKey) {
          currentKeyKode = 'ctrl';
        }

        // if ctrl button we want to remove selection
        if (currentKeyKode === 'ctrl') {
          this.lastKeyKodeUsed = currentKeyKode;
          isSel = this.isSelected(currentRow);
          if (isSel === true) {
            this.deSelect(currentRow);
          }
          this.lastRowSelected = currentRow;
        } else {
          // else we just want to make it current..
          // isSel = this.isSelected(currentRow);
          this.select(currentRow, false);
        }
        // update selection on rows
        this.updateSelectionOnAllRows();
      }
    }
  }


}