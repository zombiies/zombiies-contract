// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.2;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721EnumerableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721BurnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";

contract ZombiiesTokenBase is
    Initializable,
    ERC721Upgradeable,
    ERC721EnumerableUpgradeable,
    ERC721URIStorageUpgradeable,
    OwnableUpgradeable,
    ERC721BurnableUpgradeable
{
    using CountersUpgradeable for CountersUpgradeable.Counter;

    CountersUpgradeable.Counter private _tokenIdCounter;
    string private _factoryURI;
    uint256 private _mintFee;

    /**
     * @dev This event is emitted every time `_factoryURI` is changed.
     */
    event FactoryURIChanged(string newURI);

    /**
     * @dev This event is emitted every time `_mintFee` is changed.
     */
    event MintFeeChanged(uint256 newFee);

    function initialize() public initializer {
        __ERC721_init("ZombiiesToken", "ZBT");
        __ERC721Enumerable_init();
        __ERC721URIStorage_init();
        __Ownable_init();
        __ERC721Burnable_init();
    }

    /**
     * @dev Set new mint fee.
     *
     * Requirements:
     *
     * - newFee must greater than 0.
     *
     */
    function setMintFee(uint256 newFee) external onlyOwner {
        require(newFee > 0);
        _mintFee = newFee;
        emit MintFeeChanged(newFee);
    }

    /**
     * @dev Return the current mint fee.
     */
    function getMintFee() external view returns (uint256) {
        return _mintFee;
    }

    /**
     * @dev Return the current card factory URI.
     */
    function getFactoryURI() external view returns (string memory) {
        return _factoryURI;
    }

    /**
     * @dev Set card factory URI.
     */
    function setFactoryURI(string memory newURI) external onlyOwner {
        _factoryURI = newURI;
        emit FactoryURIChanged(newURI);
    }

    // The following functions are overrides required by Solidity.

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override(ERC721Upgradeable, ERC721EnumerableUpgradeable) {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    /**
     * @dev Destroys `tokenId`.
     * The approval is cleared when the token is burned.
     *
     * Requirements:
     *
     * - `tokenId` must exist.
     *
     * Emits a {Transfer} event.
     */
    function _burn(uint256 tokenId)
        internal
        override(ERC721Upgradeable, ERC721URIStorageUpgradeable)
    {
        super._burn(tokenId);
    }

    /**
     * @dev See {IERC721Metadata-tokenURI}.
     */
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721Upgradeable, ERC721URIStorageUpgradeable)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    /**
     * @dev See {IERC165-supportsInterface}.
     */
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721Upgradeable, ERC721EnumerableUpgradeable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    /**
     * @dev Safely mints with generated token ID and transfers it to `to`.
     *
     * Requirements:
     *
     * - If `to` refers to a smart contract, it must implement {IERC721Receiver-onERC721Received}, which is called upon a safe transfer.
     *
     * Emits a {Transfer} event.
     */
    function _safeMint(address to) internal onlyOwner returns (uint256) {
        uint256 newTokenId = _tokenIdCounter.current();
        super._safeMint(to, newTokenId);
        _tokenIdCounter.increment();

        return newTokenId;
    }

    /**
     * @dev Safely mints with generated token ID, specify token URI and transfers it to `to`.
     *
     * Requirements:
     *
     * - If `to` refers to a smart contract, it must implement {IERC721Receiver-onERC721Received}, which is called upon a safe transfer.
     *
     * Emits a {Transfer} event.
     */
    function _safeMint(address to, string memory _tokenURI) internal onlyOwner {
        _setTokenURI(_safeMint(to), _tokenURI);
    }
}
