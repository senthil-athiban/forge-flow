import { Loader2 } from "lucide-react";

const Loader = () => {
  return (
    <div className="flex h-screen items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
    </div>
  );
};
export default Loader;
