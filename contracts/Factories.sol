//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/presets/ERC20PresetFixedSupply.sol";
import "@openzeppelin/contracts/proxy/Proxy.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";

contract SimpleFactory {
    event Created(address);

    // $132
    function createToken() external returns (address) {
        ERC20PresetFixedSupply token = new ERC20PresetFixedSupply(
            "Token",
            "TTO",
            type(uint).max,
            msg.sender
        );

        emit Created(address(token));
        return address(token);
    }
}

// ProxyFactory ====creates=====> SimpleProxy -------delegatecall-------> Implementation
//                                (storage)

// CloneFactory ====creates=====> Clone -------delegatecall-------> Implementation
//                               (bytecode)

contract SimpleProxy is Proxy {
    address public implementation;

    constructor(address _impl) {
        implementation = _impl;
    }

    function _implementation() internal view override returns (address) {
        return implementation;
    }
}

contract ProxyFactory {
    address public immutable implementation;
    event Created(address);

    constructor(address _implementation) {
        implementation = _implementation;
    }

    // $15,94
    function createToken() external returns (address) {
        SimpleProxy proxy = new SimpleProxy(implementation);

        emit Created(address(proxy));
        return address(proxy);
    }
}

contract CloneFactory {
    address public immutable implementation;
    event Created(address);

    constructor(address _implementation) {
        implementation = _implementation;
    }

    // $6,5270
    function createToken() external returns (address) {
        address clone = Clones.clone(implementation);

        emit Created(address(clone));
        return address(clone);
    }
}

