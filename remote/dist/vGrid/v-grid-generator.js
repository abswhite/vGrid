"use strict";

System.register(["aurelia-framework"], function (_export, _context) {
  "use strict";

  var ViewSlot, _createClass, VGridGenerator;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  return {
    setters: [function (_aureliaFramework) {
      ViewSlot = _aureliaFramework.ViewSlot;
    }],
    execute: function () {
      _createClass = function () {
        function defineProperties(target, props) {
          for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
          }
        }

        return function (Constructor, protoProps, staticProps) {
          if (protoProps) defineProperties(Constructor.prototype, protoProps);
          if (staticProps) defineProperties(Constructor, staticProps);
          return Constructor;
        };
      }();

      _export("VGridGenerator", VGridGenerator = function () {
        function VGridGenerator(vGrid) {
          _classCallCheck(this, VGridGenerator);

          this.contentHeight = 0;
          this.gridHeight = 0;
          this.gridWidth = 0;
          this.scrollBodyHeight = 0;
          this.scrollBottomOnNext = false;
          this.htmlCache = {
            grid: null,
            header: null,
            content: null,
            footer: null,
            rowsArray: [],
            scrollBody: null,
            rowTemplate: null };
          this.scrollVars = {
            lastScrollTop: 0,
            lastScrollLeft: 0,
            isScrollBarScrolling: false,
            timer: null,
            scrollCallbackTimer: null
          };
          this.selection = this.vGridSelection;

          this.vGrid = vGrid;
        }

        VGridGenerator.prototype.fillDataInRows = function fillDataInRows() {
          for (var i = 0; i < this.getRowCacheLength(); i++) {
            var currentRow = this.htmlCache.rowsArray[i].top / this.vGridConfig.rowHeight;
            var row = this.htmlCache.rowsArray[i];
            this.insertRowMarkup(currentRow, row, true, true);
          }
        };

        VGridGenerator.prototype.fillDataIntoRow = function fillDataIntoRow(rowno) {
          for (var i = 0; i < this.getRowCacheLength(); i++) {
            var currentRow = this.htmlCache.rowsArray[i].top / this.vGridConfig.rowHeight;
            if (rowno === currentRow) {
              var row = this.htmlCache.rowsArray[i];
              this.insertRowMarkup(currentRow, row, true, true);
            }
          }
        };

        VGridGenerator.prototype.updateSelectionOnAllRows = function updateSelectionOnAllRows() {
          var i;
          for (i = 0; i < this.getRowCacheLength(); i++) {
            var currentRow = this.htmlCache.rowsArray[i].top / this.vGridConfig.rowHeight;
            if (this.vGridSelection.isSelected(currentRow)) {
              this.htmlCache.rowsArray[i].div.classList.add(this.vGridConfig.css.rowSelected);
            } else {
              this.htmlCache.rowsArray[i].div.classList.remove(this.vGridConfig.css.rowSelected);
            }
          }
        };

        VGridGenerator.prototype.getHeaderTemplate = function getHeaderTemplate() {
          var rowTemplate = "";
          for (var i = 0; i < this.vGridConfig.columnLenght; i++) {
            rowTemplate = rowTemplate + ("<v-grid-header-col column-no=\"" + i + "\">" + this.vGridConfig.colConfig[i].headerTemplate + "</v-grid-header-col>");
          }
          return rowTemplate;
        };

        VGridGenerator.prototype.getRowViewFactory = function getRowViewFactory() {
          var rowTemplate = "";
          var viewFactory;
          if (this.htmlCache.rowTemplate !== null) {
            viewFactory = this.htmlCache.rowTemplate;
          } else {
            if (this.vGrid.vGridConfig.repeater) {
              rowTemplate = '<template>' + this.vGrid.vGridConfig.repeatTemplate + '</template>';
            } else {
              rowTemplate = '<template>';
              for (var i = 0; i < this.vGridConfig.columnLenght; i++) {
                rowTemplate = rowTemplate + ("<v-grid-row-col column-no=" + i + ">" + this.vGridConfig.colConfig[i].rowTemplate + "</v-grid-row-col>");
              }
              rowTemplate + '</template>';
            }

            viewFactory = this.vGrid.viewCompiler.compile(rowTemplate, this.vGrid.viewResources);
          }

          this.htmlCache.rowTemplate = viewFactory;

          return this.htmlCache.rowTemplate;
        };

        VGridGenerator.prototype.getTotalColumnWidth = function getTotalColumnWidth() {
          var total = 0;
          for (var i = 0; i < this.vGridConfig.columnLenght; i++) {
            total = total + parseInt(this.vGridConfig.colConfig[i].width, 10);
          }
          return total;
        };

        VGridGenerator.prototype.getRowCacheLength = function getRowCacheLength() {
          return this.htmlCache.rowsArray.length;
        };

        VGridGenerator.prototype.setRowTopValue = function setRowTopValue(rowArray, elementNo, topValue) {
          rowArray[elementNo].div.style.transform = "translate3d(0px," + topValue + "px, 0px)";
          rowArray[elementNo].top = topValue;
        };

        VGridGenerator.prototype.createGridHtmlWrapper = function createGridHtmlWrapper() {

          var x = document.createElement("DIV");
          this.vGridElement.appendChild(x);
          this.htmlCache.grid = x;

          this.htmlCache.grid.className = this.vGridConfig.css.wrapper;
          this.htmlCache.grid.style.position = "relative";
          this.htmlCache.grid.style.height = this.vGridElement.style.height || "100%";
          this.htmlCache.grid.style.width = this.vGridElement.style.width || "100%";

          this.gridHeight = this.htmlCache.grid.clientHeight;
          this.gridWidght = this.htmlCache.grid.clientWidth;
        };

        VGridGenerator.prototype.createLoadingScreen = function createLoadingScreen() {
          var loadingScreentHtml = ['<div class="v-grid-overlay" if.bind="loading">', '</div>', '<div if.two-way="loading" class="v-grid-progress-indicator">', '<div class="v-grid-progress-bar" role="progressbar" style="width:100%">', '<span>${ loadingMessage }</span>', '</div>', '</div>'];

          var viewFactory = this.vGrid.viewCompiler.compile('<template>' + loadingScreentHtml.join("") + '</template>', this.vGrid.viewResources);
          var view = viewFactory.create(this.vGrid.container);

          this.headerViewSlot = new ViewSlot(this.htmlCache.grid, true);
          this.headerViewSlot.add(view);

          this.headerViewSlot.bind(this.vGrid, {
            bindingContext: this.vGrid,
            parentOverrideContext: this.vGrid.overrideContext
          });
          this.headerViewSlot.attached();
        };

        VGridGenerator.prototype.createGridHtmlHeaderWrapper = function createGridHtmlHeaderWrapper() {
          this.htmlCache.header = document.createElement("DIV");
          this.htmlCache.header.className = this.vGridConfig.css.mainHeader;
          this.htmlCache.header.style.height = this.vGridConfig.headerHeight + "px";
          this.htmlCache.grid.appendChild(this.htmlCache.header);

          var row = document.createElement("DIV");
          row.className = this.vGridConfig.css.row + " " + this.vGridConfig.css.rowHeader;

          row.style.height = this.vGridConfig.headerHeight + "px";
          row.style.width = this.getTotalColumnWidth() + "px";
          this.htmlCache.header.appendChild(row);

          var viewFactory = this.vGrid.viewCompiler.compile('<template>' + this.getHeaderTemplate() + '</template>', this.vGrid.viewResources);
          var view = viewFactory.create(this.vGrid.container);

          this.headerViewSlot = new ViewSlot(this.htmlCache.header.firstChild, true);
          this.headerViewSlot.add(view);

          var bindingContext = {};
          this.headerViewSlot.bind(bindingContext, {
            bindingContext: bindingContext,
            parentOverrideContext: this.vGrid.overrideContext
          });
          this.headerViewSlot.attached();
        };

        VGridGenerator.prototype.rebuildGridHeaderHtml = function rebuildGridHeaderHtml() {
          var getScrollLeft = this.htmlCache.header.firstChild.style.left;
          this.htmlCache.header.removeChild(this.htmlCache.header.firstChild);

          var row = document.createElement("DIV");
          row.className = this.vGridConfig.css.row + " " + this.vGridConfig.css.rowHeader;
          row.style.height = this.vGridConfig.headerHeight + "px";
          row.style.width = this.getTotalColumnWidth() + "px";
          this.htmlCache.header.appendChild(row);

          var viewFactory = this.vGrid.viewCompiler.compile('<template>' + this.getHeaderTemplate() + '</template>', this.vGrid.viewResources);
          var view = viewFactory.create(this.vGrid.container);

          this.headerViewSlot.unbind();
          this.headerViewSlot.detached();
          this.headerViewSlot.removeAll();
          this.headerViewSlot = null;

          this.headerViewSlot = new ViewSlot(this.htmlCache.header.firstChild, true);
          this.headerViewSlot.add(view);

          var bindingContext = {};
          this.headerViewSlot.bind(bindingContext, {
            bindingContext: bindingContext,
            parentOverrideContext: this.vGrid.overrideContext
          });
          this.headerViewSlot.attached();

          this.addResizableAndSortableEvent();

          this.htmlCache.header.firstChild.style.left = getScrollLeft;
        };

        VGridGenerator.prototype.createGridHtmlContentWrapper = function createGridHtmlContentWrapper() {
          var gridWrapperHeight = this.gridHeight;
          var headerAndFooterHeight = this.vGridConfig.headerHeight + this.vGridConfig.footerHeight;
          this.contentHeight = gridWrapperHeight - headerAndFooterHeight;

          this.htmlCache.content = document.createElement("DIV");
          this.htmlCache.content.className = this.vGridConfig.css.mainContent;
          this.htmlCache.content.style.height = this.contentHeight + "px";
          this.htmlCache.grid.appendChild(this.htmlCache.content);
        };

        VGridGenerator.prototype.createGridHtmlFooterWrapper = function createGridHtmlFooterWrapper() {
          this.htmlCache.footer = document.createElement("DIV");
          this.htmlCache.footer.className = this.vGridConfig.css.mainFooter;
          this.htmlCache.footer.style.height = this.vGridConfig.footerHeight + "px";
          this.htmlCache.grid.appendChild(this.htmlCache.footer);

          if (this.vGridConfig.eventOnRemoteCall) {
            var viewFactory = this.vGrid.viewCompiler.compile('<template><v-grid-pager></v-grid-pager></template>', this.vGrid.viewResources);
            var view = viewFactory.create(this.vGrid.container);
            this.footerViewSlot = new ViewSlot(this.htmlCache.footer, true);
            this.footerViewSlot.add(view);

            this.footerViewSlot.bind(this, {
              bindingContext: this,
              parentOverrideContext: this.vGrid.overrideContext
            });
            this.footerViewSlot.attached();
          }
        };

        VGridGenerator.prototype.setScrollBodyHeightToVar = function setScrollBodyHeightToVar() {
          var collectionLength = this.vGridConfig.getCollectionLength();
          this.scrollBodyHeight = collectionLength * this.vGridConfig.rowHeight;
        };

        VGridGenerator.prototype.createGridHtmlScrollBodyWrapper = function createGridHtmlScrollBodyWrapper() {
          this.setScrollBodyHeightToVar();

          this.htmlCache.scrollBody = document.createElement("DIV");
          this.htmlCache.scrollBody.className = this.vGridConfig.css.scrollBody;
          this.htmlCache.scrollBody.style.height = this.scrollBodyHeight + "px";
          this.htmlCache.scrollBody.style.width = this.getTotalColumnWidth() + "px";
          this.htmlCache.content.appendChild(this.htmlCache.scrollBody);
        };

        VGridGenerator.prototype.correctRowAndScrollbodyWidth = function correctRowAndScrollbodyWidth() {
          this.htmlCache.scrollBody.style.width = this.getTotalColumnWidth() + "px";
          for (var i = 0; i < this.htmlCache.rowsArray.length; i++) {
            this.htmlCache.rowsArray[i].div.style.width = this.getTotalColumnWidth() + "px";
          }
          this.htmlCache.header.firstChild.style.width = this.getTotalColumnWidth() + "px";
        };

        VGridGenerator.prototype.correctHeaderAndScrollbodyWidth = function correctHeaderAndScrollbodyWidth() {
          this.htmlCache.scrollBody.style.width = this.getTotalColumnWidth() + "px";
          this.htmlCache.header.firstChild.style.width = this.getTotalColumnWidth() + "px";
        };

        VGridGenerator.prototype.createGridHtmlRowWrapper = function createGridHtmlRowWrapper() {
          var minimumRowsNeeded = parseInt(this.contentHeight / this.vGridConfig.rowHeight, 10);

          if (minimumRowsNeeded % 2 === 1) {
            minimumRowsNeeded = minimumRowsNeeded + 7;
          } else {
            minimumRowsNeeded = minimumRowsNeeded + 6;
          }

          var top = 0;
          for (var i = 0; i < minimumRowsNeeded; i++) {

            var row = document.createElement("DIV");

            row.className = this.vGridConfig.css.row;

            if (i % 2 === 1) {
              row.classList.add(this.vGridConfig.css.rowAlt);
            } else {
              row.classList.add(this.vGridConfig.css.rowEven);
            }

            row.style.height = this.vGridConfig.rowHeight + "px";

            this.setRowTopValue([{
              div: row,
              top: 0
            }], 0, top);

            row.style.minWidth = this.htmlCache.grid.offsetWidth + "px";
            row.style.width = this.getTotalColumnWidth() + "px";

            row.innerHTML = "";
            this.htmlCache.scrollBody.appendChild(row);

            this.htmlCache.rowsArray.push({
              div: row,
              top: top
            });

            top = top + this.vGridConfig.rowHeight;
          }
        };

        VGridGenerator.prototype.insertRowMarkup = function insertRowMarkup(rowNo, row, isDownScroll, isLargeScroll) {
          var _this = this;

          this.vGridConfig.getDataElement(rowNo, isDownScroll, isLargeScroll, function (entity) {

            row.div.setAttribute("row", rowNo);

            if (entity === "") {
              var bindingContext = {};
              row.viewSlot.bind(bindingContext, {
                bindingContext: bindingContext,
                parentOverrideContext: _this.vGrid.overrideContext
              });
            }

            if (entity !== "" && row.viewSlot !== null) {
              var tempRef = {};
              for (var k in entity) {
                if (entity.hasOwnProperty(k)) {
                  if (tempRef[k] !== entity[k]) {
                    tempRef[k] = entity[k];
                  }
                }
              }
              var that = _this;
              var _bindingContext = {};
              _bindingContext.row = rowNo;
              _bindingContext.ctx = _this;
              _bindingContext.tempRef = tempRef;
              _bindingContext.rowRef = _this.vGrid.vGridCollectionFiltered[rowNo];
              row.viewSlot.bind(_bindingContext, {
                bindingContext: _bindingContext,
                parentOverrideContext: _this.vGrid.overrideContext
              });
            }

            if (entity === undefined || entity === "") {
              row.div.style.display = "none";
            } else {
              row.div.style.display = "block";
            }

            if (rowNo % 2 === 1) {
              if (row.div.classList.contains(_this.vGridConfig.css.rowEven)) {
                row.div.classList.remove(_this.vGridConfig.css.rowEven);
                row.div.classList.add(_this.vGridConfig.css.rowAlt);
              }
            } else {
              if (row.div.classList.contains(_this.vGridConfig.css.rowAlt)) {
                row.div.classList.remove(_this.vGridConfig.css.rowAlt);
                row.div.classList.add(_this.vGridConfig.css.rowEven);
              }
            }

            if (_this.vGridSelection.isSelected(rowNo)) {
              row.div.classList.add(_this.vGridConfig.css.rowSelected);
            } else {
              row.div.classList.remove(_this.vGridConfig.css.rowSelected);
            }
          });
        };

        VGridGenerator.prototype.onNormalScrollingLarge = function onNormalScrollingLarge() {
          var _this2 = this;

          this.scrollVars.lastScrollTop = this.htmlCache.content.scrollTop;

          if (this.vGridConfig.getCollectionLength() <= this.htmlCache.rowsArray.length) {
            this.scrollVars.lastScrollTop = 0;
          }

          var rowHeight = this.vGridConfig.rowHeight;
          var bodyHeight = this.htmlCache.content.clientHeight;
          var currentRow = parseInt(this.scrollVars.lastScrollTop / rowHeight, 10);
          var firstRow = parseInt(this.htmlCache.content.scrollTop / rowHeight, 10);
          var currentRowTop = rowHeight * currentRow;
          var firstRowTop = rowHeight * firstRow;
          var collectionLength = this.vGridConfig.getCollectionLength();

          var setAfter = function setAfter(cacheRowNumber) {
            var row = _this2.htmlCache.rowsArray[cacheRowNumber];
            _this2.setRowTopValue([row], 0, currentRowTop);
            currentRowTop = currentRowTop + rowHeight;
          };

          var setBefore = function setBefore(cacheRowNumber) {
            var row = _this2.htmlCache.rowsArray[cacheRowNumber];
            firstRowTop = firstRowTop - rowHeight;
            _this2.setRowTopValue([row], 0, firstRowTop);
          };

          var setHiddenFromView = function setHiddenFromView(cacheRowNumber) {
            var row = _this2.htmlCache.rowsArray[cacheRowNumber];
            _this2.setRowTopValue([row], 0, -(currentRowTop + _this2.vGridConfig.rowHeight * 50));
          };

          for (var i = 0; i < this.getRowCacheLength(); i++) {
            var moved = false;
            switch (true) {
              case currentRow >= 0 && currentRow <= collectionLength - 1:
                setAfter(i);
                moved = true;
                break;
              case currentRow >= collectionLength && collectionLength * rowHeight >= bodyHeight:
                setBefore(i);
                moved = true;
                break;
            }
            if (!moved) {
              if (currentRow >= collectionLength && currentRowTop - rowHeight >= bodyHeight) {
                setHiddenFromView(i);
              } else {
                if (currentRow >= collectionLength) {
                  setAfter(i);
                }
              }
            }

            currentRow++;
          }

          this.htmlCache.rowsArray.sort(function (a, b) {
            return parseInt(a.top) - parseInt(b.top);
          });

          this.fillDataInRows();
        };

        VGridGenerator.prototype.onNormalScrolling = function onNormalScrolling(isDownScroll, currentScrollTop) {
          var currentScrollTop = this.htmlCache.content.scrollTop;
          if (this.scrollVars.isScrollBarScrolling === false) {
            var newTopValue;
            var currentRow = parseInt(this.scrollVars.lastScrollTop / this.vGridConfig.rowHeight, 10);
            var collectionHeight = this.vGridConfig.rowHeight * this.getRowCacheLength();
            var rowHeight = this.vGridConfig.rowHeight;

            for (var i = 0; i < this.getRowCacheLength(); i++) {

              var row = this.htmlCache.rowsArray[i];
              var rowTop = parseInt(row.top, 10);
              var update = false;

              if (isDownScroll) {
                this.lastScrollType = "down";
                if (rowTop < currentScrollTop - rowHeight) {
                  update = true;
                  newTopValue = rowTop + collectionHeight;
                  currentRow = (rowTop + collectionHeight) / rowHeight;
                }

                if (rowTop > (this.vGridConfig.getCollectionLength() - 1) * rowHeight && rowTop > parseInt(this.htmlCache.content.style.height)) {
                  update = false;
                  this.setRowTopValue([row], 0, -(rowHeight * i + rowHeight * 50));
                }
              } else {
                this.lastScrollType = "up";
                if (rowTop > currentScrollTop + this.contentHeight) {
                  update = true;
                  newTopValue = rowTop - collectionHeight;
                  currentRow = (rowTop - collectionHeight) / rowHeight;
                }
              }

              if (update === true && currentRow >= 0 && currentRow <= this.vGridConfig.getCollectionLength() - 1) {
                this.setRowTopValue([row], 0, newTopValue);
                this.insertRowMarkup(currentRow, row, isDownScroll, false);
              }
            }

            this.htmlCache.rowsArray.sort(function (a, b) {
              return parseInt(a.top) - parseInt(b.top);
            });
          } else {
            this.onScrollbarScrolling();
          }
        };

        VGridGenerator.prototype.hideRowsThatIsLargerThanCollection = function hideRowsThatIsLargerThanCollection() {
          var currentRow = parseInt(this.scrollVars.lastScrollTop / this.vGridConfig.rowHeight, 10);

          for (var i = 0; i < this.getRowCacheLength(); i++) {
            var row = this.htmlCache.rowsArray[i];
            var rowTop = parseInt(row.top, 10);
            if (rowTop > (this.vGridConfig.getCollectionLength() - 1) * this.vGridConfig.rowHeight && rowTop > parseInt(this.htmlCache.content.style.height) - this.vGridConfig.rowHeight) {
              this.setRowTopValue([row], 0, -5000 + i);
            }
          }

          this.htmlCache.rowsArray.sort(function (a, b) {
            return parseInt(a.top) - parseInt(b.top);
          });
        };

        VGridGenerator.prototype.onScrollbarScrolling = function onScrollbarScrolling() {
          var _this3 = this;

          this.scrollVars.isScrollBarScrolling = true;

          var timeout = this.vGridConfig.dataScrollDelay;

          clearTimeout(this.scrollVars.timer);

          this.scrollVars.timer = setTimeout(function () {
            _this3.onNormalScrollingLarge();
            _this3.scrollVars.isScrollBarScrolling = false;
          }, timeout);
        };

        VGridGenerator.prototype.onScroll = function onScroll() {
          var _this4 = this;

          var doScroll = function doScroll() {

            var currentScrollTop = _this4.htmlCache.content.scrollTop;
            var currentScrollLeft = _this4.htmlCache.content.scrollLeft;

            if (currentScrollTop !== _this4.scrollVars.lastScrollTop) {
              if (currentScrollLeft !== 0) {
                _this4.htmlCache.content.scrollLeft = _this4.scrollVars.lastScrollLeft;
                _this4.htmlCache.header.scrollLeft = _this4.scrollVars.lastScrollLeft;
              }

              var isDownScroll = true;
              if (currentScrollTop < _this4.scrollVars.lastScrollTop) {
                isDownScroll = false;
              }

              var isLargeScroll;
              switch (true) {
                case currentScrollTop > _this4.scrollVars.lastScrollTop + _this4.vGridConfig.largeScrollLimit:
                case currentScrollTop < _this4.scrollVars.lastScrollTop - _this4.vGridConfig.largeScrollLimit:
                  isLargeScroll = true;
                  break;
                default:
                  isLargeScroll = false;
              }

              _this4.scrollVars.lastScrollTop = currentScrollTop;

              if (isLargeScroll) {
                if (_this4.vGridConfig.renderOnScrollbarScroll) {
                  _this4.onNormalScrollingLarge(isDownScroll, currentScrollTop);
                } else {
                  _this4.onScrollbarScrolling();
                }
              } else {
                _this4.onNormalScrolling(isDownScroll, currentScrollTop);
              }
            } else {

              if (_this4.htmlCache.content.style.overflowX === "hidden") {
                _this4.htmlCache.content.scrollLeft = 0;
                _this4.scrollVars.lastScrollLeft = 0;
                _this4.htmlCache.header.scrollLeft = 0;
              } else {
                if (_this4.scrollVars.lastScrollLeft !== currentScrollLeft) {
                  currentScrollLeft = _this4.htmlCache.content.scrollLeft;
                  _this4.scrollVars.lastScrollLeft = currentScrollLeft;
                  _this4.htmlCache.header.scrollLeft = currentScrollLeft;
                }
              }
            }
          };
          clearTimeout(this.scrollVars.scrollCallbackTimer);
          if (this.vGridConfig.requestAnimationFrame) {
            requestAnimationFrame(function () {
              doScroll();
            });
          } else {
            doScroll();
          }
        };

        VGridGenerator.prototype.updateGridScrollbars = function updateGridScrollbars() {

          var collectionHeight = this.vGridConfig.getCollectionLength() * this.vGridConfig.rowHeight + this.vGridConfig.rowHeight / 2;
          var bodyHeight = this.htmlCache.content.offsetHeight;


          if (collectionHeight <= bodyHeight) {
            this.htmlCache.content.scrollTop = 0;

            this.htmlCache.content.style.overflow = "";
            this.htmlCache.content.style.overflowY = "hidden";
            this.htmlCache.content.style.overflowX = "hidden";
            this.htmlCache.header.style.overflowY = "hidden";
          } else {
            this.htmlCache.content.style.overflow = "";
            this.htmlCache.content.style.overflowY = "scroll";
            this.htmlCache.content.style.overflowX = "hidden";
            this.htmlCache.header.style.overflowY = "scroll";
          }

          if (this.htmlCache.content.offsetWidth - 5 < this.getTotalColumnWidth()) {
            this.htmlCache.content.style.overflowX = "scroll";
          }
        };

        VGridGenerator.prototype.addResizableAndSortableEvent = function addResizableAndSortableEvent() {
          if (this.vGridConfig.isResizableHeaders) {
            this.vGridResizable.init();
          }

          if (this.vGridConfig.isSortableHeader) {
            this.vGridSortable.init();
          }
        };

        VGridGenerator.prototype.addEvents = function addEvents() {
          var _this5 = this;

          var handleClick = function handleClick(e) {
            var currentRow = parseInt(e.currentTarget.getAttribute("row"));
            _this5.vGridConfig.clickHandler(e, currentRow);
            if (_this5.vGridConfig.isMultiSelect !== undefined) {
              _this5.vGridSelection.setHightlight(e, currentRow, _this5);
            }
          };

          var handleDblClick = function handleDblClick(e) {
            var currentRow = parseInt(e.currentTarget.getAttribute("row"));
            _this5.vGridConfig.clickHandler(e, currentRow);
          };

          for (var i = 0; i < this.getRowCacheLength(); i++) {
            var div = this.htmlCache.rowsArray[i].div;
            div.addEventListener("dblclick", handleDblClick.bind(this), false);
            div.addEventListener("click", handleClick.bind(this), false);
          }

          this.htmlCache.content.addEventListener("scroll", this.onScroll.bind(this));

          this.addResizableAndSortableEvent();
        };

        VGridGenerator.prototype.setLargeScrollLimit = function setLargeScrollLimit() {
          if (!this.vGridConfig.largeScrollLimit) {
            this.vGridConfig.largeScrollLimit = this.contentHeight * 1.5;
          }
        };

        VGridGenerator.prototype.addHtml = function addHtml() {
          this.createGridHtmlWrapper();
          this.createLoadingScreen();
          this.createGridHtmlHeaderWrapper();
          this.createGridHtmlContentWrapper();
          this.createGridHtmlFooterWrapper();
          this.createGridHtmlScrollBodyWrapper();
          this.createGridHtmlRowWrapper();
          this.updateGridScrollbars();
        };

        VGridGenerator.prototype.createViewSlots = function createViewSlots() {

          var rows = this.htmlCache.rowsArray;
          for (var i = 0; i < rows.length; i++) {
            var viewFactory = this.getRowViewFactory();
            var view = viewFactory.create(this.vGrid.container);
            rows[i].viewSlot = new ViewSlot(rows[i].div, true);
            rows[i].viewSlot.add(view);
            var bindingContext = {};
            rows[i].viewSlot.bind(bindingContext, {
              bindingContext: bindingContext,
              parentOverrideContext: this.vGrid.overrideContext
            });
            rows[i].viewSlot.attached();
          }
        };

        VGridGenerator.prototype.recreateViewSlots = function recreateViewSlots() {
          var rows = this.htmlCache.rowsArray;
          for (var i = 0; i < rows.length; i++) {
            rows[i].viewSlot.unbind();
            rows[i].viewSlot.detached();
            rows[i].viewSlot.removeAll();
            rows[i].viewSlot = null;
            rows[i].div.innerHTML = "";
            this.htmlCache.rowTemplate = null;
            var viewFactory = this.getRowViewFactory();
            var view = viewFactory.create(this.vGrid.container);
            rows[i].viewSlot = new ViewSlot(rows[i].div, true);
            rows[i].viewSlot.add(view);
            var bindingContext = {};
            rows[i].viewSlot.bind(bindingContext, {
              bindingContext: bindingContext,
              parentOverrideContext: this.vGrid.overrideContext
            });
            rows[i].viewSlot.attached();
          }
        };

        VGridGenerator.prototype.init = function init(isRebuild) {
          this.addHtml();
          this.addEvents();
          if (!isRebuild) {
            this.vGridSelection.setMode(this.vGridConfig.isMultiSelect);
          }
          this.createViewSlots();
          this.fillDataInRows();
          this.setLargeScrollLimit();
        };

        VGridGenerator.prototype.redrawGrid = function redrawGrid() {
          this.vGridElement.getElementsByClassName(this.vGridConfig.css.wrapper)[0].remove();
          this.htmlCache.rowsArray = [];
          this.htmlCache.header = null;
          this.htmlCache.content = null;
          this.htmlCache.footer = null;
          this.htmlCache.scrollBody = null;
          this.htmlCache.rowTemplate = null;

          this.init(true);
          this.fixHeaderWithBody();
        };

        VGridGenerator.prototype.fixHeaderWithBody = function fixHeaderWithBody() {
          var currentScrollLeft = this.htmlCache.content.scrollLeft;
          this.htmlCache.header.scrollLeft = currentScrollLeft;
        };

        VGridGenerator.prototype.rebuildColumns = function rebuildColumns() {
          this.rebuildGridHeaderHtml();
          this.recreateViewSlots();
          this.fillDataInRows();
          this.correctRowAndScrollbodyWidth();
          this.updateSelectionOnAllRows();
          this.updateGridScrollbars();
          this.fixHeaderWithBody();
        };

        VGridGenerator.prototype.rebuildColumnsRows = function rebuildColumnsRows() {
          this.recreateViewSlots();
          this.fillDataInRows();
          this.updateSelectionOnAllRows();
          this.fixHeaderWithBody();
        };

        VGridGenerator.prototype.columnChangeAndCollection = function columnChangeAndCollection(resetScrollToTop) {
          this.rebuildGridHeaderHtml();
          this.recreateViewSlots();
          this.fillDataInRows();
          this.updateSelectionOnAllRows();
          this.collectionChange(resetScrollToTop);
        };

        VGridGenerator.prototype.collectionChange = function collectionChange(resetScrollToTop, scrollBottom) {

          if (this.scrollBottomOnNext) {
            scrollBottom = true;
            this.scrollBottomOnNext = false;
          }

          this.setScrollBodyHeightToVar();
          this.htmlCache.scrollBody.style.height = this.scrollBodyHeight + "px";
          var reset = false;
          if (resetScrollToTop === true) {
            this.htmlCache.content.scrollTop = 0;
          }
          if (this.scrollBodyHeight < this.htmlCache.content.scrollTop || scrollBottom) {
            var collectionLength = this.vGridConfig.getCollectionLength();
            var contentRows = parseInt(this.htmlCache.content.offsetHeight / this.vGridConfig.rowHeight);
            var scrollOffsetHeight = contentRows * this.vGridConfig.rowHeight;
            this.htmlCache.content.scrollTop = collectionLength * this.vGridConfig.rowHeight - scrollOffsetHeight;
          }

          this.updateGridScrollbars();
          this.correctRowAndScrollbodyWidth();
          this.updateSelectionOnAllRows();
          this.fixHeaderWithBody();
          this.onNormalScrollingLarge();
          this.fillDataInRows();
          if (scrollBottom) {
            this.htmlCache.content.scrollTop = this.htmlCache.content.scrollTop + this.vGridConfig.rowHeight;
          }

          this.htmlCache.scrollBody.style.height = this.scrollBodyHeight - 1 + "px";
          this.htmlCache.scrollBody.style.height = this.scrollBodyHeight + 1 + "px";
        };

        VGridGenerator.prototype.setColumns = function setColumns(paramObj) {
          this.vGridConfig.colConfig = paramObj.colConfig;
        };

        VGridGenerator.prototype.getColumns = function getColumns() {

          var arr = [];
          this.vGridConfig.colConfig.forEach(function (obj) {
            var x = {};
            for (var k in obj) {
              if (obj.hasOwnProperty(k)) {
                if (x[k] !== obj[k]) {
                  x[k] = obj[k];
                }
              }
            }
            arr.push(x);
          });

          return {
            "colConfig": arr
          };
        };

        VGridGenerator.prototype.getSelectedRows = function getSelectedRows() {
          return this.vGridSelection.getSelectedRows();
        };

        VGridGenerator.prototype.setSelectedRows = function setSelectedRows(sel) {
          this.vGridSelection.setSelectedRows(sel);
          this.updateSelectionOnAllRows();
        };

        VGridGenerator.prototype.scrollBottom = function scrollBottom() {
          var collectionLength = this.vGridConfig.getCollectionLength();
          this.htmlCache.content.scrollTop = collectionLength * this.vGridConfig.rowHeight;
        };

        VGridGenerator.prototype.scrollTop = function scrollTop() {
          this.htmlCache.content.scrollTop = 0;
        };

        VGridGenerator.prototype.setScrollTop = function setScrollTop(newTop) {
          this.htmlCache.content.scrollTop = newTop;
        };

        VGridGenerator.prototype.scrollBottomNext = function scrollBottomNext() {
          this.scrollBottomOnNext = true;
        };

        VGridGenerator.prototype.getScrollTop = function getScrollTop() {
          return this.htmlCache.content.scrollTop;
        };

        VGridGenerator.prototype.updateRow = function updateRow(no) {
          this.fillDataIntoRow(no);
        };

        VGridGenerator.prototype.setEditMode = function setEditMode(value) {
          this.vGridConfig.editMode = value ? true : false;
          this.fillDataInRows();
        };

        VGridGenerator.prototype.clearHeaderSortFilter = function clearHeaderSortFilter() {
          this.vGrid.vGridSort.reset();
          this.rebuildGridHeaderHtml();
        };

        VGridGenerator.prototype.setHeaderSortFilter = function setHeaderSortFilter() {
          this.rebuildGridHeaderHtml();
        };

        _createClass(VGridGenerator, [{
          key: "vGridSelection",
          get: function get() {
            if (this.vGrid) {
              return this.vGrid.vGridSelection;
            } else {
              return null;
            }
          }
        }, {
          key: "vGridConfig",
          get: function get() {
            if (this.vGrid) {
              return this.vGrid.vGridConfig;
            } else {
              return null;
            }
          }
        }, {
          key: "vGridCellHelper",
          get: function get() {
            if (this.vGrid) {
              return this.vGrid.vGridCellHelper;
            } else {
              return null;
            }
          }
        }, {
          key: "vGridElement",
          get: function get() {
            if (this.vGrid) {
              return this.vGrid.element;
            } else {
              return null;
            }
          }
        }, {
          key: "vGridSortable",
          get: function get() {
            if (this.vGrid) {
              return this.vGrid.vGridSortable;
            } else {
              return null;
            }
          }
        }, {
          key: "vGridResizable",
          get: function get() {
            if (this.vGrid) {
              return this.vGrid.vGridResizable;
            } else {
              return null;
            }
          }
        }]);

        return VGridGenerator;
      }());

      _export("VGridGenerator", VGridGenerator);
    }
  };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInZHcmlkL3YtZ3JpZC1nZW5lcmF0b3IuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBT1EsYyxxQkFBQSxROzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Z0NBS0ssYztBQUVYLGdDQUFZLEtBQVosRUFBbUI7QUFBQTs7QUFBQSxlQTZEbkIsYUE3RG1CLEdBNkRILENBN0RHO0FBQUEsZUE4RG5CLFVBOURtQixHQThETixDQTlETTtBQUFBLGVBK0RuQixTQS9EbUIsR0ErRFAsQ0EvRE87QUFBQSxlQWdFbkIsZ0JBaEVtQixHQWdFQSxDQWhFQTtBQUFBLGVBaUVuQixrQkFqRW1CLEdBaUVFLEtBakVGO0FBQUEsZUFtRW5CLFNBbkVtQixHQW1FUDtBQUNWLGtCQUFNLElBREk7QUFFVixvQkFBUSxJQUZFO0FBR1YscUJBQVMsSUFIQztBQUlWLG9CQUFRLElBSkU7QUFLVix1QkFBVyxFQUxEO0FBTVYsd0JBQVksSUFORjtBQU9WLHlCQUFhLElBUEgsRUFuRU87QUFBQSxlQTZFbkIsVUE3RW1CLEdBNkVOO0FBQ1gsMkJBQWUsQ0FESjtBQUVYLDRCQUFnQixDQUZMO0FBR1gsa0NBQXNCLEtBSFg7QUFJWCxtQkFBTyxJQUpJO0FBS1gsaUNBQXFCO0FBTFYsV0E3RU07QUFBQSxlQXNzQ25CLFNBdHNDbUIsR0Fzc0NQLEtBQUssY0F0c0NFOztBQUNqQixlQUFLLEtBQUwsR0FBYSxLQUFiO0FBQ0Q7O2lDQXVGRCxjLDZCQUFpQjtBQUNmLGVBQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxLQUFLLGlCQUFMLEVBQXBCLEVBQThDLEdBQTlDLEVBQW1EO0FBQ2pELGdCQUFJLGFBQWEsS0FBSyxTQUFMLENBQWUsU0FBZixDQUF5QixDQUF6QixFQUE0QixHQUE1QixHQUFrQyxLQUFLLFdBQUwsQ0FBaUIsU0FBcEU7QUFDQSxnQkFBSSxNQUFNLEtBQUssU0FBTCxDQUFlLFNBQWYsQ0FBeUIsQ0FBekIsQ0FBVjtBQUNBLGlCQUFLLGVBQUwsQ0FBcUIs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