const fs = require("fs");
const path = require("path");
const basePath = __dirname;

const makeFile = async (location, destination, address) => {
  const json = await fs.readFileSync(path.join(basePath, location), {
    encoding: "utf-8",
  });

  await fs.writeFileSync(
    path.join(basePath, destination),
    makeData(json, address)
  );
};

const makeData = (json, address) => {
  const abi = JSON.parse(json).abi;

  return JSON.stringify({
    abi: abi,
    address: address,
  });
};

const makeKNSData = async (name, address) => {
  makeFile(`/data/artifacts/${name}.json`, `/data/${name}ABI.json`, address);
};

module.exports = {
  makeKNSData,
};
