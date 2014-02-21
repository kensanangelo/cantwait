var expect = chai.expect;

describe("round()", function() {
  it("should act like Math.round when no second argument or second argument is 0", function() {
    expect(round(3)).to.equal(3);
    expect(round(3.0)).to.equal(3);
    expect(round(2.4)).to.equal(2);
    expect(round(2.5)).to.equal(3);
    expect(round(2.675, 0)).to.equal(3);
  });

  it("should round decimals when second argument is > 0", function() {
    expect(round(1.275, 2)).to.equal(1.28);
    expect(round(2.675, 2)).to.equal(2.68);
    expect(round(1.27499, 2)).to.equal(1.27);
    expect(round(10.8034, 2)).to.equal(10.8);
  });

  it("should round to powers of 10 when second argument is < 0", function() {
    expect(round(12.675, -1)).to.equal(10);
    expect(round(1234.5678, -2)).to.equal(1200);
    expect(round(12675, -4)).to.equal(10000);
  });

  it("should round scientific notations", function() {
    expect(round(1.2345678e+2, 2)).to.equal(123.46);
    expect(round(1.2345678e+2, -2)).to.equal(100);
  });

  it("should round strings", function() {
    expect(round("123.45")).to.be.a('number').and.equal(123);
    expect(round("1.2345678e+2", 2)).to.be.a('number').and.equal(123.46);
  });

  it("should fail on non-numerical strings", function() {
    expect(round("foo")).to.be.NaN;
    expect(round("bar", 2)).to.be.NaN;
  });

  it("should fail on non numbers", function() {
    expect(round({})).to.be.NaN;
  });
});

describe("map()", function() {
  it("should map arrays", function() {
    expect(map([0, 1, 2, 3], function(e) {
      return e*2;
    })).to.deep.equal([0, 2, 4, 6]);
  });

  it("should map NodeLists", function() {
    expect(map(stringToElement("<ul><li>item1</li><li>item2</li></ul>").children, function(element, index) {
      return index + element.innerHTML;
    })).to.deep.equal(["0item1", "1item2"]);
  });

  it("should handle empty arrays", function() {
    expect(map([], function(e) {
      return e;
    })).to.be.empty;
  });

  it("should handle empty NodeLists", function() {
    expect(map(document.createElement('div').children, function(element) {
      return element;
    })).to.be.empty;
  });

  it("should not work if the collection is not an array or a NodeList", function() {
    expect(map({}, function(e) {
      return e;
    })).to.be.empty;
  });
});

describe("forEach()", function() {
  it("should loop through an array", function() {
    var sum = 0;
    forEach([1, 2, 3, 4, 5], function(element) {
      sum += element;
    });
    expect(sum).to.equal(15);
  });

  it("should loop through a NodeList", function() {
    var str = "";
    forEach(stringToElement("<ul><li>item1</li><li>item2</li></ul>").children, function(element) {
      str += element.innerHTML;
    });
    expect(str).to.equal("item1item2");
  });
});

describe("stringToElement()", function() {
  it("should return an HTML element", function() {
    expect(stringToElement("<div>")).to.be.an.instanceof(HTMLDivElement);
  });

  it("should create children", function() {
    expect(stringToElement("<ul><li>item</li><li>item</li></ul>").children).to.have.length(2);
  });

  it("should handle empty strings", function() {
    expect(stringToElement("")).to.be.null;
  });
});

describe("buildList()", function() {
  it("should build a list from an array", function() {
    expect(buildList(["a", "b", "c"])).to.be.an.instanceof(HTMLUListElement)
      .and.to.deep.equal(stringToElement("<ul><li>a</li><li>b</li><li>c</li></ul>"));
  });

  it("should handle empty arrays", function() {
    expect(buildList([])).to.be.an.instanceof(HTMLUListElement)
      .and.to.deep.equal(stringToElement("<ul></ul>"));
  });
});
