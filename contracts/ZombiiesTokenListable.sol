// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.2;

import "./ZombiiesTokenBase.sol";

contract ZombiiesTokenListable is ZombiiesTokenBase {
    struct Token {
        uint256 id;
        address owner;
        string uri;
    }

    /**
     * @dev return all tokens of an `owner`
     */
    function allTokensOf(address owner) public view returns (Token[] memory) {
        uint256 tokensCount = balanceOf(owner);
        Token[] memory tokens = new Token[](tokensCount);

        for (uint256 i = 0; i < tokensCount; i++) {
            uint256 id = tokenOfOwnerByIndex(owner, i);
            string memory uri = tokenURI(id);
            tokens[i] = Token(id, owner, uri);
        }

        return tokens;
    }

    /**
     * @dev find all tokens by token `ids`
     * revert if not found
     */
    function tokensByIds(uint256[] memory ids)
        public
        view
        returns (Token[] memory)
    {
        Token[] memory tokens = new Token[](ids.length);

        for (uint256 i; i < ids.length; i++) {
            address owner = ownerOf(ids[i]);
            string memory uri = tokenURI(ids[i]);
            tokens[i] = Token(ids[i], owner, uri);
        }

        return tokens;
    }

    /**
     * @dev return existed token ids in an ids array
     */
    function _existedIds(uint256[] memory tokenIds)
        private
        view
        returns (uint256[] memory)
    {
        uint256 existedCount = 0;

        for (uint256 i = 0; i < tokenIds.length; i++) {
            if (_exists(tokenIds[i])) {
                existedCount++;
            }
        }

        uint256[] memory existedIds = new uint256[](existedCount);

        for (uint256 i = 0; i < tokenIds.length; i++) {
            if (_exists(tokenIds[i])) {
                existedIds[i] = tokenIds[i];
            }
        }

        return existedIds;
    }

    /**
     * @dev find all tokens by token `tokenIds`
     * ignore not found tokenIds
     */
    function safeGetTokensById(uint256[] memory tokenIds)
        public
        view
        returns (Token[] memory)
    {
        uint256[] memory existedIds = _existedIds(tokenIds);
        return tokensByIds(existedIds);
    }
}
