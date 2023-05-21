import { ethers } from "ethers";
import { useEffect, useState } from 'react';

export interface Input {
  internalType: string;
  name: string;
  type: string;
}

export interface Output {
  internalType: string;
  name: string;
  type: string;
}

export interface ContractFunction {
  name: string;
  inputs: Input[];
  outputs: Output[];
  readonly: boolean;
  payable: boolean;
  abi: any;
  contractAddress: string;
}

export function ContractFunctionItem({
  name,
  inputs,
  outputs,
  readonly,
  payable,
  contractAddress,
  abi,
}: ContractFunction) {

  const [inputValues, setInputValues] = useState<string[]>([]);
  const [payValue, setPayValue] = useState<string>("");
  const [result, setResult] = useState<any>(null);

  const [windowEthereum, setWindowEthereum] = useState();

  useEffect(() => {
    const { ethereum } = window as any;

    setWindowEthereum(ethereum);
  }, []);

  const updateInputValues = (index: number, value: string) => {
    const newInputValues = [...inputValues];
    newInputValues[index] = value;
    setInputValues(newInputValues);
  };

  const handleOnClick = (name: string, readonly: boolean) => {
    console.log(`${name}(${inputValues.join(",")})`);
    if (windowEthereum) {
      const provider = new ethers.providers.Web3Provider(windowEthereum);

      // MetaMask requires requesting permission to connect users accounts
      provider.send('eth_requestAccounts', []).then(console.log);

      const signer = provider.getSigner();

      const contract = new ethers.Contract(
        contractAddress,
        abi,
        provider
      );

      const contractWithSigner = contract.connect(signer);

      let option: { [key: string]: any } = {};
      if (payable) {
        option.value = ethers.utils.parseEther(payValue);
      }

      contractWithSigner[name](...inputValues, option).then((result: any) => {
        if (readonly) {
          setResult(result.toString());
        } else {
          const etherscanTxUrl = `https://goerli.etherscan.io/tx/${result.hash}`;
          setResult(etherscanTxUrl);
        }
      });
    }
  };

  return (
    <div className="card w-[40rem] bg-base-100 shadow-xl m-4">
      <div className="card-body">
        <h2 className="card-title">{name}</h2>
        {payable && (
          <input
            type="text"
            placeholder="Payable amount (ETH)"
            className="input input-bordered w-full max-w-x"
            onChange={(e) => { setPayValue(e.target.value) }}
          />
        )}
        {inputs.map((input, index) => {
          return (
            <input
              key={`${name}_${inputs.length}_${input.name}_${outputs.length}_${readonly}`}
              type="text"
              placeholder={`${input.name} (${input.type})`}
              className="input input-bordered w-full max-w-x"
              onChange={(e) => { updateInputValues(index, e.target.value) }}
            />
          );
        })}
        <div className="card-actions justify-end">
          <button
            className="btn btn-primary"
            onClick={() => handleOnClick(name, readonly)}
          >
            {readonly ? "Query" : "Write"}
          </button>
        </div>
        {readonly && (
          <div>{`=> ${outputs.map((output) => output.type).join(",")}`}</div>
        )}
        {result && <p className="alert shadow-lg">{result}</p>}
      </div>
    </div>
  );
}
