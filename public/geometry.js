(function(namespace){
	function Point(x, y, z, _ratio){
		var ratio = _ratio || 1

		this.x = x / ratio
		this.y = y / ratio
		this.z = z / ratio

		// focal length
		this.fl = 350 * ratio;

		// vanishing point
		this.vpX = 0
		this.vpY = 0
		this.cX = 0
		this.cY = 0
		this.cZ = 0
	}

	Point.prototype.setVanishingPoint = function(vpX, vpY){
		this.vpX = vpX
		this.vpY = vpY
	}

	Point.prototype.setCenter = function(cX, cY, cZ){
		this.cX = cX
		this.cY = cY
		this.cZ = cZ
	}

	Point.prototype.rotateX = function(angle){
		var cos = Math.cos(angle)
		var sin = Math.sin(angle)
		var y1 = this.y * cos - this.z * sin
		var z1 = this.z * cos + this.y * sin
		this.y = y1
		this.z = z1
	}

	Point.prototype.rotateY = function(angle){
		var cos = Math.cos(angle)
		var sin = Math.sin(angle)
		var x1 = this.x * cos - this.z * sin
		var z1 = this.z * cos + this.x * sin
		this.x = x1
		this.z = z1
	}
	Point.prototype.rotateZ = function(angle){
		var cos = Math.cos(angle)
		var sin = Math.sin(angle)
		var x1 = this.x * cos - this.y * sin
		var y1 = this.y * cos + this.x * sin
		this.x = x1
		this.y = y1
	}

	Point.prototype.getScreenX = function(){
		var scale = this.fl / (this.fl + this.z + this.cZ)
		return this.vpX + (this.cX + this.x) * scale
	}

	Point.prototype.getScreenY = function(){
		var scale = this.fl / (this.fl + this.z + this.cZ)
		return this.vpY + (this.cY + this.y) * scale
	}

	Point.prototype.update = function(ax, ay){
		this.rotateX(ax)
		this.rotateY(ay)
	}
	function Triangle(a, b, c){
		this.pointA = a
		this.pointB = b
		this.pointC = c
	}

	Triangle.prototype.draw = function(canvas){
		canvas.beginPath()
		canvas.moveTo(this.pointC.getScreenX(), this.pointC.getScreenY())
		canvas.lineTo(this.pointB.getScreenX(), this.pointB.getScreenY())
		canvas.stroke()
	}

	namespace = namespace || {}
	namespace.Point = Point
	namespace.Triangle = Triangle
})(window)
