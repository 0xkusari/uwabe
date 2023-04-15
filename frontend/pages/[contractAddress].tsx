import {
  ContractFunction,
  ContractFunctionItem,
} from "@/components/ContractFunctionItem";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ethers } from "ethers";

const configTokenAbi = [{"inputs":[{"internalType":"address","name":"_designer","type":"address"},{"internalType":"address","name":"_programmer","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"approved","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":false,"internalType":"bool","name":"approved","type":"bool"}],"name":"ApprovalForAll","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"approve","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"designer","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"getApproved","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_destination","type":"address"}],"name":"otoshidama","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"programmer","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"bool","name":"approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"_newBaseURI","type":"string"}],"name":"setBaseURI","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"tokenURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"transferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"}];

export default function ContractAddress() {
  const router = useRouter();
  const { contractAddress } = router.query;
  const [contractFunctions, setContractFunctions] = useState<[] | null>(null);
  const [windowEthereum, setWindowEthereum] = useState();
  const [exposeFunctions, setExposeFunctions] = useState<string[]>([]);

  useEffect(() => {
    const { ethereum } = window as any;
    setWindowEthereum(ethereum);

    if (contractAddress) {
      fetchContractData(contractAddress as string);
    }
  }, []);

  const fetchConfig = () => {
    // if (windowEthereum) {
    //   const provider = new ethers.providers.Web3Provider(windowEthereum);
    //   provider.send('eth_requestAccounts', []).then(console.log);
    //   const signer = provider.getSigner();

    //   const contract = new ethers.Contract(
    //     "0x8f79b3af00f2d002bc02841feefbd183aaca7067",
    //     configTokenAbi,
    //     provider
    //   );

    //   const contractWithSigner = contract.connect(signer);
    //   contractWithSigner["designer"]([]).then((result: any) => {
    //     console.log("Get from Config Token");
    //     console.table(result.toString());
    //   });
    //   // contractWithSigner[name](...inputValues).then(console.table);
    // }

    return [
      'balanceOf',
      'designer',
      'programmer',
    ];
  };

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

      const exposeFunctions = fetchConfig();
      const filtered = functions.filter((func: any) => exposeFunctions?.indexOf(func.name) !== -1).map(mapper);
      setContractFunctions(filtered);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      {contractFunctions ? (
        <ul>
          {contractFunctions.map((contractFunction: ContractFunction) => (
            <li
              key={`${contractFunction.name}_${contractFunction.inputs.length}_${contractFunction.outputs.length}_${contractFunction.readonly}`}
            >
              <ContractFunctionItem {...contractFunction} />
            </li>
          ))}
        </ul>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
