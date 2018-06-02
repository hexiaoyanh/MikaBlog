/*!
 * mdui v0.4.1 (https://mdui.org)
 * Copyright 2016-2018 zdhxiong
 * Licensed under MIT
 */
/* jshint ignore:start */
;(function(global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.mdui = factory());
}(this, (function() {
  'use strict';

  /* jshint ignore:end */
  var mdui = {};

  /**
   * =============================================================================
   * ************   娴忚鍣ㄥ吋瀹规€ч棶棰樹慨澶�   ************
   * =============================================================================
   */

  /**
   * requestAnimationFrame
   * cancelAnimationFrame
   */
  (function () {
    var lastTime = 0;

    if (!window.requestAnimationFrame) {
      window.requestAnimationFrame = window.webkitRequestAnimationFrame;
      window.cancelAnimationFrame = window.webkitCancelAnimationFrame;
    }

    if (!window.requestAnimationFrame) {
      window.requestAnimationFrame = function (callback, element) {
        var currTime = new Date().getTime();
        var timeToCall = Math.max(0, 16.7 - (currTime - lastTime));

        var id = window.setTimeout(function () {
            callback(currTime + timeToCall);
          }, timeToCall);

        lastTime = currTime + timeToCall;
        return id;
      };
    }

    if (!window.cancelAnimationFrame) {
      window.cancelAnimationFrame = function (id) {
        clearTimeout(id);
      };
    }
  })();


  /**
   * =============================================================================
   * ************   JavaScript 宸ュ叿搴擄紝璇硶鍜� jQuery 绫讳技   ************
   * =============================================================================
   */
  /* jshint ignore:start */
  var $ = (function (window, document, undefined) {
    'use strict';
  /* jshint ignore:end */


    var emptyArray = [];
    var slice = emptyArray.slice;
    var concat = emptyArray.concat;
    var isArray = Array.isArray;

    var documentElement = document.documentElement;

    /**
     * 鏄惁鏄被鏁扮粍鐨勬暟鎹�
     * @param obj
     * @returns {boolean}
     */
    function isArrayLike(obj) {
      return typeof obj.length === 'number';
    }

    /**
     * 寰幆鏁扮粍鎴栧璞�
     * @param obj
     * @param callback
     * @returns {*}
     */
    function each(obj, callback) {
      var i;
      var prop;

      if (isArrayLike(obj)) {
        for (i = 0; i < obj.length; i++) {
          if (callback.call(obj[i], i, obj[i]) === false) {
            return obj;
          }
        }
      } else {
        for (prop in obj) {
          if (obj.hasOwnProperty(prop)) {
            if (callback.call(obj[prop], prop, obj[prop]) === false) {
              return obj;
            }
          }
        }
      }

      return obj;
    }

    function map(elems, callback) {
      var value;
      var ret = [];

      each(elems, function (i, elem) {
        value = callback(elem, i);
        if (value !== null && value !== undefined) {
          ret.push(value);
        }
      });

      return concat.apply([], ret);
    }

    /**
     * 鎶婂璞″悎骞跺埌绗竴涓弬鏁颁腑锛屽苟杩斿洖绗竴涓弬鏁�
     * @param first
     * @param second
     * @returns {*}
     */
    function merge(first, second) {
      each(second, function (i, val) {
        first.push(val);
      });

      return first;
    }

    /**
     * 杩斿洖鍘婚噸鍚庣殑鏁扮粍
     * @param arr
     * @returns {Array}
     */
    function unique(arr) {
      var unique = [];
      for (var i = 0; i < arr.length; i++) {
        if (unique.indexOf(arr[i]) === -1) {
          unique.push(arr[i]);
        }
      }

      return unique;
    }

    /**
     * 鏄惁鏄� null
     * @param obj
     * @returns {boolean}
     */
    function isNull(obj) {
      return obj === null;
    }

    /**
     * 鍒ゆ柇涓€涓妭鐐瑰悕
     * @param ele
     * @param name
     * @returns {boolean}
     */
    function nodeName(ele, name) {
      return ele.nodeName && ele.nodeName.toLowerCase() === name.toLowerCase();
    }

    function isFunction(fn) {
      return typeof fn === 'function';
    }

    function isString(obj) {
      return typeof obj === 'string';
    }

    function isObject(obj) {
      return typeof obj === 'object';
    }

    /**
     * 闄ゅ幓 null 鍚庣殑 object 绫诲瀷
     * @param obj
     * @returns {*|boolean}
     */
    function isObjectLike(obj) {
      return isObject(obj) && !isNull(obj);
    }

    function isWindow(win) {
      return win && win === win.window;
    }

    function isDocument(doc) {
      return doc && doc.nodeType === doc.DOCUMENT_NODE;
    }

    var elementDisplay = {};

    /**
     * 鑾峰彇鍏冪礌鐨勯粯璁� display 鏍峰紡鍊硷紝鐢ㄤ簬 .show() 鏂规硶
     * @param nodeName
     * @returns {*}
     */
    function defaultDisplay(nodeName) {
      var element;
      var display;

      if (!elementDisplay[nodeName]) {
        element = document.createElement(nodeName);
        document.body.appendChild(element);
        display = getComputedStyle(element, '').getPropertyValue('display');
        element.parentNode.removeChild(element);
        if (display === 'none') {
          display = 'block';
        }

        elementDisplay[nodeName] = display;
      }

      return elementDisplay[nodeName];
    }


    var JQ = function (arr) {
      var _this = this;

      for (var i = 0; i < arr.length; i++) {
        _this[i] = arr[i];
      }

      _this.length = arr.length;

      return this;
    };

    /**
     * @param selector {String|Function|Node|Window|NodeList|Array|JQ=}
     * @returns {JQ}
     */
    var $ = function (selector) {
      var arr = [];
      var i = 0;

      if (!selector) {
        return new JQ(arr);
      }

      if (selector instanceof JQ) {
        return selector;
      }

      if (isString(selector)) {
        var els;
        var tempParent;
        selector = selector.trim();

        // 鍒涘缓 HTML 瀛楃涓�
        if (selector[0] === '<' && selector[selector.length - 1] === '>') {
          // HTML
          var toCreate = 'div';
          if (selector.indexOf('<li') === 0) {
            toCreate = 'ul';
          }

          if (selector.indexOf('<tr') === 0) {
            toCreate = 'tbody';
          }

          if (selector.indexOf('<td') === 0 || selector.indexOf('<th') === 0) {
            toCreate = 'tr';
          }

          if (selector.indexOf('<tbody') === 0) {
            toCreate = 'table';
          }

          if (selector.indexOf('<option') === 0) {
            toCreate = 'select';
          }

          tempParent = document.createElement(toCreate);
          tempParent.innerHTML = selector;
          for (i = 0; i < tempParent.childNodes.length; i++) {
            arr.push(tempParent.childNodes[i]);
          }
        }

        // 閫夋嫨鍣�
        else {

          // id 閫夋嫨鍣�
          if (selector[0] === '#' && !selector.match(/[ .<>:~]/)) {
            els = [document.getElementById(selector.slice(1))];
          }

          // 鍏朵粬閫夋嫨鍣�
          else {
            els = document.querySelectorAll(selector);
          }

          for (i = 0; i < els.length; i++) {
            if (els[i]) {
              arr.push(els[i]);
            }
          }
        }
      }

      // function
      else if (isFunction(selector)) {
        return $(document).ready(selector);
      }

      // Node
      else if (selector.nodeType || selector === window || selector === document) {
        arr.push(selector);
      }

      // NodeList
      else if (selector.length > 0 && selector[0].nodeType) {
        for (i = 0; i < selector.length; i++) {
          arr.push(selector[i]);
        }
      }

      return new JQ(arr);
    };

    $.fn = JQ.prototype;

    /**
     * 鎵╁睍鍑芥暟鍜屽師鍨嬪睘鎬�
     * @param obj
     */
    $.extend = $.fn.extend = function (obj) {
      if (obj === undefined) {
        return this;
      }

      var length = arguments.length;
      var prop;
      var i;
      var options;

      // $.extend(obj)
      if (length === 1) {
        for (prop in obj) {
          if (obj.hasOwnProperty(prop)) {
            this[prop] = obj[prop];
          }
        }

        return this;
      }

      // $.extend({}, defaults[, obj])
      for (i = 1; i < length; i++) {
        options = arguments[i];
        for (prop in options) {
          if (options.hasOwnProperty(prop)) {
            obj[prop] = options[prop];
          }
        }
      }

      return obj;
    };

    $.extend({

      /**
       * 閬嶅巻瀵硅薄
       * @param obj {String|Array|Object}
       * @param callback {Function}
       * @returns {Array|Object}
       */
      each: each,

      /**
       * 鍚堝苟涓や釜鏁扮粍锛岃繑鍥炵殑缁撴灉浼氫慨鏀圭涓€涓暟缁勭殑鍐呭
       * @param first {Array}
       * @param second {Array}
       * @returns {Array}
       */
      merge: merge,

      /**
       * 鍒犻櫎鏁扮粍涓噸澶嶅厓绱�
       * @param arr {Array}
       * @returns {Array}
       */
      unique: unique,

      /**
       * 閫氳繃閬嶅巻闆嗗悎涓殑鑺傜偣瀵硅薄锛岄€氳繃鍑芥暟杩斿洖涓€涓柊鐨勬暟缁勶紝null 鎴� undefined 灏嗚杩囨护鎺夈€�
       * @param elems
       * @param callback
       * @returns {Array}
       */
      map: map,

      /**
       * 涓€涓� DOM 鑺傜偣鏄惁鍖呭惈鍙︿竴涓� DOM 鑺傜偣
       * @param parent {Node} 鐖惰妭鐐�
       * @param node {Node} 瀛愯妭鐐�
       * @returns {Boolean}
       */
      contains: function (parent, node) {
        if (parent && !node) {
          return documentElement.contains(parent);
        }

        return parent !== node && parent.contains(node);
      },

      /**
       * 灏嗘暟缁勬垨瀵硅薄搴忓垪鍖�
       * @param obj
       * @returns {String}
       */
      param: function (obj) {
        if (!isObjectLike(obj)) {
          return '';
        }

        var args = [];
        each(obj, function (key, value) {
          destructure(key, value);
        });

        return args.join('&');

        function destructure(key, value) {
          var keyTmp;

          if (isObjectLike(value)) {
            each(value, function (i, v) {
              if (isArray(value) && !isObjectLike(v)) {
                keyTmp = '';
              } else {
                keyTmp = i;
              }

              destructure(key + '[' + keyTmp + ']', v);
            });
          } else {
            if (!isNull(value) && value !== '') {
              keyTmp = '=' + encodeURIComponent(value);
            } else {
              keyTmp = '';
            }

            args.push(encodeURIComponent(key) + keyTmp);
          }
        }
      },
    });

    $.fn.extend({

      /**
       * 閬嶅巻瀵硅薄
       * @param callback {Function}
       * @return {JQ}
       */
      each: function (callback) {
        return each(this, callback);
      },

      /**
       * 閫氳繃閬嶅巻闆嗗悎涓殑鑺傜偣瀵硅薄锛岄€氳繃鍑芥暟杩斿洖涓€涓柊鐨勫璞★紝null 鎴� undefined 灏嗚杩囨护鎺夈€�
       * @param callback {Function}
       * @returns {JQ}
       */
      map: function (callback) {
        return new JQ(map(this, function (el, i) {
          return callback.call(el, i, el);
        }));
      },

      /**
       * 鑾峰彇鎸囧畾 DOM 鍏冪礌锛屾病鏈� index 鍙傛暟鏃讹紝鑾峰彇鎵€鏈� DOM 鐨勬暟缁�
       * @param index {Number=}
       * @returns {Node|Array}
       */
      get: function (index) {
        return index === undefined ?
          slice.call(this) :
          this[index >= 0 ? index : index + this.length];
      },

      /**
       * array涓彁鍙栫殑鏂规硶銆備粠start寮€濮嬶紝濡傛灉end 鎸囧嚭銆傛彁鍙栦笉鍖呭惈end浣嶇疆鐨勫厓绱犮€�
       * @param argument {start, end}
       * @returns {JQ}
       */
      slice: function (argument) {
        return new JQ(slice.apply(this, arguments));
      },

      /**
       * 绛涢€夊厓绱犻泦鍚�
       * @param selector {String|JQ|Node|Function}
       * @returns {JQ}
       */
      filter: function (selector) {
        if (isFunction(selector)) {
          return this.map(function (index, ele) {
            return selector.call(ele, index, ele) ? ele : undefined;
          });
        } else {
          var $selector = $(selector);
          return this.map(function (index, ele) {
            return $selector.index(ele) > -1 ? ele : undefined;
          });
        }
      },

      /**
       * 浠庡厓绱犻泦鍚堜腑鍒犻櫎鎸囧畾鐨勫厓绱�
       * @param selector {String|Node|JQ|Function}
       * @return {JQ}
       */
      not: function (selector) {
        var $excludes = this.filter(selector);
        return this.map(function (index, ele) {
          return $excludes.index(ele) > -1 ? undefined : ele;
        });
      },

      /**
       * 鑾峰彇鍏冪礌鐩稿浜� document 鐨勫亸绉�
       * @returns {Object}
       */
      offset: function () {
        if (this[0]) {
          var offset = this[0].getBoundingClientRect();
          return {
            left: offset.left + window.pageXOffset,
            top: offset.top + window.pageYOffset,
            width: offset.width,
            height: offset.height,
          };
        }

        return null;
      },

      /**
       * 杩斿洖鏈€杩戠殑鐢ㄤ簬瀹氫綅鐨勭埗鍏冪礌
       * @returns {*|JQ}
       */
      offsetParent: function () {
        return this.map(function () {
          var offsetParent = this.offsetParent;

          while (offsetParent && $(offsetParent).css('position') === 'static') {
            offsetParent = offsetParent.offsetParent;
          }

          return offsetParent || documentElement;
        });
      },

      /**
       * 鑾峰彇鍏冪礌鐩稿浜庣埗鍏冪礌鐨勫亸绉�
       * @return {Object}
       */
      position: function () {
        var _this = this;

        if (!_this[0]) {
          return null;
        }

        var offsetParent;
        var offset;
        var parentOffset = {
          top: 0,
          left: 0,
        };

        if (_this.css('position') === 'fixed') {
          offset = _this[0].getBoundingClientRect();
        } else {
          offsetParent = _this.offsetParent();
          offset = _this.offset();
          if (!nodeName(offsetParent[0], 'html')) {
            parentOffset = offsetParent.offset();
          }

          parentOffset = {
            top: parentOffset.top + offsetParent.css('borderTopWidth'),
            left: parentOffset.left + offsetParent.css('borderLeftWidth'),
          };
        }

        return {
          top: offset.top - parentOffset.top - _this.css('marginTop'),
          left: offset.left - parentOffset.left - _this.css('marginLeft'),
          width: offset.width,
          height: offset.height,
        };
      },

      /**
       * 鏄剧ず鎸囧畾鍏冪礌
       * @returns {JQ}
       */
      show: function () {
        return this.each(function () {
          if (this.style.display === 'none') {
            this.style.display = '';
          }

          if (window.getComputedStyle(this, '').getPropertyValue('display') === 'none') {
            this.style.display = defaultDisplay(this.nodeName);
          }
        });
      },

      /**
       * 闅愯棌鎸囧畾鍏冪礌
       * @returns {JQ}
       */
      hide: function () {
        return this.each(function () {
          this.style.display = 'none';
        });
      },

      /**
       * 鍒囨崲鍏冪礌鐨勬樉绀虹姸鎬�
       * @returns {JQ}
       */
      toggle: function () {
        return this.each(function () {
          this.style.display = this.style.display === 'none' ? '' : 'none';
        });
      },

      /**
       * 鏄惁鍚湁鎸囧畾鐨� CSS 绫�
       * @param className {String}
       * @returns {boolean}
       */
      hasClass: function (className) {
        if (!this[0] || !className) {
          return false;
        }

        return this[0].classList.contains(className);
      },

      /**
       * 绉婚櫎鎸囧畾灞炴€�
       * @param attr {String}
       * @returns {JQ}
       */
      removeAttr: function (attr) {
        return this.each(function () {
          this.removeAttribute(attr);
        });
      },

      /**
       * 鍒犻櫎灞炴€у€�
       * @param name {String}
       * @returns {JQ}
       */
      removeProp: function (name) {
        return this.each(function () {
          try {
            delete this[name];
          } catch (e) {}
        });
      },

      /**
       * 鑾峰彇褰撳墠瀵硅薄涓n涓厓绱�
       * @param index {Number}
       * @returns {JQ}
       */
      eq: function (index) {
        var ret = index === -1 ? this.slice(index) : this.slice(index, +index + 1);
        return new JQ(ret);
      },

      /**
       * 鑾峰彇瀵硅薄涓涓€涓厓绱�
       * @returns {JQ}
       */
      first: function () {
        return this.eq(0);
      },

      /**
       * 鑾峰彇瀵硅薄涓渶鍚庝竴涓厓绱�
       * @returns {JQ}
       */
      last: function () {
        return this.eq(-1);
      },

      /**
       * 鑾峰彇涓€涓厓绱犵殑浣嶇疆銆�
       * 褰� ele 鍙傛暟娌℃湁缁欏嚭鏃讹紝杩斿洖褰撳墠鍏冪礌鍦ㄥ厔寮熻妭鐐逛腑鐨勪綅缃€�
       * 鏈夌粰鍑轰簡 ele 鍙傛暟鏃讹紝杩斿洖 ele 鍏冪礌鍦ㄥ綋鍓嶅璞′腑鐨勪綅缃�
       * @param ele {Selector|Node=}
       * @returns {Number}
       */
      index: function (ele) {
        if (!ele) {
          // 鑾峰彇褰撳墠 JQ 瀵硅薄鐨勭涓€涓厓绱犲湪鍚岃緢鍏冪礌涓殑浣嶇疆
          return this.eq(0).parent().children().get().indexOf(this[0]);
        } else if (isString(ele)) {
          // 杩斿洖褰撳墠 JQ 瀵硅薄鐨勭涓€涓厓绱犲湪鎸囧畾閫夋嫨鍣ㄥ搴旂殑鍏冪礌涓殑浣嶇疆
          return $(ele).eq(0).parent().children().get().indexOf(this[0]);
        } else {
          // 杩斿洖鎸囧畾鍏冪礌鍦ㄥ綋鍓� JQ 瀵硅薄涓殑浣嶇疆
          return this.get().indexOf(ele);
        }
      },

      /**
       * 鏍规嵁閫夋嫨鍣ㄣ€丏OM鍏冪礌鎴� JQ 瀵硅薄鏉ユ娴嬪尮閰嶅厓绱犻泦鍚堬紝
       * 濡傛灉鍏朵腑鑷冲皯鏈変竴涓厓绱犵鍚堣繖涓粰瀹氱殑琛ㄨ揪寮忓氨杩斿洖true
       * @param selector {String|Node|NodeList|Array|JQ|Window}
       * @returns boolean
       */
      is: function (selector) {
        var _this = this[0];

        if (!_this || selector === undefined || selector === null) {
          return false;
        }

        var $compareWith;
        var i;
        if (isString(selector)) {
          if (_this === document || _this === window) {
            return false;
          }

          var matchesSelector =
            _this.matches ||
            _this.matchesSelector ||
            _this.webkitMatchesSelector ||
            _this.mozMatchesSelector ||
            _this.oMatchesSelector ||
            _this.msMatchesSelector;

          return matchesSelector.call(_this, selector);
        } else if (selector === document || selector === window) {
          return _this === selector;
        } else {
          if (selector.nodeType || isArrayLike(selector)) {
            $compareWith = selector.nodeType ? [selector] : selector;
            for (i = 0; i < $compareWith.length; i++) {
              if ($compareWith[i] === _this) {
                return true;
              }
            }

            return false;
          }

          return false;
        }
      },

      /**
       * 鏍规嵁 CSS 閫夋嫨鍣ㄦ壘鍒板悗浠ｈ妭鐐圭殑闆嗗悎
       * @param selector {String}
       * @returns {JQ}
       */
      find: function (selector) {
        var foundElements = [];

        this.each(function (i, _this) {
          merge(foundElements, _this.querySelectorAll(selector));
        });

        return new JQ(foundElements);
      },

      /**
       * 鎵惧埌鐩存帴瀛愬厓绱犵殑鍏冪礌闆嗗悎
       * @param selector {String=}
       * @returns {JQ}
       */
      children: function (selector) {
        var children = [];
        this.each(function (i, _this) {
          each(_this.childNodes, function (i, childNode) {
            if (childNode.nodeType !== 1) {
              return true;
            }

            if (!selector || (selector && $(childNode).is(selector))) {
              children.push(childNode);
            }
          });
        });

        return new JQ(unique(children));
      },

      /**
       * 淇濈暀鍚湁鎸囧畾瀛愬厓绱犵殑鍏冪礌锛屽幓鎺変笉鍚湁鎸囧畾瀛愬厓绱犵殑鍏冪礌
       * @param selector {String|Node|JQ|NodeList|Array}
       * @return {JQ}
       */
      has: function (selector) {
        var $targets = isString(selector) ? this.find(selector) : $(selector);
        var len = $targets.length;
        return this.filter(function () {
          for (var i = 0; i < len; i++) {
            if ($.contains(this, $targets[i])) {
              return true;
            }
          }
        });
      },

      /**
       * 鍙栧緱鍚岃緢鍏冪礌鐨勯泦鍚�
       * @param selector {String=}
       * @returns {JQ}
       */
      siblings: function (selector) {
        return this.prevAll(selector).add(this.nextAll(selector));
      },

      /**
       * 杩斿洖棣栧厛鍖归厤鍒扮殑鐖惰妭鐐癸紝鍖呭惈鐖惰妭鐐�
       * @param selector {String}
       * @returns {JQ}
       */
      closest: function (selector) {
        var _this = this;

        if (!_this.is(selector)) {
          _this = _this.parents(selector).eq(0);
        }

        return _this;
      },

      /**
       * 鍒犻櫎鎵€鏈夊尮閰嶇殑鍏冪礌
       * @returns {JQ}
       */
      remove: function () {
        return this.each(function (i, _this) {
          if (_this.parentNode) {
            _this.parentNode.removeChild(_this);
          }
        });
      },

      /**
       * 娣诲姞鍖归厤鐨勫厓绱犲埌褰撳墠瀵硅薄涓�
       * @param selector {String|JQ}
       * @returns {JQ}
       */
      add: function (selector) {
        return new JQ(unique(merge(this.get(), $(selector))));
      },

      /**
       * 鍒犻櫎瀛愯妭鐐�
       * @returns {JQ}
       */
      empty: function () {
        return this.each(function () {
          this.innerHTML = '';
        });
      },

      /**
       * 閫氳繃娣卞害鍏嬮殕鏉ュ鍒堕泦鍚堜腑鐨勬墍鏈夊厓绱犮€�
       * (閫氳繃鍘熺敓 cloneNode 鏂规硶娣卞害鍏嬮殕鏉ュ鍒堕泦鍚堜腑鐨勬墍鏈夊厓绱犮€傛鏂规硶涓嶄細鏈夋暟鎹拰浜嬩欢澶勭悊绋嬪簭澶嶅埗鍒版柊鐨勫厓绱犮€傝繖鐐瑰拰jquery涓埄鐢ㄤ竴涓弬鏁版潵纭畾鏄惁澶嶅埗鏁版嵁鍜屼簨浠跺鐞嗕笉鐩稿悓銆�)
       * @returns {JQ}
       */
      clone: function () {
        return this.map(function () {
          return this.cloneNode(true);
        });
      },

      /**
       * 鐢ㄦ柊鍏冪礌鏇挎崲褰撳墠鍏冪礌
       * @param newContent {String|Node|NodeList|JQ}
       * @returns {JQ}
       */
      replaceWith: function (newContent) {
        return this.before(newContent).remove();
      },

      /**
       * 灏嗚〃鍗曞厓绱犵殑鍊肩粍鍚堟垚閿€煎鏁扮粍
       * @returns {Array}
       */
      serializeArray: function () {
        var result = [];
        var $ele;
        var type;
        var ele = this[0];

        if (!ele || !ele.elements) {
          return result;
        }

        $(slice.call(ele.elements)).each(function () {
          $ele = $(this);
          type = $ele.attr('type');
          if (
            this.nodeName.toLowerCase() !== 'fieldset' &&
            !this.disabled &&
            ['submit', 'reset', 'button'].indexOf(type) === -1 &&
            (['radio', 'checkbox'].indexOf(type) === -1 || this.checked)
          ) {
            result.push({
              name: $ele.attr('name'),
              value: $ele.val(),
            });
          }
        });

        return result;
      },

      /**
       * 灏嗚〃鍗曞厓绱犳垨瀵硅薄搴忓垪鍖�
       * @returns {String}
       */
      serialize: function () {
        var result = [];
        each(this.serializeArray(), function (i, elm) {
          result.push(encodeURIComponent(elm.name) + '=' + encodeURIComponent(elm.value));
        });

        return result.join('&');
      },
    });

    /**
     * val - 鑾峰彇鎴栬缃厓绱犵殑鍊�
     * @param value {String=}
     * @return {*|JQ}
     */
    /**
     * html - 鑾峰彇鎴栬缃厓绱犵殑 HTML
     * @param value {String=}
     * @return {*|JQ}
     */
    /**
     * text - 鑾峰彇鎴栬缃厓绱犵殑鍐呭
     * @param value {String=}
     * @return {*|JQ}
     */
    each(['val', 'html', 'text'], function (nameIndex, name) {
      var props = {
        0: 'value',
        1: 'innerHTML',
        2: 'textContent',
      };

      var defaults = {
        0: undefined,
        1: undefined,
        2: null,
      };

      $.fn[name] = function (value) {
        if (value === undefined) {
          // 鑾峰彇鍊�
          return this[0] ? this[0][props[nameIndex]] : defaults[nameIndex];
        } else {
          // 璁剧疆鍊�
          return this.each(function (i, ele) {
            ele[props[nameIndex]] = value;
          });
        }
      };
    });

    /**
     * attr - 鑾峰彇鎴栬缃厓绱犵殑灞炴€у€�
     * @param {name|props|key,value=}
     * @return {String|JQ}
     */
    /**
     * prop - 鑾峰彇鎴栬缃厓绱犵殑灞炴€у€�
     * @param {name|props|key,value=}
     * @return {String|JQ}
     */
    /**
     * css - 鑾峰彇鎴栬缃厓绱犵殑鏍峰紡
     * @param {name|props|key,value=}
     * @return {String|JQ}
     */
    each(['attr', 'prop', 'css'], function (nameIndex, name) {
      var set = function (ele, key, value) {
        if (nameIndex === 0) {
          ele.setAttribute(key, value);
        } else if (nameIndex === 1) {
          ele[key] = value;
        } else {
          ele.style[key] = value;
        }
      };

      var get = function (ele, key) {
        if (!ele) {
          return undefined;
        }

        var value;
        if (nameIndex === 0) {
          value = ele.getAttribute(key);
        } else if (nameIndex === 1) {
          value = ele[key];
        } else {
          value = window.getComputedStyle(ele, null).getPropertyValue(key);
        }

        return value;
      };

      $.fn[name] = function (key, value) {
        var argLength = arguments.length;

        if (argLength === 1 && isString(key)) {
          // 鑾峰彇鍊�
          return get(this[0], key);
        } else {
          // 璁剧疆鍊�
          return this.each(function (i, ele) {
            if (argLength === 2) {
              set(ele, key, value);
            } else {
              each(key, function (k, v) {
                set(ele, k, v);
              });
            }
          });
        }
      };
    });

    /**
     * addClass - 娣诲姞 CSS 绫伙紝澶氫釜绫诲悕鐢ㄧ┖鏍煎垎鍓�
     * @param className {String}
     * @return {JQ}
     */
    /**
     * removeClass - 绉婚櫎 CSS 绫伙紝澶氫釜绫诲悕鐢ㄧ┖鏍煎垎鍓�
     * @param className {String}
     * @return {JQ}
     */
    /**
     * toggleClass - 鍒囨崲 CSS 绫诲悕锛屽涓被鍚嶇敤绌烘牸鍒嗗壊
     * @param className {String}
     * @return {JQ}
     */
    each(['add', 'remove', 'toggle'], function (nameIndex, name) {
      $.fn[name + 'Class'] = function (className) {
        if (!className) {
          return this;
        }

        var classes = className.split(' ');
        return this.each(function (i, ele) {
          each(classes, function (j, cls) {
            ele.classList[name](cls);
          });
        });
      };
    });

    /**
     * width - 鑾峰彇鍏冪礌鐨勫搴�
     * @return {Number}
     */
    /**
     * height - 鑾峰彇鍏冪礌鐨勯珮搴�
     * @return {Number}
     */
    each({
      Width: 'width',
      Height: 'height',
    }, function (prop, name) {
      $.fn[name] = function (val) {
        if (val === undefined) {
          // 鑾峰彇
          var ele = this[0];

          if (isWindow(ele)) {
            return ele['inner' + prop];
          }

          if (isDocument(ele)) {
            return ele.documentElement['scroll' + prop];
          }

          var $ele = $(ele);

          // IE10銆両E11 鍦� box-sizing:border-box 鏃讹紝涓嶄細鍖呭惈 padding 鍜� border锛岃繖閲岃繘琛屼慨澶�
          var IEFixValue = 0;
          var isWidth = name === 'width';
          if ('ActiveXObject' in window) { // 鍒ゆ柇鏄� IE 娴忚鍣�
            if ($ele.css('box-sizing') === 'border-box') {
              IEFixValue =
                parseFloat($ele.css('padding-' + (isWidth ? 'left' : 'top'))) +
                parseFloat($ele.css('padding-' + (isWidth ? 'right' : 'bottom'))) +
                parseFloat($ele.css('border-' + (isWidth ? 'left' : 'top') + '-width')) +
                parseFloat($ele.css('border-' + (isWidth ? 'right' : 'bottom') + '-width'));
            }
          }

          return parseFloat($(ele).css(name)) + IEFixValue;
        } else {
          // 璁剧疆
          if (!isNaN(Number(val)) && val !== '') {
            val += 'px';
          }

          return this.css(name, val);
        }
      };
    });

    /**
     * innerWidth - 鑾峰彇鍏冪礌鐨勫搴︼紝鍖呭惈鍐呰竟璺�
     * @return {Number}
     */
    /**
     * innerHeight - 鑾峰彇鍏冪礌鐨勯珮搴︼紝鍖呭惈鍐呰竟璺�
     * @return {Number}
     */
    each({
      Width: 'width',
      Height: 'height',
    }, function (prop, name) {
      $.fn['inner' + prop] = function () {
        var value = this[name]();
        var $ele = $(this[0]);

        if ($ele.css('box-sizing') !== 'border-box') {
          value += parseFloat($ele.css('padding-' + (name === 'width' ? 'left' : 'top')));
          value += parseFloat($ele.css('padding-' + (name === 'width' ? 'right' : 'bottom')));
        }

        return value;
      };
    });

    var dir = function (nodes, selector, nameIndex, node) {
      var ret = [];
      var ele;
      nodes.each(function (j, _this) {
        ele = _this[node];
        while (ele) {
          if (nameIndex === 2) {
            // prevUntil
            if (!selector || (selector && $(ele).is(selector))) {
              break;
            }

            ret.push(ele);
          } else if (nameIndex === 0) {
            // prev
            if (!selector || (selector && $(ele).is(selector))) {
              ret.push(ele);
            }

            break;
          } else {
            // prevAll
            if (!selector || (selector && $(ele).is(selector))) {
              ret.push(ele);
            }
          }

          ele = ele[node];
        }
      });

      return new JQ(unique(ret));
    };

    /**
     * prev - 鍙栧緱鍓嶄竴涓尮閰嶇殑鍏冪礌
     * @param selector {String=}
     * @return {JQ}
     */
    /**
     * prevAll - 鍙栧緱鍓嶉潰鎵€鏈夊尮閰嶇殑鍏冪礌
     * @param selector {String=}
     * @return {JQ}
     */
    /**
     * prevUntil - 鍙栧緱鍓嶉潰鐨勬墍鏈夊厓绱狅紝鐩村埌閬囧埌鍖归厤鐨勫厓绱狅紝涓嶅寘鍚尮閰嶇殑鍏冪礌
     * @param selector {String=}
     * @return {JQ}
     */
    each(['', 'All', 'Until'], function (nameIndex, name) {
      $.fn['prev' + name] = function (selector) {

        // prevAll銆乸revUntil 闇€瑕佹妸鍏冪礌鐨勯『搴忓€掑簭澶勭悊锛屼互渚垮拰 jQuery 鐨勭粨鏋滀竴鑷�
        var $nodes = nameIndex === 0 ? this : $(this.get().reverse());
        return dir($nodes, selector, nameIndex, 'previousElementSibling');
      };
    });

    /**
     * next - 鍙栧緱鍚庝竴涓尮閰嶇殑鍏冪礌
     * @param selector {String=}
     * @return {JQ}
     */
    /**
     * nextAll - 鍙栧緱鍚庨潰鎵€鏈夊尮閰嶇殑鍏冪礌
     * @param selector {String=}
     * @return {JQ}
     */
    /**
     * nextUntil - 鍙栧緱鍚庨潰鎵€鏈夊尮閰嶇殑鍏冪礌锛岀洿鍒伴亣鍒板尮閰嶇殑鍏冪礌锛屼笉鍖呭惈鍖归厤鐨勫厓绱�
     * @param selector {String=}
     * @return {JQ}
     */
    each(['', 'All', 'Until'], function (nameIndex, name) {
      $.fn['next' + name] = function (selector) {
        return dir(this, selector, nameIndex, 'nextElementSibling');
      };
    });

    /**
     * parent - 鍙栧緱鍖归厤鐨勭洿鎺ョ埗鍏冪礌
     * @param selector {String=}
     * @return {JQ}
     */
    /**
     * parents - 鍙栧緱鎵€鏈夊尮閰嶇殑鐖跺厓绱�
     * @param selector {String=}
     * @return {JQ}
     */
    /**
     * parentUntil - 鍙栧緱鎵€鏈夌殑鐖跺厓绱狅紝鐩村埌閬囧埌鍖归厤鐨勫厓绱狅紝涓嶅寘鍚尮閰嶇殑鍏冪礌
     * @param selector {String=}
     * @return {JQ}
     */
    each(['', 's', 'sUntil'], function (nameIndex, name) {
      $.fn['parent' + name] = function (selector) {

        // parents銆乸arentsUntil 闇€瑕佹妸鍏冪礌鐨勯『搴忓弽鍚戝鐞嗭紝浠ヤ究鍜� jQuery 鐨勭粨鏋滀竴鑷�
        var $nodes = nameIndex === 0 ? this : $(this.get().reverse());
        return dir($nodes, selector, nameIndex, 'parentNode');
      };
    });

    /**
     * append - 鍦ㄥ厓绱犲唴閮ㄨ拷鍔犲唴瀹�
     * @param newChild {String|Node|NodeList|JQ}
     * @return {JQ}
     */
    /**
     * prepend - 鍦ㄥ厓绱犲唴閮ㄥ墠缃唴瀹�
     * @param newChild {String|Node|NodeList|JQ}
     * @return {JQ}
     */
    each(['append', 'prepend'], function (nameIndex, name) {
      $.fn[name] = function (newChild) {
        var newChilds;
        var copyByClone = this.length > 1;

        if (isString(newChild)) {
          var tempDiv = document.createElement('div');
          tempDiv.innerHTML = newChild;
          newChilds = slice.call(tempDiv.childNodes);
        } else {
          newChilds = $(newChild).get();
        }

        if (nameIndex === 1) {
          // prepend
          newChilds.reverse();
        }

        return this.each(function (i, _this) {
          each(newChilds, function (j, child) {
            // 涓€涓厓绱犺鍚屾椂杩藉姞鍒板涓厓绱犱腑锛岄渶瑕佸厛澶嶅埗涓€浠斤紝鐒跺悗杩藉姞
            if (copyByClone && i > 0) {
              child = child.cloneNode(true);
            }

            if (nameIndex === 0) {
              // append
              _this.appendChild(child);
            } else {
              // prepend
              _this.insertBefore(child, _this.childNodes[0]);
            }
          });
        });
      };
    });

    /**
     * insertBefore - 鎻掑叆鍒版寚瀹氬厓绱犵殑鍓嶉潰
     * @param selector {String|Node|NodeList|JQ}
     * @return {JQ}
     */
    /**
     * insertAfter - 鎻掑叆鍒版寚瀹氬厓绱犵殑鍚庨潰
     * @param selector {String|Node|NodeList|JQ}
     * @return {JQ}
     */
    each(['insertBefore', 'insertAfter'], function (nameIndex, name) {
      $.fn[name] = function (selector) {
        var $ele = $(selector);
        return this.each(function (i, _this) {
          $ele.each(function (j, ele) {
            ele.parentNode.insertBefore(
              $ele.length === 1 ? _this : _this.cloneNode(true),
              nameIndex === 0 ? ele : ele.nextSibling
            );
          });
        });
      };
    });

    /**
     * appendTo - 杩藉姞鍒版寚瀹氬厓绱犲唴瀹�
     * @param selector {String|Node|NodeList|JQ}
     * @return {JQ}
     */
    /**
     * prependTo - 鍓嶇疆鍒版寚瀹氬厓绱犲唴閮�
     * @param selector {String|Node|NodeList|JQ}
     * @return {JQ}
     */
    /**
     * before - 鎻掑叆鍒版寚瀹氬厓绱犲墠闈�
     * @param selector {String|Node|NodeList|JQ}
     * @return {JQ}
     */
    /**
     * after - 鎻掑叆鍒版寚瀹氬厓绱犲悗闈�
     * @param selector {String|Node|NodeList|JQ}
     * @return {JQ}
     */
    /**
     * replaceAll - 鏇挎崲鎺夋寚瀹氬厓绱�
     * @param selector {String|Node|NodeList|JQ}
     * @return {JQ}
     */
    each({
      appendTo: 'append',
      prependTo: 'prepend',
      before: 'insertBefore',
      after: 'insertAfter',
      replaceAll: 'replaceWith',
    }, function (name, original) {
      $.fn[name] = function (selector) {
        $(selector)[original](this);
        return this;
      };
    });



    (function () {
      var dataNS = 'mduiElementDataStorage';

      $.extend({
        /**
         * 鍦ㄦ寚瀹氬厓绱犱笂瀛樺偍鏁版嵁锛屾垨浠庢寚瀹氬厓绱犱笂璇诲彇鏁版嵁
         * @param ele 蹇呴』锛� DOM 鍏冪礌
         * @param key 蹇呴』锛岄敭鍚�
         * @param value 鍙€夛紝鍊�
         */
        data: function (ele, key, value) {
          var data = {};

          if (value !== undefined) {
            // 鏍规嵁 key銆乿alue 璁剧疆鍊�
            data[key] = value;
          } else if (isObjectLike(key)) {
            // 鏍规嵁閿€煎璁剧疆鍊�
            data = key;
          } else if (key === undefined) {
            // 鑾峰彇鎵€鏈夊€�
            var result = {};
            each(ele.attributes, function (i, attribute) {
              var name = attribute.name;
              if (name.indexOf('data-') === 0) {
                var prop = name.slice(5).replace(/-./g, function (u) {
                  // 妯潬杞负椹煎嘲娉�
                  return u.charAt(1).toUpperCase();
                });

                result[prop] = attribute.value;
              }
            });

            if (ele[dataNS]) {
              each(ele[dataNS], function (k, v) {
                result[k] = v;
              });
            }

            return result;
          } else {
            // 鑾峰彇鎸囧畾鍊�
            if (ele[dataNS] && (key in ele[dataNS])) {
              return ele[dataNS][key];
            } else {
              var dataKey = ele.getAttribute('data-' + key);
              if (dataKey) {
                return dataKey;
              } else {
                return undefined;
              }
            }
          }

          // 璁剧疆鍊�
          if (!ele[dataNS]) {
            ele[dataNS] = {};
          }

          each(data, function (k, v) {
            ele[dataNS][k] = v;
          });
        },

        /**
         * 绉婚櫎鎸囧畾鍏冪礌涓婂瓨鏀剧殑鏁版嵁
         * @param ele 蹇呴』锛孌OM 鍏冪礌
         * @param key 蹇呴』锛岄敭鍚�
         */
        removeData: function (ele, key) {
          if (ele[dataNS] && ele[dataNS][key]) {
            ele[dataNS][key] = null;
            delete ele.mduiElementDataStorage[key];
          }
        },

      });

      $.fn.extend({

        /**
         * 鍦ㄥ厓绱犱笂璇诲彇鎴栬缃暟鎹�
         * @param key 蹇呴』
         * @param value
         * @returns {*}
         */
        data: function (key, value) {
          if (value === undefined) {
            if (isObjectLike(key)) {

              // 鍚屾椂璁剧疆澶氫釜鍊�
              return this.each(function (i, ele) {
                $.data(ele, key);
              });
            } else if (this[0]) {

              // 鑾峰彇鍊�
              return $.data(this[0], key);
            } else {
              return undefined;
            }
          } else {
            // 璁剧疆鍊�
            return this.each(function (i, ele) {
              $.data(ele, key, value);
            });
          }
        },

        /**
         * 绉婚櫎鍏冪礌涓婂瓨鍌ㄧ殑鏁版嵁
         * @param key 蹇呴』
         * @returns {*}
         */
        removeData: function (key) {
          return this.each(function (i, ele) {
            $.removeData(ele, key);
          });
        },

      });
    })();


    (function () {
      // 瀛樺偍浜嬩欢
      var handlers = {
        // i: { // 鍏冪礌ID
        //   j: { // 浜嬩欢ID
        //     e: 浜嬩欢鍚�
        //     fn: 浜嬩欢澶勭悊鍑芥暟
        //     i: 浜嬩欢ID
        //     proxy:
        //     sel: 閫夋嫨鍣�
        //   }
        // }
      };

      // 鍏冪礌ID
      var _elementId = 1;

      var fnFalse = function () {
        return false;
      };

      $.fn.extend({
        /**
         * DOM 鍔犺浇瀹屾瘯鍚庤皟鐢ㄧ殑鍑芥暟
         * @param callback
         * @returns {ready}
         */
        ready: function (callback) {
          if (/complete|loaded|interactive/.test(document.readyState) && document.body) {
            callback($);
          } else {
            document.addEventListener('DOMContentLoaded', function () {
              callback($);
            }, false);
          }

          return this;
        },

        /**
         * 缁戝畾浜嬩欢
         *
         * $().on({eventName: fn}, selector, data);
         * $().on({eventName: fn}, selector)
         * $().on({eventName: fn})
         * $().on(eventName, selector, data, fn);
         * $().on(eventName, selector, fn);
         * $().on(eventName, data, fn);
         * $().on(eventName, fn);
         * $().on(eventName, false);
         *
         * @param eventName
         * @param selector
         * @param data
         * @param callback
         * @param one 鏄惁鏄� one 鏂规硶锛屽彧鍦� JQ 鍐呴儴浣跨敤
         * @returns
         */
        on: function (eventName, selector, data, callback, one) {
          var _this = this;

          // 榛樿
          // $().on(event, selector, data, callback)

          // event 浣跨敤 浜嬩欢:鍑芥暟 閿€煎
          // event = {
          //   'event1': callback1,
          //   'event2': callback2
          // }
          //
          // $().on(event, selector, data)
          if (eventName && !isString(eventName)) {
            each(eventName, function (type, fn) {
              _this.on(type, selector, data, fn);
            });

            return _this;
          }

          // selector 涓嶅瓨鍦�
          // $().on(event, data, callback)
          if (!isString(selector) && !isFunction(callback) && callback !== false) {
            callback = data;
            data = selector;
            selector = undefined;
          }

          // data 涓嶅瓨鍦�
          // $().on(event, callback)
          if (isFunction(data) || data === false) {
            callback = data;
            data = undefined;
          }

          // callback 涓� false
          // $().on(event, false)
          if (callback === false) {
            callback = fnFalse;
          }

          if (one === 1) {
            var origCallback = callback;
            callback = function () {
              _this.off(eventName, selector, callback);
              return origCallback.apply(this, arguments);
            };
          }

          return this.each(function () {
            add(this, eventName, callback, data, selector);
          });
        },

        /**
         * 缁戝畾浜嬩欢锛屽彧瑙﹀彂涓€娆�
         * @param eventName
         * @param selector
         * @param data
         * @param callback
         */
        one: function (eventName, selector, data, callback) {
          var _this = this;

          if (!isString(eventName)) {
            each(eventName, function (type, fn) {
              type.split(' ').forEach(function (eName) {
                _this.on(eName, selector, data, fn, 1);
              });
            });
          } else {
            eventName.split(' ').forEach(function (eName) {
              _this.on(eName, selector, data, callback, 1);
            });
          }

          return this;
        },

        /**
         * 鍙栨秷缁戝畾浜嬩欢
         *
         * $().off(eventName, selector);
         * $().off(eventName, callback);
         * $().off(eventName, false);
         *
         */
        off: function (eventName, selector, callback) {
          var _this = this;

          // event 浣跨敤 浜嬩欢:鍑芥暟 閿€煎
          // event = {
          //   'event1': callback1,
          //   'event2': callback2
          // }
          //
          // $().off(event, selector)
          if (eventName && !isString(eventName)) {
            each(eventName, function (type, fn) {
              _this.off(type, selector, fn);
            });

            return _this;
          }

          // selector 涓嶅瓨鍦�
          // $().off(event, callback)
          if (!isString(selector) && !isFunction(callback) && callback !== false) {
            callback = selector;
            selector = undefined;
          }

          // callback 涓� false
          // $().off(event, false)
          if (callback === false) {
            callback = fnFalse;
          }

          return _this.each(function () {
            remove(this, eventName, callback, selector);
          });
        },

        /**
         * 瑙﹀彂涓€涓簨浠�
         * @param eventName
         * @param data
         * @returns {*|JQ}
         */
        trigger: function (eventName, data) {
          if (!isString(eventName)) {
            return;
          }

          var isMouseEvent = ['click', 'mousedown', 'mouseup', 'mousemove'].indexOf(eventName) > -1;

          var evt;

          if (isMouseEvent) {
            // Note: MouseEvent 鏃犳硶浼犲叆 detail 鍙傛暟
            try {
              evt = new MouseEvent(eventName, {
                bubbles: true,
                cancelable: true,
              });
            } catch (e) {
              evt = document.createEvent('MouseEvent');
              evt.initMouseEvent(eventName, true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
            }
          } else {
            try {
              evt = new CustomEvent(eventName, {
                detail: data,
                bubbles: true,
                cancelable: true,
              });
            } catch (e) {
              evt = document.createEvent('CustomEvent');
              evt.initCustomEvent(eventName, true, true, data);
            }
          }

          evt._detail = data;

          return this.each(function () {
            this.dispatchEvent(evt);
          });
        },
      });

      /**
       * 娣诲姞浜嬩欢鐩戝惉
       * @param element
       * @param eventName
       * @param func
       * @param data
       * @param selector
       */
      function add(element, eventName, func, data, selector) {
        var elementId = getElementId(element);
        if (!handlers[elementId]) {
          handlers[elementId] = [];
        }

        // 浼犲叆 data.useCapture 鏉ヨ缃� useCapture: true
        var useCapture = false;
        if (isObjectLike(data) && data.useCapture) {
          useCapture = true;
        }

        eventName.split(' ').forEach(function (event) {

          var handler = {
            e: event,
            fn: func,
            sel: selector,
            i: handlers[elementId].length,
          };

          var callFn = function (e, ele) {
            // 鍥犱负榧犳爣浜嬩欢妯℃嫙浜嬩欢鐨� detail 灞炴€ф槸鍙鐨勶紝鍥犳鍦� e._detail 涓瓨鍌ㄥ弬鏁�
            var result = func.apply(ele, e._detail === undefined ? [e] : [e].concat(e._detail));

            if (result === false) {
              e.preventDefault();
              e.stopPropagation();
            }
          };

          var proxyfn = handler.proxy = function (e) {
            e._data = data;

            // 浜嬩欢浠ｇ悊
            if (selector) {
              $(element).find(selector).get().reverse().forEach(function (ele) {
                if (ele === e.target || $.contains(ele, e.target)) {
                  callFn(e, ele);
                }
              });
            }

            // 涓嶄娇鐢ㄤ簨浠朵唬鐞�
            else {
              callFn(e, element);
            }
          };

          handlers[elementId].push(handler);
          element.addEventListener(handler.e, proxyfn, useCapture);
        });
      }

      /**
       * 绉婚櫎浜嬩欢鐩戝惉
       * @param element
       * @param eventName
       * @param func
       * @param selector
       */
      function remove(element, eventName, func, selector) {
        (eventName || '').split(' ').forEach(function (event) {
          getHandlers(element, event, func, selector).forEach(function (handler) {
            delete handlers[getElementId(element)][handler.i];
            element.removeEventListener(handler.e, handler.proxy, false);
          });
        });
      }

      /**
       * 涓哄厓绱犺祴浜堜竴涓敮涓€鐨処D
       * @param element
       * @returns {number|*}
       */
      function getElementId(element) {
        return element._elementId || (element._elementId = _elementId++);
      }

      /**
       * 鑾峰彇鍖归厤鐨勪簨浠�
       * @param element
       * @param eventName
       * @param func
       * @param selector
       * @returns {Array.<T>}
       */
      function getHandlers(element, eventName, func, selector) {
        return (handlers[getElementId(element)] || []).filter(function (handler) {

          return handler &&
            (!eventName  || handler.e === eventName) &&
            (!func || handler.fn.toString() === func.toString()) &&
            (!selector || handler.sel === selector);
        });
      }

    })();


    (function () {
      var globalOptions = {};
      var jsonpID = 0;

      // 鍏ㄥ眬浜嬩欢鍚�
      var ajaxEvent = {
        ajaxStart: 'start.mdui.ajax',
        ajaxSuccess: 'success.mdui.ajax',
        ajaxError: 'error.mdui.ajax',
        ajaxComplete: 'complete.mdui.ajax',
      };

      /**
       * 鍒ゆ柇姝よ姹傛柟娉曟槸鍚﹂€氳繃鏌ヨ瀛楃涓叉彁浜ゅ弬鏁�
       * @param method 璇锋眰鏂规硶锛屽ぇ鍐�
       * @returns {boolean}
       */
      var isQueryStringData = function (method) {
        return ['GET', 'HEAD'].indexOf(method) >= 0;
      };

      /**
       * 娣诲姞鍙傛暟鍒� URL 涓婏紝涓� URL 涓笉瀛樺湪 ? 鏃讹紝鑷姩鎶婄涓€涓� & 鏇挎崲涓� ?
       * @param url
       * @param query 鍙傛暟 key=value
       * @returns {string}
       */
      var appendQuery = function (url, query) {
        return (url + '&' + query).replace(/[&?]{1,2}/, '?');
      };

      $.extend({

        /**
         * 涓� ajax 璇锋眰璁剧疆鍏ㄥ眬閰嶇疆鍙傛暟
         * @param options
         */
        ajaxSetup: function (options) {
          $.extend(globalOptions, options || {});
        },

        /**
         * 鍙戦€� ajax 璇锋眰
         * @param options
         */
        ajax: function (options) {

          // 閰嶇疆鍙傛暟
          var defaults = {
            method: 'GET',         // 璇锋眰鏂瑰紡
            data: false,           // 璇锋眰鐨勬暟鎹紝鏌ヨ瀛楃涓叉垨瀵硅薄
            processData: true,     // 鏄惁鎶婃暟鎹浆鎹负鏌ヨ瀛楃涓插彂閫侊紝涓� false 鏃朵笉杩涜鑷姩杞崲銆�
            async: true,           // 鏄惁涓哄紓姝ヨ姹�
            cache: true,           // 鏄惁浠庣紦瀛樹腑璇诲彇锛屽彧瀵� GET/HEAD 璇锋眰鏈夋晥锛宒ataType 涓� jsonp 鏃朵负 false
            username: '',          // HTTP 璁块棶璁よ瘉鐨勭敤鎴峰悕
            password: '',          // HTTP 璁块棶璁よ瘉鐨勫瘑鐮�
            headers: {},           // 涓€涓敭鍊煎锛岄殢鐫€璇锋眰涓€璧峰彂閫�
            xhrFields: {},         // 璁剧疆 XHR 瀵硅薄
            statusCode: {},        // 涓€涓� HTTP 浠ｇ爜鍜屽嚱鏁扮殑瀵硅薄
            dataType: 'text',      // 棰勬湡鏈嶅姟鍣ㄨ繑鍥炵殑鏁版嵁绫诲瀷 text銆乯son銆乯sonp
            jsonp: 'callback',     // jsonp 璇锋眰鐨勫洖璋冨嚱鏁板悕绉�
            jsonpCallback: function () {  // 锛坰tring 鎴� Function锛変娇鐢ㄦ寚瀹氱殑鍥炶皟鍑芥暟鍚嶄唬鏇胯嚜鍔ㄧ敓鎴愮殑鍥炶皟鍑芥暟鍚�
              return 'mduijsonp_' + Date.now() + '_' + (jsonpID += 1);
            },

            contentType: 'application/x-www-form-urlencoded', // 鍙戦€佷俊鎭嚦鏈嶅姟鍣ㄦ椂鍐呭缂栫爜绫诲瀷
            timeout: 0,            // 璁剧疆璇锋眰瓒呮椂鏃堕棿锛堟绉掞級
            global: true,          // 鏄惁鍦� document 涓婅Е鍙戝叏灞€ ajax 浜嬩欢
            // beforeSend:    function (XMLHttpRequest) 璇锋眰鍙戦€佸墠鎵ц锛岃繑鍥� false 鍙彇娑堟湰娆� ajax 璇锋眰
            // success:       function (data, textStatus, XMLHttpRequest) 璇锋眰鎴愬姛鏃惰皟鐢�
            // error:         function (XMLHttpRequest, textStatus) 璇锋眰澶辫触鏃惰皟鐢�
            // statusCode:    {404: function ()}
            //                200-299涔嬮棿鐨勭姸鎬佺爜琛ㄧず鎴愬姛锛屽弬鏁板拰 success 鍥炶皟涓€鏍凤紱鍏朵粬鐘舵€佺爜琛ㄧず澶辫触锛屽弬鏁板拰 error 鍥炶皟涓€鏍�
            // complete:      function (XMLHttpRequest, textStatus) 璇锋眰瀹屾垚鍚庡洖璋冨嚱鏁� (璇锋眰鎴愬姛鎴栧け璐ヤ箣鍚庡潎璋冪敤)
          };

          // 鍥炶皟鍑芥暟
          var callbacks = [
            'beforeSend',
            'success',
            'error',
            'statusCode',
            'complete',
          ];

          // 鏄惁宸插彇娑堣姹�
          var isCanceled = false;

          // 淇濆瓨鍏ㄥ眬閰嶇疆
          var globals = globalOptions;

          // 浜嬩欢鍙傛暟
          var eventParams = {};

          // 鍚堝苟鍏ㄥ眬鍙傛暟鍒伴粯璁ゅ弬鏁帮紝鍏ㄥ眬鍥炶皟鍑芥暟涓嶈鐩�
          each(globals, function (key, value) {
            if (callbacks.indexOf(key) < 0) {
              defaults[key] = value;
            }
          });

          // 鍙傛暟鍚堝苟
          options = $.extend({}, defaults, options);

          /**
           * 瑙﹀彂鍏ㄥ眬浜嬩欢
           * @param event string 浜嬩欢鍚�
           * @param xhr XMLHttpRequest 浜嬩欢鍙傛暟
           */
          function triggerEvent(event, xhr) {
            if (options.global) {
              $(document).trigger(event, xhr);
            }
          }

          /**
           * 瑙﹀彂 XHR 鍥炶皟鍜屼簨浠�
           * @param callback string 鍥炶皟鍑芥暟鍚嶇О
           */
          function triggerCallback(callback) {
            var a = arguments;
            var result1;
            var result2;

            if (callback) {
              // 鍏ㄥ眬鍥炶皟
              if (callback in globals) {
                result1 = globals[callback](a[1], a[2], a[3], a[4]);
              }

              // 鑷畾涔夊洖璋�
              if (options[callback]) {
                result2 = options[callback](a[1], a[2], a[3], a[4]);
              }

              // beforeSend 鍥炶皟杩斿洖 false 鏃跺彇娑� ajax 璇锋眰
              if (callback === 'beforeSend' && (result1 === false || result2 === false)) {
                isCanceled = true;
              }
            }
          }

          // 璇锋眰鏂瑰紡杞负澶у啓
          var method = options.method = options.method.toUpperCase();

          // 榛樿浣跨敤褰撳墠椤甸潰 URL
          if (!options.url) {
            options.url = window.location.toString();
          }

          // 闇€瑕佸彂閫佺殑鏁版嵁
          // GET/HEAD 璇锋眰鍜� processData 涓� true 鏃讹紝杞崲涓烘煡璇㈠瓧绗︿覆鏍煎紡锛岀壒娈婃牸寮忎笉杞崲
          var sendData;
          if (
            (isQueryStringData(method) || options.processData) &&
            options.data &&
            [ArrayBuffer, Blob, Document, FormData].indexOf(options.data.constructor) < 0
          ) {
            sendData = isString(options.data) ? options.data : $.param(options.data);
          } else {
            sendData = options.data;
          }

          // 瀵逛簬 GET銆丠EAD 绫诲瀷鐨勮姹傦紝鎶� data 鏁版嵁娣诲姞鍒� URL 涓�
          if (isQueryStringData(method) && sendData) {
            // 鏌ヨ瀛楃涓叉嫾鎺ュ埌 URL 涓�
            options.url = appendQuery(options.url, sendData);
            sendData = null;
          }

          // JSONP
          if (options.dataType === 'jsonp') {
            // URL 涓坊鍔犺嚜鍔ㄧ敓鎴愮殑鍥炶皟鍑芥暟鍚�
            var callbackName = isFunction(options.jsonpCallback) ?
              options.jsonpCallback() :
              options.jsonpCallback;
            var requestUrl = appendQuery(options.url, options.jsonp + '=' + callbackName);

            eventParams.options = options;

            triggerEvent(ajaxEvent.ajaxStart, eventParams);
            triggerCallback('beforeSend', null);

            if (isCanceled) {
              return;
            }

            var abortTimeout;

            // 鍒涘缓 script
            var script = document.createElement('script');
            script.type = 'text/javascript';

            // 鍒涘缓 script 澶辫触
            script.onerror = function () {
              if (abortTimeout) {
                clearTimeout(abortTimeout);
              }

              triggerEvent(ajaxEvent.ajaxError, eventParams);
              triggerCallback('error', null, 'scripterror');

              triggerEvent(ajaxEvent.ajaxComplete, eventParams);
              triggerCallback('complete', null, 'scripterror');
            };

            script.src = requestUrl;

            // 澶勭悊
            window[callbackName] = function (data) {
              if (abortTimeout) {
                clearTimeout(abortTimeout);
              }

              eventParams.data = data;

              triggerEvent(ajaxEvent.ajaxSuccess, eventParams);
              triggerCallback('success', data, 'success', null);

              $(script).remove();
              script = null;
              delete window[callbackName];
            };

            $('head').append(script);

            if (options.timeout > 0) {
              abortTimeout = setTimeout(function () {
                $(script).remove();
                script = null;

                triggerEvent(ajaxEvent.ajaxError, eventParams);
                triggerCallback('error', null, 'timeout');
              }, options.timeout);
            }

            return;
          }

          // GET/HEAD 璇锋眰鐨勭紦瀛樺鐞�
          if (isQueryStringData(method) && !options.cache) {
            options.url = appendQuery(options.url, '_=' + Date.now());
          }

          // 鍒涘缓 XHR
          var xhr = new XMLHttpRequest();

          xhr.open(method, options.url, options.async, options.username, options.password);

          if (sendData && !isQueryStringData(method) && options.contentType !== false || options.contentType) {
            xhr.setRequestHeader('Content-Type', options.contentType);
          }

          // 璁剧疆 Accept
          if (options.dataType === 'json') {
            xhr.setRequestHeader('Accept', 'application/json, text/javascript');
          }

          // 娣诲姞 headers
          if (options.headers) {
            each(options.headers, function (key, value) {
              xhr.setRequestHeader(key, value);
            });
          }

          // 妫€鏌ユ槸鍚︽槸璺ㄥ煙璇锋眰
          if (options.crossDomain === undefined) {
            options.crossDomain =
              /^([\w-]+:)?\/\/([^\/]+)/.test(options.url) &&
              RegExp.$2 !== window.location.host;
          }

          if (!options.crossDomain) {
            xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
          }

          if (options.xhrFields) {
            each(options.xhrFields, function (key, value) {
              xhr[key] = value;
            });
          }

          eventParams.xhr = xhr;
          eventParams.options = options;

          var xhrTimeout;

          xhr.onload = function () {
            if (xhrTimeout) {
              clearTimeout(xhrTimeout);
            }

            // 鍖呭惈鎴愬姛鎴栭敊璇唬鐮佺殑瀛楃涓�
            var textStatus;

            // AJAX 杩斿洖鐨� HTTP 鍝嶅簲鐮佹槸鍚﹁〃绀烘垚鍔�
            var isHttpStatusSuccess = (xhr.status >= 200 && xhr.status < 300) || xhr.status === 0;

            if (isHttpStatusSuccess) {

              if (xhr.status === 204 || method === 'HEAD') {
                textStatus = 'nocontent';
              } else if (xhr.status === 304) {
                textStatus = 'notmodified';
              } else {
                textStatus = 'success';
              }

              var responseData;
              if (options.dataType === 'json') {
                try {
                  eventParams.data = responseData = JSON.parse(xhr.responseText);
                } catch (err) {
                  textStatus = 'parsererror';

                  triggerEvent(ajaxEvent.ajaxError, eventParams);
                  triggerCallback('error', xhr, textStatus);
                }

                if (textStatus !== 'parsererror') {
                  triggerEvent(ajaxEvent.ajaxSuccess, eventParams);
                  triggerCallback('success', responseData, textStatus, xhr);
                }
              } else {
                eventParams.data = responseData =
                  xhr.responseType === 'text' || xhr.responseType === '' ?
                  xhr.responseText :
                  xhr.response;

                triggerEvent(ajaxEvent.ajaxSuccess, eventParams);
                triggerCallback('success', responseData, textStatus, xhr);
              }
            } else {
              textStatus = 'error';

              triggerEvent(ajaxEvent.ajaxError, eventParams);
              triggerCallback('error', xhr, textStatus);
            }

            // statusCode
            each([globals.statusCode, options.statusCode], function (i, func) {
              if (func && func[xhr.status]) {
                if (isHttpStatusSuccess) {
                  func[xhr.status](responseData, textStatus, xhr);
                } else {
                  func[xhr.status](xhr, textStatus);
                }
              }
            });

            triggerEvent(ajaxEvent.ajaxComplete, eventParams);
            triggerCallback('complete', xhr, textStatus);
          };

          xhr.onerror = function () {
            if (xhrTimeout) {
              clearTimeout(xhrTimeout);
            }

            triggerEvent(ajaxEvent.ajaxError, eventParams);
            triggerCallback('error', xhr, xhr.statusText);

            triggerEvent(ajaxEvent.ajaxComplete, eventParams);
            triggerCallback('complete', xhr, 'error');
          };

          xhr.onabort = function () {
            var textStatus = 'abort';

            if (xhrTimeout) {
              textStatus = 'timeout';
              clearTimeout(xhrTimeout);
            }

            triggerEvent(ajaxEvent.ajaxError, eventParams);
            triggerCallback('error', xhr, textStatus);

            triggerEvent(ajaxEvent.ajaxComplete, eventParams);
            triggerCallback('complete', xhr, textStatus);
          };

          // ajax start 鍥炶皟
          triggerEvent(ajaxEvent.ajaxStart, eventParams);
          triggerCallback('beforeSend', xhr);

          if (isCanceled) {
            return xhr;
          }

          // Timeout
          if (options.timeout > 0) {
            xhrTimeout = setTimeout(function () {
              xhr.abort();
            }, options.timeout);
          }

          // 鍙戦€� XHR
          xhr.send(sendData);

          return xhr;
        },
      });

      // 鐩戝惉鍏ㄥ眬浜嬩欢
      //
      // 閫氳繃 $(document).on('success.mdui.ajax', function (event, params) {}) 璋冪敤鏃讹紝鍖呭惈涓や釜鍙傛暟
      // event: 浜嬩欢瀵硅薄
      // params: {
      //   xhr: XMLHttpRequest 瀵硅薄
      //   options: ajax 璇锋眰鐨勯厤缃弬鏁�
      //   data: ajax 璇锋眰杩斿洖鐨勬暟鎹�
      // }

      // 鍏ㄥ眬 Ajax 浜嬩欢蹇嵎鏂规硶
      // $(document).ajaxStart(function (event, xhr, options) {})
      // $(document).ajaxSuccess(function (event, xhr, options, data) {})
      // $(document).ajaxError(function (event, xhr, options) {})
      // $(document).ajaxComplete(function (event, xhr, options) {})
      each(ajaxEvent, function (name, eventName) {
        $.fn[name] = function (fn) {
          return this.on(eventName, function (e, params) {
            fn(e, params.xhr, params.options, params.data);
          });
        };
      });
    })();


  /* jshint ignore:start */
    return $;
  })(window, document);
  /* jshint ignore:end */


  /**
   * =============================================================================
   * ************   瀹氫箟鍏ㄥ眬鍙橀噺   ************
   * =============================================================================
   */

  var $document = $(document);
  var $window = $(window);

  /**
   * 闃熷垪 -- 褰撳墠闃熷垪鐨� api 鍜� jquery 涓嶄竴鏍凤紝鎵€浠ヤ笉鎵撳寘杩� mdui.JQ 閲�
   */
  var queue = {};
  (function () {
    var queueData = [];

    /**
     * 鍐欏叆闃熷垪
     * @param queueName 瀵瑰垪鍚�
     * @param func 鍑芥暟鍚嶏紝璇ュ弬鏁颁负绌烘椂锛岃繑鍥炴墍鏈夐槦鍒�
     */
    queue.queue = function (queueName, func) {
      if (queueData[queueName] === undefined) {
        queueData[queueName] = [];
      }

      if (func === undefined) {
        return queueData[queueName];
      }

      queueData[queueName].push(func);
    };

    /**
     * 浠庨槦鍒椾腑绉婚櫎绗竴涓嚱鏁帮紝骞舵墽琛岃鍑芥暟
     * @param queueName
     */
    queue.dequeue = function (queueName) {
      if (queueData[queueName] !== undefined && queueData[queueName].length) {
        (queueData[queueName].shift())();
      }
    };

  })();

  /**
   * touch 浜嬩欢鍚庣殑 500ms 鍐呯鐢� mousedown 浜嬩欢
   *
   * 涓嶆敮鎸佽Е鎺х殑灞忓箷涓婁簨浠堕『搴忎负 mousedown -> mouseup -> click
   * 鏀寔瑙︽帶鐨勫睆骞曚笂浜嬩欢椤哄簭涓� touchstart -> touchend -> mousedown -> mouseup -> click
   */
  var TouchHandler = {
    touches: 0,

    /**
     * 璇ヤ簨浠舵槸鍚﹁鍏佽
     * 鍦ㄦ墽琛屼簨浠跺墠璋冪敤璇ユ柟娉曞垽鏂簨浠舵槸鍚﹀彲浠ユ墽琛�
     * @param e
     * @returns {boolean}
     */
    isAllow: function (e) {
      var allow = true;

      if (
        TouchHandler.touches &&
        [
          'mousedown',
          'mouseup',
          'mousemove',
          'click',
          'mouseover',
          'mouseout',
          'mouseenter',
          'mouseleave',
        ].indexOf(e.type) > -1
      ) {
        // 瑙﹀彂浜� touch 浜嬩欢鍚庨樆姝㈤紶鏍囦簨浠�
        allow = false;
      }

      return allow;
    },

    /**
     * 鍦� touchstart 鍜� touchmove銆乼ouchend銆乼ouchcancel 浜嬩欢涓皟鐢ㄨ鏂规硶娉ㄥ唽浜嬩欢
     * @param e
     */
    register: function (e) {
      if (e.type === 'touchstart') {
        // 瑙﹀彂浜� touch 浜嬩欢
        TouchHandler.touches += 1;
      } else if (['touchmove', 'touchend', 'touchcancel'].indexOf(e.type) > -1) {
        // touch 浜嬩欢缁撴潫 500ms 鍚庤В闄ゅ榧犳爣浜嬩欢鐨勯樆姝�
        setTimeout(function () {
          if (TouchHandler.touches) {
            TouchHandler.touches -= 1;
          }
        }, 500);
      }
    },

    start: 'touchstart mousedown',
    move: 'touchmove mousemove',
    end: 'touchend mouseup',
    cancel: 'touchcancel mouseleave',
    unlock: 'touchend touchmove touchcancel',
  };

  // 娴嬭瘯浜嬩欢
  // 鍦ㄦ瘡涓€涓簨浠朵腑閮戒娇鐢� TouchHandler.isAllow(e) 鍒ゆ柇浜嬩欢鏄惁鍙墽琛�
  // 鍦� touchstart 鍜� touchmove銆乼ouchend銆乼ouchcancel
  // (function () {
  //
  //   $document
  //     .on(TouchHandler.start, function (e) {
  //       if (!TouchHandler.isAllow(e)) {
  //         return;
  //       }
  //       TouchHandler.register(e);
  //       console.log(e.type);
  //     })
  //     .on(TouchHandler.move, function (e) {
  //       if (!TouchHandler.isAllow(e)) {
  //         return;
  //       }
  //       console.log(e.type);
  //     })
  //     .on(TouchHandler.end, function (e) {
  //       if (!TouchHandler.isAllow(e)) {
  //         return;
  //       }
  //       console.log(e.type);
  //     })
  //     .on(TouchHandler.unlock, TouchHandler.register);
  // })();

  $(function () {
    // 閬垮厤椤甸潰鍔犺浇瀹屽悗鐩存帴鎵цcss鍔ㄧ敾
    // https://css-tricks.com/transitions-only-after-page-load/

    setTimeout(function () {
      $('body').addClass('mdui-loaded');
    }, 0);
  });


  /**
   * =============================================================================
   * ************   MDUI 鍐呴儴浣跨敤鐨勫嚱鏁�   ************
   * =============================================================================
   */

  /**
   * 瑙ｆ瀽 DATA API 鐨勫弬鏁�
   * @param str
   * @returns {*}
   */
  var parseOptions = function (str) {
    var options = {};

    if (str === null || !str) {
      return options;
    }

    if (typeof str === 'object') {
      return str;
    }

    /* jshint ignore:start */
    var start = str.indexOf('{');
    try {
      options = (new Function('',
        'var json = ' + str.substr(start) +
        '; return JSON.parse(JSON.stringify(json));'))();
    } catch (e) {
    }
    /* jshint ignore:end */

    return options;
  };

  /**
   * 缁戝畾缁勪欢鐨勪簨浠�
   * @param eventName 浜嬩欢鍚�
   * @param pluginName 鎻掍欢鍚�
   * @param inst 鎻掍欢瀹炰緥
   * @param trigger 鍦ㄨ鍏冪礌涓婅Е鍙�
   * @param obj 浜嬩欢鍙傛暟
   */
  var componentEvent = function (eventName, pluginName, inst, trigger, obj) {
    if (!obj) {
      obj = {};
    }

    obj.inst = inst;

    var fullEventName = eventName + '.mdui.' + pluginName;

    // jQuery 浜嬩欢
    if (typeof jQuery !== 'undefined') {
      jQuery(trigger).trigger(fullEventName, obj);
    }

    // JQ 浜嬩欢
    $(trigger).trigger(fullEventName, obj);
  };


  /**
   * =============================================================================
   * ************   寮€鏀剧殑甯哥敤鏂规硶   ************
   * =============================================================================
   */

  $.fn.extend({

    /**
     * 鎵ц寮哄埗閲嶇粯
     */
    reflow: function () {
      return this.each(function () {
        return this.clientLeft;
      });
    },

    /**
     * 璁剧疆 transition 鏃堕棿
     * @param duration
     */
    transition: function (duration) {
      if (typeof duration !== 'string') {
        duration = duration + 'ms';
      }

      return this.each(function () {
        this.style.webkitTransitionDuration = duration;
        this.style.transitionDuration = duration;
      });
    },

    /**
     * transition 鍔ㄧ敾缁撴潫鍥炶皟
     * @param callback
     * @returns {transitionEnd}
     */
    transitionEnd: function (callback) {
      var events = [
          'webkitTransitionEnd',
          'transitionend',
        ];
      var i;
      var _this = this;

      function fireCallBack(e) {
        if (e.target !== this) {
          return;
        }

        callback.call(this, e);

        for (i = 0; i < events.length; i++) {
          _this.off(events[i], fireCallBack);
        }
      }

      if (callback) {
        for (i = 0; i < events.length; i++) {
          _this.on(events[i], fireCallBack);
        }
      }

      return this;
    },

    /**
     * 璁剧疆 transform-origin 灞炴€�
     * @param transformOrigin
     */
    transformOrigin: function (transformOrigin) {
      return this.each(function () {
        this.style.webkitTransformOrigin = transformOrigin;
        this.style.transformOrigin = transformOrigin;
      });
    },

    /**
     * 璁剧疆 transform 灞炴€�
     * @param transform
     */
    transform: function (transform) {
      return this.each(function () {
        this.style.webkitTransform = transform;
        this.style.transform = transform;
      });
    },

  });

  $.extend({
    /**
     * 鍒涘缓骞舵樉绀洪伄缃�
     * @param zIndex 閬僵灞傜殑 z-index
     */
    showOverlay: function (zIndex) {
      var $overlay = $('.mdui-overlay');

      if ($overlay.length) {
        $overlay.data('isDeleted', 0);

        if (zIndex !== undefined) {
          $overlay.css('z-index', zIndex);
        }
      } else {
        if (zIndex === undefined) {
          zIndex = 2000;
        }

        $overlay = $('<div class="mdui-overlay">')
          .appendTo(document.body)
          .reflow()
          .css('z-index', zIndex);
      }

      var level = $overlay.data('overlay-level') || 0;
      return $overlay
        .data('overlay-level', ++level)
        .addClass('mdui-overlay-show');
    },

    /**
     * 闅愯棌閬僵灞�
     * @param force 鏄惁寮哄埗闅愯棌閬僵
     */
    hideOverlay: function (force) {
      var $overlay = $('.mdui-overlay');

      if (!$overlay.length) {
        return;
      }

      var level = force ? 1 : $overlay.data('overlay-level');
      if (level > 1) {
        $overlay.data('overlay-level', --level);
        return;
      }

      $overlay
        .data('overlay-level', 0)
        .removeClass('mdui-overlay-show')
        .data('isDeleted', 1)
        .transitionEnd(function () {
          if ($overlay.data('isDeleted')) {
            $overlay.remove();
          }
        });
    },

    /**
     * 閿佸畾灞忓箷
     */
    lockScreen: function () {
      var $body = $('body');

      // 涓嶇洿鎺ユ妸 body 璁句负 box-sizing: border-box锛岄伩鍏嶆薄鏌撳叏灞€鏍峰紡
      var newBodyWidth = $body.width();

      $body
        .addClass('mdui-locked')
        .width(newBodyWidth);

      var level = $body.data('lockscreen-level') || 0;
      $body.data('lockscreen-level', ++level);
    },

    /**
     * 瑙ｉ櫎灞忓箷閿佸畾
     * @param force 鏄惁寮哄埗瑙ｉ攣灞忓箷
     */
    unlockScreen: function (force) {
      var $body = $('body');

      var level = force ? 1 : $body.data('lockscreen-level');
      if (level > 1) {
        $body.data('lockscreen-level', --level);
        return;
      }

      $body
        .data('lockscreen-level', 0)
        .removeClass('mdui-locked')
        .width('');
    },

    /**
     * 鍑芥暟鑺傛祦
     * @param fn
     * @param delay
     * @returns {Function}
     */
    throttle: function (fn, delay) {
      var timer = null;
      if (!delay || delay < 16) {
        delay = 16;
      }

      return function () {
        var _this = this;
        var args = arguments;

        if (timer === null) {
          timer = setTimeout(function () {
            fn.apply(_this, args);
            timer = null;
          }, delay);
        }
      };
    },
  });

  /**
   * 鐢熸垚鍞竴 id
   * @param string name id鐨勫悕绉帮紝鑻ヨ鍚嶇О瀵逛簬鐨刧uid涓嶅瓨鍦紝鍒欑敓鎴愭柊鐨刧uid骞惰繑鍥烇紱鑻ュ凡瀛樺湪锛屽垯杩斿洖鍘熸湁guid
   * @returns {string}
   */
  (function () {
    var GUID = {};

    $.extend({
      guid: function (name) {
        if (typeof name !== 'undefined' && typeof GUID[name] !== 'undefined') {
          return GUID[name];
        }

        function s4() {
          return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
        }

        var guid = s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();

        if (typeof name !== 'undefined') {
          GUID[name] = guid;
        }

        return guid;
      },
    });
  })();


  /**
   * =============================================================================
   * ************   Mutation   ************
   * =============================================================================
   */

  (function () {
    /**
     * API 鍒濆鍖栦唬鐞�, 褰� DOM 绐佸彉鍐嶆鎵ц浠ｇ悊鐨勫垵濮嬪寲鍑芥暟. 浣跨敤鏂规硶:
     *
     * 1. 浠ｇ悊缁勪欢 API 鎵ц鍒濆鍖栧嚱鏁�, selector 蹇呴』涓哄瓧绗︿覆.
     *    mdui.mutation(selector, apiInit);
     *    mutation 浼氭墽琛� $(selector).each(apiInit)
     *
     * 2. 绐佸彉鏃�, 鍐嶆鎵ц浠ｇ悊鐨勫垵濮嬪寲鍑芥暟
     *    mdui.mutation()        绛変环 $(document).mutation()
     *    $(selector).mutation() 鍦� selector 鑺傜偣鍐呰繘琛� API 鍒濆鍖�
     *
     * 鍘熺悊:
     *
     *    mutation 鎵ц浜� $().data('mdui.mutation', [selector]).
     *    褰撳厓绱犺閲嶆瀯鏃�, 璇ユ暟鎹細涓㈠け, 鐢辨鍒ゆ柇鏄惁绐佸彉.
     *
     * 鎻愮ず:
     *
     *    绫讳技 Drawer 鍙互浣跨敤濮旀墭浜嬩欢瀹屾垚.
     *    绫讳技 Collapse 闇€瑕佺煡閬� DOM 鍙戠敓绐佸彉, 骞跺啀娆¤繘琛屽垵濮嬪寲.
     */
    var entries = { };

    function mutation(selector, apiInit, that, i, item) {
      var $this = $(that);
      var m = $this.data('mdui.mutation');

      if (!m) {
        m = [];
        $this.data('mdui.mutation', m);
      }

      if (m.indexOf(selector) === -1) {
        m.push(selector);
        apiInit.call(that, i, item);
      }
    }

    $.fn.extend({
      mutation: function () {
        return this.each(function (i, item) {
          var $this = $(this);
          $.each(entries, function (selector, apiInit) {
            if ($this.is(selector)) {
              mutation(selector, apiInit, $this[0], i, item);
            }

            $this.find(selector).each(function (i, item) {
              mutation(selector, apiInit, this, i, item);
            });
          });
        });
      },
    });

    mdui.mutation = function (selector, apiInit) {
      if (typeof selector !== 'string' || typeof apiInit !== 'function') {
        $(document).mutation();
        return;
      }

      entries[selector] = apiInit;
      $(selector).each(function (i, item) {
        mutation(selector, apiInit, this, i, item);
      });
    };

  })();


  /**
   * =============================================================================
   * ************   Headroom.js   ************
   * =============================================================================
   */

  mdui.Headroom = (function () {

    /**
     * 榛樿鍙傛暟
     * @type {{}}
     */
    var DEFAULT = {
      tolerance: 5,                                 // 婊氬姩鏉℃粴鍔ㄥ灏戣窛绂诲紑濮嬮殣钘忔垨鏄剧ず鍏冪礌锛寋down: num, up: num}锛屾垨鏁板瓧
      offset: 0,                                    // 鍦ㄩ〉闈㈤《閮ㄥ灏戣窛绂诲唴婊氬姩涓嶄細闅愯棌鍏冪礌
      initialClass: 'mdui-headroom',                // 鍒濆鍖栨椂娣诲姞鐨勭被
      pinnedClass: 'mdui-headroom-pinned-top',      // 鍏冪礌鍥哄畾鏃舵坊鍔犵殑绫�
      unpinnedClass: 'mdui-headroom-unpinned-top',  // 鍏冪礌闅愯棌鏃舵坊鍔犵殑绫�
    };

    /**
     * Headroom
     * @param selector
     * @param opts
     * @constructor
     */
    function Headroom(selector, opts) {
      var _this = this;

      _this.$headroom = $(selector).eq(0);
      if (!_this.$headroom.length) {
        return;
      }

      // 宸查€氳繃鑷畾涔夊睘鎬у疄渚嬪寲杩囷紝涓嶅啀閲嶅瀹炰緥鍖�
      var oldInst = _this.$headroom.data('mdui.headroom');
      if (oldInst) {
        return oldInst;
      }

      _this.options = $.extend({}, DEFAULT, (opts || {}));

      // 鏁板€艰浆涓� {down: bum, up: num}
      var tolerance = _this.options.tolerance;
      if (tolerance !== Object(tolerance)) {
        _this.options.tolerance = {
          down: tolerance,
          up: tolerance,
        };
      }

      _this._init();
    }

    /**
     * 鍒濆鍖�
     * @private
     */
    Headroom.prototype._init = function () {
      var _this = this;

      _this.state = 'pinned';
      _this.$headroom
        .addClass(_this.options.initialClass)
        .removeClass(_this.options.pinnedClass + ' ' + _this.options.unpinnedClass);

      _this.inited = false;
      _this.lastScrollY = 0;

      _this._attachEvent();
    };

    /**
     * 鐩戝惉婊氬姩浜嬩欢
     * @private
     */
    Headroom.prototype._attachEvent = function () {
      var _this = this;

      if (!_this.inited) {
        _this.lastScrollY = window.pageYOffset;
        _this.inited = true;

        $window.on('scroll', function () {
          _this._scroll();
        });
      }
    };

    /**
     * 婊氬姩鏃剁殑澶勭悊
     * @private
     */
    Headroom.prototype._scroll = function () {
      var _this = this;
      _this.rafId = window.requestAnimationFrame(function () {
        var currentScrollY = window.pageYOffset;
        var direction = currentScrollY > _this.lastScrollY ? 'down' : 'up';
        var toleranceExceeded =
          Math.abs(currentScrollY - _this.lastScrollY) >=
          _this.options.tolerance[direction];

        if (
          currentScrollY > _this.lastScrollY &&
          currentScrollY >= _this.options.offset &&
          toleranceExceeded) {
          _this.unpin();
        } else if (
          (currentScrollY < _this.lastScrollY && toleranceExceeded) ||
          currentScrollY <= _this.options.offset
        ) {
          _this.pin();
        }

        _this.lastScrollY = currentScrollY;
      });
    };

    /**
     * 鍔ㄧ敾缁撴潫鍥炶皟
     * @param inst
     */
    var transitionEnd = function (inst) {
      if (inst.state === 'pinning') {
        inst.state = 'pinned';
        componentEvent('pinned', 'headroom', inst, inst.$headroom);
      }

      if (inst.state === 'unpinning') {
        inst.state = 'unpinned';
        componentEvent('unpinned', 'headroom', inst, inst.$headroom);
      }
    };

    /**
     * 鍥哄畾浣�
     */
    Headroom.prototype.pin = function () {
      var _this = this;

      if (
        _this.state === 'pinning' ||
        _this.state === 'pinned' ||
        !_this.$headroom.hasClass(_this.options.initialClass)
      ) {
        return;
      }

      componentEvent('pin', 'headroom', _this, _this.$headroom);

      _this.state = 'pinning';

      _this.$headroom
        .removeClass(_this.options.unpinnedClass)
        .addClass(_this.options.pinnedClass)
        .transitionEnd(function () {
          transitionEnd(_this);
        });
    };

    /**
     * 涓嶅浐瀹氫綇
     */
    Headroom.prototype.unpin = function () {
      var _this = this;

      if (
        _this.state === 'unpinning' ||
        _this.state === 'unpinned' ||
        !_this.$headroom.hasClass(_this.options.initialClass)
      ) {
        return;
      }

      componentEvent('unpin', 'headroom', _this, _this.$headroom);

      _this.state = 'unpinning';

      _this.$headroom
        .removeClass(_this.options.pinnedClass)
        .addClass(_this.options.unpinnedClass)
        .transitionEnd(function () {
          transitionEnd(_this);
        });
    };

    /**
     * 鍚敤
     */
    Headroom.prototype.enable = function () {
      var _this = this;

      if (!_this.inited) {
        _this._init();
      }
    };

    /**
     * 绂佺敤
     */
    Headroom.prototype.disable = function () {
      var _this = this;

      if (_this.inited) {
        _this.inited = false;
        _this.$headroom
          .removeClass([
            _this.options.initialClass,
            _this.options.pinnedClass,
            _this.options.unpinnedClass,
          ].join(' '));

        $window.off('scroll', function () {
          _this._scroll();
        });

        window.cancelAnimationFrame(_this.rafId);
      }
    };

    /**
     * 鑾峰彇褰撳墠鐘舵€� pinning | pinned | unpinning | unpinned
     */
    Headroom.prototype.getState = function () {
      return this.state;
    };

    return Headroom;

  })();


  /**
   * =============================================================================
   * ************   Headroom 鑷畾涔夊睘鎬� API   ************
   * =============================================================================
   */

  $(function () {
    mdui.mutation('[mdui-headroom]', function () {
      var $this = $(this);
      var options = parseOptions($this.attr('mdui-headroom'));

      var inst = $this.data('mdui.headroom');
      if (!inst) {
        inst = new mdui.Headroom($this, options);
        $this.data('mdui.headroom', inst);
      }
    });
  });


  /**
   * =============================================================================
   * ************   渚� Collapse銆� Panel 璋冪敤鐨勬姌鍙犲唴瀹瑰潡鎻掍欢   ************
   * =============================================================================
   */
  var CollapsePrivate = (function () {

    /**
     * 榛樿鍙傛暟
     */
    var DEFAULT = {
      accordion: false,                             // 鏄惁浣跨敤鎵嬮鐞存晥鏋�
    };

    /**
     * 鎶樺彔鍐呭鍧�
     * @param selector
     * @param opts
     * @param namespace
     * @constructor
     */
    function Collapse(selector, opts, namespace) {
      var _this = this;

      // 鍛藉悕绌洪棿
      _this.ns = namespace;

      // 绫诲悕
      var classpPefix = 'mdui-' + _this.ns + '-item';
      _this.class_item = classpPefix;
      _this.class_item_open = classpPefix + '-open';
      _this.class_header = classpPefix + '-header';
      _this.class_body = classpPefix + '-body';

      // 鎶樺彔闈㈡澘鍏冪礌
      _this.$collapse = $(selector).eq(0);
      if (!_this.$collapse.length) {
        return;
      }

      // 宸查€氳繃鑷畾涔夊睘鎬у疄渚嬪寲杩囷紝涓嶅啀閲嶅瀹炰緥鍖�
      var oldInst = _this.$collapse.data('mdui.' + _this.ns);
      if (oldInst) {
        return oldInst;
      }

      _this.options = $.extend({}, DEFAULT, (opts || {}));

      _this.$collapse.on('click', '.' + _this.class_header, function () {
        var $item = $(this).parent('.' + _this.class_item);
        if (_this.$collapse.children($item).length) {
          _this.toggle($item);
        }
      });

      // 缁戝畾鍏抽棴鎸夐挳
      _this.$collapse.on('click', '[mdui-' + _this.ns + '-item-close]', function () {
        var $item = $(this).parents('.' + _this.class_item).eq(0);
        if (_this._isOpen($item)) {
          _this.close($item);
        }
      });
    }

    /**
     * 鎸囧畾 item 鏄惁澶勪簬鎵撳紑鐘舵€�
     * @param $item
     * @returns {boolean}
     * @private
     */
    Collapse.prototype._isOpen = function ($item) {
      return $item.hasClass(this.class_item_open);
    };

    /**
     * 鑾峰彇鎸囧畾 item
     * @param item
     * @returns {*}
     * @private
     */
    Collapse.prototype._getItem = function (item) {
      var _this = this;

      if (parseInt(item) === item) {
        // item 鏄储寮曞彿
        return _this.$collapse.children('.' + _this.class_item).eq(item);
      }

      return $(item).eq(0);
    };

    /**
     * 鍔ㄧ敾缁撴潫鍥炶皟
     * @param inst
     * @param $content
     * @param $item
     */
    var transitionEnd = function (inst, $content, $item) {
      if (inst._isOpen($item)) {
        $content
          .transition(0)
          .height('auto')
          .reflow()
          .transition('');

        componentEvent('opened', inst.ns, inst, $item[0]);
      } else {
        $content.height('');

        componentEvent('closed', inst.ns, inst, $item[0]);
      }
    };

    /**
     * 鎵撳紑鎸囧畾闈㈡澘椤�
     * @param item 闈㈡澘椤圭殑绱㈠紩鍙锋垨 DOM 鍏冪礌鎴� CSS 閫夋嫨鍣�
     */
    Collapse.prototype.open = function (item) {
      var _this = this;
      var $item = _this._getItem(item);

      if (_this._isOpen($item)) {
        return;
      }

      // 鍏抽棴鍏朵粬椤�
      if (_this.options.accordion) {
        _this.$collapse.children('.' + _this.class_item_open).each(function () {
          var $tmpItem = $(this);

          if ($tmpItem !== $item) {
            _this.close($tmpItem);
          }
        });
      }

      var $content = $item.children('.' + _this.class_body);

      $content
        .height($content[0].scrollHeight)
        .transitionEnd(function () {
          transitionEnd(_this, $content, $item);
        });

      componentEvent('open', _this.ns, _this, $item[0]);

      $item.addClass(_this.class_item_open);
    };

    /**
     * 鍏抽棴鎸囧畾椤�
     * @param item 闈㈡澘椤圭殑绱㈠紩鍙锋垨 DOM 鍏冪礌鎴� CSS 閫夋嫨鍣�
     */
    Collapse.prototype.close = function (item) {
      var _this = this;
      var $item = _this._getItem(item);

      if (!_this._isOpen($item)) {
        return;
      }

      var $content = $item.children('.' + _this.class_body);

      componentEvent('close', _this.ns, _this, $item[0]);

      $item.removeClass(_this.class_item_open);

      $content
        .transition(0)
        .height($content[0].scrollHeight)
        .reflow()
        .transition('')
        .height('')
        .transitionEnd(function () {
          transitionEnd(_this, $content, $item);
        });
    };

    /**
     * 鍒囨崲鎸囧畾椤圭殑鐘舵€�
     * @param item 闈㈡澘椤圭殑绱㈠紩鍙锋垨 DOM 鍏冪礌鎴� CSS 閫夋嫨鍣ㄦ垨 JQ 瀵硅薄
     */
    Collapse.prototype.toggle = function (item) {
      var _this = this;
      var $item = _this._getItem(item);

      if (_this._isOpen($item)) {
        _this.close($item);
      } else {
        _this.open($item);
      }
    };

    /**
     * 鎵撳紑鎵€鏈夐」
     */
    Collapse.prototype.openAll = function () {
      var _this = this;

      _this.$collapse.children('.' + _this.class_item).each(function () {
        var $tmpItem = $(this);

        if (!_this._isOpen($tmpItem)) {
          _this.open($tmpItem);
        }
      });
    };

    /**
     * 鍏抽棴鎵€鏈夐」
     */
    Collapse.prototype.closeAll = function () {
      var _this = this;

      _this.$collapse.children('.' + _this.class_item).each(function () {
        var $tmpItem = $(this);

        if (_this._isOpen($tmpItem)) {
          _this.close($tmpItem);
        }
      });
    };

    return Collapse;
  })();

  /**
   * =============================================================================
   * ************   Collapse 鎶樺彔鍐呭鍧楁彃浠�   ************
   * =============================================================================
   */
  mdui.Collapse = (function () {

    function Collapse(selector, opts) {
      return new CollapsePrivate(selector, opts, 'collapse');
    }

    return Collapse;
  })();


  /**
   * =============================================================================
   * ************   Collapse 鑷畾涔夊睘鎬�   ************
   * =============================================================================
   */

  $(function () {
    mdui.mutation('[mdui-collapse]', function () {
      var $target = $(this);

      var inst = $target.data('mdui.collapse');
      if (!inst) {
        var options = parseOptions($target.attr('mdui-collapse'));
        inst = new mdui.Collapse($target, options);
        $target.data('mdui.collapse', inst);
      }
    });
  });


  /**
   * =============================================================================
   * ************   Table 琛ㄦ牸   ************
   * =============================================================================
   */

  (function () {

    /**
     * 鐢熸垚 checkbox 鐨� HTML 缁撴瀯
     * @param tag
     * @returns {string}
     */
    var checkboxHTML = function (tag) {
      return '<' + tag + ' class="mdui-table-cell-checkbox">' +
               '<label class="mdui-checkbox">' +
                 '<input type="checkbox"/>' +
                 '<i class="mdui-checkbox-icon"></i>' +
               '</label>' +
             '</' + tag + '>';
    };

    /**
     * Table 琛ㄦ牸
     * @param selector
     * @constructor
     */
    function Table(selector) {
      var _this = this;

      _this.$table = $(selector).eq(0);

      if (!_this.$table.length) {
        return;
      }

      _this.init();
    }

    /**
     * 鍒濆鍖�
     */
    Table.prototype.init = function () {
      var _this = this;

      _this.$thRow = _this.$table.find('thead tr');
      _this.$tdRows = _this.$table.find('tbody tr');
      _this.$tdCheckboxs = $();
      _this.selectable = _this.$table.hasClass('mdui-table-selectable');
      _this.selectedRow = 0;

      _this._updateThCheckbox();
      _this._updateTdCheckbox();
      _this._updateNumericCol();
    };

    /**
     * 鏇存柊琛ㄦ牸琛岀殑 checkbox
     */
    Table.prototype._updateTdCheckbox = function () {
      var _this = this;

      _this.$tdRows.each(function () {
        var $tdRow = $(this);

        // 绉婚櫎鏃х殑 checkbox
        $tdRow.find('.mdui-table-cell-checkbox').remove();

        if (!_this.selectable) {
          return;
        }

        // 鍒涘缓 DOM
        var $checkbox = $(checkboxHTML('td'))
          .prependTo($tdRow)
          .find('input[type="checkbox"]');

        // 榛樿閫変腑鐨勮
        if ($tdRow.hasClass('mdui-table-row-selected')) {
          $checkbox[0].checked = true;
          _this.selectedRow++;
        }

        // 鎵€鏈夎閮介€変腑鍚庯紝閫変腑琛ㄥご锛涘惁鍒欙紝涓嶉€変腑琛ㄥご
        _this.$thCheckbox[0].checked = _this.selectedRow === _this.$tdRows.length;

        // 缁戝畾浜嬩欢
        $checkbox.on('change', function () {
          if ($checkbox[0].checked) {
            $tdRow.addClass('mdui-table-row-selected');
            _this.selectedRow++;
          } else {
            $tdRow.removeClass('mdui-table-row-selected');
            _this.selectedRow--;
          }

          // 鎵€鏈夎閮介€変腑鍚庯紝閫変腑琛ㄥご锛涘惁鍒欙紝涓嶉€変腑琛ㄥご
          _this.$thCheckbox[0].checked = _this.selectedRow === _this.$tdRows.length;
        });

        _this.$tdCheckboxs = _this.$tdCheckboxs.add($checkbox);
      });
    };

    /**
     * 鏇存柊琛ㄥご鐨� checkbox
     */
    Table.prototype._updateThCheckbox = function () {
      var _this = this;

      // 绉婚櫎鏃х殑 checkbox
      _this.$thRow.find('.mdui-table-cell-checkbox').remove();

      if (!_this.selectable) {
        return;
      }

      _this.$thCheckbox = $(checkboxHTML('th'))
        .prependTo(_this.$thRow)
        .find('input[type="checkbox"]')
        .on('change', function () {

          var isCheckedAll = _this.$thCheckbox[0].checked;
          _this.selectedRow = isCheckedAll ? _this.$tdRows.length : 0;

          _this.$tdCheckboxs.each(function (i, checkbox) {
            checkbox.checked = isCheckedAll;
          });

          _this.$tdRows.each(function (i, row) {
            $(row)[isCheckedAll ? 'addClass' : 'removeClass']('mdui-table-row-selected');
          });

        });
    };

    /**
     * 鏇存柊鏁板€煎垪
     */
    Table.prototype._updateNumericCol = function () {
      var _this = this;
      var $th;
      var $tdRow;

      _this.$thRow.find('th').each(function (i, th) {
        $th = $(th);

        _this.$tdRows.each(function () {
          $tdRow = $(this);
          var method = $th.hasClass('mdui-table-col-numeric') ? 'addClass' : 'removeClass';
          $tdRow.find('td').eq(i)[method]('mdui-table-col-numeric');
        });
      });
    };

    /**
     * 鍒濆鍖栬〃鏍�
     */
    mdui.mutation('.mdui-table', function () {
      var $table = $(this);
      if (!$table.data('mdui.table')) {
        $table.data('mdui.table', new Table($table));
      }
    });

    /**
     * 鏇存柊琛ㄦ牸
     */
    mdui.updateTables = function () {
      $(arguments.length ? arguments[0] : '.mdui-table').each(function () {
        var $table = $(this);
        var inst = $table.data('mdui.table');

        if (inst) {
          inst.init();
        } else {
          $table.data('mdui.table', new Table($table));
        }
      });
    };

  })();


  /**
   * =============================================================================
   * ************   娑熸吉   ************
   * =============================================================================
   *
   * Inspired by https://github.com/nolimits4web/Framework7/blob/master/src/js/fast-clicks.js
   * https://github.com/nolimits4web/Framework7/blob/master/LICENSE
   *
   * Inspired by https://github.com/fians/Waves
   */

  (function () {

    var Ripple = {

      /**
       * 寤舵椂锛岄伩鍏嶆墜鎸囨粦鍔ㄦ椂涔熻Е鍙戞稛婕紙鍗曚綅锛氭绉掞級
       */
      delay: 200,

      /**
       * 鏄剧ず娑熸吉鍔ㄧ敾
       * @param e
       * @param $ripple
       */
      show: function (e, $ripple) {

        // 榧犳爣鍙抽敭涓嶄骇鐢熸稛婕�
        if (e.button === 2) {
          return;
        }

        // 鐐瑰嚮浣嶇疆鍧愭爣
        var tmp;
        if ('touches' in e && e.touches.length) {
          tmp = e.touches[0];
        } else {
          tmp = e;
        }

        var touchStartX = tmp.pageX;
        var touchStartY = tmp.pageY;

        // 娑熸吉浣嶇疆
        var offset = $ripple.offset();
        var center = {
          x: touchStartX - offset.left,
          y: touchStartY - offset.top,
        };

        var height = $ripple.innerHeight();
        var width = $ripple.innerWidth();
        var diameter = Math.max(
          Math.pow((Math.pow(height, 2) + Math.pow(width, 2)), 0.5), 48
        );

        // 娑熸吉鎵╂暎鍔ㄧ敾
        var translate =
          'translate3d(' + (-center.x + width / 2) + 'px, ' + (-center.y + height / 2) + 'px, 0) ' +
          'scale(1)';

        // 娑熸吉鐨� DOM 缁撴瀯
        $('<div class="mdui-ripple-wave" style="' +
          'width: ' + diameter + 'px; ' +
          'height: ' + diameter + 'px; ' +
          'margin-top:-' + diameter / 2 + 'px; ' +
          'margin-left:-' + diameter / 2 + 'px; ' +
          'left:' + center.x + 'px; ' +
          'top:' + center.y + 'px;">' +
          '</div>')

          // 缂撳瓨鍔ㄧ敾鏁堟灉
          .data('translate', translate)

          .prependTo($ripple)
          .reflow()
          .transform(translate);
      },

      /**
       * 闅愯棌娑熸吉鍔ㄧ敾
       */
      hide: function (e, element) {
        var $ripple = $(element || this);

        $ripple.children('.mdui-ripple-wave').each(function () {
          removeRipple($(this));
        });

        $ripple.off('touchmove touchend touchcancel mousemove mouseup mouseleave', Ripple.hide);
      },
    };

    /**
     * 闅愯棌骞剁Щ闄ゆ稛婕�
     * @param $wave
     */
    function removeRipple($wave) {
      if (!$wave.length || $wave.data('isRemoved')) {
        return;
      }

      $wave.data('isRemoved', true);

      var removeTimeout = setTimeout(function () {
        $wave.remove();
      }, 400);

      var translate = $wave.data('translate');

      $wave
        .addClass('mdui-ripple-wave-fill')
        .transform(translate.replace('scale(1)', 'scale(1.01)'))
        .transitionEnd(function () {
          clearTimeout(removeTimeout);

          $wave
            .addClass('mdui-ripple-wave-out')
            .transform(translate.replace('scale(1)', 'scale(1.01)'));

          removeTimeout = setTimeout(function () {
            $wave.remove();
          }, 700);

          setTimeout(function () {
            $wave.transitionEnd(function () {
              clearTimeout(removeTimeout);
              $wave.remove();
            });
          }, 0);
        });
    }

    /**
     * 鏄剧ず娑熸吉锛屽苟缁戝畾 touchend 绛変簨浠�
     * @param e
     */
    function showRipple(e) {
      if (!TouchHandler.isAllow(e)) {
        return;
      }

      TouchHandler.register(e);

      // Chrome 59 鐐瑰嚮婊氬姩鏉℃椂锛屼細鍦� document 涓婅Е鍙戜簨浠�
      if (e.target === document) {
        return;
      }

      var $ripple;
      var $target = $(e.target);

      // 鑾峰彇鍚� .mdui-ripple 绫荤殑鍏冪礌
      if ($target.hasClass('mdui-ripple')) {
        $ripple = $target;
      } else {
        $ripple = $target.parents('.mdui-ripple').eq(0);
      }

      if ($ripple.length) {

        // 绂佺敤鐘舵€佺殑鍏冪礌涓婁笉浜х敓娑熸吉鏁堟灉
        if ($ripple[0].disabled || $ripple.attr('disabled') !== null) {
          return;
        }

        if (e.type === 'touchstart') {
          var hidden = false;

          // toucstart 瑙﹀彂鎸囧畾鏃堕棿鍚庡紑濮嬫稛婕姩鐢�
          var timer = setTimeout(function () {
            timer = null;
            Ripple.show(e, $ripple);
          }, Ripple.delay);

          var hideRipple = function (hideEvent) {
            // 濡傛灉鎵嬫寚娌℃湁绉诲姩锛屼笖娑熸吉鍔ㄧ敾杩樻病鏈夊紑濮嬶紝鍒欏紑濮嬫稛婕姩鐢�
            if (timer) {
              clearTimeout(timer);
              timer = null;
              Ripple.show(e, $ripple);
            }

            if (!hidden) {
              hidden = true;
              Ripple.hide(hideEvent, $ripple);
            }
          };

          // 鎵嬫寚绉诲姩鍚庯紝绉婚櫎娑熸吉鍔ㄧ敾
          var touchMove = function (moveEvent) {
            if (timer) {
              clearTimeout(timer);
              timer = null;
            }

            hideRipple(moveEvent);
          };

          $ripple
            .on('touchmove', touchMove)
            .on('touchend touchcancel', hideRipple);

        } else {
          Ripple.show(e, $ripple);
          $ripple.on('touchmove touchend touchcancel mousemove mouseup mouseleave', Ripple.hide);
        }
      }
    }

    // 鍒濆鍖栫粦瀹氱殑浜嬩欢
    $document
      .on(TouchHandler.start, showRipple)
      .on(TouchHandler.unlock, TouchHandler.register);
  })();


  /**
   * =============================================================================
   * ************   Text Field 鏂囨湰妗�   ************
   * =============================================================================
   */

  (function () {

    var getProp = function (obj, prop) {
      return (
        typeof obj === 'object' &&
        obj !== null &&
        obj[prop] !== undefined &&
        obj[prop]
      ) ? obj[prop] : false;
    };

    /**
     * 杈撳叆妗嗕簨浠�
     * @param e
     */
    var inputEvent = function (e) {
      var input = e.target;
      var $input = $(input);
      var event = e.type;
      var value = $input.val();

      // reInit 涓� true 鏃讹紝闇€瑕侀噸鏂板垵濮嬪寲鏂囨湰妗�
      var reInit = getProp(e.detail, 'reInit');

      // domLoadedEvent 涓� true 鏃讹紝涓� DOM 鍔犺浇瀹屾瘯鍚庤嚜鍔ㄨЕ鍙戠殑浜嬩欢
      var domLoadedEvent = getProp(e.detail, 'domLoadedEvent');

      // 鏂囨湰妗嗙被鍨�
      var type = $input.attr('type') || '';
      if (['checkbox', 'button', 'submit', 'range', 'radio', 'image'].indexOf(type) >= 0) {
        return;
      }

      var $textField = $input.parent('.mdui-textfield');

      // 杈撳叆妗嗘槸鍚﹁仛鐒�
      if (event === 'focus') {
        $textField.addClass('mdui-textfield-focus');
      }

      if (event === 'blur') {
        $textField.removeClass('mdui-textfield-focus');
      }

      // 杈撳叆妗嗘槸鍚︿负绌�
      if (event === 'blur' || event === 'input') {
        $textField[(value && value !== '') ? 'addClass' : 'removeClass']('mdui-textfield-not-empty');
      }

      // 杈撳叆妗嗘槸鍚︾鐢�
      $textField[input.disabled ? 'addClass' : 'removeClass']('mdui-textfield-disabled');

      // 琛ㄥ崟楠岃瘉
      if ((event === 'input' || event === 'blur') && !domLoadedEvent) {
        if (input.validity) {
          var method = input.validity.valid ? 'removeClass' : 'addClass';
          $textField[method]('mdui-textfield-invalid-html5');
        }
      }

      // textarea 楂樺害鑷姩璋冩暣
      if (e.target.nodeName.toLowerCase() === 'textarea') {

        // IE bug锛歵extarea 鐨勫€间粎涓哄涓崲琛岋紝涓嶅惈鍏朵粬鍐呭鏃讹紝textarea 鐨勯珮搴︿笉鍑嗙‘
        //         姝ゆ椂锛屽湪璁＄畻楂樺害鍓嶏紝鍦ㄥ€肩殑寮€澶村姞鍏ヤ竴涓┖鏍硷紝璁＄畻瀹屽悗锛岀Щ闄ょ┖鏍�
        var inputValue = $input.val();
        var hasExtraSpace = false;
        if (inputValue.replace(/[\r\n]/g, '') === '') {
          $input.val(' ' + inputValue);
          hasExtraSpace = true;
        }

        // 璁剧疆 textarea 楂樺害
        $input.height('');
        var height = $input.height();
        var scrollHeight = input.scrollHeight;

        if (scrollHeight > height) {
          $input.height(scrollHeight);
        }

        // 璁＄畻瀹岋紝杩樺師 textarea 鐨勫€�
        if (hasExtraSpace) {
          $input.val(inputValue);
        }
      }

      // 瀹炴椂瀛楁暟缁熻
      if (reInit) {
        $textField
          .find('.mdui-textfield-counter')
          .remove();
      }

      var maxlength = $input.attr('maxlength');
      if (maxlength) {
        if (reInit || domLoadedEvent) {
          $('<div class="mdui-textfield-counter">' +
              '<span class="mdui-textfield-counter-inputed"></span> / ' + maxlength +
            '</div>').appendTo($textField);
        }

        // 瀛楃闀垮害锛岀‘淇濈粺璁℃柟寮忓拰 maxlength 涓€鑷�
        var inputed = value.length + value.split('\n').length - 1;
        $textField.find('.mdui-textfield-counter-inputed').text(inputed.toString());
      }

      // 鍚� 甯姪鏂囨湰銆侀敊璇彁绀恒€佸瓧鏁扮粺璁� 鏃讹紝澧炲姞鏂囨湰妗嗗簳閮ㄥ唴杈硅窛
      if (
        $textField.find('.mdui-textfield-helper').length ||
        $textField.find('.mdui-textfield-error').length ||
        maxlength
      ) {
        $textField.addClass('mdui-textfield-has-bottom');
      }
    };

    // 缁戝畾浜嬩欢
    $document.on('input focus blur', '.mdui-textfield-input', { useCapture: true }, inputEvent);

    // 鍙睍寮€鏂囨湰妗嗗睍寮€
    $document.on('click', '.mdui-textfield-expandable .mdui-textfield-icon', function () {
      $(this)

        // 灞曞紑鏂囨湰妗�
        .parents('.mdui-textfield')
        .addClass('mdui-textfield-expanded')

        // 鑱氱劍鍒拌緭鍏ユ
        .find('.mdui-textfield-input')[0].focus();
    });

    // 鍙睍寮€鏂囨湰妗嗗叧闂�
    $document.on('click', '.mdui-textfield-expanded .mdui-textfield-close', function () {
      $(this)

        // 鍏抽棴鏂囨湰妗�
        .parents('.mdui-textfield')
        .removeClass('mdui-textfield-expanded')

        // 娓呯┖杈撳叆妗�
        .find('.mdui-textfield-input')
        .val('');
    });

    /**
     * 閫氳繃 JS 鏇存柊浜嗚〃鍗曞唴瀹癸紝闇€瑕侀噸鏂拌繘琛岃〃鍗曞鐞�
     * @param- 濡傛灉浼犲叆浜� .mdui-textfield 鎵€鍦ㄧ殑 DOM 鍏冪礌锛屽垯鏇存柊璇ユ枃鏈锛涘惁鍒欙紝鏇存柊鎵€鏈夋枃鏈
     */
    mdui.updateTextFields = function () {
      $(arguments.length ? arguments[0] : '.mdui-textfield').each(function () {
        $(this)
          .find('.mdui-textfield-input')
          .trigger('input', {
            reInit: true,
          });
      });
    };

    /**
     * 鍒濆鍖栨枃鏈
     */
    mdui.mutation('.mdui-textfield', function () {
      $(this)
        .find('.mdui-textfield-input')
        .trigger('input', {
          domLoadedEvent: true,
        });
    });

  })();


  /**
   * =============================================================================
   * ************   Slider 婊戝潡   ************
   * =============================================================================
   */

  (function () {

    /**
     * 婊戝潡鐨勫€煎彉鏇村悗淇敼婊戝潡鏍峰紡
     * @param $slider
     */
    var updateValueStyle = function ($slider) {
      var data = $slider.data();

      var $track = data.$track;
      var $fill = data.$fill;
      var $thumb = data.$thumb;
      var $input = data.$input;
      var min = data.min;
      var max = data.max;
      var isDisabled = data.disabled;
      var isDiscrete = data.discrete;
      var $thumbText = data.$thumbText;
      var value = $input.val();
      var percent = (value - min) / (max - min) * 100;

      $fill.width(percent + '%');
      $track.width((100 - percent) + '%');

      if (isDisabled) {
        $fill.css('padding-right', '6px');
        $track.css('padding-left', '6px');
      }

      $thumb.css('left', percent + '%');

      if (isDiscrete) {
        $thumbText.text(value);
      }

      $slider[parseFloat(percent) === 0 ? 'addClass' : 'removeClass']('mdui-slider-zero');
    };

    /**
     * 閲嶆柊鍒濆鍖�
     * @param $slider
     */
    var reInit = function ($slider) {
      var $track = $('<div class="mdui-slider-track"></div>');
      var $fill = $('<div class="mdui-slider-fill"></div>');
      var $thumb = $('<div class="mdui-slider-thumb"></div>');
      var $input = $slider.find('input[type="range"]');

      // 绂佺敤鐘舵€�
      var isDisabled = $input[0].disabled;
      $slider[isDisabled ? 'addClass' : 'removeClass']('mdui-slider-disabled');

      // 閲嶆柊濉厖 HTML
      $slider.find('.mdui-slider-track').remove();
      $slider.find('.mdui-slider-fill').remove();
      $slider.find('.mdui-slider-thumb').remove();
      $slider.append($track).append($fill).append($thumb);

      // 闂寸画鍨嬫粦鍧�
      var isDiscrete = $slider.hasClass('mdui-slider-discrete');

      var $thumbText;
      if (isDiscrete) {
        $thumbText = $('<span></span>');
        $thumb.empty().append($thumbText);
      }

      $slider.data({
        $track: $track,
        $fill: $fill,
        $thumb: $thumb,
        $input: $input,
        min: $input.attr('min'),    // 婊戝潡鏈€灏忓€�
        max: $input.attr('max'),    // 婊戝潡鏈€澶у€�
        disabled: isDisabled,       // 鏄惁绂佺敤鐘舵€�
        discrete: isDiscrete,       // 鏄惁鏄棿缁瀷婊戝潡
        $thumbText: $thumbText,      // 闂寸画鍨嬫粦鍧楃殑鏁板€�
      });

      // 璁剧疆榛樿鍊�
      updateValueStyle($slider);
    };

    var rangeSelector = '.mdui-slider input[type="range"]';

    $document

      // 婊戝姩婊戝潡浜嬩欢
      .on('input change', rangeSelector, function () {
        var $slider = $(this).parent();
        updateValueStyle($slider);
      })

      // 寮€濮嬭Е鎽告粦鍧椾簨浠�
      .on(TouchHandler.start, rangeSelector, function (e) {
        if (!TouchHandler.isAllow(e)) {
          return;
        }

        TouchHandler.register(e);

        if (!this.disabled) {
          var $slider = $(this).parent();
          $slider.addClass('mdui-slider-focus');
        }
      })

      // 缁撴潫瑙︽懜婊戝潡浜嬩欢
      .on(TouchHandler.end, rangeSelector, function (e) {
        if (!TouchHandler.isAllow(e)) {
          return;
        }

        if (!this.disabled) {
          var $slider = $(this).parent();
          $slider.removeClass('mdui-slider-focus');
        }
      })

      .on(TouchHandler.unlock, rangeSelector, TouchHandler.register);

    /**
     * 椤甸潰鍔犺浇瀹屽悗鑷姩鍒濆鍖栵紙鏈垵濮嬪寲鏃讹紝鍙互璋冪敤璇ユ柟娉曞垵濮嬪寲锛�
     */
    mdui.mutation('.mdui-slider', function () {
      reInit($(this));
    });

    /**
     * 閲嶆柊鍒濆鍖栨粦鍧楋紙寮哄埗閲嶆柊鍒濆鍖栵級
     */
    mdui.updateSliders = function () {
      $(arguments.length ? arguments[0] : '.mdui-slider').each(function () {
        reInit($(this));
      });
    };
  })();


  /**
   * =============================================================================
   * ************   Fab 娴姩鎿嶄綔鎸夐挳   ************
   * =============================================================================
   */

  mdui.Fab = (function () {

    /**
     * 榛樿鍙傛暟
     * @type {{}}
     */
    var DEFAULT = {
      trigger: 'hover',      // 瑙﹀彂鏂瑰紡 ['hover', 'click']
    };

    /**
     * 娴姩鎿嶄綔鎸夐挳瀹炰緥
     * @param selector 閫夋嫨鍣ㄦ垨 HTML 瀛楃涓叉垨 DOM 鍏冪礌鎴� JQ 瀵硅薄
     * @param opts
     * @constructor
     */
    function Fab(selector, opts) {
      var _this = this;

      _this.$fab = $(selector).eq(0);
      if (!_this.$fab.length) {
        return;
      }

      // 宸查€氳繃 data 灞炴€у疄渚嬪寲杩囷紝涓嶅啀閲嶅瀹炰緥鍖�
      var oldInst = _this.$fab.data('mdui.fab');
      if (oldInst) {
        return oldInst;
      }

      _this.options = $.extend({}, DEFAULT, (opts || {}));
      _this.state = 'closed';

      _this.$btn = _this.$fab.find('.mdui-fab');
      _this.$dial = _this.$fab.find('.mdui-fab-dial');
      _this.$dialBtns = _this.$dial.find('.mdui-fab');

      if (_this.options.trigger === 'hover') {
        _this.$btn
          .on('touchstart mouseenter', function () {
            _this.open();
          });

        _this.$fab
          .on('mouseleave', function () {
            _this.close();
          });
      }

      if (_this.options.trigger === 'click') {
        _this.$btn
          .on(TouchHandler.start, function () {
            _this.open();
          });
      }

      // 瑙︽懜灞忓箷鍏朵粬鍦版柟鍏抽棴蹇€熸嫧鍙�
      $document.on(TouchHandler.start, function (e) {
        if (!$(e.target).parents('.mdui-fab-wrapper').length) {
          _this.close();
        }
      });
    }

    /**
     * 鎵撳紑鑿滃崟
     */
    Fab.prototype.open = function () {
      var _this = this;

      if (_this.state === 'opening' || _this.state === 'opened') {
        return;
      }

      // 涓鸿彍鍗曚腑鐨勬寜閽坊鍔犱笉鍚岀殑 transition-delay
      _this.$dialBtns.each(function (index, btn) {
        btn.style['transition-delay'] = btn.style['-webkit-transition-delay'] =
          15 * (_this.$dialBtns.length - index) + 'ms';
      });

      _this.$dial
        .css('height', 'auto')
        .addClass('mdui-fab-dial-show');

      // 濡傛灉鎸夐挳涓瓨鍦� .mdui-fab-opened 鐨勫浘鏍囷紝鍒欒繘琛屽浘鏍囧垏鎹�
      if (_this.$btn.find('.mdui-fab-opened').length) {
        _this.$btn.addClass('mdui-fab-opened');
      }

      _this.state = 'opening';
      componentEvent('open', 'fab', _this, _this.$fab);

      // 鎵撳紑椤哄簭涓轰粠涓嬪埌涓婇€愪釜鎵撳紑锛屾渶涓婇潰鐨勬墦寮€鍚庢墠琛ㄧず鍔ㄧ敾瀹屾垚
      _this.$dialBtns.eq(0).transitionEnd(function () {
        if (_this.$btn.hasClass('mdui-fab-opened')) {
          _this.state = 'opened';
          componentEvent('opened', 'fab', _this, _this.$fab);
        }
      });
    };

    /**
     * 鍏抽棴鑿滃崟
     */
    Fab.prototype.close = function () {
      var _this = this;

      if (_this.state === 'closing' || _this.state === 'closed') {
        return;
      }

      // 涓鸿彍鍗曚腑鐨勬寜閽坊鍔犱笉鍚岀殑 transition-delay
      _this.$dialBtns.each(function (index, btn) {
        btn.style['transition-delay'] = btn.style['-webkit-transition-delay'] = 15 * index + 'ms';
      });

      _this.$dial.removeClass('mdui-fab-dial-show');
      _this.$btn.removeClass('mdui-fab-opened');
      _this.state = 'closing';
      componentEvent('close', 'fab', _this, _this.$fab);

      // 浠庝笂寰€涓嬩緷娆″叧闂紝鏈€鍚庝竴涓叧闂悗鎵嶈〃绀哄姩鐢诲畬鎴�
      _this.$dialBtns.eq(-1).transitionEnd(function () {
        if (!_this.$btn.hasClass('mdui-fab-opened')) {
          _this.state = 'closed';
          componentEvent('closed', 'fab', _this, _this.$fab);
          _this.$dial.css('height', 0);
        }
      });
    };

    /**
     * 鍒囨崲鑿滃崟鐨勬墦寮€鐘舵€�
     */
    Fab.prototype.toggle = function () {
      var _this = this;

      if (_this.state === 'opening' || _this.state === 'opened') {
        _this.close();
      } else if (_this.state === 'closing' || _this.state === 'closed') {
        _this.open();
      }
    };

    /**
     * 鑾峰彇褰撳墠鑿滃崟鐘舵€�
     * @returns {'opening'|'opened'|'closing'|'closed'}
     */
    Fab.prototype.getState = function () {
      return this.state;
    };

    /**
     * 浠ュ姩鐢荤殑褰㈠紡鏄剧ず娴姩鎿嶄綔鎸夐挳
     */
    Fab.prototype.show = function () {
      this.$fab.removeClass('mdui-fab-hide');
    };

    /**
     * 浠ュ姩鐢荤殑褰㈠紡闅愯棌娴姩鎿嶄綔鎸夐挳
     */
    Fab.prototype.hide = function () {
      this.$fab.addClass('mdui-fab-hide');
    };

    return Fab;
  })();


  /**
   * =============================================================================
   * ************   Fab DATA API   ************
   * =============================================================================
   */

  $(function () {
    // mouseenter 涓嶅啋娉★紝鏃犳硶杩涜浜嬩欢濮旀墭锛岃繖閲岀敤 mouseover 浠ｆ浛銆�
    // 涓嶇鏄� click 銆� mouseover 杩樻槸 touchstart 锛岄兘鍏堝垵濮嬪寲銆�

    $document.on('touchstart mousedown mouseover', '[mdui-fab]', function (e) {
      var $this = $(this);

      var inst = $this.data('mdui.fab');
      if (!inst) {
        var options = parseOptions($this.attr('mdui-fab'));
        inst = new mdui.Fab($this, options);
        $this.data('mdui.fab', inst);
      }
    });
  });


  /**
   * =============================================================================
   * ************   Select 涓嬫媺閫夋嫨   ************
   * =============================================================================
   */

  mdui.Select = (function () {

    /**
     * 榛樿鍙傛暟
     */
    var DEFAULT = {
      position: 'auto',                // 涓嬫媺妗嗕綅缃紝auto銆乥ottom銆乼op
      gutter: 16,                      // 鑿滃崟涓庣獥鍙ｄ笂涓嬭竟妗嗚嚦灏戜繚鎸佸灏戦棿璺�
    };

    /**
     * 璋冩暣鑿滃崟浣嶇疆
     * @param _this Select 瀹炰緥
     */
    var readjustMenu = function (_this) {
      // 绐楀彛楂樺害
      var windowHeight = $window.height();

      // 閰嶇疆鍙傛暟
      var gutter = _this.options.gutter;
      var position = _this.options.position;

      // mdui-select 楂樺害
      var selectHeight = parseInt(_this.$select.height());

      // 鑿滃崟椤归珮搴�
      var $menuItemFirst = _this.$items.eq(0);
      var menuItemHeight = parseInt($menuItemFirst.height());
      var menuItemMargin = parseInt($menuItemFirst.css('margin-top'));

      // 鑿滃崟楂樺害
      var menuWidth = parseFloat(_this.$select.width() + 0.01); // 蹇呴』姣旂湡瀹炲搴﹀涓€鐐癸紝涓嶇劧浼氬嚭鐜扮渷鐣ュ彿
      var menuHeight = menuItemHeight * _this.size + menuItemMargin * 2;

      // var menuRealHeight = menuItemHeight * _this.$items.length + menuItemMargin * 2;

      // 鑿滃崟鏄惁鍑虹幇浜嗘粴鍔ㄦ潯
      //var isMenuScrollable = menuRealHeight > menuHeight;

      // select 鍦ㄧ獥鍙ｄ腑鐨勪綅缃�
      var selectTop = _this.$select[0].getBoundingClientRect().top;

      var transformOriginY;
      var menuMarginTop;

      // position 涓� auto 鏃�
      if (position === 'auto') {

        // 鑿滃崟楂樺害涓嶈兘瓒呰繃绐楀彛楂樺害
        var heightTemp = windowHeight - gutter * 2;
        if (menuHeight > heightTemp) {
          menuHeight = heightTemp;
        }

        // 鑿滃崟鐨� margin-top
        menuMarginTop = -(
          menuItemMargin + _this.selectedIndex * menuItemHeight +
          (menuItemHeight - selectHeight) / 2
        );
        var menuMarginTopMax = -(
          menuItemMargin + (_this.size - 1) * menuItemHeight +
          (menuItemHeight - selectHeight) / 2
        );
        if (menuMarginTop < menuMarginTopMax) {
          menuMarginTop = menuMarginTopMax;
        }

        // 鑿滃崟涓嶈兘瓒呭嚭绐楀彛
        var menuTop = selectTop + menuMarginTop;

        if (menuTop < gutter) {
          // 涓嶈兘瓒呭嚭绐楀彛涓婃柟
          menuMarginTop = -(selectTop - gutter);
        } else if (menuTop + menuHeight + gutter > windowHeight) {
          // 涓嶈兘瓒呭嚭绐楀彛涓嬫柟
          menuMarginTop = -(selectTop + menuHeight + gutter - windowHeight);
        }

        // transform 鐨� Y 杞村潗鏍�
        transformOriginY = (_this.selectedIndex * menuItemHeight + menuItemHeight / 2 + menuItemMargin) + 'px';
      } else if (position === 'bottom') {
        menuMarginTop = selectHeight;
        transformOriginY = '0px';
      } else if (position === 'top') {
        menuMarginTop = -menuHeight - 1;
        transformOriginY = '100%';
      }

      // 璁剧疆鏍峰紡
      _this.$select.width(menuWidth);
      _this.$menu
        .width(menuWidth)
        .height(menuHeight)
        .css({
          'margin-top': menuMarginTop + 'px',
          'transform-origin':
          'center ' + transformOriginY + ' 0',
        });
    };

    /**
     * 涓嬫媺閫夋嫨
     * @param selector
     * @param opts
     * @constructor
     */
    function Select(selector, opts) {
      var _this = this;

      var $selectNative =  _this.$selectNative = $(selector).eq(0);
      if (!$selectNative.length) {
        return;
      }

      // 宸查€氳繃鑷畾涔夊睘鎬у疄渚嬪寲杩囷紝涓嶅啀閲嶅瀹炰緥鍖�
      var oldInst = $selectNative.data('mdui.select');
      if (oldInst) {
        return oldInst;
      }

      $selectNative.hide();

      _this.options = $.extend({}, DEFAULT, (opts || {}));

      // 涓哄綋鍓� select 鐢熸垚鍞竴 ID
      _this.uniqueID = $.guid();

      _this.state = 'closed';

      // 鐢熸垚 select
      _this.handleUpdate();

      // 鐐瑰嚮 select 澶栭潰鍖哄煙鍏抽棴
      $document.on('click touchstart', function (e) {
        var $target = $(e.target);
        if (
          (_this.state === 'opening' || _this.state === 'opened') &&
          !$target.is(_this.$select) &&
          !$.contains(_this.$select[0], $target[0])
        ) {
          _this.close();
        }
      });
    }

    /**
     * 瀵瑰師鐢� select 缁勪欢杩涜浜嗕慨鏀瑰悗锛岄渶瑕佽皟鐢ㄨ鏂规硶
     */
    Select.prototype.handleUpdate = function () {
      var _this = this;

      if (_this.state === 'opening' || _this.state === 'opened') {
        _this.close();
      }

      var $selectNative = _this.$selectNative;

      // 褰撳墠鐨勫€煎拰鏂囨湰
      _this.value = $selectNative.val();
      _this.text = '';

      // 鐢熸垚 HTML
      // 鑿滃崟椤�
      _this.$items = $();
      $selectNative.find('option').each(function (index, option) {
        var data = {
          value: option.value,
          text: option.textContent,
          disabled: option.disabled,
          selected: _this.value === option.value,
          index: index,
        };

        if (_this.value === data.value) {
          _this.text = data.text;
          _this.selectedIndex = index;
        }

        _this.$items = _this.$items.add(
          $('<div class="mdui-select-menu-item mdui-ripple"' +
            (data.disabled ? ' disabled' : '') +
            (data.selected ? ' selected' : '') + '>' + data.text + '</div>')
            .data(data)
        );
      });

      // selected
      _this.$selected = $('<span class="mdui-select-selected">' + _this.text + '</span>');

      // select
      _this.$select =
        $(
          '<div class="mdui-select mdui-select-position-' + _this.options.position + '" ' +
          'style="' + _this.$selectNative.attr('style') + '" ' +
          'id="' + _this.uniqueID + '"></div>'
        )
          .show()
          .append(_this.$selected);

      // menu
      _this.$menu =
        $('<div class="mdui-select-menu"></div>')
          .appendTo(_this.$select)
          .append(_this.$items);

      $('#' + _this.uniqueID).remove();
      $selectNative.after(_this.$select);

      // 鏍规嵁 select 鐨� size 灞炴€ц缃珮搴︼紝榛樿涓� 6
      _this.size = _this.$selectNative.attr('size');

      if (!_this.size) {
        _this.size = _this.$items.length;
        if (_this.size > 8) {
          _this.size = 8;
        }
      }

      if (_this.size < 2) {
        _this.size = 2;
      }

      // 鐐瑰嚮閫夐」鏃跺叧闂笅鎷夎彍鍗�
      _this.$items.on('click', function () {
        if (_this.state === 'closing') {
          return;
        }

        var $item = $(this);

        if ($item.data('disabled')) {
          return;
        }

        var itemData = $item.data();

        _this.$selected.text(itemData.text);
        $selectNative.val(itemData.value);
        _this.$items.removeAttr('selected');
        $item.attr('selected', '');
        _this.selectedIndex = itemData.index;
        _this.value = itemData.value;
        _this.text = itemData.text;
        $selectNative.trigger('change');

        _this.close();
      });

      // 鐐瑰嚮 select 鏃舵墦寮€涓嬫媺鑿滃崟
      _this.$select.on('click', function (e) {
        var $target = $(e.target);

        // 鍦ㄨ彍鍗曚笂鐐瑰嚮鏃朵笉鎵撳紑
        if ($target.is('.mdui-select-menu') || $target.is('.mdui-select-menu-item')) {
          return;
        }

        _this.toggle();
      });
    };

    /**
     * 鍔ㄧ敾缁撴潫鍥炶皟
     * @param inst
     */
    var transitionEnd = function (inst) {
      inst.$select.removeClass('mdui-select-closing');

      if (inst.state === 'opening') {
        inst.state = 'opened';
        componentEvent('opened', 'select', inst, inst.$selectNative);

        inst.$menu.css('overflow-y', 'auto');
      }

      if (inst.state === 'closing') {
        inst.state = 'closed';
        componentEvent('closed', 'select', inst, inst.$selectNative);

        // 鎭㈠鏍峰紡
        inst.$select.width('');
        inst.$menu.css({
          'margin-top': '',
          height: '',
          width: '',
        });
      }
    };

    /**
     * 鎵撳紑 Select
     */
    Select.prototype.open = function () {
      var _this = this;

      if (_this.state === 'opening' || _this.state === 'opened') {
        return;
      }

      _this.state = 'opening';
      componentEvent('open', 'select', _this, _this.$selectNative);

      readjustMenu(_this);

      _this.$select.addClass('mdui-select-open');

      _this.$menu.transitionEnd(function () {
        transitionEnd(_this);
      });
    };

    /**
     * 鍏抽棴 Select
     */
    Select.prototype.close = function () {
      var _this = this;

      if (_this.state === 'closing' || _this.state === 'closed') {
        return;
      }

      _this.state = 'closing';
      componentEvent('close', 'select', _this, _this.$selectNative);

      _this.$menu.css('overflow-y', '');

      _this.$select
        .removeClass('mdui-select-open')
        .addClass('mdui-select-closing');
      _this.$menu.transitionEnd(function () {
        transitionEnd(_this);
      });
    };

    /**
     * 鍒囨崲 Select 鏄剧ず鐘舵€�
     */
    Select.prototype.toggle = function () {
      var _this = this;

      if (_this.state === 'opening' || _this.state === 'opened') {
        _this.close();
      } else if (_this.state === 'closing' || _this.state === 'closed') {
        _this.open();
      }
    };

    return Select;
  })();


  /**
   * =============================================================================
   * ************   Select 涓嬫媺閫夋嫨   ************
   * =============================================================================
   */

  $(function () {
    mdui.mutation('[mdui-select]', function () {
      var $this = $(this);
      var inst = $this.data('mdui.select');
      if (!inst) {
        inst = new mdui.Select($this, parseOptions($this.attr('mdui-select')));
        $this.data('mdui.select', inst);
      }
    });
  });


  /**
   * =============================================================================
   * ************   Appbar   ************
   * =============================================================================
   * 婊氬姩鏃惰嚜鍔ㄩ殣钘忓簲鐢ㄦ爮
   * mdui-appbar-scroll-hide
   * mdui-appbar-scroll-toolbar-hide
   */

  $(function () {
    // 婊氬姩鏃堕殣钘忓簲鐢ㄦ爮
    mdui.mutation('.mdui-appbar-scroll-hide', function () {
      var $this = $(this);
      $this.data('mdui.headroom', new mdui.Headroom($this));
    });

    // 婊氬姩鏃跺彧闅愯棌搴旂敤鏍忎腑鐨勫伐鍏锋爮
    mdui.mutation('.mdui-appbar-scroll-toolbar-hide', function () {
      var $this = $(this);
      var inst = new mdui.Headroom($this, {
        pinnedClass: 'mdui-headroom-pinned-toolbar',
        unpinnedClass: 'mdui-headroom-unpinned-toolbar',
      });
      $this.data('mdui.headroom', inst);
    });
  });


  /**
   * =============================================================================
   * ************   Tab   ************
   * =============================================================================
   */

  mdui.Tab = (function () {

    var DEFAULT = {
      trigger: 'click',       // 瑙﹀彂鏂瑰紡 click: 榧犳爣鐐瑰嚮鍒囨崲 hover: 榧犳爣鎮诞鍒囨崲
      //animation: false,       // 鍒囨崲鏃舵槸鍚︽樉绀哄姩鐢�
      loop: false,            // 涓簍rue鏃讹紝鍦ㄦ渶鍚庝竴涓€夐」鍗℃椂璋冪敤 next() 鏂规硶浼氬洖鍒扮涓€涓€夐」鍗�
    };

    // 鍏冪礌鏄惁宸茬鐢�
    var isDisabled = function ($ele) {
      return $ele[0].disabled || $ele.attr('disabled') !== null;
    };

    /**
     * 閫夐」鍗�
     * @param selector
     * @param opts
     * @returns {*}
     * @constructor
     */
    function Tab(selector, opts) {
      var _this = this;

      _this.$tab = $(selector).eq(0);
      if (!_this.$tab.length) {
        return;
      }

      // 宸查€氳繃鑷畾涔夊睘鎬у疄渚嬪寲杩囷紝涓嶅啀閲嶅瀹炰緥鍖�
      var oldInst = _this.$tab.data('mdui.tab');
      if (oldInst) {
        return oldInst;
      }

      _this.options = $.extend({}, DEFAULT, (opts || {}));
      _this.$tabs = _this.$tab.children('a');
      _this.$indicator = $('<div class="mdui-tab-indicator"></div>').appendTo(_this.$tab);
      _this.activeIndex = false; // 涓� false 鏃惰〃绀烘病鏈夋縺娲荤殑閫夐」鍗★紝鎴栦笉瀛樺湪閫夐」鍗�

      // 鏍规嵁 url hash 鑾峰彇榛樿婵€娲荤殑閫夐」鍗�
      var hash = location.hash;
      if (hash) {
        _this.$tabs.each(function (i, tab) {
          if ($(tab).attr('href') === hash) {
            _this.activeIndex = i;
            return false;
          }
        });
      }

      // 鍚� mdui-tab-active 鐨勫厓绱犻粯璁ゆ縺娲�
      if (_this.activeIndex === false) {
        _this.$tabs.each(function (i, tab) {
          if ($(tab).hasClass('mdui-tab-active')) {
            _this.activeIndex = i;
            return false;
          }
        });
      }

      // 瀛樺湪閫夐」鍗℃椂锛岄粯璁ゆ縺娲荤涓€涓€夐」鍗�
      if (_this.$tabs.length && _this.activeIndex === false) {
        _this.activeIndex = 0;
      }

      // 璁剧疆婵€娲荤姸鎬侀€夐」鍗�
      _this._setActive();

      // 鐩戝惉绐楀彛澶у皬鍙樺寲浜嬩欢锛岃皟鏁存寚绀哄櫒浣嶇疆
      $window.on('resize', $.throttle(function () {
        _this._setIndicatorPosition();
      }, 100));

      // 鐩戝惉鐐瑰嚮閫夐」鍗′簨浠�
      _this.$tabs.each(function (i, tab) {
        _this._bindTabEvent(tab);
      });
    }

    /**
     * 缁戝畾鍦� Tab 涓婄偣鍑绘垨鎮诞鐨勪簨浠�
     * @private
     */
    Tab.prototype._bindTabEvent = function (tab) {
      var _this = this;
      var $tab = $(tab);

      // 鐐瑰嚮鎴栭紶鏍囩Щ鍏ヨЕ鍙戠殑浜嬩欢
      var clickEvent = function (e) {
        // 绂佺敤鐘舵€佺殑閫夐」鏃犳硶閫変腑
        if (isDisabled($tab)) {
          e.preventDefault();
          return;
        }

        _this.activeIndex = _this.$tabs.index(tab);
        _this._setActive();
      };

      // 鏃犺 trigger 鏄� click 杩樻槸 hover锛岄兘浼氬搷搴� click 浜嬩欢
      $tab.on('click', clickEvent);

      // trigger 涓� hover 鏃讹紝棰濆鍝嶅簲 mouseenter 浜嬩欢
      if (_this.options.trigger === 'hover') {
        $tab.on('mouseenter', clickEvent);
      }

      $tab.on('click', function (e) {
        // 闃绘閾炬帴鐨勯粯璁ょ偣鍑诲姩浣�
        if ($tab.attr('href').indexOf('#') === 0) {
          e.preventDefault();
        }
      });
    };

    /**
     * 璁剧疆婵€娲荤姸鎬佺殑閫夐」鍗�
     * @private
     */
    Tab.prototype._setActive = function () {
      var _this = this;

      _this.$tabs.each(function (i, tab) {
        var $tab = $(tab);
        var targetId = $tab.attr('href');

        // 璁剧疆閫夐」鍗℃縺娲荤姸鎬�
        if (i === _this.activeIndex && !isDisabled($tab)) {
          if (!$tab.hasClass('mdui-tab-active')) {
            componentEvent('change', 'tab', _this, _this.$tab, {
              index: _this.activeIndex,
              id: targetId.substr(1),
            });
            componentEvent('show', 'tab', _this, $tab);

            $tab.addClass('mdui-tab-active');
          }

          $(targetId).show();
          _this._setIndicatorPosition();
        } else {
          $tab.removeClass('mdui-tab-active');
          $(targetId).hide();
        }
      });
    };

    /**
     * 璁剧疆閫夐」鍗℃寚绀哄櫒鐨勪綅缃�
     */
    Tab.prototype._setIndicatorPosition = function () {
      var _this = this;
      var $activeTab;
      var activeTabOffset;

      // 閫夐」鍗℃暟閲忎负 0 鏃讹紝涓嶆樉绀烘寚绀哄櫒
      if (_this.activeIndex === false) {
        _this.$indicator.css({
          left: 0,
          width: 0,
        });

        return;
      }

      $activeTab = _this.$tabs.eq(_this.activeIndex);
      if (isDisabled($activeTab)) {
        return;
      }

      activeTabOffset = $activeTab.offset();
      _this.$indicator.css({
        left: activeTabOffset.left + _this.$tab[0].scrollLeft -
              _this.$tab[0].getBoundingClientRect().left + 'px',
        width: $activeTab.width() + 'px',
      });
    };

    /**
     * 鍒囨崲鍒颁笅涓€涓€夐」鍗�
     */
    Tab.prototype.next = function () {
      var _this = this;

      if (_this.activeIndex === false) {
        return;
      }

      if (_this.$tabs.length > _this.activeIndex + 1) {
        _this.activeIndex++;
      } else if (_this.options.loop) {
        _this.activeIndex = 0;
      }

      _this._setActive();
    };

    /**
     * 鍒囨崲鍒颁笂涓€涓€夐」鍗�
     */
    Tab.prototype.prev = function () {
      var _this = this;

      if (_this.activeIndex === false) {
        return;
      }

      if (_this.activeIndex > 0) {
        _this.activeIndex--;
      } else if (_this.options.loop) {
        _this.activeIndex = _this.$tabs.length - 1;
      }

      _this._setActive();
    };

    /**
     * 鏄剧ず鎸囧畾搴忓彿鎴栨寚瀹歩d鐨勯€夐」鍗�
     * @param index 浠�0寮€濮嬬殑搴忓彿锛屾垨浠�#寮€澶寸殑id
     */
    Tab.prototype.show = function (index) {
      var _this = this;

      if (_this.activeIndex === false) {
        return;
      }

      if (parseInt(index) === index) {
        _this.activeIndex = index;
      } else {
        _this.$tabs.each(function (i, tab) {
          if (tab.id === index) {
            _this.activeIndex = i;
            return false;
          }
        });
      }

      _this._setActive();
    };

    /**
     * 鍦ㄧ埗鍏冪礌鐨勫搴﹀彉鍖栨椂锛岄渶瑕佽皟鐢ㄨ鏂规硶閲嶆柊璋冩暣鎸囩ず鍣ㄤ綅缃�
     * 鍦ㄦ坊鍔犳垨鍒犻櫎閫夐」鍗℃椂锛岄渶瑕佽皟鐢ㄨ鏂规硶
     */
    Tab.prototype.handleUpdate = function () {
      var _this = this;

      var $oldTabs = _this.$tabs;               // 鏃х殑 tabs JQ瀵硅薄
      var $newTabs = _this.$tab.children('a');  // 鏂扮殑 tabs JQ瀵硅薄
      var oldTabsEle = $oldTabs.get();          // 鏃� tabs 鐨勫厓绱犳暟缁�
      var newTabsEle = $newTabs.get();          // 鏂扮殑 tabs 鍏冪礌鏁扮粍

      if (!$newTabs.length) {
        _this.activeIndex = false;
        _this.$tabs = $newTabs;
        _this._setIndicatorPosition();

        return;
      }

      // 閲嶆柊閬嶅巻閫夐」鍗★紝鎵惧嚭鏂板鐨勯€夐」鍗�
      $newTabs.each(function (i, tab) {
        // 鏈夋柊澧炵殑閫夐」鍗�
        if (oldTabsEle.indexOf(tab) < 0) {
          _this._bindTabEvent(tab);

          if (_this.activeIndex === false) {
            _this.activeIndex = 0;
          } else if (i <= _this.activeIndex) {
            _this.activeIndex++;
          }
        }
      });

      // 鎵惧嚭琚Щ闄ょ殑閫夐」鍗�
      $oldTabs.each(function (i, tab) {
        // 鏈夎绉婚櫎鐨勯€夐」鍗�
        if (newTabsEle.indexOf(tab) < 0) {

          if (i < _this.activeIndex) {
            _this.activeIndex--;
          } else if (i === _this.activeIndex) {
            _this.activeIndex = 0;
          }
        }
      });

      _this.$tabs = $newTabs;

      _this._setActive();
    };

    return Tab;
  })();


  /**
   * =============================================================================
   * ************   Tab 鑷畾涔夊睘鎬� API   ************
   * =============================================================================
   */

  $(function () {
    mdui.mutation('[mdui-tab]', function () {
      var $this = $(this);
      var inst = $this.data('mdui.tab');
      if (!inst) {
        inst = new mdui.Tab($this, parseOptions($this.attr('mdui-tab')));
        $this.data('mdui.tab', inst);
      }
    });
  });


  /**
   * =============================================================================
   * ************   Drawer 鎶藉眽鏍�   ************
   * =============================================================================
   *
   * 鍦ㄦ闈㈣澶囦笂榛樿鏄剧ず鎶藉眽鏍忥紝涓嶆樉绀洪伄缃╁眰
   * 鍦ㄦ墜鏈哄拰骞虫澘璁惧涓婇粯璁や笉鏄剧ず鎶藉眽鏍忥紝濮嬬粓鏄剧ず閬僵灞傦紝涓旇鐩栧鑸爮
   */

  mdui.Drawer = (function () {

    /**
     * 榛樿鍙傛暟
     * @type {{}}
     */
    var DEFAULT = {
      // 鍦ㄦ闈㈣澶囦笂鏄惁鏄剧ず閬僵灞傘€傛墜鏈哄拰骞虫澘涓嶅彈杩欎釜鍙傛暟褰卞搷锛屽缁堜細鏄剧ず閬僵灞�
      overlay: false,

      // 鏄惁寮€鍚墜鍔�
      swipe: false,
    };

    var isDesktop = function () {
      return $window.width() >= 1024;
    };

    /**
     * 鎶藉眽鏍忓疄渚�
     * @param selector 閫夋嫨鍣ㄦ垨 HTML 瀛楃涓叉垨 DOM 鍏冪礌
     * @param opts
     * @constructor
     */
    function Drawer(selector, opts) {
      var _this = this;

      _this.$drawer = $(selector).eq(0);
      if (!_this.$drawer.length) {
        return;
      }

      var oldInst = _this.$drawer.data('mdui.drawer');
      if (oldInst) {
        return oldInst;
      }

      _this.options = $.extend({}, DEFAULT, (opts || {}));

      _this.overlay = false; // 鏄惁鏄剧ず鐫€閬僵灞�
      _this.position = _this.$drawer.hasClass('mdui-drawer-right') ? 'right' : 'left';

      if (_this.$drawer.hasClass('mdui-drawer-close')) {
        _this.state = 'closed';
      } else if (_this.$drawer.hasClass('mdui-drawer-open')) {
        _this.state = 'opened';
      } else if (isDesktop()) {
        _this.state = 'opened';
      } else {
        _this.state = 'closed';
      }

      // 娴忚鍣ㄧ獥鍙ｅぇ灏忚皟鏁存椂
      $window.on('resize', $.throttle(function () {
        // 鐢辨墜鏈哄钩鏉垮垏鎹㈠埌妗岄潰鏃�
        if (isDesktop()) {
          // 濡傛灉鏄剧ず鐫€閬僵锛屽垯闅愯棌閬僵
          if (_this.overlay && !_this.options.overlay) {
            $.hideOverlay();
            _this.overlay = false;
            $.unlockScreen();
          }

          // 娌℃湁寮哄埗鍏抽棴锛屽垯鐘舵€佷负鎵撳紑鐘舵€�
          if (!_this.$drawer.hasClass('mdui-drawer-close')) {
            _this.state = 'opened';
          }
        }

        // 鐢辨闈㈠垏鎹㈠埌鎵嬫満骞虫澘鏃躲€傚鏋滄娊灞夋爮鏄墦寮€鐫€鐨勪笖娌℃湁閬僵灞傦紝鍒欏叧闂娊灞夋爮
        else {
          if (!_this.overlay && _this.state === 'opened') {
            // 鎶藉眽鏍忓浜庡己鍒舵墦寮€鐘舵€侊紝娣诲姞閬僵
            if (_this.$drawer.hasClass('mdui-drawer-open')) {
              $.showOverlay();
              _this.overlay = true;
              $.lockScreen();

              $('.mdui-overlay').one('click', function () {
                _this.close();
              });
            } else {
              _this.state = 'closed';
            }
          }
        }
      }, 100));

      // 缁戝畾鍏抽棴鎸夐挳浜嬩欢
      _this.$drawer.find('[mdui-drawer-close]').each(function () {
        $(this).on('click', function () {
          _this.close();
        });
      });

      swipeSupport(_this);
    }

    /**
     * 婊戝姩鎵嬪娍鏀寔
     * @param _this
     */
    var swipeSupport = function (_this) {
      // 鎶藉眽鏍忔粦鍔ㄦ墜鍔挎帶鍒�
      var openNavEventHandler;
      var touchStartX;
      var touchStartY;
      var swipeStartX;
      var swiping = false;
      var maybeSwiping = false;
      var $body = $('body');

      // 鎵嬪娍瑙﹀彂鐨勮寖鍥�
      var swipeAreaWidth = 24;

      function enableSwipeHandling() {
        if (!openNavEventHandler) {
          $body.on('touchstart', onBodyTouchStart);
          openNavEventHandler = onBodyTouchStart;
        }
      }

      function setPosition(translateX, closeTransform) {
        var rtlTranslateMultiplier = _this.position === 'right' ? -1 : 1;
        var transformCSS = 'translate(' + (-1 * rtlTranslateMultiplier * translateX) + 'px, 0) !important;';
        _this.$drawer.css(
          'cssText',
          'transform:' + transformCSS + (closeTransform ? 'transition: initial !important;' : '')
        );
      }

      function cleanPosition() {
        _this.$drawer.css({
          transform: '',
          transition: '',
        });
      }

      function getMaxTranslateX() {
        return _this.$drawer.width() + 10;
      }

      function getTranslateX(currentX) {
        return Math.min(
          Math.max(
            swiping === 'closing' ? (swipeStartX - currentX) : (getMaxTranslateX() + swipeStartX - currentX),
            0
          ),
          getMaxTranslateX()
        );
      }

      function onBodyTouchStart(event) {
        touchStartX = event.touches[0].pageX;
        if (_this.position === 'right') {
          touchStartX = $body.width() - touchStartX;
        }

        touchStartY = event.touches[0].pageY;

        if (_this.state !== 'opened') {
          if (touchStartX > swipeAreaWidth || openNavEventHandler !== onBodyTouchStart) {
            return;
          }
        }

        maybeSwiping = true;

        $body.on({
          touchmove: onBodyTouchMove,
          touchend: onBodyTouchEnd,
          touchcancel: onBodyTouchMove,
        });
      }

      function onBodyTouchMove(event) {
        var touchX = event.touches[0].pageX;
        if (_this.position === 'right') {
          touchX = $body.width() - touchX;
        }

        var touchY = event.touches[0].pageY;

        if (swiping) {
          setPosition(getTranslateX(touchX), true);
        } else if (maybeSwiping) {
          var dXAbs = Math.abs(touchX - touchStartX);
          var dYAbs = Math.abs(touchY - touchStartY);
          var threshold = 8;

          if (dXAbs > threshold && dYAbs <= threshold) {
            swipeStartX = touchX;
            swiping = _this.state === 'opened' ? 'closing' : 'opening';
            $.lockScreen();
            setPosition(getTranslateX(touchX), true);
          } else if (dXAbs <= threshold && dYAbs > threshold) {
            onBodyTouchEnd();
          }
        }
      }

      function onBodyTouchEnd(event) {
        if (swiping) {
          var touchX = event.changedTouches[0].pageX;
          if (_this.position === 'right') {
            touchX = $body.width() - touchX;
          }

          var translateRatio = getTranslateX(touchX) / getMaxTranslateX();

          maybeSwiping = false;
          var swipingState = swiping;
          swiping = null;

          if (swipingState === 'opening') {
            if (translateRatio < 0.92) {
              cleanPosition();
              _this.open();
            } else {
              cleanPosition();
            }
          } else {
            if (translateRatio > 0.08) {
              cleanPosition();
              _this.close();
            } else {
              cleanPosition();
            }
          }

          $.unlockScreen();
        } else {
          maybeSwiping = false;
        }

        $body.off({
          touchmove: onBodyTouchMove,
          touchend: onBodyTouchEnd,
          touchcancel: onBodyTouchMove,
        });
      }

      if (_this.options.swipe) {
        enableSwipeHandling();
      }
    };

    /**
     * 鍔ㄧ敾缁撴潫鍥炶皟
     * @param inst
     */
    var transitionEnd = function (inst) {
      if (inst.$drawer.hasClass('mdui-drawer-open')) {
        inst.state = 'opened';
        componentEvent('opened', 'drawer', inst, inst.$drawer);
      } else {
        inst.state = 'closed';
        componentEvent('closed', 'drawer', inst, inst.$drawer);
      }
    };

    /**
     * 鎵撳紑鎶藉眽鏍�
     */
    Drawer.prototype.open = function () {
      var _this = this;

      if (_this.state === 'opening' || _this.state === 'opened') {
        return;
      }

      _this.state = 'opening';
      componentEvent('open', 'drawer', _this, _this.$drawer);

      if (!_this.options.overlay) {
        $('body').addClass('mdui-drawer-body-' + _this.position);
      }

      _this.$drawer
        .removeClass('mdui-drawer-close')
        .addClass('mdui-drawer-open')
        .transitionEnd(function () {
          transitionEnd(_this);
        });

      if (!isDesktop() || _this.options.overlay) {
        _this.overlay = true;
        $.showOverlay().one('click', function () {
          _this.close();
        });

        $.lockScreen();
      }
    };

    /**
     * 鍏抽棴鎶藉眽鏍�
     */
    Drawer.prototype.close = function () {
      var _this = this;

      if (_this.state === 'closing' || _this.state === 'closed') {
        return;
      }

      _this.state = 'closing';
      componentEvent('close', 'drawer', _this, _this.$drawer);

      if (!_this.options.overlay) {
        $('body').removeClass('mdui-drawer-body-' + _this.position);
      }

      _this.$drawer
        .addClass('mdui-drawer-close')
        .removeClass('mdui-drawer-open')
        .transitionEnd(function () {
          transitionEnd(_this);
        });

      if (_this.overlay) {
        $.hideOverlay();
        _this.overlay = false;
        $.unlockScreen();
      }
    };

    /**
     * 鍒囨崲鎶藉眽鏍忔墦寮€/鍏抽棴鐘舵€�
     */
    Drawer.prototype.toggle = function () {
      var _this = this;

      if (_this.state === 'opening' || _this.state === 'opened') {
        _this.close();
      } else if (_this.state === 'closing' || _this.state === 'closed') {
        _this.open();
      }
    };

    /**
     * 鑾峰彇鎶藉眽鏍忕姸鎬�
     * @returns {'opening'|'opened'|'closing'|'closed'}
     */
    Drawer.prototype.getState = function () {
      return this.state;
    };

    return Drawer;

  })();


  /**
   * =============================================================================
   * ************   Drawer 鑷畾涔夊睘鎬� API   ************
   * =============================================================================
   */

  $(function () {
    mdui.mutation('[mdui-drawer]', function () {
      var $this = $(this);
      var options = parseOptions($this.attr('mdui-drawer'));
      var selector = options.target;
      delete options.target;

      var $drawer = $(selector).eq(0);

      var inst = $drawer.data('mdui.drawer');
      if (!inst) {
        inst = new mdui.Drawer($drawer, options);
        $drawer.data('mdui.drawer', inst);
      }

      $this.on('click', function () {
        inst.toggle();
      });

    });
  });


  /**
   * =============================================================================
   * ************   Dialog 瀵硅瘽妗�   ************
   * =============================================================================
   */

  mdui.Dialog = (function () {

    /**
     * 榛樿鍙傛暟
     */
    var DEFAULT = {
      history: true,                // 鐩戝惉 hashchange 浜嬩欢
      overlay: true,                // 鎵撳紑瀵硅瘽妗嗘椂鏄惁鏄剧ず閬僵
      modal: false,                 // 鏄惁妯℃€佸寲瀵硅瘽妗嗭紝涓� false 鏃剁偣鍑诲璇濇澶栭潰鍖哄煙鍏抽棴瀵硅瘽妗嗭紝涓� true 鏃朵笉鍏抽棴
      closeOnEsc: true,             // 鎸変笅 esc 鍏抽棴瀵硅瘽妗�
      closeOnCancel: true,          // 鎸変笅鍙栨秷鎸夐挳鏃跺叧闂璇濇
      closeOnConfirm: true,         // 鎸変笅纭鎸夐挳鏃跺叧闂璇濇
      destroyOnClosed: false,        // 鍏抽棴鍚庨攢姣�
    };

    /**
     * 閬僵灞傚厓绱�
     */
    var $overlay;

    /**
     * 绐楀彛鏄惁宸查攣瀹�
     */
    var isLockScreen;

    /**
     * 褰撳墠瀵硅瘽妗嗗疄渚�
     */
    var currentInst;

    /**
     * 闃熷垪鍚�
     * @type {string}
     */
    var queueName = '__md_dialog';

    /**
     * 绐楀彛瀹藉害鍙樺寲锛屾垨瀵硅瘽妗嗗唴瀹瑰彉鍖栨椂锛岃皟鏁村璇濇浣嶇疆鍜屽璇濇鍐呯殑婊氬姩鏉�
     */
    var readjust = function () {
      if (!currentInst) {
        return;
      }

      var $dialog = currentInst.$dialog;

      var $dialogTitle = $dialog.children('.mdui-dialog-title');
      var $dialogContent = $dialog.children('.mdui-dialog-content');
      var $dialogActions = $dialog.children('.mdui-dialog-actions');

      // 璋冩暣 dialog 鐨� top 鍜� height 鍊�
      $dialog.height('');
      $dialogContent.height('');

      var dialogHeight = $dialog.height();
      $dialog.css({
        top: (($window.height() - dialogHeight) / 2) + 'px',
        height: dialogHeight + 'px',
      });

      // 璋冩暣 mdui-dialog-content 鐨勯珮搴�
      $dialogContent.height(
        dialogHeight -
        ($dialogTitle.height() || 0) -
        ($dialogActions.height() || 0)
      );
    };

    /**
     * hashchange 浜嬩欢瑙﹀彂鏃跺叧闂璇濇
     */
    var hashchangeEvent = function () {
      if (location.hash.substring(1).indexOf('&mdui-dialog') < 0) {
        currentInst.close(true);
      }
    };

    /**
     * 鐐瑰嚮閬僵灞傚叧闂璇濇
     * @param e
     */
    var overlayClick = function (e) {
      if ($(e.target).hasClass('mdui-overlay') && currentInst) {
        currentInst.close();
      }
    };

    /**
     * 瀵硅瘽妗嗗疄渚�
     * @param selector 閫夋嫨鍣ㄦ垨 HTML 瀛楃涓叉垨 DOM 鍏冪礌
     * @param opts
     * @constructor
     */
    function Dialog(selector, opts) {
      var _this = this;

      // 瀵硅瘽妗嗗厓绱�
      _this.$dialog = $(selector).eq(0);
      if (!_this.$dialog.length) {
        return;
      }

      // 宸查€氳繃 data 灞炴€у疄渚嬪寲杩囷紝涓嶅啀閲嶅瀹炰緥鍖�
      var oldInst = _this.$dialog.data('mdui.dialog');
      if (oldInst) {
        return oldInst;
      }

      // 濡傛灉瀵硅瘽妗嗗厓绱犳病鏈夊湪褰撳墠鏂囨。涓紝鍒欓渶瑕佹坊鍔�
      if (!$.contains(document.body, _this.$dialog[0])) {
        _this.append = true;
        $('body').append(_this.$dialog);
      }

      _this.options = $.extend({}, DEFAULT, (opts || {}));
      _this.state = 'closed';

      // 缁戝畾鍙栨秷鎸夐挳浜嬩欢
      _this.$dialog.find('[mdui-dialog-cancel]').each(function () {
        $(this).on('click', function () {
          componentEvent('cancel', 'dialog', _this, _this.$dialog);
          if (_this.options.closeOnCancel) {
            _this.close();
          }
        });
      });

      // 缁戝畾纭鎸夐挳浜嬩欢
      _this.$dialog.find('[mdui-dialog-confirm]').each(function () {
        $(this).on('click', function () {
          componentEvent('confirm', 'dialog', _this, _this.$dialog);
          if (_this.options.closeOnConfirm) {
            _this.close();
          }
        });
      });

      // 缁戝畾鍏抽棴鎸夐挳浜嬩欢
      _this.$dialog.find('[mdui-dialog-close]').each(function () {
        $(this).on('click', function () {
          _this.close();
        });
      });
    }

    /**
     * 鍔ㄧ敾缁撴潫鍥炶皟
     * @param inst
     */
    var transitionEnd = function (inst) {
      if (inst.$dialog.hasClass('mdui-dialog-open')) {
        inst.state = 'opened';
        componentEvent('opened', 'dialog', inst, inst.$dialog);
      } else {
        inst.state = 'closed';
        componentEvent('closed', 'dialog', inst, inst.$dialog);

        inst.$dialog.hide();

        // 鎵€鏈夊璇濇閮藉叧闂紝涓斿綋鍓嶆病鏈夋墦寮€鐨勫璇濇鏃讹紝瑙ｉ攣灞忓箷
        if (queue.queue(queueName).length === 0 && !currentInst && isLockScreen) {
          $.unlockScreen();
          isLockScreen = false;
        }

        $window.off('resize', $.throttle(function () {
          readjust();
        }, 100));

        if (inst.options.destroyOnClosed) {
          inst.destroy();
        }
      }
    };

    /**
     * 鎵撳紑鎸囧畾瀵硅瘽妗�
     * @private
     */
    Dialog.prototype._doOpen = function () {
      var _this = this;

      currentInst = _this;

      if (!isLockScreen) {
        $.lockScreen();
        isLockScreen = true;
      }

      _this.$dialog.show();

      readjust();
      $window.on('resize', $.throttle(function () {
        readjust();
      }, 100));

      // 鎵撳紑娑堟伅妗�
      _this.state = 'opening';
      componentEvent('open', 'dialog', _this, _this.$dialog);

      _this.$dialog
        .addClass('mdui-dialog-open')
        .transitionEnd(function () {
          transitionEnd(_this);
        });

      // 涓嶅瓨鍦ㄩ伄缃╁眰鍏冪礌鏃讹紝娣诲姞閬僵灞�
      if (!$overlay) {
        $overlay = $.showOverlay(5100);
      }

      $overlay

        // 鐐瑰嚮閬僵灞傛椂鏄惁鍏抽棴瀵硅瘽妗�
        [_this.options.modal ? 'off' : 'on']('click', overlayClick)

        // 鏄惁鏄剧ず閬僵灞傦紝涓嶆樉绀烘椂锛屾妸閬僵灞傝儗鏅€忔槑
        .css('opacity', _this.options.overlay ? '' : 0);

      if (_this.options.history) {
        // 濡傛灉 hash 涓師鏉ュ氨鏈� &mdui-dialog锛屽厛鍒犻櫎锛岄伩鍏嶅悗閫€鍘嗗彶绾綍鍚庝粛鐒舵湁 &mdui-dialog 瀵艰嚧鏃犳硶鍏抽棴
        var hash = location.hash.substring(1);
        if (hash.indexOf('&mdui-dialog') > -1) {
          hash = hash.replace(/&mdui-dialog/g, '');
        }

        // 鍚庨€€鎸夐挳鍏抽棴瀵硅瘽妗�
        location.hash = hash + '&mdui-dialog';
        $window.on('hashchange', hashchangeEvent);
      }
    };

    /**
     * 鎵撳紑瀵硅瘽妗�
     */
    Dialog.prototype.open = function () {
      var _this = this;

      if (_this.state === 'opening' || _this.state === 'opened') {
        return;
      }

      // 濡傛灉褰撳墠鏈夋鍦ㄦ墦寮€鎴栧凡缁忔墦寮€鐨勫璇濇,鎴栭槦鍒椾笉涓虹┖锛屽垯鍏堝姞鍏ラ槦鍒楋紝绛夋棫瀵硅瘽妗嗗紑濮嬪叧闂椂鍐嶆墦寮€
      if (
        (currentInst && (currentInst.state === 'opening' || currentInst.state === 'opened')) ||
        queue.queue(queueName).length
      ) {
        queue.queue(queueName, function () {
          _this._doOpen();
        });

        return;
      }

      _this._doOpen();
    };

    /**
     * 鍏抽棴瀵硅瘽妗�
     */
    Dialog.prototype.close = function () {
      var _this = this;

      // setTimeout 鐨勪綔鐢ㄦ槸锛�
      // 褰撳悓鏃跺叧闂竴涓璇濇锛屽苟鎵撳紑鍙︿竴涓璇濇鏃讹紝浣挎墦寮€瀵硅瘽妗嗙殑鎿嶄綔鍏堟墽琛岋紝浠ヤ娇闇€瑕佹墦寮€鐨勫璇濇鍏堝姞鍏ラ槦鍒�
      setTimeout(function () {
        if (_this.state === 'closing' || _this.state === 'closed') {
          return;
        }

        currentInst = null;

        _this.state = 'closing';
        componentEvent('close', 'dialog', _this, _this.$dialog);

        // 鎵€鏈夊璇濇閮藉叧闂紝涓斿綋鍓嶆病鏈夋墦寮€鐨勫璇濇鏃讹紝闅愯棌閬僵
        if (queue.queue(queueName).length === 0 && $overlay) {
          $.hideOverlay();
          $overlay = null;
        }

        _this.$dialog
          .removeClass('mdui-dialog-open')
          .transitionEnd(function () {
            transitionEnd(_this);
          });

        if (_this.options.history && queue.queue(queueName).length === 0) {
          // 鏄惁闇€瑕佸悗閫€鍘嗗彶绾綍锛岄粯璁や负 false銆�
          // 涓� false 鏃舵槸閫氳繃 js 鍏抽棴锛岄渶瑕佸悗閫€涓€涓巻鍙茶褰�
          // 涓� true 鏃舵槸閫氳繃鍚庨€€鎸夐挳鍏抽棴锛屼笉闇€瑕佸悗閫€鍘嗗彶璁板綍
          if (!arguments[0]) {
            window.history.back();
          }

          $window.off('hashchange', hashchangeEvent);
        }

        // 鍏抽棴鏃у璇濇锛屾墦寮€鏂板璇濇銆�
        // 鍔犱竴鐐瑰欢杩燂紝浠呬粎涓轰簡瑙嗚鏁堟灉鏇村ソ銆備笉鍔犲欢鏃朵篃涓嶅奖鍝嶅姛鑳�
        setTimeout(function () {
          queue.dequeue(queueName);
        }, 100);
      }, 0);
    };

    /**
     * 鍒囨崲瀵硅瘽妗嗘墦寮€/鍏抽棴鐘舵€�
     */
    Dialog.prototype.toggle = function () {
      var _this = this;

      if (_this.state === 'opening' || _this.state === 'opened') {
        _this.close();
      } else if (_this.state === 'closing' || _this.state === 'closed') {
        _this.open();
      }
    };

    /**
     * 鑾峰彇瀵硅瘽妗嗙姸鎬�
     * @returns {'opening'|'opened'|'closing'|'closed'}
     */
    Dialog.prototype.getState = function () {
      return this.state;
    };

    /**
     * 閿€姣佸璇濇
     */
    Dialog.prototype.destroy = function () {
      var _this = this;

      if (_this.append) {
        _this.$dialog.remove();
      }

      _this.$dialog.removeData('mdui.dialog');

      if (queue.queue(queueName).length === 0 && !currentInst) {
        if ($overlay) {
          $.hideOverlay();
          $overlay = null;
        }

        if (isLockScreen) {
          $.unlockScreen();
          isLockScreen = false;
        }
      }
    };

    /**
     * 瀵硅瘽妗嗗唴瀹瑰彉鍖栨椂锛岄渶瑕佽皟鐢ㄨ鏂规硶鏉ヨ皟鏁村璇濇浣嶇疆鍜屾粴鍔ㄦ潯楂樺害
     */
    Dialog.prototype.handleUpdate = function () {
      readjust();
    };

    // esc 鎸変笅鏃跺叧闂璇濇
    $document.on('keydown', function (e) {
      if (
        currentInst &&
        currentInst.options.closeOnEsc &&
        currentInst.state === 'opened' &&
        e.keyCode === 27
      ) {
        currentInst.close();
      }
    });

    return Dialog;

  })();


  /**
   * =============================================================================
   * ************   Dialog DATA API   ************
   * =============================================================================
   */

  $(function () {
    $document.on('click', '[mdui-dialog]', function () {
      var $this = $(this);
      var options = parseOptions($this.attr('mdui-dialog'));
      var selector = options.target;
      delete options.target;

      var $dialog = $(selector).eq(0);

      var inst = $dialog.data('mdui.dialog');
      if (!inst) {
        inst = new mdui.Dialog($dialog, options);
        $dialog.data('mdui.dialog', inst);
      }

      inst.open();
    });
  });


  /**
   * =============================================================================
   * ************   mdui.dialog(options)   ************
   * =============================================================================
   */

  mdui.dialog = function (options) {

    /**
     * 榛樿鍙傛暟
     */
    var DEFAULT = {
      title: '',                // 鏍囬
      content: '',              // 鏂囨湰
      buttons: [],              // 鎸夐挳
      stackedButtons: false,    // 鍨傜洿鎺掑垪鎸夐挳
      cssClass: '',             // 鍦� Dialog 涓婃坊鍔犵殑 CSS 绫�
      history: true,            // 鐩戝惉 hashchange 浜嬩欢
      overlay: true,            // 鏄惁鏄剧ず閬僵
      modal: false,             // 鏄惁妯℃€佸寲瀵硅瘽妗�
      closeOnEsc: true,         // 鎸変笅 esc 鏃跺叧闂璇濇
      destroyOnClosed: true,    // 鍏抽棴鍚庨攢姣�
      onOpen: function () {     // 鎵撳紑鍔ㄧ敾寮€濮嬫椂鐨勫洖璋�
      },

      onOpened: function () {   // 鎵撳紑鍔ㄧ敾缁撴潫鍚庣殑鍥炶皟
      },

      onClose: function () {    // 鍏抽棴鍔ㄧ敾寮€濮嬫椂鐨勫洖璋�
      },

      onClosed: function () {   // 鍏抽棴鍔ㄧ敾缁撴潫鏃剁殑鍥炶皟
      },
    };

    /**
     * 鎸夐挳鐨勯粯璁ゅ弬鏁�
     */
    var DEFAULT_BUTTON = {
      text: '',                   // 鎸夐挳鏂囨湰
      bold: false,                // 鎸夐挳鏂囨湰鏄惁鍔犵矖
      close: true,                // 鐐瑰嚮鎸夐挳鍚庡叧闂璇濇
      onClick: function (inst) {  // 鐐瑰嚮鎸夐挳鐨勫洖璋�
      },
    };

    // 鍚堝苟鍙傛暟
    options = $.extend({}, DEFAULT, (options || {}));
    $.each(options.buttons, function (i, button) {
      options.buttons[i] = $.extend({}, DEFAULT_BUTTON, button);
    });

    // 鎸夐挳鐨� HTML
    var buttonsHTML = '';
    if (options.buttons.length) {
      buttonsHTML =
        '<div class="mdui-dialog-actions ' +
          (options.stackedButtons ? 'mdui-dialog-actions-stacked' : '') +
        '">';
      $.each(options.buttons, function (i, button) {
        buttonsHTML +=
          '<a href="javascript:void(0)" ' +
            'class="mdui-btn mdui-ripple mdui-text-color-primary ' +
            (button.bold ? 'mdui-btn-bold' : '') + '">' +
            button.text +
          '</a>';
      });

      buttonsHTML += '</div>';
    }

    // Dialog 鐨� HTML
    var HTML =
      '<div class="mdui-dialog ' + options.cssClass + '">' +
        (options.title ? '<div class="mdui-dialog-title">' + options.title + '</div>' : '') +
        (options.content ? '<div class="mdui-dialog-content">' + options.content + '</div>' : '') +
        buttonsHTML +
      '</div>';

    // 瀹炰緥鍖� Dialog
    var inst = new mdui.Dialog(HTML, {
      history: options.history,
      overlay: options.overlay,
      modal: options.modal,
      closeOnEsc: options.closeOnEsc,
      destroyOnClosed: options.destroyOnClosed,
    });

    // 缁戝畾鎸夐挳浜嬩欢
    if (options.buttons.length) {
      inst.$dialog.find('.mdui-dialog-actions .mdui-btn').each(function (i, button) {
        $(button).on('click', function () {
          if (typeof options.buttons[i].onClick === 'function') {
            options.buttons[i].onClick(inst);
          }

          if (options.buttons[i].close) {
            inst.close();
          }
        });
      });
    }

    // 缁戝畾鎵撳紑鍏抽棴浜嬩欢
    if (typeof options.onOpen === 'function') {
      inst.$dialog
        .on('open.mdui.dialog', function () {
          options.onOpen(inst);
        })
        .on('opened.mdui.dialog', function () {
          options.onOpened(inst);
        })
        .on('close.mdui.dialog', function () {
          options.onClose(inst);
        })
        .on('closed.mdui.dialog', function () {
          options.onClosed(inst);
        });
    }

    inst.open();

    return inst;
  };


  /**
   * =============================================================================
   * ************   mdui.alert(text, title, onConfirm, options)   ************
   * ************   mdui.alert(text, onConfirm, options)   ************
   * =============================================================================
   */

  mdui.alert = function (text, title, onConfirm, options) {

    // title 鍙傛暟鍙€�
    if (typeof title === 'function') {
      title = '';
      onConfirm = arguments[1];
      options = arguments[2];
    }

    if (onConfirm === undefined) {
      onConfirm = function () {};
    }

    if (options === undefined) {
      options = {};
    }

    /**
     * 榛樿鍙傛暟
     */
    var DEFAULT = {
      confirmText: 'ok',             // 鎸夐挳涓婄殑鏂囨湰
      history: true,                 // 鐩戝惉 hashchange 浜嬩欢
      modal: false,                  // 鏄惁妯℃€佸寲瀵硅瘽妗嗭紝涓� false 鏃剁偣鍑诲璇濇澶栭潰鍖哄煙鍏抽棴瀵硅瘽妗嗭紝涓� true 鏃朵笉鍏抽棴
      closeOnEsc: true,              // 鎸変笅 esc 鍏抽棴瀵硅瘽妗�
    };

    options = $.extend({}, DEFAULT, options);

    return mdui.dialog({
      title: title,
      content: text,
      buttons: [
        {
          text: options.confirmText,
          bold: false,
          close: true,
          onClick: onConfirm,
        },
      ],
      cssClass: 'mdui-dialog-alert',
      history: options.history,
      modal: options.modal,
      closeOnEsc: options.closeOnEsc,
    });
  };


  /**
   * =============================================================================
   * ************   mdui.confirm(text, title, onConfirm, onCancel, options)   ************
   * ************   mdui.confirm(text, onConfirm, onCancel, options)          ************
   * =============================================================================
   */

  mdui.confirm = function (text, title, onConfirm, onCancel, options) {

    // title 鍙傛暟鍙€�
    if (typeof title === 'function') {
      title = '';
      onConfirm = arguments[1];
      onCancel = arguments[2];
      options = arguments[3];
    }

    if (onConfirm === undefined) {
      onConfirm = function () {};
    }

    if (onCancel === undefined) {
      onCancel = function () {};
    }

    if (options === undefined) {
      options = {};
    }

    /**
     * 榛樿鍙傛暟
     */
    var DEFAULT = {
      confirmText: 'ok',            // 纭鎸夐挳鐨勬枃鏈�
      cancelText: 'cancel',         // 鍙栨秷鎸夐挳鐨勬枃鏈�
      history: true,                // 鐩戝惉 hashchange 浜嬩欢
      modal: false,                 // 鏄惁妯℃€佸寲瀵硅瘽妗嗭紝涓� false 鏃剁偣鍑诲璇濇澶栭潰鍖哄煙鍏抽棴瀵硅瘽妗嗭紝涓� true 鏃朵笉鍏抽棴
      closeOnEsc: true,             // 鎸変笅 esc 鍏抽棴瀵硅瘽妗�
    };

    options = $.extend({}, DEFAULT, options);

    return mdui.dialog({
      title: title,
      content: text,
      buttons: [
        {
          text: options.cancelText,
          bold: false,
          close: true,
          onClick: onCancel,
        },
        {
          text: options.confirmText,
          bold: false,
          close: true,
          onClick: onConfirm,
        },
      ],
      cssClass: 'mdui-dialog-confirm',
      history: options.history,
      modal: options.modal,
      closeOnEsc: options.closeOnEsc,
    });
  };


  /**
   * =============================================================================
   * ************   mdui.prompt(label, title, onConfirm, onCancel, options)   ************
   * ************   mdui.prompt(label, onConfirm, onCancel, options)          ************
   * =============================================================================
   */

  mdui.prompt = function (label, title, onConfirm, onCancel, options) {

    // title 鍙傛暟鍙€�
    if (typeof title === 'function') {
      title = '';
      onConfirm = arguments[1];
      onCancel = arguments[2];
      options = arguments[3];
    }

    if (onConfirm === undefined) {
      onConfirm = function () {};
    }

    if (onCancel === undefined) {
      onCancel = function () {};
    }

    if (options === undefined) {
      options = {};
    }

    /**
     * 榛樿鍙傛暟
     */
    var DEFAULT = {
      confirmText: 'ok',        // 纭鎸夐挳鐨勬枃鏈�
      cancelText: 'cancel',     // 鍙栨秷鎸夐挳鐨勬枃鏈�
      history: true,            // 鐩戝惉 hashchange 浜嬩欢
      modal: false,             // 鏄惁妯℃€佸寲瀵硅瘽妗嗭紝涓� false 鏃剁偣鍑诲璇濇澶栭潰鍖哄煙鍏抽棴瀵硅瘽妗嗭紝涓� true 鏃朵笉鍏抽棴
      closeOnEsc: true,         // 鎸変笅 esc 鍏抽棴瀵硅瘽妗�
      type: 'text',             // 杈撳叆妗嗙被鍨嬶紝text: 鍗曡鏂囨湰妗� textarea: 澶氳鏂囨湰妗�
      maxlength: '',            // 鏈€澶ц緭鍏ュ瓧绗︽暟
      defaultValue: '',         // 杈撳叆妗嗕腑鐨勯粯璁ゆ枃鏈�
      confirmOnEnter: false,    // 鎸変笅 enter 纭杈撳叆鍐呭
    };

    options = $.extend({}, DEFAULT, options);

    var content =
      '<div class="mdui-textfield">' +
        (label ? '<label class="mdui-textfield-label">' + label + '</label>' : '') +
        (options.type === 'text' ?
          '<input class="mdui-textfield-input" type="text" ' +
            'value="' + options.defaultValue + '" ' +
            (options.maxlength ? ('maxlength="' + options.maxlength + '"') : '') + '/>' :
          '') +
        (options.type === 'textarea' ?
          '<textarea class="mdui-textfield-input" ' +
            (options.maxlength ? ('maxlength="' + options.maxlength + '"') : '') + '>' +
              options.defaultValue +
          '</textarea>' :
          '') +
      '</div>';

    return mdui.dialog({
      title: title,
      content: content,
      buttons: [
        {
          text: options.cancelText,
          bold: false,
          close: true,
          onClick: function (inst) {
            var value = inst.$dialog.find('.mdui-textfield-input').val();
            onCancel(value, inst);
          },
        },
        {
          text: options.confirmText,
          bold: false,
          close: true,
          onClick: function (inst) {
            var value = inst.$dialog.find('.mdui-textfield-input').val();
            onConfirm(value, inst);
          },
        },
      ],
      cssClass: 'mdui-dialog-prompt',
      history: options.history,
      modal: options.modal,
      closeOnEsc: options.closeOnEsc,
      onOpen: function (inst) {

        // 鍒濆鍖栬緭鍏ユ
        var $input = inst.$dialog.find('.mdui-textfield-input');
        mdui.updateTextFields($input);

        // 鑱氱劍鍒拌緭鍏ユ
        $input[0].focus();

        // 鎹曟崏鏂囨湰妗嗗洖杞﹂敭锛屽湪鍗曡鏂囨湰妗嗙殑鎯呭喌涓嬭Е鍙戝洖璋�
        if (options.type === 'text' && options.confirmOnEnter === true) {
          $input.on('keydown', function (event) {
            if (event.keyCode === 13) {
              var value = inst.$dialog.find('.mdui-textfield-input').val();
              onConfirm(value, inst);
              inst.close();
            }
          });
        }

        // 濡傛灉鏄琛岃緭鍏ユ锛岀洃鍚緭鍏ユ鐨� input 浜嬩欢锛屾洿鏂板璇濇楂樺害
        if (options.type === 'textarea') {
          $input.on('input', function () {
            inst.handleUpdate();
          });
        }

        // 鏈夊瓧绗︽暟闄愬埗鏃讹紝鍔犺浇瀹屾枃鏈鍚� DOM 浼氬彉鍖栵紝闇€瑕佹洿鏂板璇濇楂樺害
        if (options.maxlength) {
          inst.handleUpdate();
        }
      },
    });

  };


  /**
   * =============================================================================
   * ************   ToolTip 宸ュ叿鎻愮ず   ************
   * =============================================================================
   */

  mdui.Tooltip = (function () {

    /**
     * 榛樿鍙傛暟
     */
    var DEFAULT = {
      position: 'auto',     // 鎻愮ず鎵€鍦ㄤ綅缃�
      delay: 0,             // 寤惰繜锛屽崟浣嶆绉�
      content: '',          // 鎻愮ず鏂囨湰锛屽厑璁稿寘鍚� HTML
    };

    /**
     * 鏄惁鏄闈㈣澶�
     * @returns {boolean}
     */
    var isDesktop = function () {
      return $window.width() > 1024;
    };

    /**
     * 璁剧疆 Tooltip 鐨勪綅缃�
     * @param inst
     */
    function setPosition(inst) {
      var marginLeft;
      var marginTop;
      var position;

      // 瑙﹀彂鐨勫厓绱�
      var targetProps = inst.$target[0].getBoundingClientRect();

      // 瑙﹀彂鐨勫厓绱犲拰 Tooltip 涔嬮棿鐨勮窛绂�
      var targetMargin = (isDesktop() ? 14 : 24);

      // Tooltip 鐨勫搴﹀拰楂樺害
      var tooltipWidth = inst.$tooltip[0].offsetWidth;
      var tooltipHeight = inst.$tooltip[0].offsetHeight;

      // Tooltip 鐨勬柟鍚�
      position = inst.options.position;

      // 鑷姩鍒ゆ柇浣嶇疆锛屽姞 2px锛屼娇 Tooltip 璺濈绐楀彛杈规鑷冲皯鏈� 2px 鐨勯棿璺�
      if (['bottom', 'top', 'left', 'right'].indexOf(position) === -1) {
        if (
          targetProps.top + targetProps.height + targetMargin + tooltipHeight + 2 <
          $window.height()
        ) {
          position = 'bottom';
        } else if (targetMargin + tooltipHeight + 2 < targetProps.top) {
          position = 'top';
        } else if (targetMargin + tooltipWidth + 2 < targetProps.left) {
          position = 'left';
        } else if (
          targetProps.width + targetMargin + tooltipWidth + 2 <
          $window.width() - targetProps.left
        ) {
          position = 'right';
        } else {
          position = 'bottom';
        }
      }

      // 璁剧疆浣嶇疆
      switch (position) {
        case 'bottom':
          marginLeft = -1 * (tooltipWidth / 2);
          marginTop = (targetProps.height / 2) + targetMargin;
          inst.$tooltip.transformOrigin('top center');
          break;
        case 'top':
          marginLeft = -1 * (tooltipWidth / 2);
          marginTop = -1 * (tooltipHeight + (targetProps.height / 2) + targetMargin);
          inst.$tooltip.transformOrigin('bottom center');
          break;
        case 'left':
          marginLeft = -1 * (tooltipWidth + (targetProps.width / 2) + targetMargin);
          marginTop = -1 * (tooltipHeight / 2);
          inst.$tooltip.transformOrigin('center right');
          break;
        case 'right':
          marginLeft = (targetProps.width / 2) + targetMargin;
          marginTop = -1 * (tooltipHeight / 2);
          inst.$tooltip.transformOrigin('center left');
          break;
      }

      var targetOffset = inst.$target.offset();
      inst.$tooltip.css({
        top: targetOffset.top + (targetProps.height / 2) + 'px',
        left: targetOffset.left + (targetProps.width / 2) + 'px',
        'margin-left': marginLeft + 'px',
        'margin-top': marginTop + 'px',
      });
    }

    /**
     * Tooltip 瀹炰緥
     * @param selector
     * @param opts
     * @constructor
     */
    function Tooltip(selector, opts) {
      var _this = this;

      _this.$target = $(selector).eq(0);
      if (!_this.$target.length) {
        return;
      }

      // 宸查€氳繃 data 灞炴€у疄渚嬪寲杩囷紝涓嶅啀閲嶅瀹炰緥鍖�
      var oldInst = _this.$target.data('mdui.tooltip');
      if (oldInst) {
        return oldInst;
      }

      _this.options = $.extend({}, DEFAULT, (opts || {}));
      _this.state = 'closed';

      // 鍒涘缓 Tooltip HTML
      _this.$tooltip = $(
        '<div class="mdui-tooltip" id="' + $.guid() + '">' +
          _this.options.content +
        '</div>'
      ).appendTo(document.body);

      // 缁戝畾浜嬩欢銆傚厓绱犲浜� disabled 鐘舵€佹椂鏃犳硶瑙﹀彂榧犳爣浜嬩欢锛屼负浜嗙粺涓€锛屾妸 touch 浜嬩欢涔熺鐢�
      _this.$target
        .on('touchstart mouseenter', function (e) {
          if (this.disabled) {
            return;
          }

          if (!TouchHandler.isAllow(e)) {
            return;
          }

          TouchHandler.register(e);

          _this.open();
        })
        .on('touchend mouseleave', function (e) {
          if (this.disabled) {
            return;
          }

          if (!TouchHandler.isAllow(e)) {
            return;
          }

          _this.close();
        })
        .on(TouchHandler.unlock, function (e) {
          if (this.disabled) {
            return;
          }

          TouchHandler.register(e);
        });
    }

    /**
     * 鍔ㄧ敾缁撴潫鍥炶皟
     * @private
     */
    var transitionEnd = function (inst) {
      if (inst.$tooltip.hasClass('mdui-tooltip-open')) {
        inst.state = 'opened';
        componentEvent('opened', 'tooltip', inst, inst.$target);
      } else {
        inst.state = 'closed';
        componentEvent('closed', 'tooltip', inst, inst.$target);
      }
    };

    /**
     * 鎵ц鎵撳紑 Tooltip
     * @private
     */
    Tooltip.prototype._doOpen = function () {
      var _this = this;

      _this.state = 'opening';
      componentEvent('open', 'tooltip', _this, _this.$target);

      _this.$tooltip
        .addClass('mdui-tooltip-open')
        .transitionEnd(function () {
          transitionEnd(_this);
        });
    };

    /**
     * 鎵撳紑 Tooltip
     * @param opts 鍏佽姣忔鎵撳紑鏃惰缃笉鍚岀殑鍙傛暟
     */
    Tooltip.prototype.open = function (opts) {
      var _this = this;

      if (_this.state === 'opening' || _this.state === 'opened') {
        return;
      }

      var oldOpts = $.extend({}, _this.options);

      // 鍚堝苟 data 灞炴€у弬鏁�
      $.extend(_this.options, parseOptions(_this.$target.attr('mdui-tooltip')));
      if (opts) {
        $.extend(_this.options, opts);
      }

      // tooltip 鐨勫唴瀹规湁鏇存柊
      if (oldOpts.content !== _this.options.content) {
        _this.$tooltip.html(_this.options.content);
      }

      setPosition(_this);

      if (_this.options.delay) {
        _this.timeoutId = setTimeout(function () {
          _this._doOpen();
        }, _this.options.delay);
      } else {
        _this.timeoutId = false;
        _this._doOpen();
      }
    };

    /**
     * 鍏抽棴 Tooltip
     */
    Tooltip.prototype.close = function () {
      var _this = this;

      if (_this.timeoutId) {
        clearTimeout(_this.timeoutId);
        _this.timeoutId = false;
      }

      if (_this.state === 'closing' || _this.state === 'closed') {
        return;
      }

      _this.state = 'closing';
      componentEvent('close', 'tooltip', _this, _this.$target);

      _this.$tooltip
        .removeClass('mdui-tooltip-open')
        .transitionEnd(function () {
          transitionEnd(_this);
        });
    };

    /**
     * 鍒囨崲 Tooltip 鐘舵€�
     */
    Tooltip.prototype.toggle = function () {
      var _this = this;

      if (_this.state === 'opening' || _this.state === 'opened') {
        _this.close();
      } else if (_this.state === 'closing' || _this.state === 'closed') {
        _this.open();
      }
    };

    /**
     * 鑾峰彇 Tooltip 鐘舵€�
     * @returns {'opening'|'opened'|'closing'|'closed'}
     */
    Tooltip.prototype.getState = function () {
      return this.state;
    };

    /**
     * 閿€姣� Tooltip
     */
    /*Tooltip.prototype.destroy = function () {
      var _this = this;
      clearTimeout(_this.timeoutId);
      $.data(_this.target, 'mdui.tooltip', null);
      $.remove(_this.tooltip);
    };*/

    return Tooltip;

  })();


  /**
   * =============================================================================
   * ************   Tooltip DATA API   ************
   * =============================================================================
   */

  $(function () {
    // mouseenter 涓嶈兘鍐掓场锛屾墍浠ヨ繖閲岀敤 mouseover 浠ｆ浛
    $document.on('touchstart mouseover', '[mdui-tooltip]', function () {
      var $this = $(this);

      var inst = $this.data('mdui.tooltip');
      if (!inst) {
        var options = parseOptions($this.attr('mdui-tooltip'));
        inst = new mdui.Tooltip($this, options);
        $this.data('mdui.tooltip', inst);
      }
    });
  });


  /**
   * =============================================================================
   * ************   Snackbar   ************
   * =============================================================================
   */

  (function () {

    /**
     * 褰撳墠鎵撳紑鐫€鐨� Snackbar
     */
    var currentInst;

    /**
     * 瀵瑰垪鍚�
     * @type {string}
     */
    var queueName = '__md_snackbar';

    var DEFAULT = {
      timeout: 4000,                  // 鍦ㄧ敤鎴锋病鏈夋搷浣滄椂澶氶暱鏃堕棿鑷姩闅愯棌
      buttonText: '',                 // 鎸夐挳鐨勬枃鏈�
      buttonColor: '',                // 鎸夐挳鐨勯鑹诧紝鏀寔 blue #90caf9 rgba(...)
      position: 'bottom',             // 浣嶇疆 bottom銆乼op銆乴eft-top銆乴eft-bottom銆乺ight-top銆乺ight-bottom
      closeOnButtonClick: true,       // 鐐瑰嚮鎸夐挳鏃跺叧闂�
      closeOnOutsideClick: true,      // 瑙︽懜鎴栫偣鍑诲睆骞曞叾浠栧湴鏂规椂鍏抽棴
      onClick: function () {          // 鍦� Snackbar 涓婄偣鍑荤殑鍥炶皟
      },

      onButtonClick: function () {    // 鐐瑰嚮鎸夐挳鐨勫洖璋�
      },

      onOpen: function () {           // 鎵撳紑鍔ㄧ敾寮€濮嬫椂鐨勫洖璋�
      },

      onOpened: function () {         // 鎵撳紑鍔ㄧ敾缁撴潫鏃剁殑鍥炶皟
      },

      onClose: function () {          // 鍏抽棴鍔ㄧ敾寮€濮嬫椂鐨勫洖璋�
      },

      onClosed: function () {         // 鎵撳紑鍔ㄧ敾缁撴潫鏃剁殑鍥炶皟
      },
    };

    /**
     * 鐐瑰嚮 Snackbar 澶栭潰鐨勫尯鍩熷叧闂�
     * @param e
     */
    var closeOnOutsideClick = function (e) {
      var $target = $(e.target);
      if (!$target.hasClass('mdui-snackbar') && !$target.parents('.mdui-snackbar').length) {
        currentInst.close();
      }
    };

    /**
     * Snackbar 瀹炰緥
     * @param message
     * @param opts
     * @constructor
     */
    function Snackbar(message, opts) {
      var _this = this;

      _this.message = message;
      _this.options = $.extend({}, DEFAULT, (opts || {}));

      // message 鍙傛暟蹇呴』
      if (!_this.message) {
        return;
      }

      _this.state = 'closed';

      _this.timeoutId = false;

      // 鎸夐挳棰滆壊
      var buttonColorStyle = '';
      var buttonColorClass = '';

      if (
        _this.options.buttonColor.indexOf('#') === 0 ||
        _this.options.buttonColor.indexOf('rgb') === 0
      ) {
        buttonColorStyle = 'style="color:' + _this.options.buttonColor + '"';
      } else if (_this.options.buttonColor !== '') {
        buttonColorClass = 'mdui-text-color-' + _this.options.buttonColor;
      }

      // 娣诲姞 HTML
      _this.$snackbar = $(
        '<div class="mdui-snackbar">' +
          '<div class="mdui-snackbar-text">' +
            _this.message +
          '</div>' +
          (_this.options.buttonText ?
            ('<a href="javascript:void(0)" ' +
            'class="mdui-snackbar-action mdui-btn mdui-ripple mdui-ripple-white ' +
              buttonColorClass + '" ' +
              buttonColorStyle + '>' +
              _this.options.buttonText +
            '</a>') :
            ''
          ) +
        '</div>')
        .appendTo(document.body);

      // 璁剧疆浣嶇疆
      _this._setPosition('close');

      _this.$snackbar
        .reflow()
        .addClass('mdui-snackbar-' + _this.options.position);
    }

    /**
     * 璁剧疆 Snackbar 鐨勪綅缃�
     * @param state
     * @private
     */
    Snackbar.prototype._setPosition = function (state) {
      var _this = this;

      var snackbarHeight = _this.$snackbar[0].clientHeight;
      var position = _this.options.position;

      var translateX;
      var translateY;

      // translateX
      if (position === 'bottom' || position === 'top') {
        translateX = '-50%';
      } else {
        translateX = '0';
      }

      // translateY
      if (state === 'open') {
        translateY = '0';
      } else {
        if (position === 'bottom') {
          translateY = snackbarHeight;
        }

        if (position === 'top') {
          translateY = -snackbarHeight;
        }

        if (position === 'left-top' || position === 'right-top') {
          translateY = -snackbarHeight - 24;
        }

        if (position === 'left-bottom' || position === 'right-bottom') {
          translateY = snackbarHeight + 24;
        }
      }

      _this.$snackbar.transform('translate(' + translateX + ',' + translateY + 'px)');
    };

    /**
     * 鎵撳紑 Snackbar
     */
    Snackbar.prototype.open = function () {
      var _this = this;

      if (!_this.message) {
        return;
      }

      if (_this.state === 'opening' || _this.state === 'opened') {
        return;
      }

      // 濡傛灉褰撳墠鏈夋鍦ㄦ樉绀虹殑 Snackbar锛屽垯鍏堝姞鍏ラ槦鍒楋紝绛夋棫 Snackbar 鍏抽棴鍚庡啀鎵撳紑
      if (currentInst) {
        queue.queue(queueName, function () {
          _this.open();
        });

        return;
      }

      currentInst = _this;

      // 寮€濮嬫墦寮€
      _this.state = 'opening';
      _this.options.onOpen();

      _this._setPosition('open');

      _this.$snackbar
        .transitionEnd(function () {
          if (_this.state !== 'opening') {
            return;
          }

          _this.state = 'opened';
          _this.options.onOpened();

          // 鏈夋寜閽椂缁戝畾浜嬩欢
          if (_this.options.buttonText) {
            _this.$snackbar
              .find('.mdui-snackbar-action')
              .on('click', function () {
                _this.options.onButtonClick();
                if (_this.options.closeOnButtonClick) {
                  _this.close();
                }
              });
          }

          // 鐐瑰嚮 snackbar 鐨勪簨浠�
          _this.$snackbar.on('click', function (e) {
            if (!$(e.target).hasClass('mdui-snackbar-action')) {
              _this.options.onClick();
            }
          });

          // 鐐瑰嚮 Snackbar 澶栭潰鐨勫尯鍩熷叧闂�
          if (_this.options.closeOnOutsideClick) {
            $document.on(TouchHandler.start, closeOnOutsideClick);
          }

          // 瓒呮椂鍚庤嚜鍔ㄥ叧闂�
          if (_this.options.timeout) {
            _this.timeoutId = setTimeout(function () {
              _this.close();
            }, _this.options.timeout);
          }
        });
    };

    /**
     * 鍏抽棴 Snackbar
     */
    Snackbar.prototype.close = function () {
      var _this = this;

      if (!_this.message) {
        return;
      }

      if (_this.state === 'closing' || _this.state === 'closed') {
        return;
      }

      if (_this.timeoutId) {
        clearTimeout(_this.timeoutId);
      }

      if (_this.options.closeOnOutsideClick) {
        $document.off(TouchHandler.start, closeOnOutsideClick);
      }

      _this.state = 'closing';
      _this.options.onClose();

      _this._setPosition('close');

      _this.$snackbar
        .transitionEnd(function () {
          if (_this.state !== 'closing') {
            return;
          }

          currentInst = null;
          _this.state = 'closed';
          _this.options.onClosed();
          _this.$snackbar.remove();
          queue.dequeue(queueName);
        });
    };

    /**
     * 鎵撳紑 Snackbar
     * @param message
     * @param opts
     */
    mdui.snackbar = function (message, opts) {
      if (typeof message !== 'string') {
        opts = message;
        message = opts.message;
      }

      var inst = new Snackbar(message, opts);

      inst.open();
      return inst;
    };

  })();


  /**
   * =============================================================================
   * ************   Bottom navigation 搴曢儴瀵艰埅鏍�   ************
   * =============================================================================
   */

  (function () {

    // 鍒囨崲瀵艰埅椤�
    $document.on('click', '.mdui-bottom-nav>a', function () {
      var $this = $(this);
      var $bottomNav = $this.parent();
      var isThis;
      $bottomNav.children('a').each(function (i, item) {
        isThis = $this.is(item);
        if (isThis) {
          componentEvent('change', 'bottomNav', null, $bottomNav, {
            index: i,
          });
        }

        $(item)[isThis ? 'addClass' : 'removeClass']('mdui-bottom-nav-active');
      });
    });

    // 婊氬姩鏃堕殣钘� mdui-bottom-nav-scroll-hide
    mdui.mutation('.mdui-bottom-nav-scroll-hide', function () {
      var $this = $(this);
      var inst = new mdui.Headroom($this, {
        pinnedClass: 'mdui-headroom-pinned-down',
        unpinnedClass: 'mdui-headroom-unpinned-down',
      });
      $this.data('mdui.headroom', inst);
    });

  })();


  /**
   * =============================================================================
   * ************   Spinner 鍦嗗舰杩涘害鏉�   ************
   * =============================================================================
   */

  (function () {
    /**
     * layer 鐨� HTML 缁撴瀯
     */
    var layerHTML = function () {
      var i = arguments.length ? arguments[0] : false;

      return '<div class="mdui-spinner-layer ' + (i ? 'mdui-spinner-layer-' + i : '') + '">' +
                 '<div class="mdui-spinner-circle-clipper mdui-spinner-left">' +
               '<div class="mdui-spinner-circle"></div>' +
               '</div>' +
               '<div class="mdui-spinner-gap-patch">' +
                 '<div class="mdui-spinner-circle"></div>' +
               '</div>' +
               '<div class="mdui-spinner-circle-clipper mdui-spinner-right">' +
                 '<div class="mdui-spinner-circle"></div>' +
               '</div>' +
             '</div>';
    };

    /**
     * 濉厖 HTML
     * @param spinner
     */
    var fillHTML = function (spinner) {
      var $spinner = $(spinner);
      var layer;
      if ($spinner.hasClass('mdui-spinner-colorful')) {
        layer = layerHTML('1') + layerHTML('2') + layerHTML('3') + layerHTML('4');
      } else {
        layer = layerHTML();
      }

      $spinner.html(layer);
    };

    /**
     * 椤甸潰鍔犺浇瀹屽悗鑷姩濉厖 HTML 缁撴瀯
     */
    mdui.mutation('.mdui-spinner', function () {
      fillHTML(this);
    });

    /**
     * 鏇存柊鍦嗗舰杩涘害鏉�
     */
    mdui.updateSpinners = function () {
      $(arguments.length ? arguments[0] : '.mdui-spinner').each(function () {
        fillHTML(this);
      });
    };

  })();



  /**
   * =============================================================================
   * ************   Expansion panel 鍙墿灞曢潰鏉�   ************
   * =============================================================================
   */

  mdui.Panel = (function () {

    function Panel(selector, opts) {
      return new CollapsePrivate(selector, opts, 'panel');
    }

    return Panel;

  })();


  /**
   * =============================================================================
   * ************   Expansion panel 鑷畾涔夊睘鎬�   ************
   * =============================================================================
   */

  $(function () {
    mdui.mutation('[mdui-panel]', function () {
      var $target = $(this);

      var inst = $target.data('mdui.panel');
      if (!inst) {
        var options = parseOptions($target.attr('mdui-panel'));
        inst = new mdui.Panel($target, options);
        $target.data('mdui.panel', inst);
      }
    });
  });


  /**
   * =============================================================================
   * ************   Menu 鑿滃崟   ************
   * =============================================================================
   */

  mdui.Menu = (function () {

    /**
     * 榛樿鍙傛暟
     */
    var DEFAULT = {
      position: 'auto',         // 鑿滃崟浣嶇疆 top銆乥ottom銆乧enter銆乤uto
      align: 'auto',            // 鑿滃崟鍜岃Е鍙戝畠鐨勫厓绱犵殑瀵归綈鏂瑰紡 left銆乺ight銆乧enter銆乤uto
      gutter: 16,               // 鑿滃崟璺濈绐楀彛杈圭紭鐨勬渶灏忚窛绂伙紝鍗曚綅 px
      fixed: false,             // 鏄惁浣胯彍鍗曞浐瀹氬湪绐楀彛锛屼笉闅忔粴鍔ㄦ潯婊氬姩
      covered: 'auto',          // 鑿滃崟鏄惁瑕嗙洊鍦ㄨЕ鍙戝畠鐨勫厓绱犱笂锛宼rue銆乫alse銆俛uto 鏃剁畝鍗曡彍鍗曡鐩栵紝绾ц仈鑿滃崟涓嶈鐩�
      subMenuTrigger: 'hover',  // 瀛愯彍鍗曠殑瑙﹀彂鏂瑰紡 hover銆乧lick
      subMenuDelay: 200,        // 瀛愯彍鍗曠殑瑙﹀彂寤舵椂锛屼粎鍦� submenuTrigger 涓� hover 鏈夋晥
    };

    /**
     * 璋冩暣涓昏彍鍗曚綅缃�
     * @param _this 瀹炰緥
     */
    var readjust = function (_this) {
      var menuLeft;
      var menuTop;

      // 鑿滃崟浣嶇疆鍜屾柟鍚�
      var position;
      var align;

      // window 绐楀彛鐨勫搴﹀拰楂樺害
      var windowHeight = $window.height();
      var windowWidth = $window.width();

      // 閰嶇疆鍙傛暟
      var gutter = _this.options.gutter;
      var isCovered = _this.isCovered;
      var isFixed = _this.options.fixed;

      // 鍔ㄧ敾鏂瑰悜鍙傛暟
      var transformOriginX;
      var transformOriginY;

      // 鑿滃崟鐨勫師濮嬪搴﹀拰楂樺害
      var menuWidth = _this.$menu.width();
      var menuHeight = _this.$menu.height();

      var $anchor = _this.$anchor;

      // 瑙﹀彂鑿滃崟鐨勫厓绱犲湪绐楀彛涓殑浣嶇疆
      var anchorTmp = $anchor[0].getBoundingClientRect();
      var anchorTop = anchorTmp.top;
      var anchorLeft = anchorTmp.left;
      var anchorHeight = anchorTmp.height;
      var anchorWidth = anchorTmp.width;
      var anchorBottom = windowHeight - anchorTop - anchorHeight;
      var anchorRight = windowWidth - anchorLeft - anchorWidth;

      // 瑙﹀彂鍏冪礌鐩稿鍏舵嫢鏈夊畾浣嶅睘鎬х殑鐖跺厓绱犵殑浣嶇疆
      var anchorOffsetTop = $anchor[0].offsetTop;
      var anchorOffsetLeft = $anchor[0].offsetLeft;

      // ===============================
      // ================= 鑷姩鍒ゆ柇鑿滃崟浣嶇疆
      // ===============================
      if (_this.options.position === 'auto') {

        // 鍒ゆ柇涓嬫柟鏄惁鏀惧緱涓嬭彍鍗�
        if (anchorBottom + (isCovered ? anchorHeight : 0) > menuHeight + gutter) {
          position = 'bottom';
        }

        // 鍒ゆ柇涓婃柟鏄惁鏀惧緱涓嬭彍鍗�
        else if (anchorTop + (isCovered ? anchorHeight : 0) > menuHeight + gutter) {
          position = 'top';
        }

        // 涓婁笅閮芥斁涓嶄笅锛屽眳涓樉绀�
        else {
          position = 'center';
        }
      } else {
        position = _this.options.position;
      }

      // ===============================
      // ============== 鑷姩鍒ゆ柇鑿滃崟瀵归綈鏂瑰紡
      // ===============================
      if (_this.options.align === 'auto') {

        // 鍒ゆ柇鍙充晶鏄惁鏀惧緱涓嬭彍鍗�
        if (anchorRight + anchorWidth > menuWidth + gutter) {
          align = 'left';
        }

        // 鍒ゆ柇宸︿晶鏄惁鏀惧緱涓嬭彍鍗�
        else if (anchorLeft + anchorWidth > menuWidth + gutter) {
          align = 'right';
        }

        // 宸﹀彸閮芥斁涓嶄笅锛屽眳涓樉绀�
        else {
          align = 'center';
        }
      } else {
        align = _this.options.align;
      }

      // ===============================
      // ==================== 璁剧疆鑿滃崟浣嶇疆
      // ===============================
      if (position === 'bottom') {
        transformOriginY = '0';

        menuTop =
          (isCovered ? 0 : anchorHeight) +
          (isFixed ? anchorTop : anchorOffsetTop);

      } else if (position === 'top') {
        transformOriginY = '100%';

        menuTop =
          (isCovered ? anchorHeight : 0) +
          (isFixed ? (anchorTop - menuHeight) : (anchorOffsetTop - menuHeight));

      } else {
        transformOriginY = '50%';

        // =====================鍦ㄧ獥鍙ｄ腑灞呬腑
        // 鏄剧ず鐨勮彍鍗曠殑楂樺害锛岀畝鍗曡彍鍗曢珮搴︿笉瓒呰繃绐楀彛楂樺害锛岃嫢瓒呰繃浜嗗垯鍦ㄨ彍鍗曞唴閮ㄦ樉绀烘粴鍔ㄦ潯
        // 绾ц仈鑿滃崟鍐呴儴涓嶅厑璁稿嚭鐜版粴鍔ㄦ潯
        var menuHeightTemp = menuHeight;

        // 绠€鍗曡彍鍗曟瘮绐楀彛楂樻椂锛岄檺鍒惰彍鍗曢珮搴�
        if (!_this.isCascade) {
          if (menuHeight + gutter * 2 > windowHeight) {
            menuHeightTemp = windowHeight - gutter * 2;
            _this.$menu.height(menuHeightTemp);
          }
        }

        menuTop =
          (windowHeight - menuHeightTemp) / 2 +
          (isFixed ? 0 : (anchorOffsetTop - anchorTop));
      }

      _this.$menu.css('top', menuTop + 'px');

      // ===============================
      // ================= 璁剧疆鑿滃崟瀵归綈鏂瑰紡
      // ===============================
      if (align === 'left') {
        transformOriginX = '0';

        menuLeft = isFixed ? anchorLeft : anchorOffsetLeft;

      } else if (align === 'right') {
        transformOriginX = '100%';

        menuLeft = isFixed ?
          (anchorLeft + anchorWidth - menuWidth) :
          (anchorOffsetLeft + anchorWidth - menuWidth);
      } else {
        transformOriginX = '50%';

        //=======================鍦ㄧ獥鍙ｄ腑灞呬腑
        // 鏄剧ず鐨勮彍鍗曠殑瀹藉害锛岃彍鍗曞搴︿笉鑳借秴杩囩獥鍙ｅ搴�
        var menuWidthTemp = menuWidth;

        // 鑿滃崟姣旂獥鍙ｅ锛岄檺鍒惰彍鍗曞搴�
        if (menuWidth + gutter * 2 > windowWidth) {
          menuWidthTemp = windowWidth - gutter * 2;
          _this.$menu.width(menuWidthTemp);
        }

        menuLeft =
          (windowWidth - menuWidthTemp) / 2 +
          (isFixed ? 0 : anchorOffsetLeft - anchorLeft);
      }

      _this.$menu.css('left', menuLeft + 'px');

      // 璁剧疆鑿滃崟鍔ㄧ敾鏂瑰悜
      _this.$menu.transformOrigin(transformOriginX + ' ' + transformOriginY);
    };

    /**
     * 璋冩暣瀛愯彍鍗曠殑浣嶇疆
     * @param $submenu
     */
    var readjustSubmenu = function ($submenu) {
      var $item = $submenu.parent('.mdui-menu-item');

      var submenuTop;
      var submenuLeft;

      // 瀛愯彍鍗曚綅缃拰鏂瑰悜
      var position; // top銆乥ottom
      var align; // left銆乺ight

      // window 绐楀彛鐨勫搴﹀拰楂樺害
      var windowHeight = $window.height();
      var windowWidth = $window.width();

      // 鍔ㄧ敾鏂瑰悜鍙傛暟
      var transformOriginX;
      var transformOriginY;

      // 瀛愯彍鍗曠殑鍘熷瀹藉害鍜岄珮搴�
      var submenuWidth = $submenu.width();
      var submenuHeight = $submenu.height();

      // 瑙﹀彂瀛愯彍鍗曠殑鑿滃崟椤圭殑瀹藉害楂樺害
      var itemTmp = $item[0].getBoundingClientRect();
      var itemWidth = itemTmp.width;
      var itemHeight = itemTmp.height;
      var itemLeft = itemTmp.left;
      var itemTop = itemTmp.top;

      // ===================================
      // ===================== 鍒ゆ柇鑿滃崟涓婁笅浣嶇疆
      // ===================================

      // 鍒ゆ柇涓嬫柟鏄惁鏀惧緱涓嬭彍鍗�
      if (windowHeight - itemTop > submenuHeight) {
        position = 'bottom';
      }

      // 鍒ゆ柇涓婃柟鏄惁鏀惧緱涓嬭彍鍗�
      else if (itemTop + itemHeight > submenuHeight) {
        position = 'top';
      }

      // 榛樿鏀惧湪涓嬫柟
      else {
        position = 'bottom';
      }

      // ====================================
      // ====================== 鍒ゆ柇鑿滃崟宸﹀彸浣嶇疆
      // ====================================

      // 鍒ゆ柇鍙充晶鏄惁鏀惧緱涓嬭彍鍗�
      if (windowWidth - itemLeft - itemWidth > submenuWidth) {
        align = 'left';
      }

      // 鍒ゆ柇宸︿晶鏄惁鏀惧緱涓嬭彍鍗�
      else if (itemLeft > submenuWidth) {
        align = 'right';
      }

      // 榛樿鏀惧湪鍙充晶
      else {
        align = 'left';
      }

      // ===================================
      // ======================== 璁剧疆鑿滃崟浣嶇疆
      // ===================================
      if (position === 'bottom') {
        transformOriginY = '0';
        submenuTop = '0';
      } else if (position === 'top') {
        transformOriginY = '100%';
        submenuTop = -submenuHeight + itemHeight;
      }

      $submenu.css('top', submenuTop + 'px');

      // ===================================
      // ===================== 璁剧疆鑿滃崟瀵归綈鏂瑰紡
      // ===================================
      if (align === 'left') {
        transformOriginX = '0';
        submenuLeft = itemWidth;
      } else if (align === 'right') {
        transformOriginX = '100%';
        submenuLeft = -submenuWidth;
      }

      $submenu.css('left', submenuLeft + 'px');

      // 璁剧疆鑿滃崟鍔ㄧ敾鏂瑰悜
      $submenu.transformOrigin(transformOriginX + ' ' + transformOriginY);
    };

    /**
     * 鎵撳紑瀛愯彍鍗�
     * @param $submenu
     */
    var openSubMenu = function ($submenu) {
      readjustSubmenu($submenu);

      $submenu
        .addClass('mdui-menu-open')
        .parent('.mdui-menu-item')
        .addClass('mdui-menu-item-active');
    };

    /**
     * 鍏抽棴瀛愯彍鍗曪紝鍙婂叾宓屽鐨勫瓙鑿滃崟
     * @param $submenu
     */
    var closeSubMenu = function ($submenu) {
      // 鍏抽棴瀛愯彍鍗�
      $submenu
        .removeClass('mdui-menu-open')
        .addClass('mdui-menu-closing')
        .transitionEnd(function () {
          $submenu.removeClass('mdui-menu-closing');
        })

        // 绉婚櫎婵€娲荤姸鎬佺殑鏍峰紡
        .parent('.mdui-menu-item')
        .removeClass('mdui-menu-item-active');

      // 寰幆鍏抽棴宓屽鐨勫瓙鑿滃崟
      $submenu.find('.mdui-menu').each(function () {
        var $subSubmenu = $(this);
        $subSubmenu
          .removeClass('mdui-menu-open')
          .addClass('mdui-menu-closing')
          .transitionEnd(function () {
            $subSubmenu.removeClass('mdui-menu-closing');
          })
          .parent('.mdui-menu-item')
          .removeClass('mdui-menu-item-active');
      });
    };

    /**
     * 鍒囨崲瀛愯彍鍗曠姸鎬�
     * @param $submenu
     */
    var toggleSubMenu = function ($submenu) {
      if ($submenu.hasClass('mdui-menu-open')) {
        closeSubMenu($submenu);
      } else {
        openSubMenu($submenu);
      }
    };

    /**
     * 缁戝畾瀛愯彍鍗曚簨浠�
     * @param inst 瀹炰緥
     */
    var bindSubMenuEvent = function (inst) {
      // 鐐瑰嚮鎵撳紑瀛愯彍鍗�
      inst.$menu.on('click', '.mdui-menu-item', function (e) {
        var $this = $(this);
        var $target = $(e.target);

        // 绂佺敤鐘舵€佽彍鍗曚笉鎿嶄綔
        if ($this.attr('disabled') !== null) {
          return;
        }

        // 娌℃湁鐐瑰嚮鍦ㄥ瓙鑿滃崟鐨勮彍鍗曢」涓婃椂锛屼笉鎿嶄綔锛堢偣鍦ㄤ簡瀛愯彍鍗曠殑绌虹櫧鍖哄煙銆佹垨鍒嗛殧绾夸笂锛�
        if ($target.is('.mdui-menu') || $target.is('.mdui-divider')) {
          return;
        }

        // 闃绘鍐掓场锛岀偣鍑昏彍鍗曢」鏃跺彧鍦ㄦ渶鍚庝竴绾х殑 mdui-menu-item 涓婄敓鏁堬紝涓嶅悜涓婂啋娉�
        if (!$target.parents('.mdui-menu-item').eq(0).is($this)) {
          return;
        }

        // 褰撳墠鑿滃崟鐨勫瓙鑿滃崟
        var $submenu = $this.children('.mdui-menu');

        // 鍏堝叧闂櫎褰撳墠瀛愯彍鍗曞鐨勬墍鏈夊悓绾у瓙鑿滃崟
        $this.parent('.mdui-menu').children('.mdui-menu-item').each(function () {
          var $tmpSubmenu = $(this).children('.mdui-menu');
          if (
            $tmpSubmenu.length &&
            (!$submenu.length || !$tmpSubmenu.is($submenu))
          ) {
            closeSubMenu($tmpSubmenu);
          }
        });

        // 鍒囨崲褰撳墠瀛愯彍鍗�
        if ($submenu.length) {
          toggleSubMenu($submenu);
        }
      });

      if (inst.options.subMenuTrigger === 'hover') {
        // 涓存椂瀛樺偍 setTimeout 瀵硅薄
        var timeout;

        var timeoutOpen;
        var timeoutClose;

        inst.$menu.on('mouseover mouseout', '.mdui-menu-item', function (e) {
          var $this = $(this);
          var eventType = e.type;
          var $relatedTarget = $(e.relatedTarget);

          // 绂佺敤鐘舵€佺殑鑿滃崟涓嶆搷浣�
          if ($this.attr('disabled') !== null) {
            return;
          }

          // 鐢� mouseover 妯℃嫙 mouseenter
          if (eventType === 'mouseover') {
            if (!$this.is($relatedTarget) && $.contains($this[0], $relatedTarget[0])) {
              return;
            }
          }

          // 鐢� mouseout 妯℃嫙 mouseleave
          else if (eventType === 'mouseout') {
            if ($this.is($relatedTarget) || $.contains($this[0], $relatedTarget[0])) {
              return;
            }
          }

          // 褰撳墠鑿滃崟椤逛笅鐨勫瓙鑿滃崟锛屾湭蹇呭瓨鍦�
          var $submenu = $this.children('.mdui-menu');

          // 榧犳爣绉诲叆鑿滃崟椤规椂锛屾樉绀鸿彍鍗曢」涓嬬殑瀛愯彍鍗�
          if (eventType === 'mouseover') {
            if ($submenu.length) {

              // 褰撳墠瀛愯彍鍗曞噯澶囨墦寮€鏃讹紝濡傛灉褰撳墠瀛愯彍鍗曟鍑嗗鐫€鍏抽棴锛屼笉鐢ㄥ啀鍏抽棴浜�
              var tmpClose = $submenu.data('timeoutClose.mdui.menu');
              if (tmpClose) {
                clearTimeout(tmpClose);
              }

              // 濡傛灉褰撳墠瀛愯彍鍗曞凡缁忔墦寮€锛屼笉鎿嶄綔
              if ($submenu.hasClass('mdui-menu-open')) {
                return;
              }

              // 褰撳墠瀛愯彍鍗曞噯澶囨墦寮€鏃讹紝鍏朵粬鍑嗗鎵撳紑鐨勫瓙鑿滃崟涓嶇敤鍐嶆墦寮€浜�
              clearTimeout(timeoutOpen);

              // 鍑嗗鎵撳紑褰撳墠瀛愯彍鍗�
              timeout = timeoutOpen = setTimeout(function () {
                openSubMenu($submenu);
              }, inst.options.subMenuDelay);

              $submenu.data('timeoutOpen.mdui.menu', timeout);
            }
          }

          // 榧犳爣绉诲嚭鑿滃崟椤规椂锛屽叧闂彍鍗曢」涓嬬殑瀛愯彍鍗�
          else if (eventType === 'mouseout') {
            if ($submenu.length) {

              // 榧犳爣绉诲嚭鑿滃崟椤规椂锛屽鏋滃綋鍓嶈彍鍗曢」涓嬬殑瀛愯彍鍗曟鍑嗗鎵撳紑锛屼笉鐢ㄥ啀鎵撳紑浜�
              var tmpOpen = $submenu.data('timeoutOpen.mdui.menu');
              if (tmpOpen) {
                clearTimeout(tmpOpen);
              }

              // 鍑嗗鍏抽棴褰撳墠瀛愯彍鍗�
              timeout = timeoutClose = setTimeout(function () {
                closeSubMenu($submenu);
              }, inst.options.subMenuDelay);

              $submenu.data('timeoutClose.mdui.menu', timeout);
            }
          }
        });
      }
    };

    /**
     * 鑿滃崟
     * @param anchorSelector 鐐瑰嚮璇ュ厓绱犺Е鍙戣彍鍗�
     * @param menuSelector 鑿滃崟
     * @param opts 閰嶇疆椤�
     * @constructor
     */
    function Menu(anchorSelector, menuSelector, opts) {
      var _this = this;

      // 瑙﹀彂鑿滃崟鐨勫厓绱�
      _this.$anchor = $(anchorSelector).eq(0);
      if (!_this.$anchor.length) {
        return;
      }

      // 宸查€氳繃鑷畾涔夊睘鎬у疄渚嬪寲杩囷紝涓嶅啀閲嶅瀹炰緥鍖�
      var oldInst = _this.$anchor.data('mdui.menu');
      if (oldInst) {
        return oldInst;
      }

      _this.$menu = $(menuSelector).eq(0);

      // 瑙﹀彂鑿滃崟鐨勫厓绱� 鍜� 鑿滃崟蹇呴』鏄悓绾х殑鍏冪礌锛屽惁鍒欒彍鍗曞彲鑳戒笉鑳藉畾浣�
      if (!_this.$anchor.siblings(_this.$menu).length) {
        return;
      }

      _this.options = $.extend({}, DEFAULT, (opts || {}));
      _this.state = 'closed';

      // 鏄惁鏄骇鑱旇彍鍗�
      _this.isCascade = _this.$menu.hasClass('mdui-menu-cascade');

      // covered 鍙傛暟澶勭悊
      if (_this.options.covered === 'auto') {
        _this.isCovered = !_this.isCascade;
      } else {
        _this.isCovered = _this.options.covered;
      }

      // 鐐瑰嚮瑙﹀彂鑿滃崟鍒囨崲
      _this.$anchor.on('click', function () {
        _this.toggle();
      });

      // 鐐瑰嚮鑿滃崟澶栭潰鍖哄煙鍏抽棴鑿滃崟
      $document.on('click touchstart', function (e) {
        var $target = $(e.target);
        if (
          (_this.state === 'opening' || _this.state === 'opened') &&
            !$target.is(_this.$menu) &&
            !$.contains(_this.$menu[0], $target[0]) &&
            !$target.is(_this.$anchor) &&
            !$.contains(_this.$anchor[0], $target[0])
        ) {
          _this.close();
        }
      });

      // 鐐瑰嚮涓嶅惈瀛愯彍鍗曠殑鑿滃崟鏉＄洰鍏抽棴鑿滃崟
      $document.on('click', '.mdui-menu-item', function (e) {
        var $this = $(this);
        if (!$this.find('.mdui-menu').length && $this.attr('disabled') === null) {
          _this.close();
        }
      });

      // 缁戝畾鐐瑰嚮鎴栭紶鏍囩Щ鍏ュ惈瀛愯彍鍗曠殑鏉＄洰鐨勪簨浠�
      bindSubMenuEvent(_this);

      // 绐楀彛澶у皬鍙樺寲鏃讹紝閲嶆柊璋冩暣鑿滃崟浣嶇疆
      $window.on('resize', $.throttle(function () {
        readjust(_this);
      }, 100));
    }

    /**
     * 鍒囨崲鑿滃崟鐘舵€�
     */
    Menu.prototype.toggle = function () {
      var _this = this;

      if (_this.state === 'opening' || _this.state === 'opened') {
        _this.close();
      } else if (_this.state === 'closing' || _this.state === 'closed') {
        _this.open();
      }
    };

    /**
     * 鍔ㄧ敾缁撴潫鍥炶皟
     * @param inst
     */
    var transitionEnd = function (inst) {
      inst.$menu.removeClass('mdui-menu-closing');

      if (inst.state === 'opening') {
        inst.state = 'opened';
        componentEvent('opened', 'menu', inst, inst.$menu);
      }

      if (inst.state === 'closing') {
        inst.state = 'closed';
        componentEvent('closed', 'menu', inst, inst.$menu);

        // 鍏抽棴鍚庯紝鎭㈠鑿滃崟鏍峰紡鍒伴粯璁ょ姸鎬侊紝骞舵仮澶� fixed 瀹氫綅
        inst.$menu.css({
          top: '',
          left: '',
          width: '',
          position: 'fixed',
        });
      }
    };

    /**
     * 鎵撳紑鑿滃崟
     */
    Menu.prototype.open = function () {
      var _this = this;

      if (_this.state === 'opening' || _this.state === 'opened') {
        return;
      }

      _this.state = 'opening';
      componentEvent('open', 'menu', _this, _this.$menu);

      // 璋冩暣鑿滃崟浣嶇疆
      readjust(_this);

      _this.$menu

        // 鑿滃崟闅愯棌鐘舵€佷娇鐢ㄤ娇鐢� fixed 瀹氫綅銆�
        .css('position', _this.options.fixed ? 'fixed' : 'absolute')

        // 鎵撳紑鑿滃崟
        .addClass('mdui-menu-open')

        // 鎵撳紑鍔ㄧ敾瀹屾垚鍚�
        .transitionEnd(function () {
          transitionEnd(_this);
        });
    };

    /**
     * 鍏抽棴鑿滃崟
     */
    Menu.prototype.close = function () {
      var _this = this;
      if (_this.state === 'closing' || _this.state === 'closed') {
        return;
      }

      _this.state = 'closing';
      componentEvent('close', 'menu', _this, _this.$menu);

      // 鑿滃崟寮€濮嬪叧闂椂锛屽叧闂墍鏈夊瓙鑿滃崟
      _this.$menu.find('.mdui-menu').each(function () {
        closeSubMenu($(this));
      });

      _this.$menu
        .removeClass('mdui-menu-open')
        .addClass('mdui-menu-closing')
        .transitionEnd(function () {
          transitionEnd(_this);
        });
    };

    return Menu;
  })();


  /**
   * =============================================================================
   * ************   Menu 鑷畾涔夊睘鎬� API   ************
   * =============================================================================
   */

  $(function () {
    $document.on('click', '[mdui-menu]', function () {
      var $this = $(this);

      var inst = $this.data('mdui.menu');
      if (!inst) {
        var options = parseOptions($this.attr('mdui-menu'));
        var menuSelector = options.target;
        delete options.target;

        inst = new mdui.Menu($this, menuSelector, options);
        $this.data('mdui.menu', inst);

        inst.toggle();
      }
    });
  });


  /* jshint ignore:start */
  mdui.JQ = $;
  return mdui;
})));
/* jshint ignore:end */