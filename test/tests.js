var expect = chai.expect;

describe("Collection helpers", function () {
  describe("forEach()", function() {
    it("should loop through an array", function () {
      var sum = 0;
      forEach([1, 2, 3, 4, 5], function (element) {
        sum += element;
      });
      expect(sum).to.equal(15);
    });

    it("should loop through a NodeList", function () {
      var str = "";
      forEach(stringToElement("<ul><li>item1</li><li>item2</li></ul>").children, function (element) {
        str += element.innerHTML;
      });
      expect(str).to.equal("item1item2");
    });
  });

  describe("map()", function () {
    it("should map arrays", function () {
      expect(map([0, 1, 2, 3], function (e) {
        return e*2;
      })).to.deep.equal([0, 2, 4, 6]);
    });

    it("should map NodeLists", function () {
      expect(map(stringToElement("<ul><li>item1</li><li>item2</li></ul>").children, function (element, index) {
        return index + element.innerHTML;
      })).to.deep.equal(["0item1", "1item2"]);
    });

    it("should handle empty arrays", function () {
      expect(map([], function (e) {
        return e;
      })).to.be.empty;
    });

    it("should handle empty NodeLists", function () {
      expect(map(document.createElement('div').children, function (element) {
        return element;
      })).to.be.empty;
    });

    it("should not work if the collection is not an array or a NodeList", function () {
      expect(map({}, function (e) {
        return e;
      })).to.be.empty;
    });
  });
});

describe("Math helpers", function () {
  describe("round()", function () {
    it("should act like Math.round when no second argument or second argument is 0", function() {
      expect(round(3)).to.equal(3);
      expect(round(3.0)).to.equal(3);
      expect(round(2.4)).to.equal(2);
      expect(round(2.5)).to.equal(3);
      expect(round(2.675, 0)).to.equal(3);
    });

    it("should round decimals when second argument is > 0", function () {
      expect(round(1.275, 2)).to.equal(1.28);
      expect(round(2.675, 2)).to.equal(2.68);
      expect(round(1.27499, 2)).to.equal(1.27);
      expect(round(10.8034, 2)).to.equal(10.8);
    });

    it("should round to powers of 10 when second argument is < 0", function () {
      expect(round(12.675, -1)).to.equal(10);
      expect(round(1234.5678, -2)).to.equal(1200);
      expect(round(12675, -4)).to.equal(10000);
    });

    it("should round scientific notations", function () {
      expect(round(1.2345678e+2, 2)).to.equal(123.46);
      expect(round(1.2345678e+2, -2)).to.equal(100);
    });

    it("should round strings", function () {
      expect(round("123.45")).to.be.a('number').and.equal(123);
      expect(round("1.2345678e+2", 2)).to.be.a('number').and.equal(123.46);
    });

    it("should fail on non-numerical strings", function () {
      expect(round("foo")).to.be.NaN;
      expect(round("bar", 2)).to.be.NaN;
    });

    it("should fail on non numbers", function () {
      expect(round({})).to.be.NaN;
    });
  });
});

describe("String helpers", function () {
  describe("generateRandomString()", function () {
    it("should be a string", function () {
      expect(generateRandomString()).to.be.a('string');
    });

    it("should be 8-char long every time", function () {
      for(var i = 0; i < 10; ++i)
        expect(generateRandomString()).to.have.length(8);
    });
  });
});

