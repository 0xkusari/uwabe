// SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract UwabeConfigToken is ERC721, Ownable {
  using Address for address;
  using Counters for Counters.Counter;

  mapping(uint256 => address) public tokenIdToContract;
  mapping(uint256 => string) public tokenIdToFunctions;
  mapping(uint256 => string) public tokenIdToSlug;
  mapping(string => uint256) public slugToTokenId;
  uint256 private fee = 0.00 ether;
  Counters.Counter private _tokenIdCounter;

  constructor() ERC721("UwabeConfigToken", "UCT") {}

  function buy(address _contract, string memory _functions, string memory _slug) payable external {
    require(msg.value >= fee, "Fee is not enough");
    require(bytes(_slug).length > 0, "Slug is required");
    require(_contract != address(0), "Contract address is required");
    require(Address.isContract(_contract), "This address is not a contract");
    require(bytes(_functions).length > 0, "Functions are required");
    require(slugToTokenId[_slug] == 0, "Slug is already taken");

    uint256 _tokenId = _tokenIdCounter.current();
    _tokenIdCounter.increment();

    _mint(msg.sender, _tokenId);
    tokenIdToContract[_tokenId] = _contract;
    tokenIdToFunctions[_tokenId] = _functions;
    tokenIdToSlug[_tokenId] = _slug;
    slugToTokenId[_slug] = _tokenId;
  }

  function tokenURI(uint256 _tokenId) public view override returns (string memory) {
    require(_exists(_tokenId), "Non-existent Token ID");

    address contractAddress = tokenIdToContract[_tokenId];
    string memory functions = tokenIdToFunctions[_tokenId];
    string memory slug = tokenIdToSlug[_tokenId];

    return string(
      abi.encodePacked(
        'data:application/json;base64,',
        Base64.encode(
          bytes(
            abi.encodePacked(
              '{"name":"', tokenName(_tokenId),
                '","description":"Otoshidama in Pochi Bukuro',
                '","attributes":[",',
                  '{"trait_type":"Contract","value":"', contractAddress, '"}',
                  '{"trait_type":"Functions","value":"', functions, '"}',
                  '{"trait_type":"Slug","value":"', slug, '"}',
                '],"image":"https://0xkusari.github.io/uwabe/uwabe.jpg',
              '"}'
            )
          )
        )
      )
    );
  }

  function tokenName(uint256 _tokenId) internal pure returns(string memory) {
    return string(abi.encodePacked("Uwabe #", Strings.toString(_tokenId)));
  }

  function updateFee(uint256 _fee) onlyOwner external {
    fee = _fee;
  }
}
