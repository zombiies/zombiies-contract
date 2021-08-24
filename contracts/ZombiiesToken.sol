// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract ZombiiesToken is
    ERC721,
    ERC721Enumerable,
    ERC721URIStorage,
    Pausable,
    Ownable,
    ERC721Burnable
{
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    constructor() ERC721("ZombiiesToken", "ZBT") {}

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override(ERC721, ERC721Enumerable) whenNotPaused {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    // The following functions are overrides required by Solidity.

    function _burn(uint256 tokenId)
        internal
        override(ERC721, ERC721URIStorage)
    {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function _awardToken(address to) public onlyOwner returns (uint256) {
        uint256 newTokenId = _tokenIdCounter.current();
        _safeMint(to, newTokenId);
        _tokenIdCounter.increment();

        return newTokenId;
    }

    function awardToken(address _to, string memory _tokenURI) public onlyOwner {
        uint256 newTokenId = _awardToken(_to);
        _setTokenURI(newTokenId, _tokenURI);
    }

    struct Token {
        uint256 id;
        address owner;
        string uri;
    }

    function allTokensOf(address _address)
        public
        view
        returns (Token[] memory)
    {
        uint256 tokensCount = balanceOf(_address);
        Token[] memory tokens = new Token[](tokensCount);

        for (uint256 i = 0; i < tokensCount; i++) {
            uint256 id = tokenOfOwnerByIndex(_address, i);
            string memory uri = tokenURI(id);
            tokens[i] = Token(id, _address, uri);
        }

        return tokens;
    }

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

    function _existedIds(uint256[] memory ids)
        private
        view
        returns (uint256[] memory)
    {
        uint256 existedCount = 0;

        for (uint256 i = 0; i < ids.length; i++) {
            if (_exists(ids[i])) {
                existedCount++;
            }
        }

        uint256[] memory existedIds = new uint256[](existedCount);

        for (uint256 i = 0; i < ids.length; i++) {
            if (_exists(ids[i])) {
                existedIds[i] = ids[i];
            }
        }

        return existedIds;
    }

    function safeGetTokensById(uint256[] memory ids)
        public
        view
        returns (Token[] memory)
    {
        uint256[] memory existedIds = _existedIds(ids);
        return tokensByIds(existedIds);
    }
}
