describe("", function() {
  var inst, $canvas;
  beforeEach(function() {
    $canvas = $('canvas');
    $canvas.enGauge();
    inst = $canvas.data('gauge');
  });

  describe("initialize", function() {
    it("should have a property of progress", function() {
      expect(inst.progress).toBe(85);
    });

    it("should have a property of canvas", function() {
      expect(inst.canvas).toBe($canvas[0]);
    });

    it("should have a property of context", function() {
      expect(inst.context).toBe($canvas[0].getContext('2d'));
    });

    it("should have a property of options", function() {
      expect(Object.keys(inst.options).length).toBe(6);
    });

    it("should have a property of circ", function() {
      expect(typeof inst.circ).toBe("number");
    });

    it("should have a property of quarter", function() {
      expect(typeof inst.quarter).toBe("number");
    });

    it("should set the context globalCompositeOperation to be source-atop", function() {
      expect(inst.context.globalCompositeOperation).toBe("source-atop");
    });
  });

  describe("Draw initial meter", function() {
    beforeEach(function() {
      spyOn(inst.context, 'beginPath');
      spyOn(inst.context, 'arc');
      spyOn(inst.context, 'stroke');
      spyOn(inst.context, 'closePath');
      inst.drawInitialMeter();
    });

    it("should begin the path", function() {
      expect(inst.context.beginPath).toHaveBeenCalled();
    });

    it("should create an arc", function() {
      expect(inst.context.arc).toHaveBeenCalledWith(100, 100, 80, 0, inst.circ);
    });

    it("should set the stroke style to be equal to the background", function() {
      expect(inst.context.strokeStyle).toBe(inst.options.background.toLowerCase());
    });

    it("should set the line width to be equal to the width", function() {
      expect(inst.context.lineWidth).toBe(inst.options.width);
    });

    it("should stroke the line", function() {
      expect(inst.context.stroke).toHaveBeenCalled();
    });

    it("should close the path", function() {
      expect(inst.context.closePath).toHaveBeenCalled();
    });
  });

  describe("Draw the animated progress", function() {
    beforeEach(function() {
      spyOn($.fn, 'animate').andCallThrough();
      spyOn(inst, 'drawText').andCallThrough();
      spyOn(inst, 'draw');
      inst.drawAnimatedProgress();
    });

    it("should call the animate method containing an object with a key of property and a value which equals the progress", function() {
      expect($.fn.animate.mostRecentCall.args[0]).toEqual({ property: inst.progress });
    });

    it("should also call the animate method with a step function", function() {
      expect($.fn.animate.mostRecentCall.args[1].step instanceof Function).toBeTruthy();
    });

    it("should call the drawText method", function() {
      expect(inst.drawText).toHaveBeenCalled();
    });

    it("should call the draw method", function() {
      expect(inst.draw.mostRecentCall.args[1]).toEqual(inst.options.fill);
    });

    it("should call the animate method with an easing", function() {
      expect($.fn.animate.mostRecentCall.args[1].easing).toBe('easeInOutCubic');
    });

    it("should call the animate method with a duration", function() {
      expect($.fn.animate.mostRecentCall.args[1].duration).toBe(inst.options.duration);
    });
  });

  describe("draw", function() {
    beforeEach(function() {
      spyOn(inst.context, 'beginPath');
      spyOn(inst.context, 'arc');
      spyOn(inst.context, 'stroke');
      spyOn(inst.context, 'closePath');
      inst.draw(20, inst.options.fill);
    });

    it("should begin the path", function() {
      expect(inst.context.beginPath).toHaveBeenCalled();
    });

    it("should create an arc", function() {
      expect(inst.context.arc).toHaveBeenCalledWith(100, 100, 80, -(inst.quarter), (inst.circ * 20) - inst.quarter, false);
    });

    it("should set the stroke style to be equal to the fill", function() {
      expect(inst.context.strokeStyle).toBe(inst.options.fill.toLowerCase());
    });

    it("should set the line width to be equal to the width", function() {
      expect(inst.context.lineWidth).toBe(inst.options.width);
    });

    it("should stroke the line", function() {
      expect(inst.context.stroke).toHaveBeenCalled();
    });

    it("should close the path", function() {
      expect(inst.context.closePath).toHaveBeenCalled();
    });
  });
});
