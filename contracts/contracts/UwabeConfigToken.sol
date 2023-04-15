// SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract UwabeConfigToken is ERC721 {
  constructor() ERC721("UwabeConfigToken", "UCT") {}
}
