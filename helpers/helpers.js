module.exports.register = function (handlebars, options)  {

// Count the number of roots in the styleguide
  handlebars.registerHelper('countRoots', function(options) {
    var buffer = '',
      sections = options.data.root.styleguide.section('x'),
      l;
      l = sections.length;
      return l;
  });

// Provides a block helper to generate the correct number of rows
// should always be used as {{#eachRow}} or dark and terrible things will happen
  handlebars.registerHelper('eachRow', function(options) {
    var buffer = '',
      sections = options.data.root.styleguide.section('x'),
      l;
      l = sections.length;

    if (l * 2 > 12) {
        for (var i = l*2; i > 0; i -= 12) {
            buffer += options.fn(sections[i]);
        }
    }
    return buffer;
  });

// Return the correct foundation / bootstrap grid number for the number of roots
  handlebars.registerHelper('gridValue', function(options) {
    var buffer = '',
      sections = options.data.root.styleguide.section('x'),
      l;
      l = sections.length;

      var col = Math.floor(12/l);
      col = col < 2 ? 2 : col;
      return col;
  });

};