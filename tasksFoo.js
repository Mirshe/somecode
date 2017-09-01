'use strict'

const $ = require("gulp");
const s = require("gulp-sass");
const el = require("gulp-eslint");
const babel = require('gulp-babel');
const deb = require("gulp-debug");
const som = require("gulp-sourcemaps");
const g = require('gulp-git');

module.exports = {
	build: function (src, dest) {
		return function () {
			return $.src(src)
			.pipe($.dest(dest));
		}
	},
	sass: function (src, dest) {
		return function () {
			return $.src(src)
			.pipe(som.init())
			.pipe(s.sync().on('error', s.logError))
			.pipe(som.write())
			.pipe($.dest(dest));
		}
	},
	lint: function (src, dest) {
		return function () {
			return $.src(src)
			.pipe(babel({
					presets: ['env']
				}))
			/*.pipe(el({
			"env": {
			"browser": true,
			"node": true,
			"es6": true
			},
			"rules": {
			"strict": 0
			}
			}))
			.pipe(el.format())
			.pipe(el.failAfterError());*/
			.pipe(deb())
			.pipe($.dest(dest));
		}
	},
	init: function () {
		return function () {
			return g.init(function (err) {
				if (err)
					throw err;
			});
		}
	},
	add: function (src) {
		return function () {
			return $.src(src)
			.pipe(g.add());
		}
	},
	commit: function (src) {
		return function () {
			return $.src(src)
			.pipe(g.commit(undefined, {
					args: '-m "' + Date.now() + '"',
					disableMessageRequirement: true
				}));
		}
	},
	addremote: function (url) {
		return function () {
			g.addRemote('origin', url, function (err) {
				if (err)
					throw err;
			});
			return new Promise(function (res) {
				res();
			});
		}
	},
	push: function () {
		return function () {
			return new Promise(function (res, rej) {
				g.push('origin', 'master', function (err) {
					if (err){
					rej();
					throw err;
					};
					res();
				});
				
			});
		}
	}
}