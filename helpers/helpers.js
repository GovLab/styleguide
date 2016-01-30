module.exports.register = function (handlebars, options)  {

var row = 0;
var minSize = 2; // minimum column size value we want for our columns

// Count the number of roots in the styleguide
handlebars.registerHelper('countRoots', function(options) {
    var sections = options.data.root.styleguide.section('x'),
    l;
    l = sections.length;
    return l;
});

// Increment the current row we are on
handlebars.registerHelper('incrementRow', function(options) {
    row++;
});

// Provides a block helper to generate the correct number of rows
// should always be used as {{#eachRow}} or dark and terrible things will happen
handlebars.registerHelper('eachRow', function(options) {
    var buffer = '',
    sections = options.data.root.styleguide.section('x'),
    l;

    l = sections.length;

    if (l*minSize > 12) {
        for (var i = l*minSize; i > 0; i -= 12) {
            buffer += options.fn(sections[i]);
        }
    }
    return buffer;
});

// Works like eachRoot, but provides a limit (in bootstrap/foundation columns) of to how many to display
// and offsets based on current row
handlebars.registerHelper('eachRootLimit', function(limit, options) {
    var buffer = '',
    sections = options.data.root.styleguide.section('x'),
    i, l;

    if (!sections) {
        return '';
    }

    // Calculate how many sections we should display on this row
    var offset = row*limit/minSize;
    l = sections.length - offset;
    l = l > limit/minSize ? limit/minSize : l;

    // Add them to buffer to display
    for (i = offset; i < offset+l; i += 1) {
        buffer += options.fn(sections[i].data);
    }

    return buffer;
});

// Return the correct foundation / bootstrap grid number for the number of roots
handlebars.registerHelper('gridValue', function(options) {
    var sections = options.data.root.styleguide.section('x'),
    l;

    l = sections.length;

    var col = Math.floor(12/l);
    col = col < minSize ? minSize : col;
    return col;
});

};