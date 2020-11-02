import {ethers, network} from "hardhat";
import {expect} from "chai";
import {DsProxy} from "../typechain/DsProxy";
import {ProxyRegistryInterface} from "../typechain/ProxyRegistryInterface";
import makerAddresses from "./shared/makerAddress.json";
import {getProxy} from "./shared/utilities";
import {FlashSwapCompoundHandler, FlashSwapCompoundHandlerFactory} from "../typechain";
import IERC20Artifact from "@openzeppelin/contracts/build/contracts/IERC20.json";
import {Ierc20} from "../typechain/Ierc20";
import {IUniswapV2Pair} from "../typechain/IUniswapV2Pair";
import UniswapV2PairArtifact from "@uniswap/v2-core/build/UniswapV2Pair.json";

describe("FlashSwapCompoundHandler", function () {
    const BINANCE_ADDRESS = "0x3f5CE5FBFe3E9af3971dD833D26bA9b5C936f0bE";
    let dsProxy: DsProxy;
    let wbtc: Ierc20;
    let wbtc_eth_pair: IUniswapV2Pair;

    beforeEach(async () => {
        const provider = ethers.provider;
        const signer = provider.getSigner();
        // Get dsProxy for signer
        const registry: ProxyRegistryInterface = await ethers.getContractAt(
            "ProxyRegistryInterface",
            makerAddresses["PROXY_REGISTRY"]
        ) as ProxyRegistryInterface;
        const proxyInfo = await getProxy(registry, signer, provider);
        dsProxy = proxyInfo.proxy;
        // Transfer 1 WBTC to dsProxy
        await network.provider.request({
                method: "hardhat_impersonateAccount",
                // Binance account
                params: [BINANCE_ADDRESS]
            }
        )
        wbtc = await ethers.getContractAt(IERC20Artifact.abi, "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599") as Ierc20;
        await wbtc.connect(provider.getSigner(BINANCE_ADDRESS)).transfer(await signer.getAddress(), 1);
        expect(await wbtc.balanceOf(await signer.getAddress())).to.equal(1);
        // Deploy FlashSwapCompoundHandler
        const flashSwapCompoundHandlerFactory: FlashSwapCompoundHandlerFactory = await ethers.getContractFactory("FlashSwapCompoundHandler") as FlashSwapCompoundHandlerFactory;
        const flashSwapCompoundHandler: FlashSwapCompoundHandler = await flashSwapCompoundHandlerFactory.deploy();
        await flashSwapCompoundHandler.deployed();
        // Load WBTC/ETH pair
        wbtc_eth_pair = await ethers.getContractAt(UniswapV2PairArtifact.abi, "0xbb2b8038a1640196fbe3e38816f3e67cba72d940") as IUniswapV2Pair;
    });

    it("flash swap", async () => {
    });
});