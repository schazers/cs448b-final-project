d3.svg.arc1d = function() {
  var radius = d3_svg_arc1dRadius,
      startAngle = d3_svg_arc1dStartAngle,
      endAngle = d3_svg_arc1dEndAngle;

  function arc1d() {
    var r0 = radius.apply(this, arguments),
        r1 = radius.apply(this, arguments),
        a0 = startAngle.apply(this, arguments) + d3_svg_arc1dOffset,
        a1 = endAngle.apply(this, arguments) + d3_svg_arc1dOffset,
        da = (a1 < a0 && (da = a0, a0 = a1, a1 = da), a1 - a0),
        df = da < Math.PI ? "0" : "1",
        c0 = Math.cos(a0),
        s0 = Math.sin(a0),
        c1 = Math.cos(a1),
        s1 = Math.sin(a1);
    return da >= d3_svg_arc1dMax
      ? ("M0," + r1
      + "A" + r1 + "," + r1 + " 0 1,1 0," + (-r1)
      + "A" + r1 + "," + r1 + " 0 1,1 0," + r1)
      : ("M" + r1 * c0 + "," + r1 * s0
      + "A" + r1 + "," + r1 + " 0 " + df + ",1 " + r1 * c1 + "," + r1 * s1);
  }

  arc1d.radius = function(v) {
    if (!arguments.length) return radius;
    radius = d3.functor(v);
    return arc1d;
  };

  arc1d.startAngle = function(v) {
    if (!arguments.length) return startAngle;
    startAngle = d3.functor(v);
    return arc1d;
  };

  arc1d.endAngle = function(v) {
    if (!arguments.length) return endAngle;
    endAngle = d3.functor(v);
    return arc1d;
  };

  arc1d.centroid = function() {
    var r = radius.apply(this, arguments),
        a = (startAngle.apply(this, arguments)
        + endAngle.apply(this, arguments)) / 2 + d3_svg_arc1dOffset;
    return [Math.cos(a) * r, Math.sin(a) * r];
  };

  return arc1d;
};

var d3_svg_arc1dOffset = -Math.PI / 2,
    d3_svg_arc1dMax = 2 * Math.PI - 1e-6;

function d3_svg_arc1dRadius(d) {
  return d.radius;
}


function d3_svg_arc1dStartAngle(d) {
  return d.startAngle;
}

function d3_svg_arc1dEndAngle(d) {
  return d.endAngle;
}
