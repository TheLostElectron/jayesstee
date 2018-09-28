"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.JstObject = undefined;

var _typeof2 = require("babel-runtime/helpers/typeof");

var _typeof3 = _interopRequireDefault(_typeof2);

var _toConsumableArray2 = require("babel-runtime/helpers/toConsumableArray");

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _assign = require("babel-runtime/core-js/object/assign");

var _assign2 = _interopRequireDefault(_assign);

var _keys = require("babel-runtime/core-js/object/keys");

var _keys2 = _interopRequireDefault(_keys);

var _getIterator2 = require("babel-runtime/core-js/get-iterator");

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

exports.jst = jst;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function jst(selectorOrElement) {
  if (selectorOrElement instanceof HTMLElement) {
    return new JstElement(selectorOrElement);
  } else {
    var el = document.querySelector(selectorOrElement);
    if (!el) {
      return new JstElement();
    } else {
      return new JstElement(el);
    }
  }
}

exports.default = jst;


var globalJstId = 1;
var globalJstElementId = 1;

// JstObject Class
//
// This class is a base class for all classes that are
// renderable within jayesstee. For a user-defined class to
// be successfully redered, it must extend this class and
// implement the render() method
//
// It can also be used as a companion object for generic
// objects. Calling jst.object(someObj) will return one of these
// objects that is linked to someObj (someObj.$jst is this object and
// this.companionObj is the passed in object).

var JstObject = exports.JstObject = function () {
  function JstObject(companionObj) {
    (0, _classCallCheck3.default)(this, JstObject);

    this._jstId = globalJstId++;
    this.companionObj = companionObj;
    this.parent = undefined;
    this.renderFunc = undefined;
  }

  (0, _createClass3.default)(JstObject, [{
    key: "refresh",
    value: function refresh() {
      if (this.parent) {
        this.parent.update(this);
      }
    }
  }, {
    key: "render",
    value: function render() {
      if (!this.renderFunc) {
        if (this.companionObj) {
          throw new Error("You must define a render function with .fill()");
        } else {
          throw new Error("You must override render() in descendant classes");
        }
      } else {
        return this.renderFunc(this.companionObj);
      }
    }
  }, {
    key: "fill",
    value: function fill(renderFunc) {
      if (typeof renderFunc !== "function") {
        throw new Error(".fill() expects a function to be passed in");
      }

      this.renderFunc = renderFunc;

      return this;
    }
  }, {
    key: "setParent",
    value: function setParent(parent) {
      this.parent = parent;
    }
  }, {
    key: "getParent",
    value: function getParent() {
      return this.parent;
    }
  }, {
    key: "setRef",
    value: function setRef(refName, val) {
      if (this.companionObj) {
        this.companionObj[refName] = val;
      } else {
        this[refName] = val;
      }
    }
  }]);
  return JstObject;
}();

// JstElement Class
//
// This class represents an HTML element. On creation
// it is just a scaffold that can be either inserted into
// the DOM (in a browser) or serialized into HTML.