describe("DOM helpers", function () {
  describe("show()", function () {
    it("should remove the 'hidden' class of a single element", function () {
      var div = stringToElement("<div class=hidden>");
      show(div);
      expect(div.className).to.not.contain("hidden");
    });

    it("should remove the 'hidden' class of each element of a collection", function () {
      var lis = stringToElement("<ul><li class=hidden>item1</li><li class=hidden>item2</li></ul>").children;
      show(lis);
      forEach(lis, function (element) {
        expect(element.className).to.not.contain("hidden");
      });
    });
  });

  describe("hide()", function () {
    it("should add the 'hidden' class to a single element", function () {
      var div = stringToElement("<div>");
      hide(div);
      expect(div.className).to.contain("hidden");
    });

    it("should add the 'hidden' class to each element of a collection", function () {
      var lis = stringToElement("<ul><li>item1</li><li>item2</li></ul>").children;
      hide(lis);
      forEach(lis, function (element) {
        expect(element.className).to.contain("hidden");
      });
    });
  });

  describe("removeAllChildren()", function () {
    it("should empty a list", function () {
      var list = stringToElement("<ul><li>item1</li><li>item2</li></ul>");
      removeAllChildren(list);
      expect(list.children.length).to.equal(0);
    });

    it("should do nothing to a leaf element", function () {
      var div = stringToElement("<div>");
      removeAllChildren(div);
      expect(div.children.length).to.equal(0);
    });
  });

  describe("stringToElement()", function () {
    it("should return an HTML element", function () {
      expect(stringToElement("<div>")).to.be.an("object");
      expect(stringToElement("<div>")).to.be.an.instanceof(HTMLElement);
    });

    it("should create children", function () {
      expect(stringToElement("<ul><li>item</li><li>item</li></ul>").children).to.have.length(2);
    });

    it("should handle empty strings", function() {
      expect(stringToElement("")).to.be.null;
    });
  });

  describe("buildList()", function () {
    it("should build a list from an array", function () {
      expect(buildList(["a", "b", "c"])).to.be.an("object");
      expect(buildList(["a", "b", "c"])).to.be.an.instanceof(HTMLUListElement)
        .and.to.deep.equal(stringToElement("<ul><li>a</li><li>b</li><li>c</li></ul>"));
    });

    it("should handle empty arrays", function () {
      expect(buildList([])).to.be.an("object");
      expect(buildList([])).to.be.an.instanceof(HTMLUListElement)
        .and.to.deep.equal(stringToElement("<ul></ul>"));
    });
  });
});

describe("Templating system", function () {
  describe("getTemplate()", function () {
    before(function () {
      templates.dummytemplate = "Dummy template";
    });

    after(function () {
      delete templates.dummytemplate;
    });

    it("should return a string", function () {
      expect(getTemplate("dummytemplate")).to.be.a('string');
    });

    it("should return a template from the DOM", function () {
      expect(getTemplate("dummytemplate")).to.equal("Dummy template");
    });

    it("should handle inexisting template", function () {
      expect(getTemplate("unknowntemplate")).to.be.undefined;
    });

    it("should handle missing argument", function () {
      expect(getTemplate()).to.be.undefined;
    });
  });

  describe("render()", function () {
    it("should substitute variables", function () {
      expect(render("test {{foo}} test", {"foo": "bar"})).to.equal("test bar test");
      expect(render("{{foo1}} {{foo2}}", {"foo1": "bar1", "foo2": "bar2"})).to.equal("bar1 bar2");
    });

    it("should not substitute unknon variables", function () {
      expect(render("test {{foo}} test", {})).to.equal("test {{foo}} test");
    });

    it("should not substitute variables not in the template", function () {
      expect(render("test", {"foo": "bar"})).to.equal("test");
    });
  });
});

