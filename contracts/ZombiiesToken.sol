// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.2;

import "./ZombiiesTokenBase.sol";

struct Token {
    uint256 id;
    string uri;
}

contract ZombiiesToken is ZombiiesTokenBase {
    /**
     * @dev This event is emitted every time a `player` level up card.
     */
    event LevelUp(string proofURI);

    /**
     * @dev This event is emitted every time a `player` mint a new token.
     */
    event SafeMint(string proofURI);

    /**
     * @dev Safe mints new card with higher level of sacrifices cards.
     */
    function levelUp(
        address to,
        uint256[] memory sacrificeIds,
        string memory newTokenURI,
        string memory proofURI
    ) external onlyOwner {
        require(sacrificeIds.length == 2, "Not enough sacrifices");

        for (uint256 i = 0; i < sacrificeIds.length; i++) {
            _burn(sacrificeIds[i]);
        }

        _safeMint(to, newTokenURI);

        emit LevelUp(proofURI);
    }

    /**
     * @dev Safe mints new card and transfer to `to`.
     */
    function safeMint(
        address to,
        string memory tokenURI,
        string memory proofURI
    ) external onlyOwner {
        _safeMint(to, tokenURI);

        emit SafeMint(proofURI);
    }

    function tokensIn(uint256[] memory tokenIds)
        public
        view
        returns (Token[] memory)
    {
        Token[] memory tokens = new Token[](tokenIds.length);

        for (uint256 i = 0; i < tokenIds.length; i++) {
            tokens[i] = Token({id: tokenIds[i], uri: tokenURI(tokenIds[i])});
        }

        return tokens;
    }

    /**
     * @dev Returns all the tokenIds and tokenUris owned by the given address.
     */
    function tokensOf(address owner) external view returns (Token[] memory) {
        uint256 balance = balanceOf(owner);
        uint256[] memory ids = new uint256[](balance);

        for (uint256 i = 0; i < balance; i++) {
            ids[i] = tokenOfOwnerByIndex(owner, i);
        }

        return tokensIn(ids);
    }
}
