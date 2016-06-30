# NFluentJS

> **THIS PACKAGE IS NOT MAINTAINED ANYMORE, FORK IT IF YOU NEED IT**

>**Important note:** the `master` branch is still on WIP. You should never ever think to use NFluentjs
in production
>
>[Travis-CI](http://travis-ci.org/mickaelandrieu/NFluentjs) build status:
>
>- ![Build Status](https://travis-ci.org/mickaelandrieu/NFluentjs.png?branch=master) `master` branch
>- tests have to be run manually using the `nfluentjs --selftest` command

NFluentJS is a CLI-tool based on [CasperJS](http://www.casperjs.org/)
and [VigoJS](http://slimerjs.org/).

It aims to provide some beautiful TDD assertions in Javascript for unit and fonctional testing.

## Installation

First [install CasperJS](http://docs.casperjs.org/en/latest/installation.html), we'll use 1.1 beta-3 here
and his dependencies (at this point, only [PhantomJS](http://www.phantomjs.org/) is required)

For now, we have only one way to install NFluentjs.

### From the master branch

```shell
    $ git clone git://github.com/mickaelandrieu/NFluentjs.git
    $ cd NFluentjs
    $ ln -sf `pwd`/bin/nfluentjs /usr/local/bin/nfluentjs
```

Once PhantomJS and CasperJS installed on your machine, you should obtain something like this:

```shell
    $ phantomjs --version
    1.9.2
    $ casperjs
    CasperJS version 1.1.0-DEV at /Users/niko/Sites/casperjs, using phantomjs version 1.9.2
    # ...
    $ nfluentjs
    NFluentjs version 0.0.1-DEV
```


### How it works ?

```javascript
/* For more complete samples, see the VigoJs documentation and use cases */

var DummyTest = function(nfluentInstance){
    this.title = 'This is a Dummy Test';
    this.description = 'This is a Dummy description';
    this.Check = nfluentInstance.test;
};


DummyTest.prototype.launchTest = function launchTest() {
    var string = new String('lol');
    this.Check.That(string).IsInstanceOf(String);
};

DummyTest.prototype.getUrl = function getUrl() {
    return false;
} 

DummyTest.prototype.setTest = function setTest(testerInstance) {
    this.test = testerInstance;

    return this;
}

exports.create = function create(nfluentInstance, config, properties) {
    return new DummyTest(nfluentInstance, config, properties);
};
```

## License

MIT
