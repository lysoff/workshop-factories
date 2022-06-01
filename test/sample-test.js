const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Factories", function () {
  it("creates SimpleFactory and invokes createToken", async function () {
    const simpleFactoryFactory = await ethers.getContractFactory("SimpleFactory");
    const simpleFactory = await simpleFactoryFactory.deploy();
    await simpleFactory.deployed();

    const tx = await simpleFactory.createToken();
    const receipt = await tx.wait();

    const event = receipt.events.find((e) => e.event === "Created");

    expect(event.args[0].length).to.be.eq(42);
  });

  it("creates ProxyFactory and invokes createdToken()", async function () {
    const deployer = await ethers.getSigner();
    const proxyFactoryFactory = await ethers.getContractFactory("ProxyFactory");
    const erc20TokenFactory = await ethers.getContractFactory("ERC20PresetFixedSupply");

    const token = await erc20TokenFactory.deploy("Token", "TTO", ethers.utils.parseEther("100000"), deployer.address);

    const proxyFactory = await proxyFactoryFactory.deploy(token.address);
    await proxyFactory.deployed();

    const tx = await proxyFactory.createToken();
    const receipt = await tx.wait();

    const event = receipt.events.find((e) => e.event === "Created");

    expect(event.args[0].length).to.be.eq(42);
  });

  it("creates CloneFactory and invokes createdToken()", async function () {
    const deployer = await ethers.getSigner();
    const cloneFactoryFactory = await ethers.getContractFactory("CloneFactory");
    const erc20TokenFactory = await ethers.getContractFactory("ERC20PresetFixedSupply");

    const token = await erc20TokenFactory.deploy("Token", "TTO", ethers.utils.parseEther("100000"), deployer.address);

    const cloneFactory = await cloneFactoryFactory.deploy(token.address);
    await cloneFactory.deployed();

    const tx = await cloneFactory.createToken();
    const receipt = await tx.wait();

    const event = receipt.events.find((e) => e.event === "Created");

    expect(event.args[0].length).to.be.eq(42);
  });
});
