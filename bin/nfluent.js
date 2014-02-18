(function () {
    /* jshint -W071 */
    /* jshint -W074 */

    /**
     * This script is called with this command :
     *      nfluentjs  <tests path> [options]
     *
     * You can use config.json to store some params like login/pwd/buildPath
     * If options are both in config.json and cli params, those cli params will be used first
     *
     * Actually phantomJs doesn't provide any way to disable specific resource loading.
     * Some javascript provided by advertiser may break the process. So, waiting for a solution from phantom to
     * improve their event onResourceRequested, you may have to modify your hosts (it works actually wihout this tips) :
     *      127.0.0.1       cstatic.weborama.fr
     *
     * @params string path
     * @params string buildPath (default in ./build folder)
     * @params string configPath
     */

    "use strict";
    
    var casperOptions = {
        verbose: false,
        logLevel: "info"
    };

    // Parameters
    var date     = new Date(),
        fs       = require('fs'),
        sys      = require('system'),
        libPath  = fs.absolute('../modules/'),
        testPath = fs.absolute('../tests/')
        version  = '0.0.1-DEV';

    // Phantom JS Setup
    phantom.casperPath = sys.env['CASPERJS_PATH'];
    phantom.injectJs(phantom.casperPath + 'bin/bootstrap.js');
    phantom.casperTest = true;

    // Casper and VigoJS helpers

    var genuineCasper = require('casper').Casper,
        genuineTester = require('tester').Tester,
        utils         = require('utils'),
        nfluent       = require(libPath + 'NFluent').create(libPath, genuineCasper, genuineTester, casperOptions, utils),
        configurator  = require(libPath + 'Configurator')(utils),
        vigoUtils     = require(libPath + 'Utils')(fs),
        cli           = require(libPath + 'Cli')(fs.absolute('.') + './../config/config.definition.json', nfluent, vigoUtils),
        sequence      = require(libPath + 'Sequence')(fs);

    if (nfluent.cli.has('version')) {
        nfluent.echo(version);
        nfluent.exit();
        return;
    }
    if (nfluent.cli.has('selftest')) {
        cli.setTestPath(testPath);
    } else {
        if (!nfluent.cli.get(0) || nfluent.cli.has('help')) {
            cli.showHelp();
            nfluent.exit();
            return;
        } else if (!fs.exists(cli.getTestPath())) {
            nfluent.echo('No tests path is specified.', 'ERROR');
            nfluent.echo('The file or directory `' + cli.getTestPath() + '` does not exist.', 'ERROR').exit(1);
        }
    }
    
    // NFluentJS configuration generation
    var config = configurator
        // Default configuration
        .addConfigHandler(function () {
            return JSON.parse(fs.read('../config/config.json'));
        })
        // Project configuration
        .addConfigHandler(function (path) {
            var pathSplit = (typeof path !== 'undefined' && path ? path.split('/') : cli.getTestPath().split('/'));
            var config    = {};
            
            while (pathSplit.length > 1) {
                if (fs.exists(pathSplit.join('/') + '/.vigojs.json')) {
                    var cfgObject = JSON.parse(fs.read(pathSplit.join('/') + '/.vigojs.json'));
                    // require as first argument because closest config file has priority
                    config = utils.mergeObjects(cfgObject, config);
                }
                
                pathSplit.pop();
            }
            
            return config;
        })
        // User configuration
        .addConfigHandler(function () {
            return ( typeof nfluent.cli.options['configPath'] !== 'undefined' ? JSON.parse(fs.read(cli.getPath(nfluent.cli.options['configPath']))) : {});
        })
        // CLI Configuration
        .addConfigHandler(function () {
            return nfluent.cli.options;
        })
        .addConfigHandler(function (path, config){
            var tmpConfig = {};

            if (typeof config !== 'undefined') {
                tmpConfig.buildPath = config.buildPath;
            }

            tmpConfig.libPath = libPath;
            tmpConfig.currentTestPath = path;

            return tmpConfig;
        })
        .getConfig();

    // Tests sequence building    
    sequence.add(cli.getTestPath());
    
    // Build path resolution
    config.buildPath = cli.getPath(config.buildPath) + '/' + date.getTime();

    if (!fs.isDirectory(config.buildPath)) {
        nfluent.echo('Creation of the build folder: ' + config.buildPath);
        fs.makeDirectory(config.buildPath);
    }

    // NFluentJS init
    nfluent.init(config.buildPath, 'test_' + date.getTime() + '.xml');

    // Tests sequence launch
    var interval = setInterval(function (test) {
        if (test.running) {
            return;
        }
        if (test.currentSuiteNum === sequence.list.length || test.aborted) {
            // Results display
            test.emit('tests.complete');
            clearInterval(interval);
        } else {
            var item = sequence.list[test.currentSuiteNum];
            utils.dump(item);
            config = configurator.getConfig(item.dir, config);
            var module = require(item.module).create(nfluent, config, item);

            // Check that module implements required methods
            if (typeof module.launchTest === 'undefined' || typeof module.getUrl === 'undefined' || typeof module.setTest === 'undefined') {
                nfluent.echo('Checker ' + item.name + ' does not implement required methods `launchTest`, `getUrl` and/or `setTest`.', 'ERROR').exit(1);
            }

            var url = module.getUrl() == false ? "[WARNING] No URL for this test" : module.getUrl();

            nfluent.echo('[' + item.name + ']' + (url ? ' - Main url : ' + url : ''), 'INFO_BAR');
            test.currentTestFile = module.xunitClass || item.name;
            test.currentTestFilePath = item.filepath;

            nfluent.test.begin(module.title ? module.title : 'Untitled test suite', function(tester) {
                module.setTest(tester);
                nfluent.start();

                // Infos display
                if (module.description){
                    nfluent.echo('## ' + module.description, 'COMMENT');
                }

                // NFluent environement configuration        
                nfluent.viewport(config.viewportWidth, config.viewportHeight);
                if (config.login && config.pwd) {
                    nfluent.setHttpAuth(config.login, config.pwd);
                }

                // Test launch
                if(url == false) {
                    nfluent.then(function() {
                        module.launchTest();
                    }).run(function() {
                        tester.done();
                    });
                } else {
                    nfluent.thenOpen(url, function() {
                        module.launchTest();
                    }).run(function() {
                        tester.done();
                    });
                }
                
            });

            test.currentSuiteNum++;
        }
    }, 20, nfluent.test);
})();
