var path = require('path');
var mkdirp = require('mkdirp');
var walkSync = require('walk-sync');
var mapSeries = require('promise-map-series');
var Writer = require('broccoli-writer');
var helpers = require('broccoli-kitchen-sink-helpers');

var Select = function(tree, fn) {
    this.tree = tree;
    this.fn = fn;
};
Select.prototype = Object.create(Writer.prototype);
Select.prototype.write = function(readTree, dst) {
    var self = this;
    return readTree(self.tree)
    .then(function(src) {
        return mapSeries(walkSync(src), function(p) {
            if (p.slice(-1) !== '/' && self.fn(p)) {
                var i = path.join(src, p);
                var o = path.join(dst, p);
                mkdirp.sync(path.dirname(o));
                helpers.copyPreserveSync(i, o);
            }
        });
    });
};

module.exports = Select;
