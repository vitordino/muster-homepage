(function(){
	var color = '#708986'
	var rad = Math.PI / 180;
	var speed = 0.005;

	var $moebius =  document.querySelector('.moebius');
	if(!$moebius) return

	var canvas = $moebius.querySelector('canvas')
	var ctx = canvas.getContext("2d");

	canvas.width = $moebius.offsetWidth
	canvas.height = $moebius.offsetHeight;
	var scl = 1
	var cw, ch, cy, cx, m, r, v, lw
	var points = [], triangles = []
	function setEnv(){
		var _w = $moebius.offsetWidth
		var _h = $moebius.offsetHeight
		var _x = Math.min(_w, _h)
		lw = _h > 400 ? 1.5 : 1
		canvas.width = _w
		canvas.height = _h
		cw = _x
		ch = _x
		cx = _w / 2;
		cy = _h / 2;
		m = { //  mouse initial position
			x: cw / 2.1,
			y: ch / 2.1
		}
		r = Math.min($moebius.offsetHeight, $moebius.offsetWidth) / (1/($moebius.offsetHeight/1000))
		v = -.66 * r;

		points = [];
		triangles = [];

		for (var u = 0; u <= 2 * Math.PI; u += .1) {
			var x = (r + .5 * v * Math.cos(.5 * u)) * Math.cos(u);
			var y = (r + .5 * v * Math.cos(.5 * u)) * Math.sin(u);
			var z = .75 * v * Math.sin(.5 * u);
			var point = new Point(x, y, z);
			points.push(point);

			var _u = u + 2 * Math.PI;
			var _x = (r + .5 * v * Math.cos(.5 * _u)) * Math.cos(_u);
			var _y = (r + .5 * v * Math.cos(.5 * _u)) * Math.sin(_u);
			var _z = .5 * v * Math.sin(.5 * _u);
			var _point = new Point(_x, _y, _z);
			points.push(_point);
		}

		for (var i = 0; i <= points.length - 2; i += 2) {
			var v1 = points[i];
			if (i == points.length - 2) {
				var v3 = points[1+i];
				var v4 = points[i];
			} else {
				var v3 = points[i];
				var v4 = points[i + 1];
			}
			var t = new Triangle(v1, v3, v4);
			triangles.push(t);
		}

		for (var i = 0; i < points.length; i++) {
			points[i].setVanishingPoint(cx, cy);
			points[i].setCenter(0, 0, ch/2);
		}
	}

	function Point(x, y, z) {
		this.x = x * scl;
		this.y = y * scl;
		this.z = z * scl;

		this.fl = 350; // focal length
		// vanishing point
		this.vpX = 0;
		this.vpY = 0;
		this.cX = 0;
		this.cY = 0;
		this.cZ = 0;

		this.setVanishingPoint = function(vpX, vpY) {
			this.vpX = vpX;
			this.vpY = vpY;
		};

		this.setCenter = function(cX, cY, cZ) {
			this.cX = cX;
			this.cY = cY;
			this.cZ = cZ;
		};

		this.rotateX = function(angle) {
			var cos = Math.cos(angle);
			var sin = Math.sin(angle);
			var y1 = this.y * cos - this.z * sin;
			var z1 = this.z * cos + this.y * sin;
			this.y = y1;
			this.z = z1;
		}

		this.rotateY = function(angle) {
			var cos = Math.cos(angle);
			var sin = Math.sin(angle);
			var x1 = this.x * cos - this.z * sin;
			var z1 = this.z * cos + this.x * sin;
			this.x = x1;
			this.z = z1;
		}
		this.rotateZ = function(angle) {
			var cos = Math.cos(angle);
			var sin = Math.sin(angle);
			var x1 = this.x * cos - this.y * sin;
			var y1 = this.y * cos + this.x * sin;
			this.x = x1;
			this.y = y1;
		};

		this.getScreenX = function() {
			var scale = this.fl / (this.fl + this.z + this.cZ);
			return this.vpX + (this.cX + this.x) * scale;
		}

		this.getScreenY = function() {
			var scale = this.fl / (this.fl + this.z + this.cZ);
			return this.vpY + (this.cY + this.y) * scale;
		};

		this.update = function(ax, ay) {
			this.rotateX(ax);
			this.rotateY(ay);
		}
	}

	function Triangle(a, b, c) {
		this.pointA = a;
		this.pointB = b;
		this.pointC = c;

		this.draw = function() {
			ctx.save();
			ctx.lineWidth = lw;
			ctx.strokeStyle = color;
			ctx.beginPath();
			ctx.moveTo(this.pointC.getScreenX(), this.pointC.getScreenY());
			ctx.lineTo(this.pointB.getScreenX(), this.pointB.getScreenY());

			ctx.stroke();

		}

		this.getDepth = function() {
			return Math.min(this.pointA.z, this.pointB.z, this.pointC.z);
		};

	}

	function depth(a, b) {
		return (b.getDepth() - a.getDepth());
	} // for sorting triangles

	function Draw() {
		requestId = window.requestAnimationFrame(Draw);
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		var ax = (m.y - cy) / ch * speed;
		var ay = (m.x - cx) / cw * speed;
		for (var i = 0; i < points.length; i++) {
			points[i].update(ax, ay);
		}
		triangles.sort(depth)
		for (var i = 0; i < triangles.length; i++) {
			triangles[i].draw();
		}
	}
	setEnv()
	requestId = window.requestAnimationFrame(Draw);

	window.addEventListener('mousemove', function(evt) {
		m = oMousePos(canvas, evt);
	}, false);

	function oMousePos(canvas, evt) {
		var rect = canvas.getBoundingClientRect();
		return {
			x: Math.round(evt.clientX - rect.left),
			y: Math.round(evt.clientY - rect.top)
		}
	}

	window.addEventListener('resize', setEnv)
})()