var JstElement = function () {
  function JstElement(tag, params) {
    (0, _classCallCheck3.default)(this, JstElement);

    this.id = globalJstElementId++;
    this.tag = tag;
    this.contents = [];
    this.attrs = {};
    this.props = [];
    this.events = {};
    this.opts = {};

    if (tag instanceof HTMLElement) {
      // Wrapping an element with a JstElement
      this.tag = tag.tagName.toLowerCase();
      this.el = tag;
    }

    this._processParams(params);

    if (this.el) {
      // If we have a real element, put all the content into it
      this.dom();
    }
  }

  (0, _createClass3.default)(JstElement, [{
    key: "appendChild",
    value: function appendChild() {
      this.isDomified = false;

      this._processParams(arguments);
      if (this.el) {
        this.dom();
      }
    }
  }, {
    key: "replaceChild",
    value: function replaceChild() {
      if (this.el) {
        this.el.innerHTML = "";
      }

      this.isDomified = false;
      this.contents = [];
      this.atts = [];
      this.props = [];

      this.appendChild.apply(this, arguments);
    }

    // Return HTML

  }, {
    key: "html",
    value: function html(opts) {
      var html = "";

      if (!opts) {
        opts = {};
      }
      if (!opts.depth) {
        opts.depth = 0;
      }
      if (opts.indent) {
        html += " ".repeat(opts.indent * opts.depth++);
      }

      html += "<" + this.tag;

      var attrs = [];
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = (0, _getIterator3.default)((0, _keys2.default)(this.attrs)), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var attrName = _step.value;

          attrs.push(attrName + "=" + "\"" + this._quoteAttrValue(this.attrs[attrName]) + "\"");
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      if (attrs.length) {
        html += " " + attrs.join(" ");
      }
      if (this.props.length) {
        html += " " + this.props.join(" ");
      }

      html += ">";

      if (opts.indent) {
        html += "\n";
      }

      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = (0, _getIterator3.default)(this.contents), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var item = _step2.value;

          if (item.type === "jst") {
            html += item.value.html(opts);
          } else if (item.type === "HTMLElement") {
            html += item.value.innerHTML;
          } else if (item.type === "textnode") {
            if (opts.indent && opts.depth) {
              html += " ".repeat(opts.indent * opts.depth);
            }
            html += item.value;
            if (opts.indent && opts.depth) {
              html += "\n";
            }
          } else {
            console.log("Unexpected content type while serializing:", item.type);
          }
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      if (opts.indent && opts.depth) {
        opts.depth--;
        html += " ".repeat(opts.indent * opts.depth);
      }

      html += "</" + this.tag + ">";
      if (opts.indent) {
        html += "\n";
      }
      return html;
    }

    // Return an HTMLElement

  }, {
    key: "dom",
    value: function dom(lastJstObject) {
      var el = this.el || document.createElement(this.tag);

      if (this.ref && lastJstObject) {
        lastJstObject.setRef(this.ref, this);
      }

      if (!this.isDomified) {
        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
          for (var _iterator3 = (0, _getIterator3.default)((0, _keys2.default)(this.attrs)), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            var attrName = _step3.value;

            el.setAttribute(attrName, this.attrs[attrName]);
          }
        } catch (err) {
          _didIteratorError3 = true;
          _iteratorError3 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion3 && _iterator3.return) {
              _iterator3.return();
            }
          } finally {
            if (_didIteratorError3) {
              throw _iteratorError3;
            }
          }
        }

        var _iteratorNormalCompletion4 = true;
        var _didIteratorError4 = false;
        var _iteratorError4 = undefined;

        try {
          for (var _iterator4 = (0, _getIterator3.default)(this.props), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
            var propName = _step4.value;

            el[propName] = true;
          }
        } catch (err) {
          _didIteratorError4 = true;
          _iteratorError4 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion4 && _iterator4.return) {
              _iterator4.return();
            }
          } finally {
            if (_didIteratorError4) {
              throw _iteratorError4;
            }
          }
        }

        var _iteratorNormalCompletion5 = true;
        var _didIteratorError5 = false;
        var _iteratorError5 = undefined;

        try {
          for (var _iterator5 = (0, _getIterator3.default)((0, _keys2.default)(this.events)), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
            var event = _step5.value;

            // TODO: Add support for options - note that this will require
            //       some detection of options support in the browser...
            el.addEventListener(event, this.events[event].listener);
          }
        } catch (err) {
          _didIteratorError5 = true;
          _iteratorError5 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion5 && _iterator5.return) {
              _iterator5.return();
            }
          } finally {
            if (_didIteratorError5) {
              throw _iteratorError5;
            }
          }
        }
      }

      var nextEl = void 0;
      for (var i = this.contents.length - 1; i >= 0; i--) {
        var item = this.contents[i];
        if (item.type === "jst") {
          var hasEl = item.value.el;
          var childEl = item.value.dom(item.jstObject || lastJstObject);
          childEl.aId = item.value.aId;
          if (!hasEl) {
            if (nextEl) {
              el.insertBefore(childEl, nextEl);
            } else {
              el.appendChild(childEl);
            }
          }
          nextEl = childEl;
        } else if (item.type === "textnode") {
          if (!item.el) {
            item.el = document.createTextNode(item.value);
            if (nextEl) {
              el.insertBefore(item.el, nextEl);
            } else {
              el.appendChild(item.el);
            }
          }
        } else {
          console.warn("Unexpected content type while dominating:", item.type);
        }
      }

      this.el = el;
      this.isDomified = true;
      return el;
    }
  }, {
    key: "delete",
    value: function _delete() {
      // Remove all items associated with this JstElement
      var _iteratorNormalCompletion6 = true;
      var _didIteratorError6 = false;
      var _iteratorError6 = undefined;

      try {
        for (var _iterator6 = (0, _getIterator3.default)(this.contents), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
          var item = _step6.value;

          this._deleteItem(item);
        }

        // Delete this element, if present
      } catch (err) {
        _didIteratorError6 = true;
        _iteratorError6 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion6 && _iterator6.return) {
            _iterator6.return();
          }
        } finally {
          if (_didIteratorError6) {
            throw _iteratorError6;
          }
        }
      }

      if (this.el) {
        if (this.el.parentNode) {
          this.el.parentNode.removeChild(this.el);
        }
      }

      delete this.el;

      this.tag = "-deleted-";
      this.contents = [];
      this.attrs = {};
      this.props = [];
    }
  }, {
    key: "update",
    value: function update(jstObject, forceUpdate) {

      // Create a new JST tree that will be compared against the existing one
      var items = jstObject.render();

      // newJst will contain the new updated tree
      var newJst = new JstElement("div");
      newJst._processParams([items], jstObject);

      this._compareAndCopy(newJst, true, jstObject, forceUpdate, 0);

      // If we were already domified, then redo it for the new elements
      if (this.isDomified) {
        this.dom();
      }
    }

    // Returns true if upper layer needs to copy new Jst. False otherwise

  }, {
    key: "_compareAndCopy",
    value: function _compareAndCopy(newJst, topNode, jstObject, forceUpdate, level) {
      var oldIndex = 0;
      var newIndex = 0;

      var copyJst = (0, _assign2.default)({}, newJst);

      // console.log("CAC>" + " ".repeat(level*2), this.tag + this.aId, newJst.tag+newJst.aId);

      // First check the attributes, props and events
      // But only if we aren't the topNode
      if (!topNode) {
        if (forceUpdate || this.opts.forceUpdate || this.tag !== newJst.tag) {
          return true;
        }

        // Blindly copy the JST options
        this.opts = newJst.opts;

        // Just fix all the attributes inline
        var _iteratorNormalCompletion7 = true;
        var _didIteratorError7 = false;
        var _iteratorError7 = undefined;

        try {
          for (var _iterator7 = (0, _getIterator3.default)((0, _keys2.default)(this.attrs)), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
            var attrName = _step7.value;

            if (!newJst.attrs[attrName]) {
              delete this.attrs[attrName];
              if (this.isDomified) {
                this.el.removeAttribute(attrName);
              }
            } else if (newJst.attrs[attrName] !== this.attrs[attrName]) {
              this.attrs[attrName] = newJst.attrs[attrName];
              if (this.isDomified) {
                this.el.setAttribute(attrName, newJst.attrs[attrName]);
              }
            }
          }
        } catch (err) {
          _didIteratorError7 = true;
          _iteratorError7 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion7 && _iterator7.return) {
              _iterator7.return();
            }
          } finally {
            if (_didIteratorError7) {
              throw _iteratorError7;
            }
          }
        }

        var _iteratorNormalCompletion8 = true;
        var _didIteratorError8 = false;
        var _iteratorError8 = undefined;

        try {
          for (var _iterator8 = (0, _getIterator3.default)((0, _keys2.default)(newJst.attrs)), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
            var _attrName = _step8.value;

            if (!this.attrs[_attrName]) {
              this.attrs[_attrName] = newJst.attrs[_attrName];
              if (this.isDomified) {
                this.el.setAttribute(_attrName, newJst.attrs[_attrName]);
              }
            }
          }
        } catch (err) {
          _didIteratorError8 = true;
          _iteratorError8 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion8 && _iterator8.return) {
              _iterator8.return();
            }
          } finally {
            if (_didIteratorError8) {
              throw _iteratorError8;
            }
          }
        }

        if (this.props.length || newJst.props.length) {
          var fixProps = false;

          // Just compare them in order - if they happen to be the same,
          // but in a different order, we will do a bit more work than necessary
          // but it should be very unlikely that that would happen
          if (this.props.length != newJst.props.length) {
            fixProps = true;
          } else {
            for (var i = 0; i < this.props.length; i++) {
              if (this.props[i] !== newJst.props[i]) {
                fixProps = true;
                break;
              }
            }
          }

          if (fixProps) {
            if (this.isDomified) {
              var _iteratorNormalCompletion9 = true;
              var _didIteratorError9 = false;
              var _iteratorError9 = undefined;

              try {
                for (var _iterator9 = (0, _getIterator3.default)(this.props), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
                  var prop = _step9.value;

                  delete this.el[prop];
                }
              } catch (err) {
                _didIteratorError9 = true;
                _iteratorError9 = err;
              } finally {
                try {
                  if (!_iteratorNormalCompletion9 && _iterator9.return) {
                    _iterator9.return();
                  }
                } finally {
                  if (_didIteratorError9) {
                    throw _iteratorError9;
                  }
                }
              }

              var _iteratorNormalCompletion10 = true;
              var _didIteratorError10 = false;
              var _iteratorError10 = undefined;

              try {
                for (var _iterator10 = (0, _getIterator3.default)(newJst.props), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
                  var _prop = _step10.value;

                  this.el[_prop] = true;
                }
              } catch (err) {
                _didIteratorError10 = true;
                _iteratorError10 = err;
              } finally {
                try {
                  if (!_iteratorNormalCompletion10 && _iterator10.return) {
                    _iterator10.return();
                  }
                } finally {
                  if (_didIteratorError10) {
                    throw _iteratorError10;
                  }
                }
              }
            }
            this.props = newJst.props;
          }
        }

        // Fix all the events
        var _iteratorNormalCompletion11 = true;
        var _didIteratorError11 = false;
        var _iteratorError11 = undefined;

        try {
          for (var _iterator11 = (0, _getIterator3.default)((0, _keys2.default)(this.events)), _step11; !(_iteratorNormalCompletion11 = (_step11 = _iterator11.next()).done); _iteratorNormalCompletion11 = true) {
            var eventName = _step11.value;

            if (!newJst.events[eventName]) {
              delete this.events[eventName];
              if (this.isDomified) {
                this.el.removeEventListener(eventName, this.events[eventName].listener);
              }
            } else if (newJst.events[eventName].listener !== this.events[eventName].listener) {
              if (this.isDomified) {
                this.el.removeEventListener(eventName, this.events[eventName].listener);
                this.el.addEventListener(eventName, newJst.events[eventName].listener);
              }
              this.events[eventName] = newJst.events[eventName];
            }
          }
        } catch (err) {
          _didIteratorError11 = true;
          _iteratorError11 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion11 && _iterator11.return) {
              _iterator11.return();
            }
          } finally {
            if (_didIteratorError11) {
              throw _iteratorError11;
            }
          }
        }

        var _iteratorNormalCompletion12 = true;
        var _didIteratorError12 = false;
        var _iteratorError12 = undefined;

        try {
          for (var _iterator12 = (0, _getIterator3.default)((0, _keys2.default)(newJst.events)), _step12; !(_iteratorNormalCompletion12 = (_step12 = _iterator12.next()).done); _iteratorNormalCompletion12 = true) {
            var _eventName = _step12.value;

            if (!this.events[_eventName]) {
              this.events[_eventName] = newJst.events[_eventName];
              if (this.isDomified) {
                this.el.addEventListener(_eventName, newJst.events[_eventName].listener);
              }
            }
          }
        } catch (err) {
          _didIteratorError12 = true;
          _iteratorError12 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion12 && _iterator12.return) {
              _iterator12.return();
            }
          } finally {
            if (_didIteratorError12) {
              throw _iteratorError12;
            }
          }
        }
      }

      if (!forceUpdate && !this.opts.forceUpdate) {
        while (true) {
          var _oldItem = this.contents[oldIndex];
          var newItem = newJst.contents[newIndex];

          if (!_oldItem || !newItem) {
            break;
          }

          if (jstObject && _oldItem.jstObject._jstId !== jstObject._jstId) {
            oldIndex++;
            continue;
          }

          if (_oldItem.type !== newItem.type) {
            break;
          }

          if (_oldItem.type === "jst") {
            // If the tags are the same, then we must descend and compare
            var doReplace = _oldItem.value._compareAndCopy(newItem.value, false, undefined, undefined, level + 1);
            if (doReplace) {
              break;
            }
          } else if (_oldItem.type === "textnode" && _oldItem.value !== newItem.value) {
            if (_oldItem.el) {
              _oldItem.el.textContent = newItem.value;
            }
            _oldItem.value = newItem.value;
          }

          oldIndex++;
          newIndex++;
        }
      }

      // Need to copy stuff - first delete all the old contents
      var oldStartIndex = oldIndex;
      var oldItem = this.contents[oldIndex];

      while (oldItem) {
        if (jstObject && oldItem.jstObject._jstId !== jstObject._jstId) {
          break;
        }
        // console.log("      " + " ".repeat(level*2), "deleting old item :", oldItem);
        this._deleteItem(oldItem);
        oldIndex++;
        oldItem = this.contents[oldIndex];
      }

      this.contents.splice(oldStartIndex, oldIndex - oldStartIndex);

      if (newJst.contents[newIndex]) {
        var _contents;

        // Remove the old stuff and insert the new
        var newItems = newJst.contents.splice(newIndex, newJst.contents.length - newIndex);
        // console.log("      " + " ".repeat(level*2), "new items being added:", newItems);
        var _iteratorNormalCompletion13 = true;
        var _didIteratorError13 = false;
        var _iteratorError13 = undefined;

        try {
          for (var _iterator13 = (0, _getIterator3.default)(newItems), _step13; !(_iteratorNormalCompletion13 = (_step13 = _iterator13.next()).done); _iteratorNormalCompletion13 = true) {
            var _newItem = _step13.value;

            if (_newItem.jstObject) {
              _newItem.jstObject.setParent(this);
            }
          }
        } catch (err) {
          _didIteratorError13 = true;
          _iteratorError13 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion13 && _iterator13.return) {
              _iterator13.return();
            }
          } finally {
            if (_didIteratorError13) {
              throw _iteratorError13;
            }
          }
        }

        (_contents = this.contents).splice.apply(_contents, [oldStartIndex, 0].concat((0, _toConsumableArray3.default)(newItems)));
      }

      // console.log("CAC>" + " ".repeat(level*2), "/" + this.tag+this.aId);
      return false;
    }
  }, {
    key: "_deleteItem",
    value: function _deleteItem(contentsItem) {
      if (contentsItem.type === "jst") {
        contentsItem.value.delete();
      } else if (contentsItem.type === "textnode") {
        if (contentsItem.el && contentsItem.el.parentNode) {
          // Remove the span element
          contentsItem.el.parentNode.removeChild(contentsItem.el);
          delete contentsItem.el;
        }
      } else {
        console.warn("Unexpected content type while deleting:", contentsItem.type);
      }
    }
  }, {
    key: "_processParams",
    value: function _processParams(params, jstObject) {
      params = jst._flatten.apply(this, params);
      if (typeof params === "undefined") {
        params = [];
      }
      var _iteratorNormalCompletion14 = true;
      var _didIteratorError14 = false;
      var _iteratorError14 = undefined;

      try {
        for (var _iterator14 = (0, _getIterator3.default)(params), _step14; !(_iteratorNormalCompletion14 = (_step14 = _iterator14.next()).done); _iteratorNormalCompletion14 = true) {
          var param = _step14.value;

          var type = typeof param === "undefined" ? "undefined" : (0, _typeof3.default)(param);

          if (type === "number" || type === "string") {
            this.contents.push({ type: "textnode", value: param, jstObject: jstObject });
          } else if (type === "boolean") {
            this.contents.push({ type: "textnode", value: param.toString(), jstObject: jstObject });
          } else if (param instanceof JstObject) {
            if (!param.getParent()) {
              param.setParent(this);
            }

            var items = param.render();
            this._processParams([items], param);
          } else if (param instanceof JstElement) {
            this.contents.push({ type: "jst", value: param, jstObject: jstObject });
          } else if (typeof HTMLElement !== 'undefined' && param instanceof HTMLElement) {
            this.contents.push({ type: "jst", value: new JstElement(param), jstObject: jstObject });
          } else if (type === "object") {
            var _iteratorNormalCompletion15 = true;
            var _didIteratorError15 = false;
            var _iteratorError15 = undefined;

            try {
              for (var _iterator15 = (0, _getIterator3.default)((0, _keys2.default)(param)), _step15; !(_iteratorNormalCompletion15 = (_step15 = _iterator15.next()).done); _iteratorNormalCompletion15 = true) {
                var name = _step15.value;

                if (typeof param[name] === "undefined") {
                  param[name] = "";
                }
                if (name === "jstoptions" && param.jstoptions instanceof Object) {
                  this.opts = param.jstoptions;
                } else if (name === "properties" && param.properties instanceof Array) {
                  var _iteratorNormalCompletion16 = true;
                  var _didIteratorError16 = false;
                  var _iteratorError16 = undefined;

                  try {
                    for (var _iterator16 = (0, _getIterator3.default)(param.properties), _step16; !(_iteratorNormalCompletion16 = (_step16 = _iterator16.next()).done); _iteratorNormalCompletion16 = true) {
                      var prop = _step16.value;

                      this.props.push(prop);
                    }
                  } catch (err) {
                    _didIteratorError16 = true;
                    _iteratorError16 = err;
                  } finally {
                    try {
                      if (!_iteratorNormalCompletion16 && _iterator16.return) {
                        _iterator16.return();
                      }
                    } finally {
                      if (_didIteratorError16) {
                        throw _iteratorError16;
                      }
                    }
                  }
                } else if (name === "events" && (0, _typeof3.default)(param.events) === "object") {
                  var _iteratorNormalCompletion17 = true;
                  var _didIteratorError17 = false;
                  var _iteratorError17 = undefined;

                  try {
                    for (var _iterator17 = (0, _getIterator3.default)((0, _keys2.default)(param.events)), _step17; !(_iteratorNormalCompletion17 = (_step17 = _iterator17.next()).done); _iteratorNormalCompletion17 = true) {
                      var event = _step17.value;

                      if (param.events[event] instanceof Function) {
                        this.events[event] = { listener: param.events[event] };
                      } else {
                        this.events[event] = param.events[event];
                      }
                    }
                  } catch (err) {
                    _didIteratorError17 = true;
                    _iteratorError17 = err;
                  } finally {
                    try {
                      if (!_iteratorNormalCompletion17 && _iterator17.return) {
                        _iterator17.return();
                      }
                    } finally {
                      if (_didIteratorError17) {
                        throw _iteratorError17;
                      }
                    }
                  }
                } else if (name === "ref") {
                  this.ref = param[name];
                  this.attrs.ref = param[name];
                } else if (name === "cn") {
                  // A bit of magic for the "class" attribute: cn -> class
                  // We also will append to the class if there already is one
                  if (this.attrs['class']) {
                    this.attrs['class'] += " " + param[name];
                  } else {
                    this.attrs['class'] = param[name];
                  }
                } else {
                  this.attrs[name] = param[name];
                }
              }
            } catch (err) {
              _didIteratorError15 = true;
              _iteratorError15 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion15 && _iterator15.return) {
                  _iterator15.return();
                }
              } finally {
                if (_didIteratorError15) {
                  throw _iteratorError15;
                }
              }
            }
          } else if (type === "undefined") {
            // skip
          } else {
            console.log("Unknown JstElement parameter type: ", type);
          }
        }
      } catch (err) {
        _didIteratorError14 = true;
        _iteratorError14 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion14 && _iterator14.return) {
            _iterator14.return();
          }
        } finally {
          if (_didIteratorError14) {
            throw _iteratorError14;
          }
        }
      }
    }

    // Some helpers

  }, {
    key: "_quoteAttrValue",
    value: function _quoteAttrValue(value) {
      return value.replace ? value.replace(/"/, '\"') : value;
    }
  }]);
  return JstElement;
}();

