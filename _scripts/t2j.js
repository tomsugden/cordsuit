// t2j
// ===
// A script to convert pages exported from a Tavi wiki into Jekyll pages
// run rm -r output/* first!

var fs = require("fs")

// Conversion Functions
// --------------------

var convert = function(infile, outpath, convertors, category) {

  var pages = JSON.parse(fs.readFileSync(infile))

  pages.forEach(function(page){

    var filename = toFilename(page.title)
      , body = page.body

    convertors.forEach(function(c){
      body = c(body)
    })

    var content = 
      "---\n"
    + "title: \"" + page.title.replace(/"/g, "\\\"").replace(/&/g, "&amp;").trim() + "\"\n"
    + "category: " + category + "\n"
    + "layout: article\n"
    + "---\n\n" 
    + body
    + "\n"

    fs.writeFileSync(outpath + filename + ".md", content)
  })
}

// Convertors
// ----------

// toFilename - makes a clean filename from a page title
var toFilename = function(pageTitle) {

  return pageTitle.toLowerCase()
    .replace(/[#'",:\-\.\!\/]/g, '')
    .replace(/&/g, "and")
    .replace(/°/g, 'o')
    .replace(/\ \ /g, ' ')
    .replace(/\ /g, '-')
}

// convertTitles - changes Tavi formatted titles into Markdown titles
var convertTitles = function(body) {
  // == Hello == -> ## Hello
  return (body
    .replace(
      /==[^=]+==/g,
      function(c){ return "\n\n## " + c.substr(2, c.length - 4).trim() + "\n\n" }
    )
    .replace(
      /=[^=]+=/g
    , function(c){ return "\n\n# " + c.substr(1, c.length - 2).trim() + "\n\n" }
    )
  )
}

var convertNewLines = function(body) {
  return body.replace(/\\/g, "  \n")
}

// removeExcessWhitespace - removes excess whitespace that appears in some pages
var removeExcessWhitespace = function(body) {
  // "     " -> " ", "    " -> " "
  return body.replace(/\ \ \ \ \ /g, " ")
    .replace(/\ \ \ \ /g, " ")  
}

// emphasizeQuestions - finds interview questions and converts to markdown emphasis
var emphasizeQuestions = function(body) {

  //  '''''Hello''''' -> \n\n_Hello_\n\n
  //  '''Hello''' -> \n\n_Hello_\n\n
  //  ''Hello'' -> \n\n_Hello_\n\n
  // ...''Hello'' -> \n\n_Hello_\n\n
  return (body
    .replace(/\ '''''/g, "\n\n_") 
    .replace(
      /'''''[a-zA-Z\.\,]/g, 
      function(c){ return "_\n\n" + c.split("").pop() }
    )
    .replace(/\ '''/g, "\n\n_")
    .replace(
      /'''[a-zA-Z\ ]/g, 
      function(c){ return "_\n\n" + c.split("").pop() }
    )
    .replace(/\ ''/g, "\n\n_")
    .replace(/\.\.\.''/g, "\n\n_")
    .replace(
      /''[a-zA-Z\ ]/g, 
      function(c){ return "_\n\n" + c.split("").pop() }
    )
  )
}

var fixQuotes = function(body) {
  return (body
    .replace(/''+/g, "\"")
    .replace(/[\.\?\!]"/g, function(c){ return c.split("").join(" ") }))
}

var separateMergedParagraphs = function(body) {

  // endStart -> end\n\nStart, McCarthy -> McCarthy
  // .3 -> .\n\n3
  return (body
    .replace(
      /\.[A-Z][a-z\ ]/g
    , function(c){ return ".\n\n" + c.substring(1) }
    )
    .replace(
      /\ [A-Z]*[a-bd-z]+[A-Z]/g, 
      function(c){ return c.substring(0, c.length - 1) + "\n\n" + c.substring(c.length-1) } //c.split("").join("\n\n") }
    )
    .replace(
      /\.[0-9]+/g, 
      function(c){ 
        var chars = c.split("")
        return chars.shift() + "\n\n" + chars.join("") 
      }
    )
  )
}

var breakBeforeSpeaker = function(body) {
  // Name: -> \n\nName:
  // .D: -> .\n\nD:
  return (body
    .replace(/:DB:/g, "DB:")
    .replace(
      /:?[A-Z][a-zA-Z]+:/g, 
      function(c){ return "\n\n" + c }
    )
    .replace(
      /[\.\?0-9][A-Z]:/g, 
      function(c){ 
        var chars = c.split("")
        return chars.shift() + "\n\n" + chars.join("") 
      }
    )
    .replace(/:Q:/g, "\n\nQ:")
  )
}

var markupImages = function(body) {
  return body.replace(
    /http[^\ ]+\.(jpg|png)/g, 
    function(c){ return "![" + c + "]" }
  )
}

var removeCopyright = function(body) { 
  return (body
    .replace("© D.C.Berman, Civil Jar Music/BMI", "")
    .replace("© D.C.Berman, Civil Jar Music", "")
  )
}

var convertSongLinks = function (body) {
  return body.replace(
    /#\(\([^\(]*\)\)/g
  , function(c) { 
      var n = c.substring(3, c.length-2)
      return "- [" + n + "](../songs/" + toFilename(n) + ".html)\n"
    }
  )
}

var breakTabLines = function(body) {
  return body.replace(/[EADGBe]\|-/g, function(c){ return "\n" + c })
}

var replaceSquareBrackets = function(body) {
  return (body
    .replace(/\[/g, "(")
    .replace(/\]/g, ")")
  )
}

var removeBackticks = function(body) {
  return body.replace(/`/g, "'")
}

var removeLongDashes = function(body) {
  return body.replace(/---/g, "-")
}

var removeKillerColons = function(body) {
  return body.replace(/:\ :/g, ": \n")
}

// Perform Conversions
// -------------------
var defaultConvertors = [ 
  removeCopyright
, removeBackticks
, removeLongDashes
, removeKillerColons
, replaceSquareBrackets
, convertTitles
, convertNewLines
, fixQuotes
, removeExcessWhitespace
, separateMergedParagraphs
, convertSongLinks
, breakTabLines
]

var categories = [
  "articles"
, "bibliography"
, "biography"
, "discography"
, "gigs"
, "misc"
, "news"
, "poems"
, "reviews"
, "songs"
, "tablature"
]

categories.forEach(function(name){
  fs.mkdirSync("output/" + name)
  convert(
    "../data/" + name + ".json"
  , "output/" + name + "/"
  , ( name === "articles" 
    ? defaultConvertors.concat([breakBeforeSpeaker])
    : defaultConvertors
    )
  , name
  )
})