"use client";

import { PaystackButton } from "react-paystack";

import { PaystackConfig } from "../modules/home/PriceSection";

// Re-defining props for clarity, can be adjusted
interface PaystackButtonClientProps extends PaystackConfig {
  onSuccess: (reference: { reference: string }) => void;
  onClose: () => void;
  className: string;
  disabled: boolean;
  text: string;
  onClick: () => void;
}

const PaystackButtonClient = ({
  onSuccess,
  onClose,
  className,
  disabled,
  text,
  onClick,
  ...configProps
}: PaystackButtonClientProps) => {
  return (
    <PaystackButton
      {...configProps}
      onSuccess={onSuccess}
      onClose={onClose}
      className={className}
      disabled={disabled}
      text={text}
      onClick={onClick}
    />
  );
};

export default PaystackButtonClient;
