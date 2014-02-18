/**
 * From VigoJS
 * https://github.com/M6Web/VigoJS
 *
 */
(function() {
    "use strict";

    var Tester = function (casper, utils) {
        var f = utils.format;
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

        this.contains = function contains(values, array) {
            for(var i =0; i < values.length; i++) {
                if (array.indexOf(values[i]) == -1) {
                    return false;
                }
            }

            return true;
        };

        this.IsInstanceOf = function IsInstanceOf(instance) {
            this.assertTrue(this.input instanceof instance, f("%s is instance of %s", this.input, instance.name));
        };

        this.IsNotInstanceOf = function IsNotInstanceOf(instance) {
            this.assertFalse(this.input instanceof instance, f("%s is not instance of %s", this.input, instance.name));
        };

        this.Contains = function Contains(values) {
            this.assertTrue(this.contains(values,this.input) === true, f("%s contains %s values", this.input, values));
        };

        this.NotContains = function NotContains(values) {
            this.assertFalse(this.contains(values,this.input) === true, f("%s doesn't contains %s values", this.input, values));
        };
    };

    exports.create = function (libPath, testerClass, casper, utils) {
        var inheritance = require(libPath + 'Inheritance');

        inheritance.inherits(Tester, testerClass);

        return new Tester(casper, utils);
    };
})();
