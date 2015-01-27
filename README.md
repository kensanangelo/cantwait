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
- Testing in JavaScript
  - [Mocha](http://mochajs.org/)
  - [Chai](http://chaijs.com/)
  - BDD

This was also a way to refresh my JavaScript. All of this was done using [Vanilla JS](http://vanilla-js.com/).

## Tests

Open `test/index.html` in your browser (or <http://cantwait.astori.fr/test/>) and look at all these tests gracefully pass.

If they don't, please [report a bug](https://github.com/astorije/cantwait/issues).
