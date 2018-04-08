var HDWalletProvider = require("truffle-hdwallet-provider");
var mnemonic = "fashion goose brother prefer cruise truck adult cinnamon leisure immense firm town";

module.exports = {
    networks: {
        ganache: {
            host: 'localhost',
            port: '7545',
            network_id: '5777',
        },
        rinkeby: {
          provider: function() {
            return new HDWalletProvider(mnemonic, "https://rinkeby.infura.io/Hn0TOZr0VPcBRH7izfxl")
          },
          network_id: 4
        }
    }
};
