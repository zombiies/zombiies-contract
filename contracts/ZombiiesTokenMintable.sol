// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.2;

import "./ZombiiesTokenBase.sol";

contract ZombiiesTokenMintable is ZombiiesTokenBase {
    function safeMint(address _to, string memory _tokenURI) public onlyOwner {
        _safeMint(_to, _tokenURI);
    }
}
