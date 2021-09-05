// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.2;

import "./ZombiiesTokenBase.sol";

contract ZombiiesToken is ZombiiesTokenBase {
    /**
     * @dev This event is emitted every time a starter pack is bought.
     */
    event StarterPackBought(string proofURI);

    /**
     * @dev This event is emitted every time a `player` level up card.
     */
    event LevelUp(string proofURI);

    /**
     * @dev This event is emitted every time a `player` received a award after a win match.
     */
    event Awarded(string proofURI);

    /**
     * @dev This event is emitted every time a `player` start an auction.
     */
    event AuctionStarted(string proofURI);

    /**
     * @dev This event is emitted every time a auction is end.
     */
    event AuctionEnded(string proofURI);

    /**
     * @dev Safely mints with generated token ID, specify `tokenURIs` and transfers it to `to`.
     * `proofURI` is an ipfs uri of the proof of ownership.
     *
     * Requirements:
     *
     * - If `_to` refers to a smart contract, it must implement {IERC721Receiver-onERC721Received}, which is called upon a safe transfer.
     *
     * Emits a {StarterPackBought} event.
     */
    function buyStarterPack(
        address to,
        string[] memory tokenURIs,
        string memory proofURI
    ) external onlyOwner {
        require(balanceOf(to) == 0, "Already bought starter pack");

        for (uint256 i = 0; i < tokenURIs.length; i++) {
            _safeMint(to, tokenURIs[i]);
        }

        emit StarterPackBought(proofURI);
    }

    /**
     * @dev Safe mints new card with higher level of sacrifices cards.
     */
    function levelUp(
        address to,
        uint256[] memory sacrificesIds,
        string memory newTokenURI,
        string memory proofURI
    ) external onlyOwner {
        require(
            sacrificesIds.length == countToLevelUp,
            "Not enough sacrifices"
        );

        for (uint256 i = 0; i < sacrificesIds.length; i++) {
            _burn(sacrificesIds[i]);
        }

        _safeMint(to, newTokenURI);

        emit LevelUp(proofURI);
    }

    /**
     * @dev Safe mints new card and award to `to` after a win match.
     */
    function award(
        address to,
        string memory tokenURI,
        string memory proofURI
    ) external onlyOwner {
        _safeMint(to, tokenURI);

        emit Awarded(proofURI);
    }

    /**
     * @dev Start an auction by sending the token to the owner.
     */
    function startAuction(
        address from,
        uint256 tokenId,
        string memory proofURI
    ) external {
        safeTransferFrom(from, owner(), tokenId);

        emit AuctionStarted(proofURI);
    }

    /**
     * @dev End an auction and send token to owner.
     */
    function endAuction(
        address winner,
        uint256 tokenId,
        string memory proofURI
    ) external onlyOwner {
        safeTransferFrom(owner(), winner, tokenId);

        emit AuctionEnded(proofURI);
    }
}
