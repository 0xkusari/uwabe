import ContractForm from "@/components/ContractForm";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();

  const handleSubmit = (contractAddress: string) => {
    router.push(`/${contractAddress}`);
  };

  return (
    <div className="background">
      <div className="min-h-screen flex items-center justify-center">
        <div className="card w-96 bg-base-100 shadow-xl items-center justify-center">
          <div className="card-body">
            <ContractForm onSubmit={handleSubmit} />
          </div>
        </div>
      </div>
    </div>
  );
}
