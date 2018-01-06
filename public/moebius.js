function getPixelRatio(context) {
	var backingStore = context.backingStorePixelRatio ||
		context.webkitBackingStorePixelRatio ||
		context.mozBackingStorePixelRatio ||
		context.msBackingStorePixelRatio ||
		context.oBackingStorePixelRatio
	return (window.devicePixelRatio || 1) / (backingStore || 1)
}

(function(){
	var color = '#708986'
	var speed = 0.005
	var $hero = document.querySelector('.Hero')
	var $moebius = document.querySelector('.moebius')
	if(!$moebius) return

	var $canvas = $moebius.querySelector('canvas')
	var ctx = $canvas.getContext('2d')
	var ratio = getPixelRatio(ctx)
	var isRetina = ratio !== 1

	function setup(){
		$moebius.style.width = $hero.offsetWidth * ratio + 'px'
		$moebius.style.height = $hero.offsetHeight * ratio + 'px'
		$canvas.width = $hero.offsetWidth
		$canvas.height = $hero.offsetHeight
		if(isRetina){
			var scale = 1 / ratio
			$moebius.style.transform = 'scale(' + scale + ')'
			$moebius.style.transformOrigin = 'top left'
		}
		setEnv()
	}

	var cw, ch, cy, cx, m, r, v, lw
	var points = [], triangles = []
	function setEnv(){
		$moebius.style.width = $hero.offsetWidth * ratio + 'px'
		$moebius.style.height = $hero.offsetHeight * ratio + 'px'
		var _w = $moebius.offsetWidth
		var _h = $moebius.offsetHeight
		var _x = Math.min(_w, _h)
		lw = _h > 400 ? 1.5 : 1
		lw *= isRetina * 1.5
		$canvas.width = _w
		$canvas.height = _h
		cw = _x
		ch = _x
		cx = _w / 2
		cy = _h / 2
		m = m || {x: 400, y: 800}
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
			var point = new Point(x, y, z, ratio)
			points.push(point)

			var _u = u + 2 * Math.PI
			var _x = (r + .5 * v * Math.cos(.5 * _u)) * Math.cos(_u)
			var _y = (r + .5 * v * Math.cos(.5 * _u)) * Math.sin(_u)
			var _z = .5 * v * Math.sin(.5 * _u)
			var _point = new Point(_x, _y, _z, ratio)
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
		var rect = $hero.getBoundingClientRect()
		m = {
			x: Math.round((evt.clientX - rect.left) * ratio),
			y: Math.round((evt.clientY - rect.top) * ratio),
		}
	}

	setup()
	requestId = window.requestAnimationFrame(Draw)
	$hero.addEventListener('mousemove', handleMouseMove, false)
	window.addEventListener('resize', setEnv, false)
})()
