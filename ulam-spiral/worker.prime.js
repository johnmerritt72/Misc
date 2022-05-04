/**
 * On message check for prime and send to parent for drawing
 * @param {Object} oEvent
 */
onmessage = function(oEvent) {
    var data = JSON.parse(oEvent.data);
    var point = data.point;
    var i = data.number;
var n = 0;
var c = '#ddd';
    var pointToDraw = {};
    if (isPrime(i)) {
        pointToDraw = {
            x : point.x,
            y : point.y,
            color : '#000',
            radius : data.radius / 2
        };
    } else {
	n = numFactors(i);
	c = '#ccc';
	if (n > i/8) c = '#aaa';
	if (n > i/7) c = '#999';
	if (n > i/6) c = '#777';
	if (n > i/5) c = '#555'; 
	if (n > i/4) c = '#444';
	if (n > i/3) c = '#333';
	if (n > i/2) c = '#222';
        pointToDraw = {
            x : point.x,
            y : point.y,
            color : c,
            radius : 1
        };
    }
    postMessage(JSON.stringify(pointToDraw));
};
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
	quotient = 1;
	
	for(var i = 2; i < integer; i++){
    		quotient = integer/i;
		if(quotient === Math.floor(quotient)){
			total++;
		}
	}
	return total;
    }
