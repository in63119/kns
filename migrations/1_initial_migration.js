const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const { ADDRESS, PRIVATEKEY, RPC_URL, ACCESS_KEY, SECRET_ACCESS_KEY } =
  process.env;

const { makeKNSData } = require("../makeABI");
const { labelHash } = require("../util/caverUtil");
const namehash = require("eth-ens-namehash");

// const ENSRegistry = artifacts.require("ENSRegistry");
const PublicResolver = artifacts.require("PublicResolver");
// const FIFSRegistrar = artifacts.require("FIFSRegistrar");

const { ENSRegistryCA } = require("../util/ca");

module.exports = async function (deployer, network, accounts) {
  console.log(" ");
  console.log("------------- Contract를 배포합니다. --------------");
  console.log(" ");

  const tld = "klay";
  const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
  const ZERO_HASH =
    "0x0000000000000000000000000000000000000000000000000000000000000000";

  //   await deployer.deploy(ENSRegistry);
  //   const ensContract = await ENSRegistry.deployed();
  //   await makeKNSData("ENSRegistry", ensContract.address);
  console.log("어디가 잘못된걸까? 0");

  const resolver = await deployer.deploy(PublicResolver, ENSRegistryCA);
  console.log("어디가 잘못된걸까? 0.5");
  const resolverContract = await resolver.deployed();
  const setupResolver = async (ens, resolver, accounts) => {
    console.log("어디가 잘못된걸까? 1");
    const resolverNode = namehash.hash("resolver");
    console.log("어디가 잘못된걸까? 2");

    const resolverLabel = labelhash("resolver");
    console.log("어디가 잘못된걸까? 3");

    await ens.setSubnodeOwner(ZERO_HASH, resolverLabel, accounts);
    await ens.setResolver(resolverNode, resolver.address);
    await resolver["setAddr(bytes32,address)"](resolverNode, resolver.address);
  };
  await setupResolver(ENSRegistryCA, resolverContract, ADDRESS);
  await makeKNSData("Resolver", resolverContract.address);

  //   const registrar = await deployer.deploy(
  //     FIFSRegistrar,
  //     ensContract.address,
  //     namehash.hash(tld)
  //   );
  //   const registrarContract = await registrar.deployed();
  //   const setupRegistrar = async (ens, registrar) => {
  //     await ens.setSubnodeOwner(ZERO_HASH, labelhash(tld), registrar.address);
  //   };
  //   await setupRegistrar(ensContract, registrarContract);

  //   const reverseRegistrar = await deployer.deploy(
  //     ReverseRegistrar,
  //     ensContract.address,
  //     resolverContract.address
  //   );
  //   const reverseRegistrarContract = await reverseRegistrar.deployed();
  //   const setupReverseRegistrar = async (
  //     ens,
  //     registrar,
  //     reverseRegistrar,
  //     accounts
  //   ) => {
  //     await ens.setSubnodeOwner(ZERO_HASH, labelhash("reverse"), accounts);
  //     await ens.setSubnodeOwner(
  //       namehash.hash("reverse"),
  //       labelhash("addr"),
  //       reverseRegistrar.address
  //     );
  //   };
  //   await setupReverseRegistrar(
  //     ensContract,
  //     registrarContract,
  //     reverseRegistrarContract,
  //     ADDRESS
  //   );

  console.log(" ");
  console.log("------------- ABI를 만들었습니다. --------------");

  console.log(" ");
  console.log("------------- Contract 배포가 완료되었습니다. --------------");
};
