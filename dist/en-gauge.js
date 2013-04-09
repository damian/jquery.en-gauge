/*! En Gauge - v0.0.1 - 2013-04-09
* https://github.com/damian/en-gauge
* Copyright (c) 2013 Damian Nicholson; Licensed MIT */

(function($) {

  // Collection method.
  $.fn.awesome = function() {
    return this.each(function() {
      $(this).html('awesome');
    });
  };

  // Static method.
  $.awesome = function() {
    return 'awesome';
  };

  // Custom selector.
  $.expr[':'].awesome = function(elem) {
    return elem.textContent.indexOf('awesome') >= 0;
  };

}(jQuery));
