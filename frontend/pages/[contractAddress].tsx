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
  // const { query } = router.query;
  const [query, setQuery] = useState<any>(null);
  const [slug, setSlug] = useState<string | null>(null);
  const [contractAddress, setContractAddress] = useState<string | null>(null);
  const [contractFunctions, setContractFunctions] = useState<[] | null>(null);
  const [filteredFunctions, setFilteredFunctions] = useState<[] | null>(null);
  const [windowEthereum, setWindowEthereum] = useState();
  const [config, setConfig] = useState(null);

  useEffect(() => {
    setQuery(router.query);
  }, [router]);

  useEffect(() => {
    if (query) {
      const { ethereum } = window as any;
      setWindowEthereum(ethereum);

      console.table(query);
      // コントラクトアドレスではない場合は、slugからコントラクトアドレスを取得する
      if (ethers.utils.isAddress(query.contractAddress)) {
        setContractAddress(query.contractAddress);
      } else {
        setSlug(query.contractAddress);
      }
    }
  }, [query, router]);

  useEffect(() => {
    if (contractAddress) {
      return;
    } else if (slug) {
      fetchConfig(windowEthereum);
    }
  }, [windowEthereum]);

  useEffect(() => {
    fetchContractData(contractAddress as string);
  }, [config, contractAddress]);

  useEffect(() => {
    if (contractFunctions) {
      filterFunctions(config, contractFunctions);
    }
  }, [contractFunctions]);

  const fetchConfig = (windowEthereum: any) => {
    // slugからtokenIDを取得して、コントラクトアドレスとConfigを取得してstateに保存する
    // Configオブジェクトには、以下が含まれる
    // - コントラクトアドレス
    // - 公開する関数のリスト
    console.log("=============================================================")
    console.log("fetchConfig")

    if (windowEthereum) {
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
              setContractAddress(config.attributes.filter((attr: any) => attr.trait_type === "Contract")[0].value);
          });
      });
      // contractWithSigner[name](...inputValues).then(console.table);
    }

    return [];
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

      setContractFunctions(functions.map(mapper));
    }
  };

  const filterFunctions = (config: any, contractFunctions: []) => {
    if (!config) {
      setFilteredFunctions(contractFunctions);
      return;
    }

    const exposeFunctions = config.attributes.filter((attr: any) => attr.trait_type === "Functions")[0].value.split(",");
    const filteredFunctions = contractFunctions.filter((contractFunction: ContractFunction) => {
      exposeFunctions.includes(contractFunction.name);
    });

    setFilteredFunctions(filteredFunctions as []);
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      {contractFunctions ? (
        <div>
          <Link href={`/${contractAddress}/config`} className="link link-primary" >
            Config for uwabe
          </Link>
          <ul>
            {filteredFunctions?.map((contractFunction: ContractFunction) => (
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
