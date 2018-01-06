#!/usr/bin/env bash
list-scripts(){
	local jade=$1
	local base=$2
	cat "$jade" | grep "$base" \
		| sed 's/\.js.*/.js/' \
		| tr -d '[:blank:]' \
		| tr -d "'" \
		| sed 's/script(src=//' \
		| sed 's|^/|./public/|'
}

uglify(){
	local jade="${1:-./public/_layout.jade}"
	local base="${2:-/assets/scripts/}"
	local files="$(list-scripts "$jade" "$base")"
	if [ -z "$files" ]; then
		echo 'no files found!'
		exit 1
	fi
	uglifyjs \
	$files \
	--screw-ie8 \
	-c properties,dead_code,drop_debugger,unsafe,unsafe_comps,conditionals,comparisons,evaluate,booleans,loops,unused,if_return,join_vars,negate_iife,pure_getters \
	-m \
	--passes 10
}

uglify "$@"
