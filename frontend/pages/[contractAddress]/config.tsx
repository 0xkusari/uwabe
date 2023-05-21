import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { Buffer } from "buffer";
import {
  ContractFunction,
  ContractFunctionItem,
} from "@/components/ContractFunctionItem";
import { configTokenAddress, configTokenAbi } from "@/components/ConfigToken";

export default function ConfigPage() {
  const [windowEthereum, setWindowEthereum] = useState();
  const [contractFunctions, setContractFunctions] = useState<ContractFunction[]>([]);
  const [exposeFunctions, setExposeFunctions] = useState<string[]>([]);
  const [filteredFunctions, setFilteredFunctions] = useState<ContractFunction[]>([]);

  useEffect(() => {
    const { ethereum } = window as any;
    setWindowEthereum(ethereum);
  }, []);

  useEffect(() => {
    fetchContractData();
  }, [windowEthereum]);

  useEffect(() => {
    fetchConfig(windowEthereum);
  }, [windowEthereum, contractFunctions]);

  useEffect(() => {
    filterFunctions(contractFunctions, exposeFunctions);
  }, [contractFunctions, exposeFunctions]);

  const fetchConfig = (windowEthereum: any) => {
    if (!windowEthereum) {
      return [];
    }

    const provider = new ethers.providers.Web3Provider(windowEthereum);
    provider.send('eth_requestAccounts', []);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      configTokenAddress,
      configTokenAbi,
      provider
    );

    const contractWithSigner = contract.connect(signer);
    contractWithSigner["tokenURI"](0) // token_id 0, ConfigTokenを取得している
    .then((result: any) => {
      const decodedData = Buffer.from(result.substring(29), 'base64').toString()
      const functions = JSON.parse(decodedData).attributes.filter((attr: any) => attr.trait_type === "Functions")[0].value.split(",")
      setExposeFunctions(functions);
    });
  };

  const filterFunctions = (allFunctions: ContractFunction[], exposeFunctions: string[]) => {
    const filtered = allFunctions.filter((contractFunction: any) => {
      return exposeFunctions.includes(contractFunction.name);
    });
    setFilteredFunctions(filtered);
  };

  const fetchContractData = async () => {
    const response = await fetch(`/api/contract?address=${configTokenAddress}`);
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
          contractAddress: configTokenAddress,
          abi: results,
        };
      };
      setContractFunctions(functions.map(mapper));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      {contractFunctions ? (
        <div>
          <ul>
            {filteredFunctions.map((contractFunction: ContractFunction) => (
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
