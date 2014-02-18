var CheckThatTests = function(nfluentInstance){
    this.title = 'Check Assertions tests';
    this.description = 'Test suite for all the Check.That("XXX") assertions.';
    this.Check = nfluentInstance.test;
};


CheckThatTests.prototype.launchTest = function launchTest() {
    /* prepare all datas for the tests */
    var string = new String('NFluentjs');
    function Rui() {
        this.sayHi = function sayHi() {
            return 'hi !';
        };
    }
    var rui = new Rui();
    var integers = [1, 2, 3, 4, 5, 6];

    this.Check.That(string).IsInstanceOf(String);
    this.Check.That(rui).IsInstanceOf(Rui);
    this.Check.That([1, 2]).IsInstanceOf(Array);

    this.Check.That(rui).IsNotInstanceOf(String);
    this.Check.That([1, 2, 3]).IsNotInstanceOf(Rui);

    this.Check.That(integers).Contains([1, 2, 6]);
    this.Check.That(integers).NotContains([1, 2, 9]);
};

CheckThatTests.prototype.getUrl = function getUrl() {
    return false;
}

CheckThatTests.prototype.setTest = function setTest(testerInstance) {
    this.test = testerInstance;

    return this;
}

exports.create = function create(nfluentInstance, config, properties) {
    return new CheckThatTests(nfluentInstance, config, properties);
};
