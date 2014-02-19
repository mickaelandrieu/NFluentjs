/** user_management.js
 * @author Mickaël Andrieu <mickael.andrieu@sensiolabs.com>
 */
function User(firstname, lastname, service) {
    this.firstname = firstname;
    this.lastname = lastname;
    this.service = service;

    this.moveTo = function moveTo(service) {
        this.service = service;
    };
    this.getName = function getName() {
        return this.firstname + ' ' + this.lastname;
    };
}

function Service(serviceName) {
    this.serviceName = serviceName;
}

var UserTest = function(nfluent){
    this.title = 'User test scenarios';
    this.description = 'Test suite to unit test an User.';
    this.Check = nfluent.test;
};

UserTest.prototype.launchTest = function launchTest() {
    /* A minimal test */
    var it = new Service('IT');
    var mickael = new User('Mickaël', 'Andrieu', it);
    var rui = new User('Rui', 'Carvalho', it);
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
