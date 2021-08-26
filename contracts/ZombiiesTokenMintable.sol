// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.2;

import "./ZombiiesTokenBase.sol";

contract ZombiiesTokenMintable is ZombiiesTokenBase {
    /**
     * @dev Require enough `fee`.
     */
    modifier enoughFee(uint256 fee) {
        require(msg.value == fee, "Not enough fee");
        _;
    }

    /**
     * @dev This event is emitted every time a starter pack is bought.
     */
    event StarterPackBought(address indexed buyer, uint256[] tokenIds);

    /**
     * @dev Safely mints with generated token ID, specify `tokenURIs` and transfers it to `to`.
     *
     * Requirements:
     *
     * - If `_to` refers to a smart contract, it must implement {IERC721Receiver-onERC721Received}, which is called upon a safe transfer.
     *
     * Emits a {StarterPackBought} event.
     */
    function buyStarterPack(address to, string[] memory tokenURIs)
        external
        payable
        enoughFee(starterPackFee)
    {
        require(balanceOf(to) == 0, "Already bought starter pack");

        uint256[] memory tokenIds = new uint256[](tokenURIs.length);

        for (uint256 i = 0; i < tokenURIs.length; i++) {
            tokenIds[i] = _safeMint(to, tokenURIs[i]);
        }

        emit StarterPackBought(to, tokenIds);
    }
}