describe("Cantwait functions", function () {
  describe("prettyPrintDelta()", function () {
    it("should handle seconds", function () {
      expect(prettyPrintDelta(30)).to.equal("30 seconds");
      expect(prettyPrintDelta(1)).to.equal("1 second");
      expect(prettyPrintDelta(0)).to.equal("0 seconds");
    });

    it("should handle minutes", function () {
      expect(prettyPrintDelta(180)).to.equal("3 minutes and 0 seconds");
      expect(prettyPrintDelta(90)).to.equal("1 minute and 30 seconds");
    });

    it("should handle hours", function () {
      expect(prettyPrintDelta(3600 * 3)).to.equal("3 hours, 0 minutes and 0 seconds");
      expect(prettyPrintDelta(3600 + 1800)).to.equal("1 hour, 30 minutes and 0 seconds");
    });

    it("should handle days", function () {
      expect(prettyPrintDelta(3600 * 50)).to.equal("2 days, 2 hours, 0 minutes and 0 seconds");
      expect(prettyPrintDelta(3600 * 24)).to.equal("1 day, 0 hours, 0 minutes and 0 seconds");
    });

    it("should handle weeks", function () {
      expect(prettyPrintDelta(3600 * 24 * 15)).to.equal("2 weeks, 1 day, 0 hours, 0 minutes and 0 seconds");
      expect(prettyPrintDelta(3600 * 24 *  7)).to.equal("1 week, 0 days, 0 hours, 0 minutes and 0 seconds");
    });
  });

  describe("newEventInput()", function () {
    it("should return a div element", function () {
      expect(newEventInput("", 0, true)).to.be.an('object');
      expect(newEventInput("", 0, true)).to.be.an.instanceof(HTMLDivElement);
    });

    it("should show the close button when third argument is true", function () {
      var div = newEventInput("", 0, true);
      expect(div.querySelector(".close").className).to.not.contain("hidden");
    });

    it("should hide the close button when third argument is false", function () {
      var div = newEventInput("", 0, false);
      expect(div.querySelector(".close").className).to.contain("hidden");
    });

    it("should fill the input element", function () {
      var div = newEventInput("1988-10-08", 0, true);
      expect(div.querySelector("input").value).to.equal("1988-10-08");
    });

    it("should fill the label element", function () {
      var div = newEventInput("", 42, true);
      expect(div.querySelector("label").textContent).to.equal("42");
    });
  });


  describe("createEventInputs()", function () {
    it("should return 2 empty elements when 0 dates are given in argument", function () {
      var inputs = createEventInputs([]);
      expect(inputs).to.be.an("array").and.to.have.length(2);
      expect(inputs[0]).to.be.an.instanceof(HTMLElement);
      expect(inputs[1]).to.be.an.instanceof(HTMLElement);
      expect(inputs[0].querySelector("label").textContent).to.equal("1");
      expect(inputs[1].querySelector("label").textContent).to.equal("2");
      expect(inputs[0].querySelector("input").value).to.be.empty;
      expect(inputs[1].querySelector("input").value).to.be.empty;
      expect(inputs[0].querySelector(".close").className).to.contain("hidden");
      expect(inputs[1].querySelector(".close").className).to.contain("hidden");
    });

    it("should return 2 empty elements when 1 date is given in argument", function () {
      var inputs = createEventInputs(["1988-10-08"]);
      expect(inputs).to.be.an("array").and.to.have.length(2);
      expect(inputs[0]).to.be.an.instanceof(HTMLElement);
      expect(inputs[1]).to.be.an.instanceof(HTMLElement);
      expect(inputs[0].querySelector("label").textContent).to.equal("1");
      expect(inputs[1].querySelector("label").textContent).to.equal("2");
      expect(inputs[0].querySelector("input").value).to.be.empty;
      expect(inputs[1].querySelector("input").value).to.be.empty;
      expect(inputs[0].querySelector(".close").className).to.contain("hidden");
      expect(inputs[1].querySelector(".close").className).to.contain("hidden");
    });

    it("should return 2 filled elements when 2 dates are given in argument", function () {
      var inputs = createEventInputs(["1988-10-08", "2014-02-24"]);
      expect(inputs).to.be.an("array").and.to.have.length(2);
      expect(inputs[0]).to.be.an.instanceof(HTMLElement);
      expect(inputs[1]).to.be.an.instanceof(HTMLElement);
      expect(inputs[0].querySelector("label").textContent).to.equal("1");
      expect(inputs[1].querySelector("label").textContent).to.equal("2");
      expect(inputs[0].querySelector("input").value).to.equal("1988-10-08");
      expect(inputs[1].querySelector("input").value).to.equal("2014-02-24");
      expect(inputs[0].querySelector(".close").className).to.contain("hidden");
      expect(inputs[1].querySelector(".close").className).to.contain("hidden");
    });

    it("should return 2 filled elements with delete buttons displayed when 3 dates are given in argument", function () {
      var inputs = createEventInputs(["1988-10-08", "2014-02-24", "2015-01-01"]);
      expect(inputs).to.be.an("array").and.to.have.length(3);
      expect(inputs[0]).to.be.an.instanceof(HTMLElement);
      expect(inputs[1]).to.be.an.instanceof(HTMLElement);
      expect(inputs[2]).to.be.an.instanceof(HTMLElement);
      expect(inputs[0].querySelector("label").textContent).to.equal("1");
      expect(inputs[1].querySelector("label").textContent).to.equal("2");
      expect(inputs[2].querySelector("label").textContent).to.equal("3");
      expect(inputs[0].querySelector("input").value).to.equal("1988-10-08");
      expect(inputs[1].querySelector("input").value).to.equal("2014-02-24");
      expect(inputs[2].querySelector("input").value).to.equal("2015-01-01");
      expect(inputs[0].querySelector(".close").className).to.not.contain("hidden");
      expect(inputs[1].querySelector(".close").className).to.not.contain("hidden");
      expect(inputs[2].querySelector(".close").className).to.not.contain("hidden");
    });
  });

  describe("updateProgressBar()", function () {
    var progress = stringToElement('<div class="progress"><div class="progress-bar"></div><div class="value"></div></div>');

    it("should have a half bar active", function () {
      updateProgressBar(progress, 0.5);

      expect(progress.querySelector(".progress-bar").style.width).to.equal("50%");
      expect(progress.querySelector(".progress-bar").getAttribute("aria-valuenow")).to.equal("50");
      expect(progress.querySelector(".value").textContent).to.equal("50%");
      expect(progress.className).to.contain("active");
    });

    it("should have a 0% bar inactive", function () {
      updateProgressBar(progress, 0);

      expect(progress.querySelector(".progress-bar").style.width).to.equal("0%");
      expect(progress.querySelector(".progress-bar").getAttribute("aria-valuenow")).to.equal("0");
      expect(progress.querySelector(".value").textContent).to.equal("0%");
      expect(progress.className).to.not.contain("active");
    });

    it("should have a 100% bar inactive", function () {
      updateProgressBar(progress, 1);

      expect(progress.querySelector(".progress-bar").style.width).to.equal("100%");
      expect(progress.querySelector(".progress-bar").getAttribute("aria-valuenow")).to.equal("100");
      expect(progress.querySelector(".value").textContent).to.equal("100%");
      expect(progress.className).to.not.contain("active");
    });

    it("should not go under 0%", function () {
      updateProgressBar(progress, -1);

      expect(progress.querySelector(".progress-bar").style.width).to.equal("0%");
      expect(progress.querySelector(".progress-bar").getAttribute("aria-valuenow")).to.equal("0");
      expect(progress.querySelector(".value").textContent).to.equal("0%");
      expect(progress.className).to.not.contain("active");
    });

    it("should not go above 100%", function () {
      updateProgressBar(progress, 2);

      expect(progress.querySelector(".progress-bar").style.width).to.equal("100%");
      expect(progress.querySelector(".progress-bar").getAttribute("aria-valuenow")).to.equal("100");
      expect(progress.querySelector(".value").textContent).to.equal("100%");
      expect(progress.className).to.not.contain("active");
    });
  });

  describe("buildTimerList()", function () {
    it("should compute a date between 2 dates", function () {
      var list = buildTimerList([new Date("2013"), new Date("2015")], new Date("2014"));
      expect(list.children).to.have.length(2);
      expect(list.textContent).to.contain("1 happened 52 weeks, 1 day, 0 hours, 0 minutes and 0 seconds ago.");
      expect(list.textContent).to.contain("2 will happen in 52 weeks, 1 day, 0 hours, 0 minutes and 0 seconds.");
    });

    it("should handle events happening now", function () {
      var list = buildTimerList([new Date()], new Date());
      expect(list.children).to.have.length(1);
      expect(list.textContent).to.equal("1 happened 0 seconds ago.");
    });
  });
});
