"use client";
import { useState } from "react";
import { Input } from "../ui/input";
import PrimaryButton from "../Button/PrimaryButton";

const EmailSelector = ({ setMetadata }: any) => {
  const [email, setEmail] = useState("");
  const [body, setBody] = useState("");

  const handleSubmit = () => {
    setMetadata({
      email,
      body,
    });
  };
  return (
    <div className="flex flex-col gap-y-4 my-2">
      <Input
        type="text"
        placeholder="To"
        onChange={(e) => setEmail(e.target.value)}
        value={email}
      />
      <Input
        type="text"
        placeholder="Body content"
        onChange={(e) => setBody(e.target.value)}
        value={body}
      />
      <PrimaryButton onClick={handleSubmit}>Submit</PrimaryButton>
    </div>
  );
};

export default EmailSelector;
