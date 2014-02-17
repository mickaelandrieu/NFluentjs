var CheckThatTests = function(nfluentInstance){
    this.title = 'Check Assertions tests';
    this.description = 'Test suite for all the Check.That("XXX") assertions.';
    this.Check = nfluentInstance.test;
};


CheckThatTests.prototype.launchTest = function launchTest() {
    var string = new String('NFluentjs');
    this.Check.That(string).IsInstanceOf(String);
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