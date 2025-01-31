"use client";

import { useState } from "react";
import { Input } from "../ui/input";
import PrimaryButton from "../Button/PrimaryButton";

const SolSelector = ({ setMetadata }: any) => {
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState("");
  const handleSubmit = () => {
    setMetadata({
      email,
      amount,
    });
  };

  return (
    <div className="flex flex-col gap-y-2">
      <Input
        type="text"
        placeholder="To"
        onChange={(e) => setEmail(e.target.value)}
        value={email}
      />
      <Input
        type="text"
        placeholder="amount"
        onChange={(e) => setAmount(e.target.value)}
        value={amount}
      />
      <PrimaryButton onClick={handleSubmit}>Submit</PrimaryButton>
    </div>
  );
};

export default SolSelector;
