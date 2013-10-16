/*
 * en-gauge
 * https://github.com/damian/en-gauge
 *
 * Copyright (c) 2013 Damian Nicholson
 * Licensed under the MIT license.
 */

(function($) {

  var COLOURS = {
    PINK: '#D99B9E',
    GREEN: '#C1D4A1',
    ORANGE: '#F8C78D',
    BLUE: '#84C7E1'
  };

  /**
   * @class EnGauge
   * @constructor
   * @param {HtmlElement} canvas The cannvas element acting as a placeholder
   * @param {Number} progress A number between 0 and 100
   */
  function EnGauge(canvas, progress, options) {
    var defaults = {
      duration: 800,
      fill: '#C1D4A1',
      background: '#EFEFEF',
      width: 20.0,
      easing: this.applyEasingFn(),
      text: false
    };

    /**
     * A reference to the number we want to represnet on the gauge
     *
     * @property progress
     * @type {Number}
     */
    this.progress = progress;

    /**
     * A reference to canvas element which acts as a placeholder for the gauge
     *
     * @property canvas
     * @type {HtmlElement}
     */
    this.canvas = canvas;

    /**
     * Sets the canvas context mode to 2d so we can start drawing
     *
     * @property context
     * @type {CanvasRenderingContext2D}
     */
    this.context = this.canvas.getContext('2d');

    /**
     * The options defined for this gauge
     *
     * @property options
     * @type {Object}
     */
    this.options = $.extend(defaults, options);

    /**
     * The options defined for this gauge
     *
     * @property circ
     * @type {Number}
     */
    this.circ = Math.PI * 2;

    /**
     * The options defined for this gauge
     *
     * @property quarter
     * @type {Number}
     */
    this.quarter = Math.PI / 2;

    this.drawInitialMeter();
    this.context.globalCompositeOperation = "source-atop";
    this.drawAnimatedProgress();
  }

  EnGauge.prototype = {

    /**
     * @method draw
     * @param {Number} percent The number being currently represented by the gauge
     * @param {String} colour The colour of the gauge
     */
    draw : function(percent, colour) {
      this.context.beginPath();
      this.context.arc(100, 100, 80, -(this.quarter), (this.circ * percent) - this.quarter, false);
      this.context.strokeStyle = colour;
      this.context.lineWidth = this.options.width;
      this.context.stroke();
      this.context.closePath();
    },

    /**
     * @method drawInitialMeter
     */
    drawInitialMeter : function() {
      this.context.beginPath();
      this.context.arc(100, 100, 80, 0, 2*Math.PI);
      this.context.strokeStyle = this.options.background;
      this.context.lineWidth = this.options.width;
      this.context.stroke();
      this.context.closePath();
    },

    /**
     * @method drawAnimatedProgress
     */
    drawAnimatedProgress : function() {
      var _this = this;
      $({ property: 0 }).animate({ property: this.progress }, {
        step: function(st) {
          _this.drawText(st);
          _this.draw(st / 100, _this.options.fill);
        },
        easing: 'easeInOutCubic',
        duration: _this.options.duration
      });
    },

    /**
     * @method drawText
     * @param {Number} step A number between 1 and 100
     */
    drawText : function(step) {
      if (this.options.text) {
        $(this.options.text).text(Math.ceil(step));
      }
    },

    /**
     * Augments the jQuery easing library with a easeInOutCubic
     * function which enables us to draw the gauge on a cubic
     * bezier curve
     *
     * @method applyEasingFn
     * @return {Function} The easing function
     */
    applyEasingFn : function() {
      if (!($ && $.easing.easeInOutCubic)) {
        $.extend($.easing, {
          easeInOutCubic: function (x, t, b, c, d) {
            if ((t /= d/2) < 1) {
              return c/2*t*t*t + b;
            }
            return c/2*((t-=2)*t*t + 2) + b;
          }
        });
      }
      return $.easing.easeInOutCubic;
    }
  };

  $.fn.enGauge = function() {
    return this.each(function() {
      var $this = $(this),
          options = $this.data();

      $this.data('gauge', new EnGauge(this, options.progress, { fill: COLOURS[options.color] }));
    });
  };

}(jQuery));
