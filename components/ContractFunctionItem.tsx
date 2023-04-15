import { useState } from "react";

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
}

export function ContractFunctionItem({
  name,
  inputs,
  outputs,
  readonly,
}: ContractFunction) {

  const [inputValues, setInputValues] = useState<string[]>([]);

  const updateInputValues = (index: number, value: string) => {
    const newInputValues = [...inputValues];
    newInputValues[index] = value;
    setInputValues(newInputValues);
  };

  const handleOnClick = (name: string) => {
    console.log(`${name}(${inputValues.join(",")})`);
  };

  return (
    <div className="card w-96 bg-base-100 shadow-xl m-4">
      <div className="card-body">
        <h2 className="card-title">{name}</h2>
        {inputs.map((input, index) => {
          return (
            <input
              key={`${name}_${inputs.length}_${input.name}_${outputs.length}_${readonly}`}
              type="text"
              placeholder={`${input.name} (${input.type})`}
              className="input input-bordered w-full max-w-x"
              onChange={(e) => { updateInputValues(index, e.target.value)}}
            />
          );
        })}
        <div className="card-actions justify-end">
          <button
            className="btn btn-primary"
            onClick={() => handleOnClick(name)}
          >
            {readonly ? "Query" : "Write"}
          </button>
        </div>
        {readonly && (
          <div>{`=> ${outputs.map((output) => output.type).join(",")}`}</div>
        )}
      </div>
    </div>
  );
}
