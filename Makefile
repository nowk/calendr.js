
browserify:
	browserify -r ./index.js > bundle.js

build: browserify
	uglifyjs -o calendrjs.min.js bundle.js

test:
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--recursive \
		--reporter spec \
		--bail

.PHONY: test
