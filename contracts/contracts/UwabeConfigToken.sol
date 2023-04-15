// SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract UwabeConfigToken is ERC721, Ownable {
  using Address for address;
  using Counters for Counters.Counter;

  mapping(uint256 => address) public tokenIdToContract;
  mapping(uint256 => string) public tokenIdToFunctions;
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
    slugToTokenId[_slug] = _tokenId;
  }

  function updateFee(uint256 _fee) onlyOwner external {
    fee = _fee;
  }
}
