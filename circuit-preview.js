var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var frameDelay = 16;
var increment = 2;
var startOffset = -Math.round(canvas.width * 0.2); // start 20% off-screen to the left
var rightLimit = Math.round(canvas.width * 1.3); // end 30% beyond the right edge

var topGradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
topGradient.addColorStop("0", "#003746");
topGradient.addColorStop("0.45", "#008fb3");
topGradient.addColorStop("1.0", "#30f6ff");

var bottomGradient = ctx.createLinearGradient(0, canvas.height / 2, canvas.width, canvas.height / 2);
bottomGradient.addColorStop("0", "#002f3c");
bottomGradient.addColorStop("0.5", "#00809c");
bottomGradient.addColorStop("1.0", "#00d2f0");

ctx.lineWidth = 3;
ctx.lineCap = "round";
ctx.lineJoin = "round";
ctx.globalCompositeOperation = "lighter";

var topBaseY = Math.round(canvas.height * 0.25);
var bottomBaseY = Math.round(canvas.height * 0.75);

var routeConfigs = [
	{
		name: "top",
		startX: startOffset,
		baseY: topBaseY,
		yVariance: 20,
		seedMin: 360,
		seedMax: 460,
		gradient: topGradient,
		glow: "#2ffcff",
		glowBlur: 18,
		arcAt: 460,
		delayFrames: 0,
		segments: [
			{ start: -40, end: 80, direction: 1 },
			{ start: 200, end: 280, direction: 1 },
			{
				start: 420,
				endDynamic: function (route) {
					return route.seed;
				},
				direction: -1
			},
			{
				start: 640,
				endDynamic: function (route) {
					return route.seed + 260;
				},
				direction: 1
			}
		]
	},
	{
		name: "bottom",
		startX: startOffset,
		baseY: bottomBaseY,
		yVariance: 30,
		seedMin: 520,
		seedMax: 640,
		gradient: bottomGradient,
		glow: "#00d0e5",
		glowBlur: 22,
		arcAt: 780,
		delayFrames: 45,
		segments: [
			{ start: -20, end: 160, direction: -1 },
			{ start: 320, end: 420, direction: -1 },
			{
				start: 500,
				endDynamic: function (route) {
					return route.seed;
				},
				direction: 1
			},
			{
				start: 760,
				endDynamic: function (route) {
					return route.seed + 240;
				},
				direction: -1
			}
		]
	}
];

var routes = routeConfigs.map(function (config) {
	var route = Object.assign({}, config);
	resetRoute(route);
	return route;
});

setInterval(drawMain, frameDelay);

function resetRoute(route) {
	route.seed = getRandomInt(route.seedMin, route.seedMax);
	route.x = route.startX;
	route.y = route.baseY + getRandomInt(-route.yVariance, route.yVariance);
	route.points = [{ x: route.x, y: route.y }];
	route.arcPosition = null;
	route.delayCounter = route.delayFrames || 0;
}

function traceRoute(route) {
	if (route.delayCounter > 0) {
		route.delayCounter -= 1;
		return;
	}

	var lastPoint = route.points[route.points.length - 1];
	var nextX = lastPoint.x + increment;
	var nextY = lastPoint.y;

	route.segments.forEach(function (segment) {
		var end = typeof segment.endDynamic === "function" ? segment.endDynamic(route) : segment.end;
		if (nextX > segment.start && nextX < end) {
			nextY += segment.direction * increment;
		}
	});

	route.points.push({ x: nextX, y: nextY });
	route.x = nextX;
	route.y = nextY;

	if (!route.arcPosition && Math.abs(nextX - route.arcAt) < increment * 2) {
		route.arcPosition = { x: nextX, y: nextY };
	}

	if (route.x > rightLimit) {
		resetRoute(route);
	}
}

function drawRoute(route) {
	if (route.delayCounter > 0 || route.points.length < 2) {
		return;
	}

	ctx.strokeStyle = route.gradient;
	ctx.shadowColor = route.glow;
	ctx.shadowBlur = route.glowBlur;

	ctx.beginPath();
	route.points.forEach(function (point, index) {
		if (index === 0) {
			ctx.moveTo(point.x, point.y);
		} else {
			ctx.lineTo(point.x, point.y);
		}
	});
	ctx.stroke();

	if (route.arcPosition) {
		ctx.beginPath();
		ctx.arc(route.arcPosition.x, route.arcPosition.y, 5, 0, 2 * Math.PI);
		ctx.stroke();
	}
}

function drawMain() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	routes.forEach(function (route) {
		traceRoute(route);
		drawRoute(route);
	});
}

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}
