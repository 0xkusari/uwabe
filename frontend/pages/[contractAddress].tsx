import {
  ContractFunction,
  ContractFunctionItem,
} from "@/components/ContractFunctionItem";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import Link from 'next/link'
import { configTokenAddress, configTokenAbi } from "@/components/ConfigToken";

export default function ContractAddress() {
  const router = useRouter();
  const { contractAddress } = router.query;
  const [contractFunctions, setContractFunctions] = useState<[] | null>(null);
  const [windowEthereum, setWindowEthereum] = useState();
  const [config, setConfig] = useState(null);

  useEffect(() => {
    const { ethereum } = window as any;
    setWindowEthereum(ethereum);

    if (contractAddress) {
      // コントラクトアドレスではない場合は、slugからコントラクトアドレスを取得する
      if (ethers.utils.isAddress(contractAddress as string) === false) {
        // ConfigTokenから設定値を取得
        // slug でNFTにアクセスして、コントラクトアドレスを取得。slugからtoken_idを取得
        // 1. slug から token_id を取得
        console.log("slugからtoken_idを取得");
        console.log(contractAddress);
        fetchConfig();
        // 2. token_id から設定を取得
      }
      fetchContractData(contractAddress as string);
      // 最後にフィルターかける。共通の処理
    }
  }, []);

  useEffect(() => {
    fetchConfig(windowEthereum);
  }, [windowEthereum]);

  useEffect(() => {
    fetchContractData(contractAddress as string);
  }, [config]);

  const fetchConfig = (windowEthereum: any) => {
    console.log(windowEthereum);
    if (windowEthereum) {
      console.log("windowEthereumの中です");
      const provider = new ethers.providers.Web3Provider(windowEthereum);
      provider.send('eth_requestAccounts', []).then(console.log);
      const signer = provider.getSigner();

      const contract = new ethers.Contract(
          configTokenAddress, // ConfigTokenのアドレス
          configTokenAbi,
          provider
          );

      const contractWithSigner = contract.connect(signer);
      contractWithSigner["slugToTokenId"](contractAddress).then((result: any) => {
          console.log("Get from Config Token");
          console.table(result.toString());

          contractWithSigner["tokenURI"](result.toString()).then((result: any) => {
              const decodedData = Buffer.from(result.substring(29), 'base64').toString();
              const config = JSON.parse(decodedData);
              console.table(config);
              setConfig(config);
          });
      });
      // contractWithSigner[name](...inputValues).then(console.table);
    }
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

      const exposeFunctions: any[] = fetchConfig();
      const filtered = exposeFunctions.length > 0 ? functions.filter((func: any) => exposeFunctions?.indexOf(func.name) !== -1) : functions;
      setContractFunctions(filtered.map(mapper));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      {contractFunctions ? (
        <div>
          <Link href={`/${contractAddress}/config`} className="link link-primary" >
            Config for uwabe
          </Link>
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
