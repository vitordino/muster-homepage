(function(){
	var color = '#708986'
	var speed = 0.005

	var $moebius =  document.querySelector('.moebius')
	if(!$moebius) return

	var $canvas = $moebius.querySelector('canvas')
	var ctx = $canvas.getContext('2d')

	$canvas.width = $moebius.offsetWidth
	$canvas.height = $moebius.offsetHeight
	var cw, ch, cy, cx, m, r, v, lw
	var points = [], triangles = []
	function setEnv(){
		var _w = $moebius.offsetWidth
		var _h = $moebius.offsetHeight
		var _x = Math.min(_w, _h)
		lw = _h > 400 ? 1.5 : 1
		$canvas.width = _w
		$canvas.height = _h
		cw = _x
		ch = _x
		cx = _w / 2
		cy = _h / 2
		m = m || {x: cw / 2.1, y: ch / 2.1}
		r = Math.min(_w, _h) / (1/(_h/1000))
		v = -.66 * r

		points = []
		triangles = []

		ctx.lineWidth = lw
		ctx.strokeStyle = color

		for(var u = 0; u <= 2 * Math.PI; u += .1){
			var x = (r + .5 * v * Math.cos(.5 * u)) * Math.cos(u)
			var y = (r + .5 * v * Math.cos(.5 * u)) * Math.sin(u)
			var z = .75 * v * Math.sin(.5 * u)
			var point = new Point(x, y, z)
			points.push(point)

			var _u = u + 2 * Math.PI
			var _x = (r + .5 * v * Math.cos(.5 * _u)) * Math.cos(_u)
			var _y = (r + .5 * v * Math.cos(.5 * _u)) * Math.sin(_u)
			var _z = .5 * v * Math.sin(.5 * _u)
			var _point = new Point(_x, _y, _z)
			points.push(_point)
		}

		for(var i = 0; i <= points.length - 2; i += 2){
			var v1 = points[i]
			if(i == points.length - 2){
				var v3 = points[1+i]
				var v4 = points[i]
			}else{
				var v3 = points[i]
				var v4 = points[i + 1]
			}
			var t = new Triangle(v1, v3, v4)
			triangles.push(t)
		}

		points.forEach(function(point){
			point.setVanishingPoint(cx, cy)
			point.setCenter(0, 0, ch/2)
		})
	}

	function Draw(){
		requestId = window.requestAnimationFrame(Draw)
		ctx.clearRect(0, 0, $canvas.width, $canvas.height)
		var ax = (m.y - cy) / ch * speed
		var ay = (m.x - cx) / cw * speed
		points.forEach(function(point){
			point.update(ax, ay)
		})
		triangles.forEach(function(triangle){
			triangle.draw(ctx)
		})
	}

	function handleMouseMove(evt){
		var rect = $canvas.getBoundingClientRect()
		m = {
			x: Math.round(evt.clientX - rect.left),
			y: Math.round(evt.clientY - rect.top),
		}
	}

	setEnv()
	requestId = window.requestAnimationFrame(Draw)
	$canvas.addEventListener('mousemove', handleMouseMove, false)
	window.addEventListener('resize', setEnv, false)
})()
