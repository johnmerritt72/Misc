"use strict";

(function(win, doc, nav) {
    var canvas, context, width, height, num, size, resolution;
      
    var byte2Hex = function(n) {
	var nybHexString = "0123456789ABCDEF";
	return String(nybHexString.substr((n >> 4) & 0x0F,1)) + nybHexString.substr(n & 0x0F,1);
    }
    var RGB2Color = function(r,g,b) {
	return '#' + byte2Hex(r) + byte2Hex(g) + byte2Hex(b);
    }
    var frequency = .3/8;
    var red, green, blue = 0;
    var colorPal = new Array();
    for (var i = 0; i < 256; ++i) {
	red   = Math.sin(frequency*i + 0) * 127 + 128;
	green = Math.sin(frequency*i + 2) * 127 + 128;
	blue  = Math.sin(frequency*i + 4) * 127 + 128;
	
	colorPal[i] = RGB2Color(red,green,blue);
    }
    
    var Spiral = function() {
        var radius = (resolution / 2) || 6;
        //init is -1,-1
        var point = {
            x : 0,
            y : 0
        };
        //0:right;1:up,2:left,3:down
        var direction = {
            0 : {
                "x" : 1,
                "y" : 0
            },
            1 : {
                "x" : 0,
                "y" : 1
            },
            2 : {
                "x" : -1,
                "y" : 0
            },
            3 : {
                "x" : 0,
                "y" : -1
            }
        }
        var drawPoint = function(opt) {
            opt = opt || {};
            opt.x = opt.x || 0;
            opt.y = opt.y || 0;
            opt.radius = opt.radius || radius / 2;
            opt.color = opt.color || 'red';
            if (opt.x > width || opt.y > height) {
                return false;
            }
            context.beginPath();
            var coord = {
                x : (width / 2) + (opt.x * radius * 2),
                y : (height / 2) + (-1 * opt.y * radius * 2)
            };
            context.fillStyle = opt.color;
            context.fillRect(coord.x, coord.y, opt.radius*4, opt.radius*4);
/*            context.arc(coord.x, coord.y, opt.radius, 0, 2 * Math.PI, false);
            
            context.fill(); */
            return true;
        };
        var setDirection = function(point, dirIndex) {
            if ((dirIndex >= 0 || dirIndex < 4)) {
                point.x += direction[dirIndex].x;
                point.y += direction[dirIndex].y;
            }
            return point;
        }
        var nextDirection = function(dir) {
            dir += 1;
            if (dir > 3) {
                dir = 0;
            }
            return dir;
        };
        var generate = function() {
            var directionSteps = 1;
            var directionIndex = 0;
            //var i = 1;
            var i = num;
            drawPoint({
                x : point.x,
                y : point.y,
                color : '#f00',
                radius : radius
            });
            var cont = true;
            var n = 0;
            var c = '';
            do {
                for (var k = 0; k < 2; k++) {
                    for (var ds = 0; ds < directionSteps; ds += 1) {
                        i += 1;
                        //increment number
                        point = setDirection(point, directionIndex);

                            //no web worker :()
                            var pointToDraw = {};
                            if (isPrime(i)) {
                                pointToDraw = {
                                    x : point.x,
                                    y : point.y,
                                    color : '#000',
                                    radius : radius / 2
                                };
                            } else {
                            	n = numFactors(i);
                            	c = '#fff';
                            	if (n<256) {
	                            	c = colorPal[n];
	                        } 
	                        /*
                            	if (n > i/8) c = '#aaa';
				if (n > i/7) c = '#999';
				if (n > i/6) c = '#777';
				if (n > i/5) c = '#555';
				if (n > i/4) c = '#444';
				if (n > i/3) c = '#333';
				if (n > i/2) c = '#222'; */

                                pointToDraw = {
                                    x : point.x,
                                    y : point.y,
                                    color : c,
                                    radius : radius / 2
                                };
                            }
                            drawPoint(pointToDraw);
       

                        if (i > ((width / radius) * (width / radius) - 1)) {
                            cont = false;
                            return;
                        }
                    }
                    directionIndex = nextDirection(directionIndex);
                }
                directionSteps += 1;
            } while (cont) ;
        }
        return {
            generate : generate
        }
    };
    //is prime number?
    var isPrime = function(num) {
        if (num < 2)
            return false;
        for (var i = 2; i < num; i++) {
            if (num % i == 0)
                return false;
        }
        return true;
    }
    
    var numFactors = function(num) {
	var total = 2
	var quotient = 1;
	
	for(var i = 2; i < num; i++){
    		quotient = num/i;
		if(quotient === Math.floor(quotient)){
			total++;
		}
	}
	return total;
    }
    
    
    //generate
    var generate = function() {
        try {
            $('#canvas').hide();
            $('#error').hide();
            num = parseInt($('#startNum').val(), 10);
            if (num < 1 || num != $('#startNum').val()) {
                throw 'Starting number must be > 0'
            }
            var canvasSize = parseInt($('#canvasSize').val(), 10);
            if (canvasSize < 1 || canvasSize != $('#canvasSize').val()) {
                throw 'Size of spiral must be > 0'
            }
            resolution = 12;
            canvas = doc.getElementById("canvas");
            canvas.width = (canvasSize * resolution);
            if (canvas.width != canvas.height) {
                canvas.height = canvas.width;
            }
            width = parseInt(canvas.width, 10);
            height = parseInt(canvas.height, 10)
            context = canvas.getContext("2d");
            context.rect(0, 0, width, height);
            context.fillStyle = '#fff';
            context.fill();
            var spiral = new Spiral();
            spiral.generate();
            $('#canvas').css('width', '100%');
            $('#canvas').show();
        } catch(e) {
            console.log(e);
            $('#error').html('<strong>Hmm...</strong>&nbsp;' + e);
            $('#error').fadeIn();
        }

    }
    addEventListener("DOMContentLoaded", function() {
        $('#generateButton').click(function() {
            generate();
        });
        $('#canvas').click(function(elm) {
            var url = canvas.toDataURL("image/png");
            window.open(url, 'Ulam spiral');

        });
        generate();
    });

})(window, document, navigator);
