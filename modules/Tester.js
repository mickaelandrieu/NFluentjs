/**
 * From VigoJS 
 * https://github.com/M6Web/VigoJS
 *
 */
(function() {
    "use strict";

    var Tester = function (casper, utils) {
        var self = this;
        Tester._super.constructor.call(this, casper);

        this.currentTestFilePath = '';
        this.input = undefined;

        this.assert =
        this.assertTrue = function assert(subject, message, context) {
            context = context || {};
            
            if ((typeof context.success === 'undefined' && subject !== true) || (typeof context.success !== 'undefined' && !context.success)){
                try {
                    this.i.dont.exist += 0; // doesn't exist - that's the point
                } catch(e) {
                    if (e.stackArray.length > 2) {
                        context = utils.mergeObjects({
                            testFilePath: this.currentTestFilePath,
                            failLine: e.stackArray[2].line
                        }, context);
                    }
                }
            }
            
            return Tester._super.assert.call(this, subject, message, context);
        };

        this.That = function That(value) {
            this.input = value;

            return self;
        };

        this.IsInstanceOf = function IsInstanceOf(instance) {
            this.assertTrue(this.input instanceof instance, "Subject has the good Instance");
        };
    };

    exports.create = function (libPath, testerClass, casper, utils) {
        var inheritance = require(libPath + 'Inheritance');

        inheritance.inherits(Tester, testerClass);

        return new Tester(casper, utils);
    };
})();