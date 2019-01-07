// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/repeat#Polyfill

if (!String.prototype.repeat) {
	String.prototype.repeat = function(count) {
		'use strict';
		if (this == null) {
			throw new TypeError('can\'t convert ' + this + ' to object');
		}
		var str = '' + this;
		count = +count;
		if (count < 0) {
			throw new RangeError('repeat count must be non-negative');
		}
		if (count == Infinity) {
			throw new RangeError('repeat count must be less than infinity');
		}
		count |= 0;
		if (str.length == 0 || count == 0) {
			return '';
		}
		if (str.length * count >= (1 << 28)) {
			throw new RangeError('repeat count must not overflow maximum string size');
		}
		while (count >>= 1) { str += str; }
		str += str.substring(0, str.length * count - str.length);
		return str;
	}
}


var mult = function(str){return ('<i>' + str + '</i>').repeat(7)}
var trns = function(letter){return '<span>' + letter + mult(letter) + '</span>'}
var dancingText = function($element){
	$element.innerHTML = $element.innerText.split('').map(trns).join('')
}

try{
	document.querySelectorAll('[data-dancing-text]').forEach(dancingText)
}catch(e){
	if(console) console.error(e)
}
