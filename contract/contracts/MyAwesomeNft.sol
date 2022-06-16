// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@thirdweb-dev/contracts/feature/interface/IMintableERC721.sol";
import "@thirdweb-dev/contracts/eip/interface/IERC721Supply.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract MyAwesomeNft is ERC721URIStorage, IMintableERC721, IERC721Supply {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    constructor() ERC721("Awesome NFTs", "AWSM") {}

    function totalSupply() external view override returns (uint256) {
        return _tokenIds.current();
    }

    function mintTo(address to, string calldata uri) external override returns (uint256) {
        uint256 newTokenId = _tokenIds.current();

        _mint(to, newTokenId);
        _setTokenURI(newTokenId, uri);

        _tokenIds.increment();

        emit TokensMinted(to, newTokenId, uri);

        return newTokenId;
    }
}