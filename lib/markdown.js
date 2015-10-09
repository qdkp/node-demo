var fs = require('fs');
var path = require('path');
var marked = require('marked');
var debug = require('debug')('demo:markdown');
var highlight = require('highlight.js');
var render = new marked.Renderer();

module.exports = Markdown;

render.heading = function(text, level, raw) {
  return '<h'
    + level
    + ' id="'
    + this.options.headerPrefix
    + raw.toLowerCase().replace(/[^\w]+/g, '-')
    + '" class="ui eader">'
    + text
    + '</h'
    + level
    + '>\n';
};

render.list = function(body, ordered) {
  var type = ordered ? 'ol' : 'ul';
  return '<' + type + ' class="ui list">\n' + body + '</' + type + '>\n';
};

render.listitem = function(text) {
  return '<li class="item">' + text + '</li>\n';
};

// TODO 区块引用的样式设定
render.blockquote = function(quote) {
  return '<blockquote class="ui segment">' + quote + '</blockquote>';
};

render.hr = function() {
  return this.options.xhtml ? '<hr class="ui divider"/>\n' : '<hr class="ui divider">\n';
};

render.image = function(href, title, text) {
  var out = '<img class="ui centered image" src="' + href + '" alt="' + text + '"';
  if (title) {
    out += ' title="' + title + '"';
  }
  out += this.options.xhtml ? '/>' : '>';
  return out;
};

render.table = function(header, body) {
  return '<table class="ui celled table">\n'
    + '<thead>\n'
    + header
    + '</thead>\n'
    + '<tbody>\n'
    + body
    + '</tbody>\n'
    + '</table>\n';
};

marked.setOptions({
  renderer: render,
  highlight: function(code) {
    console.log(code);
    return highlight.highlightAuto(code).value;
  },
  gfm: true,
  breaks: false,
  smartLists: true
});

function Markdown(name, options) {
  var opts = options || {};

  this.defaultExt = opts.defaultExt;
  this.ext = path.extname(name);
  this.name = name;
  this.root = opts.root;

  if (!this.ext && !this.defaultExt) {
    throw new Error("No default ext find for the file %s", name);
  }

  var fileName = this.name;

  if (!this.ext) {
    this.ext = this.defaultExt[0] !== '.'
      ? '.' + this.defaultExt
      : this.defaultExt;

    fileName += this.ext;
  }

  this.path = this.lookup(fileName);
}

Markdown.prototype.lookup = function(name) {
  var loc = path.resolve(this.root, name);
  var dir = path.dirname(loc);
  var file = path.basename(loc);

  return this.resolve(dir, file);
}

Markdown.prototype.resolve = function(dir, file) {
  var filePath = path.join(dir, file);
  var stat = tryStat(filePath);

  if (stat && stat.isFile()) {
    return filePath;
  }
}

Markdown.prototype.render = function() {
  var html;

  if (this.path) {
    var buf = fs.readFileSync(this.path);
    html = marked(buf.toString('utf-8'));
  }

  return html;
}

function tryStat(path) {
  debug("stat %s", path);

  try {
    return fs.statSync(path);
  } catch (e) {
    return undefined;
  }
}
