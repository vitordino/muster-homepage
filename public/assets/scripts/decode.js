window.linkDecode = function($$links){
	var decode = linkDecode.decodeFunction
	if(!$$links) return

	$$links.forEach(function($link){
		var encoded = $link.dataset.encodedLink
		if(!encoded) return

		$link.addEventListener('click', function(event){
			event.preventDefault()
			window.location = decode(encoded)
		})
	})
}

window.linkDecode.decodeFunction = function(str){
	return str
		.split(',')
		.map(function(code){return String.fromCharCode(code)})
		.join('')
}
