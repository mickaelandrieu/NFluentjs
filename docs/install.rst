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
