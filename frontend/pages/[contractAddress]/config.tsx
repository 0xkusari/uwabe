import {
  ContractFunction,
  ContractFunctionItem,
} from "@/components/ContractFunctionItem";
import { useEffect, useState } from "react";
import { ethers } from "ethers";

const configTokenAddress = '0xCeC87Fa14307f19230f754d195eD85eDC5Df5De3';
const configTokenAbi = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"approved","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":false,"internalType":"bool","name":"approved","type":"bool"}],"name":"ApprovalForAll","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"approve","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_contract","type":"address"},{"internalType":"string","name":"_functions","type":"string"},{"internalType":"string","name":"_slug","type":"string"}],"name":"buy","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"getApproved","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"bool","name":"approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"","type":"string"}],"name":"slugToTokenId","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"tokenIdToContract","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"tokenIdToFunctions","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"tokenIdToSlug","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_tokenId","type":"uint256"}],"name":"tokenURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"transferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_fee","type":"uint256"}],"name":"updateFee","outputs":[],"stateMutability":"nonpayable","type":"function"}];

export default function ConfigPage() {
  const [contractFunctions, setContractFunctions] = useState<[] | null>(null);
  const [windowEthereum, setWindowEthereum] = useState();
  // const [exposeFunctions, setExposeFunctions] = useState<string[]>([]);

  useEffect(() => {
    const { ethereum } = window as any;
    setWindowEthereum(ethereum);

    fetchContractData(configTokenAddress);
  });

  // const fetchConfig = () => {
  //   if (windowEthereum) {
  //     const provider = new ethers.providers.Web3Provider(windowEthereum);
  //     provider.send('eth_requestAccounts', []);
  //     const signer = provider.getSigner();
  //     const contract = new ethers.Contract(
  //       configTokenAddress,
  //       configTokenAbi,
  //       provider
  //     );

  //     const contractWithSigner = contract.connect(signer);
  //     contractWithSigner["tokenURI"](0).then((result: any) => {
  //       console.log("Get from Config Token");
  //       console.table(result.toString());
  //       // setExposeFunctions(JSON.parse(result.toString()));
  //       setExposeFunctions(["name", "symbol", "decimals"]);
  //     });
  //     // contractWithSigner[name](...inputValues).then(console.table);
  //   }

  //   setExposeFunctions([]);
  // };

  const fetchContractData = async (address: string) => {
    const response = await fetch(`/api/contract?address=${address}`);
    const data = await response.json();
    if (data.status === "1") {
      const results = JSON.parse(data.result);
      const functions = results.filter(
        (result: any) => result.type === "function"
      );

      const mapper = (func: any): ContractFunction => {
        return {
          name: func.name,
          inputs: func.inputs,
          outputs: func.outputs,
          readonly:
            func.stateMutability === "view" || func.stateMutability === "pure",
          contractAddress: address,
          abi: results,
        };
      };

      console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");

      let exposeFunctions: string[] = [];
      if (windowEthereum) {
        console.log("bbbbbbbbbbbbbbbbbbbbbbbbb");
        const provider = new ethers.providers.Web3Provider(windowEthereum);
        provider.send('eth_requestAccounts', []);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          configTokenAddress,
          configTokenAbi,
          provider
        );
        console.log("bccccccccccccccccccccccccccccccc");


        const contractWithSigner = contract.connect(signer);

        console.log("dddddddddddddd");

        contractWithSigner["tokenURI"](0).then((result: any) => {
          console.log("eeeeeeeeeeeeeeeee");
          console.log("Get from Config Token");
          console.table(result.toString());
          console.log("ffffffffffffffffff")
          // setExposeFunctions(JSON.parse(result.toString()));
          // setExposeFunctions(["name", "symbol", "decimals"]);
          exposeFunctions = ["buy"];
          console.table(exposeFunctions)


          console.log("gggggggggggg")
        });
        // contractWithSigner[name](...inputValues).then(console.table);
      }

      console.table(functions)
      console.table(exposeFunctions)

      const filtered = functions.filter((func: any) => exposeFunctions?.indexOf(func.name) !== -1).map(mapper);
      console.table(filtered);
      console.log("hhhhhhhhhhhhh")
      setContractFunctions(filtered);
      console.log("iiiiiiiiiiiiii")
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      {contractFunctions ? (
        <div>
          <ul>
            {contractFunctions.map((contractFunction: ContractFunction) => (
              <li
                key={`${contractFunction.name}_${contractFunction.inputs.length}_${contractFunction.outputs.length}_${contractFunction.readonly}`}
              >
                <ContractFunctionItem {...contractFunction} />
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <progress className="progress w-56"></progress>
      )}
    </div>
  );
}
