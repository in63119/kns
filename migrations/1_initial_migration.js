const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const { ADDRESS, PRIVATEKEY, RPC_URL, ACCESS_KEY, SECRET_ACCESS_KEY } =
  process.env;

const { makeKNSData } = require("../makeABI");
const { labelHash } = require("../util/caverUtil");
const namehash = require("eth-ens-namehash");

const ENSRegistry = artifacts.require("ENSRegistry");
const PublicResolver = artifacts.require("PublicResolver");
const FIFSRegistrar = artifacts.require("FIFSRegistrar");

module.exports = async function (deployer, network, accounts) {
  if (network === "goerli") {
    console.log(" ");
    console.log("------------- Contract를 배포합니다. --------------");
    console.log(" ");

    await deployer.deploy(ENS);
    const ENSContract = await ENS.deployed();

    makeENSData(ENSContract.address);

    console.log(" ");
    console.log("------------- ABI를 만들었습니다. --------------");

    console.log(" ");
    console.log("------------- Contract 배포가 완료되었습니다. --------------");
  } else if (network === "baobab") {
    console.log(" ");
    console.log("------------- Contract를 배포합니다. --------------");
    console.log(" ");

    const tld = "klay";
    const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
    const ZERO_HASH =
      "0x0000000000000000000000000000000000000000000000000000000000000000";

    const ens = await deployer.deploy(ENSRegistry);
    const ensContract = await ens.deployed();

    const resolver = await deployer.deploy(
      PublicResolver,
      ensContract.address,
      ZERO_ADDRESS
    );
    const resolverContract = await resolver.deployed();
    const setupResolver = async (ens, resolver, accounts) => {
      const resolverNode = namehash.hash("resolver");
      const resolverLabel = labelhash("resolver");
      await ens.setSubnodeOwner(ZERO_HASH, resolverLabel, accounts);
      await ens.setResolver(resolverNode, resolver.address);
      await resolver["setAddr(bytes32,address)"](
        resolverNode,
        resolver.address
      );
    };
    await setupResolver(ensContract, resolverContract, ADDRESS);

    const registrar = await deployer.deploy(
      FIFSRegistrar,
      ensContract.address,
      namehash.hash(tld)
    );
    const registrarContract = await registrar.deployed();
    const setupRegistrar = async (ens, registrar) => {
      await ens.setSubnodeOwner(ZERO_HASH, labelhash(tld), registrar.address);
    };
    await setupRegistrar(ensContract, registrarContract);

    const reverseRegistrar = await deployer.deploy(
      ReverseRegistrar,
      ensContract.address,
      resolverContract.address
    );
    const reverseRegistrarContract = await reverseRegistrar.deployed();
    const setupReverseRegistrar = async (
      ens,
      registrar,
      reverseRegistrar,
      accounts
    ) => {
      await ens.setSubnodeOwner(ZERO_HASH, labelhash("reverse"), accounts);
      await ens.setSubnodeOwner(
        namehash.hash("reverse"),
        labelhash("addr"),
        reverseRegistrar.address
      );
    };
    await setupReverseRegistrar(
      ensContract,
      registrarContract,
      reverseRegistrarContract,
      ADDRESS
    );

    // console.log(" ");
    // console.log("------------- ABI를 만들었습니다. --------------");

    console.log(" ");
    console.log("------------- Contract 배포가 완료되었습니다. --------------");
  }
};
