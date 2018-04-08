var ScanTheSky = artifacts.require("ScanTheSky");

contract('ScanTheSky', accounts => {
    it("should have the name Scan The Sky", () => {

        return ScanTheSky.deployed().then(instance => {
            return instance.name.call();
        }).then(name => {
            assert.equal(name.valueOf(), "Scan The Sky", "Scan The Sky isn't the name")
        });

    });
});
