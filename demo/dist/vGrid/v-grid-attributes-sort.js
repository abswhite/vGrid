'use strict';

System.register(['aurelia-framework', './v-grid'], function (_export, _context) {
  "use strict";

  var inject, customAttribute, Optional, VGrid, _dec, _dec2, _class, vGridAttributesSort;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  return {
    setters: [function (_aureliaFramework) {
      inject = _aureliaFramework.inject;
      customAttribute = _aureliaFramework.customAttribute;
      Optional = _aureliaFramework.Optional;
    }, function (_vGrid) {
      VGrid = _vGrid.VGrid;
    }],
    execute: function () {
      _export('vGridAttributesSort', vGridAttributesSort = (_dec = customAttribute('v-sort'), _dec2 = inject(Element, VGrid), _dec(_class = _dec2(_class = function () {
        function vGridAttributesSort(element, vGrid) {
          _classCallCheck(this, vGridAttributesSort);

          this.vGrid = vGrid;
          this.element = element;
        }

        vGridAttributesSort.prototype.bind = function bind(bindingContext, overrideContext) {
          this.bindingContext = bindingContext;
          this.overrideContext = overrideContext;

          var values = this.value.split("|");
          this.attribute = values[0];
          this.icon = values[1] ? true : false;
          this.filterOperator = values[2] || "=";
        };

        vGridAttributesSort.prototype.attached = function attached() {
          var _this = this;

          this.sortIcon = document.createElement("SPAN");
          this.sortIcon.innerHTML = this.getSortIconMarkup(this.attribute);
          this.element.appendChild(this.sortIcon);
          this.element.onclick = function (e) {
            _this.vGrid.vGridConfig.onOrderBy(_this.attribute, e.shiftKey);
          };

          this.vGrid.element.addEventListener("sortIconUpdate", function (e) {
            _this.sortIcon.innerHTML = _this.getSortIconMarkup(_this.attribute);
          });
        };

        vGridAttributesSort.prototype.getSortIconMarkup = function getSortIconMarkup(attribute) {
          var _this2 = this;

          var css = this.vGrid.vGridConfig.css;

          var markup = '<span  class="' + css.sortIcon + ' ' + css.sortIconSort + '"></span>';
          var isAscHtml = '<span  class="' + css.sortIcon + ' ' + css.sortIconAsc + '"></span>';
          var isDescHtml = '<span  class="' + css.sortIcon + ' ' + css.sortIconDesc + '"></span>';

          this.vGrid.vGridSort.getFilter().forEach(function (x) {
            if (x.attribute === _this2.attribute) {
              var block = x.asc === true ? isAscHtml : isDescHtml;
              var main = '<span $ class="' + css.sortIconNo + '" data-vgridsort="' + x.no + '"></span>';

              markup = main + block;
            }
          });

          return markup;
        };

        return vGridAttributesSort;
      }()) || _class) || _class));

      _export('vGridAttributesSort', vGridAttributesSort);
    }
  };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInZHcmlkL3YtZ3JpZC1hdHRyaWJ1dGVzLXNvcnQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBS1EsWSxxQkFBQSxNO0FBQVEscUIscUJBQUEsZTtBQUFpQixjLHFCQUFBLFE7O0FBQ3pCLFcsVUFBQSxLOzs7cUNBS0ssbUIsV0FGWixnQkFBZ0IsUUFBaEIsQyxVQUNBLE9BQU8sT0FBUCxFQUFnQixLQUFoQixDO0FBSUMscUNBQVksT0FBWixFQUFxQixLQUFyQixFQUE0QjtBQUFBOztBQUMxQixlQUFLLEtBQUwsR0FBYSxLQUFiO0FBQ0EsZUFBSyxPQUFMLEdBQWUsT0FBZjtBQUNEOztzQ0FJRCxJLGlCQUFLLGMsRUFBZ0IsZSxFQUFpQjtBQUNwQyxlQUFLLGNBQUwsR0FBc0IsY0FBdEI7QUFDQSxlQUFLLGVBQUwsR0FBdUIsZUFBdkI7O0FBR0EsY0FBSSxTQUFTLEtBQUssS0FBTCxDQUFXLEtBQVgsQ0FBaUIsR0FBakIsQ0FBYjtBQUNBLGVBQUssU0FBTCxHQUFpQixPQUFPLENBQVAsQ0FBakI7QUFDQSxlQUFLLElBQUwsR0FBWSxPQUFPLENBQVAsSUFBWSxJQUFaLEdBQW1CLEtBQS9CO0FBQ0EsZUFBSyxjQUFMLEdBQXNCLE9BQU8sQ0FBUCxLQUFhLEdBQW5DO0FBRUQsUzs7c0NBRUQsUSx1QkFBVztBQUFBOztBQUNULGVBQUssUUFBTCxHQUFnQixTQUFTLGFBQVQsQ0FBdUIsTUFBdkIsQ0FBaEI7QUFDQSxlQUFLLFFBQUwsQ0FBYyxTQUFkLEdBQTBCLEtBQUssaUJBQUwsQ0FBdUIsS0FBSyxTQUE1QixDQUExQjtBQUNBLGVBQUssT0FBTCxDQUFhLFdBQWIsQ0FBeUIsS0FBSyxRQUE5QjtBQUNBLGVBQUssT0FBTCxDQUFhLE9BQWIsR0FBdUIsVUFBQyxDQUFELEVBQU07QUFDM0Isa0JBQUssS0FBTCxDQUFXLFdBQVgsQ0FBdUIsU0FBdkIsQ0FBaUMsTUFBSyxTQUF0QyxFQUFpRCxFQUFFLFFBQW5EO0FBQ0QsV0FGRDs7QUFJQSxlQUFLLEtBQUwsQ0FBVyxPQUFYLENBQW1CLGdCQUFuQixDQUFvQyxnQkFBcEMsRUFBc0QsVUFBQyxDQUFELEVBQU07QUFDMUQsa0JBQUssUUFBTCxDQUFjLFNBQWQsR0FBMEIsTUFBSyxpQkFBTCxDQUF1QixNQUFLLFNBQTVCLENBQTFCO0FBQ0QsV0FGRDtBQUdELFM7O3NDQUdELGlCLDhCQUFrQixTLEVBQVc7QUFBQTs7QUFDM0IsY0FBSSxNQUFNLEtBQUssS0FBTCxDQUFXLFdBQVgsQ0FBdUIsR0FBakM7O0FBRUEsY0FBSSw0QkFBMEIsSUFBSSxRQUE5QixTQUEwQyxJQUFJLFlBQTlDLGNBQUo7QUFDQSxjQUFJLCtCQUE2QixJQUFJLFFBQWpDLFNBQTZDLElBQUksV0FBakQsY0FBSjtBQUNBLGNBQUksZ0NBQThCLElBQUksUUFBbEMsU0FBOEMsSUFBSSxZQUFsRCxjQUFKOztBQUdBLGVBQUssS0FBTCxDQUFXLFNBQVgsQ0FBcUIsU0FBckIsR0FBaUMsT0FBakMsQ0FBeUMsVUFBQyxDQUFELEVBQU87QUFDOUMsZ0JBQUksRUFBRSxTQUFGLEtBQWdCLE9BQUssU0FBekIsRUFBb0M7QUFDbEMsa0JBQUksUUFBUSxFQUFFLEdBQUYsS0FBVSxJQUFWLEdBQWlCLFNBQWpCLEdBQTZCLFVBQXpDO0FBQ0Esa0JBQUksMkJBQXlCLElBQUksVUFBN0IsMEJBQTRELEVBQUUsRUFBOUQsY0FBSjs7QUFFQSx1QkFBUyxPQUFPLEtBQWhCO0FBQ0Q7QUFDRixXQVBEOztBQVVBLGlCQUFPLE1BQVA7QUFDRCxTIiwiZmlsZSI6InZHcmlkL3YtZ3JpZC1hdHRyaWJ1dGVzLXNvcnQuanMiLCJzb3VyY2VSb290IjoiL3NyYyJ9