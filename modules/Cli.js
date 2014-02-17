/**
 * From VigoJS 
 * https://github.com/M6Web/VigoJS
 *
 */
(function() {
    "use strict";

    var Cli = function (configDefinitionPath, casper, utils) {
        
        var cliPath = casper.cli.get('cmdDir');

        this.path = undefined;

        this.getPath = function (relativePath)
        {
            if (typeof relativePath === 'undefined' || !relativePath) {
                relativePath = '';
            }
            
            return utils.absolutize(relativePath, cliPath);
        };
        
        this.getTestPath = function ()
        {
            if (casper.cli.has('selftest')) {
                return this.getPath(this.path);
            } else if (casper.cli.has(0)) {
                return this.getPath(casper.cli.get(0));
            }
            
        };

        this.setTestPath = function (absolutePath)
        {
            this.path = absolutePath;  
        }
        
        this.showHelp = function ()
        {
            var def          = require(configDefinitionPath),
                maxOptLength = utils.arrayMaxLength(def);
            casper.echo('NFluentjs version 0.0.1-DEV', 'COMMENT');
            casper.echo('Usage:');
            casper.echo('   nfluentjs <tests path> [options]');
            casper.echo('');
            casper.echo('Options:');
        
            for (var name in def){
                casper.echo('   --' + utils.pad(name, maxOptLength + 1, ' ') + def[name]);
            }
        };
    };

    module.exports = function (configDefinitionPath, casper, utils) {
        return new Cli(configDefinitionPath, casper, utils);
    };
})();