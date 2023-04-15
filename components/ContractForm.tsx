import { useState } from "react";

interface Props {
  onSubmit: (contractAddress: string) => void;
}

export default function ContractForm({ onSubmit }: Props) {
  const [contractAddress, setContractAddress] = useState<string>("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (contractAddress) {
      onSubmit(contractAddress);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="form-control w-full max-w-xs">
        <label className="label" htmlFor="contractAddress">
          <span className="label-text">Enter Contract Address</span>
        </label>
        <input
          type="text"
          id="contractAddress"
          placeholder="0x..."
          className="input input-bordered w-full max-w-x"
          onChange={(e) => setContractAddress(e.target.value)}
        />
      </div>
      <button type="submit" className="btn btn-primary btn-wide">
        View Contract
      </button>
    </form>
  );
}