jst.fn = jst.prototype = {};

// Shrunken version of jQuery's extend
jst.extend = jst.fn.extend = function () {
  var target = this;
  var length = arguments.length;

  for (var i = 0; i < length; i++) {
    var options = void 0;
    if ((options = arguments[i]) !== null) {
      for (var name in options) {
        var copy = options[name];

        // Prevent never-ending loop
        if (target === copy) {
          continue;
        }

        if (copy !== undefined) {
          target[name] = copy;
        }
      }
    }
  }

  // Return the modified object
  return target;
};

jst.extend({
  tagPrefix: "$",
  tags: ['a', 'abbr', 'address', 'area', 'article', 'aside', 'audio', 'b', 'base', 'bdi', 'bdo', 'blockquote', 'body', 'br', 'button', 'canvas', 'caption', 'cite', 'code', 'col', 'colgroup', 'command', 'data', 'datalist', 'dd', 'del', 'details', 'dfn', 'div', 'dl', 'dt', 'em', 'embed', 'fieldset', 'figcaption', 'figure', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'header', 'hgroup', 'hr', 'html', 'i', 'iframe', 'img', 'input', 'ins', 'kbd', 'keygen', 'label', 'legend', 'li', 'link', 'main', 'map', 'mark', 'math', 'menu', 'meta', 'meter', 'nav', 'noscript', 'object', 'ol', 'optgroup', 'option', 'output', 'p', 'param', 'pre', 'progress', 'q', 'rp', 'rt', 'ruby', 's', 'samp', 'script', 'section', 'select', 'small', 'source', 'span', 'strong', 'style', 'sub', 'summary', 'sup', 'svg', 'table', 'tbody', 'td', 'textarea', 'tfoot', 'th', 'thead', 'time', 'title', 'tr', 'track', 'u', 'ul', 'var', 'video', 'wbr'],

  addCustomElements: function addCustomElements() {
    var names = jst._flatten.apply(this, arguments);

    var _iteratorNormalCompletion18 = true;
    var _didIteratorError18 = false;
    var _iteratorError18 = undefined;

    try {
      var _loop = function _loop() {
        var name = _step18.value;

        var fullName = jst.tagPrefix + name;
        jst[fullName] = function () {
          var args = jst._flatten.apply(this, arguments);
          return new JstElement(name, args);
        };
      };

      for (var _iterator18 = (0, _getIterator3.default)(names), _step18; !(_iteratorNormalCompletion18 = (_step18 = _iterator18.next()).done); _iteratorNormalCompletion18 = true) {
        _loop();
      }
    } catch (err) {
      _didIteratorError18 = true;
      _iteratorError18 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion18 && _iterator18.return) {
          _iterator18.return();
        }
      } finally {
        if (_didIteratorError18) {
          throw _iteratorError18;
        }
      }
    }
  },

  init: function init() {
    jst.addCustomElements(jst.tags);
  },

  object: function object(obj) {
    if ((typeof obj === "undefined" ? "undefined" : (0, _typeof3.default)(obj)) != "object") {
      throw new Error("You must pass an object to jst.object()");
    }
    return obj.$jst = new JstObject(obj);
  },

  makeGlobal: function makeGlobal(prefix) {
    jst.global = true;
    jst.globalTagPrefix = prefix || jst.tagPrefix;
    var _iteratorNormalCompletion19 = true;
    var _didIteratorError19 = false;
    var _iteratorError19 = undefined;

    try {
      var _loop2 = function _loop2() {
        var tag = _step19.value;

        var name = jst.globalTagPrefix + tag;
        var g = typeof global !== 'undefined' ? global : window;
        g[name] = function () {
          return jst[name].apply(this, arguments);
        };
      };

      for (var _iterator19 = (0, _getIterator3.default)(jst.tags), _step19; !(_iteratorNormalCompletion19 = (_step19 = _iterator19.next()).done); _iteratorNormalCompletion19 = true) {
        _loop2();
      }
    } catch (err) {
      _didIteratorError19 = true;
      _iteratorError19 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion19 && _iterator19.return) {
          _iterator19.return();
        }
      } finally {
        if (_didIteratorError19) {
          throw _iteratorError19;
        }
      }
    }
  },

  _flatten: function _flatten() {
    var flat = [];
    for (var i = 0; i < arguments.length; i++) {
      if (arguments[i] instanceof Array) {
        flat.push.apply(flat, jst._flatten.apply(this, arguments[i]));
      } else if (arguments[i] instanceof Function) {
        var result = arguments[i]();
        if (result instanceof Array) {
          flat.push.apply(flat, jst._flatten.apply(this, result));
        } else {
          flat.push(result);
        }
      } else {
        flat.push(arguments[i]);
      }
    }
    return flat;
  }

});

jst.init();