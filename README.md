[![Build Status](https://travis-ci.org/astorije/cantwait.svg?branch=master)](https://travis-ci.org/astorije/cantwait)

# Can't wait!

This is a small web application computing time remaining between events, intended to learn and play with recent features of the JavaScript Web APIs.

## Usage

Simply try the demo at <http://cantwait.astori.fr>, or clone the repository and open the index page in your browser.

Add timed events in the numbered fields. Click on `Compute` and see the magic happen.

For example, [try these values](http://cantwait.astori.fr/?e=1985-10-26T01%3A20&e=2015-10-21T16%3A29). What's wrong, *chicken*?

## Is that useful?

Not really. Something cool was going to happen soon. Every day I was counting how much time was remaining until then as well as the current progress.
I used this as an excuse to play with some of the recent JavaScript APIs for the web and other stuff like:

- History API
- Date manipulation in JavaScript
- [Bootstrap 3](http://getbootstrap.com/)
- Latest CSS Selectors
- Functional programming principles applied in JavaScript
- [JSDoc](http://usejsdoc.org/)
- Testing in JavaScript
  - [Mocha](http://mochajs.org/)
  - [Chai](http://chaijs.com/) and the BDD assertion style
  - Automation of client-side testing with [Travis CI](http://docs.travis-ci.com/) and [PhantomJS](http://phantomjs.org/)

This was also a way to refresh my JavaScript. All of this was done using [Vanilla JS](http://vanilla-js.com/).

## Tests

### In the browser

Open `test/index.html` in your browser (or <http://cantwait.astori.fr/test/>) and look at all these tests gracefully pass.

If they don't, please [report a bug](https://github.com/astorije/cantwait/issues).

### On the command line

Run the following:

```bash
npm install
npm test
```

This is also used for continuous integration.

Caveat: Since a headless WebKit is used for this, tests may pass in the console but fail in your actual browser.

### Update test libraries

It is a good idea to update the test libraries from time to time, since they are not part of the `package.json` file
(automating this part with [Grunt](http://gruntjs.com/) or similar would be overkill...).

To do so, run the following, and then commit the changes:

```bash
npm install mocha chai
cp node_modules/{mocha/mocha.{js,css},chai/chai.js} test/
npm uninstall mocha chai
```

## Documentation

The API documentation can be seen when opening `doc/global.html` in your browser, or at <http://cantwait.astori.fr/doc/global.html>.

### Generate the documentation

To generate the documentation, run the following, and then commit the changes:

```bash
npm install
npm run doc
```

## Compatibility

Because I used the experimental [`ChildNode.remove()`](https://developer.mozilla.org/en-US/docs/Web/API/ChildNode.remove), browser compatibility of *Can't Wait!* is limited.

As far as I know, it looks like this:

- Chrome 23 and up is compatible
- Firefox 23.0 and up is compatible
- Opera 10.0 and up is compatible
- Internet Explorer is not compatible
- Safari is not compatible

Because I do not plan to use Internet Explorer or Safari someday soon and, let's face, nobody else will actually use *Can't Wait!*, I will not try to fix this.
