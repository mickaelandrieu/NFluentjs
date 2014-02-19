==========
Assertions
==========

Unit Testing
------------

Imagine we want to make a very simple user management application:

- An user have a firstname, a lastname and a service
- Each service have a name

The source code could be::

    function User = function(firstname, lastname, service) {
        this.ID = Math.random().toString(36).substring(7);
        this.firstname = firstname;
        this.lastname = lastname;
        this.group = group;
    
        this.moveTo = function moveTo(service) {
            this.service = service;
        }
        this.getName = function getName() {
            return this.firstname + ' ' + this.lastname;
        }
    };

    function Group = function(name) {
        this.groupName = name;
    };
    
    var it = new Group('IT');
    var mickael = new User('Mickaël', 'Andrieu', it);
    var rui = new User('Rui', 'Carvalho', it);

Ok, now we want to unit test a little but the behavior of
our objects. Let's write the minimal script to test theses entities::


    // import the User and Service definitions
    var UnitTest = function(nfluent){
        this.title = 'User test scenarios';
        this.description = 'Test suite to unit test an User.';
        this.Check = nfluent.test;
    };
    
    
    UserTest.prototype.launchTest = function launchTest() {
        var it = new Group('IT');
        var mickael = new User('Mickaël', 'Andrieu', it);
        var rui = new User('Rui', 'Carvalho', it);
    
        /* A minimal test */
        this.Check.That(it).EqualsTo(mickael.group);
    };
    
    UserTest.prototype.getUrl = function getUrl() {
        return false;
    }
    
    UserTest.prototype.setTest = function setTest(tester) {
        this.test = tester;
    
        return this;
    }
    
    exports.create = function create(nfluent, config, properties) {
        return new UserTest(nfluent, config, properties);
    };


You need at least to implement three functions needed by NFluentjs to deal with your class.

- launchTest: you will write all your assertions here.
- setTest: needed by nfluent, will be directly moved on AbstractTester class in 0.0.2.
- getUrl: you don't need an url when you unit test this class, but It can be useful for
functional tests

Now, let's write a first test::

    // test.js
    var UnitTest = function(nfluent){
        this.title = 'User test scenarios';
        this.description = 'Test suite to unit test an User.';
        this.Check = nfluent.test;
    };
    
    
    UserTest.prototype.launchTest = function launchTest() {
        this.Check.That(it).EqualsTo(mickael.service);
    };
    
    UserTest.prototype.getUrl = function getUrl() {
        return false;
    }
    
    UserTest.prototype.setTest = function setTest(tester) {
        this.test = tester;
    
        return this;
    }
    
    exports.create = function create(nfluent, config, properties) {
        return new UserTest(nfluent, config, properties);
    };
    

Finaly, the command `nfluentjs test.js` should return::

    [user_management] - Main url : [WARNING] No URL for this test
    # User test scenarios
    ## Test suite to unit test an User.
    PASS [object Object] is equals to [object Object] values
    Process ended, xml result is going to be generated.
    PASS 1 test executed in 0.202s, 1 passed, 0 failed, 0 dubious, 0 skipped.
    Result log stored in /home/mickaelandrieu/Projets/NFluentjs/build/1392825312997/test_1392825312997.xml


That's all ! You can now take a look to `modules\Tester.js` to find availables methods.
