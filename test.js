var select = require('./xpath.js')
  , dom = require('xmldom').DOMParser
  , assert = require('assert')
 
module.exports = {

  "get simple xpath": function (test) {   
    var xml = "<book><title>Harry Potter</title></book>"
    var doc = new dom().parseFromString(xml)    
    var nodes = select(doc, "//title")
    assert.equal("title", nodes[0].localName)
    assert.equal("Harry Potter", nodes[0].firstChild.data) //first child is the text() node
    assert.equal("<title>Harry Potter</title>", nodes[0].toString())
    test.done()
	},

  "get text node": function (test) {   
    var xml = "<book><title>Harry Potter</title></book>"
    var doc = new dom().parseFromString(xml)    
    var title = select(doc, "//title/text()")[0].data    
    assert.equal("Harry Potter", title)
    test.done()
  },

  "get xpath with namespaces": function (test) {   
    var xml = "<book><title xmlns='myns'>Harry Potter</title></book>"
    var doc = new dom().parseFromString(xml)    
    var nodes = select(doc, "//*[local-name(.)='title' and namespace-uri(.)='myns']")
    assert.equal("title", nodes[0].localName)
    assert.equal("myns", nodes[0].namespaceURI)    
    test.done()
  },

  "get attribute": function (test) {   
    var xml = "<book author='J. K. Rowling'><title>Harry Potter</title></book>"
    var doc = new dom().parseFromString(xml)    
    var author = select(doc, "/book/@author")[0].value
    assert.equal("J. K. Rowling", author) 
    test.done()
  },

  "get prefixed text node": function (test) {   
    var xml = "<book xmlns='default-namespace' xmlns:an='another-namespace'><an:title>Harry Potter</an:title></book>";
    var doc = new dom().parseFromString(xml)    
    var title = select(doc, "//a:title", {"a":"another-namespace"})[0].textContent
    assert.equal("Harry Potter", title) 
    test.done()
  },

  "get prefixed default text node": function (test) {   
    var xml = "<book xmlns='default-namespace'><title>Harry Potter</title></book>";
    var doc = new dom().parseFromString(xml)    
    var title = select(doc, "/d:book/d:title", {"d":"default-namespace"})[0].textContent
    assert.equal("Harry Potter", title) 
    test.done()
  },

  "don't get node without default prefix": function (test) {   
    var xml = "<book xmlns='default-namespace' xmlns:an='another-namespace'><title>Harry Potter</title></book>";
    var doc = new dom().parseFromString(xml)    
    var title = select(doc, "/book/title")
    assert.equal(0, title.length) 
    test.done()
  },
}
