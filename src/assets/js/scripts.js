$(function(){
    var svgString = new XMLSerializer().serializeToString(document.querySelector('svg.ngx-charts'));

    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");
    var DOMURL = self.URL || self.webkitURL || self;
    var img = new Image();
    var svg = new Blob([svgString], {type: "image/svg+xml;charset=utf-8"});
    var url = DOMURL.createObjectURL(svg);
    img.onload = function() {
        ctx.drawImage(img, 0, 0);
        var png = canvas.toDataURL("image/png");
        document.querySelector('#png-container').innerHTML = '<img class="img-responsive" src="'+png+'"/>';
        DOMURL.revokeObjectURL(png);
    };
    img.src = url;
  })