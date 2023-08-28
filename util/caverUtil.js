const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const { ADDRESS, PRIVATEKEY, RPC_URL, ACCESS_KEY, SECRET_ACCESS_KEY } =
  process.env;

const Caver = require("caver-js");
const caver = new Caver(RPC_URL);

module.exports = {
  labelHash: (label) => {
    const result = caver.utils.sha3(caver.utils.utf8ToHex(label));

    return result;
  },
};
