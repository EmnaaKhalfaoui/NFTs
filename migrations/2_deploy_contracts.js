// eslint-disable-next-line no-undef
const MemoryToken = artifacts.require("MemoryToken");

module.exports = function(deployer) {
  deployer.deploy(MemoryToken)
};
