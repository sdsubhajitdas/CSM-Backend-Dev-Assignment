import { X } from "lucide-react";
import { useState } from "react";

export default function Alert({ variant, message }) {
  let [isHidden, setIsHidden] = useState(false);
  const backgroundColour = {
    error: "bg-red-300",
    warn: "bg-yellow-300",
    success: "bg-green-300",
  };

  const hoverColour = {
    error: "hover:bg-red-400",
    warn: "hover:bg-yellow-400",
    success: "hover:bg-green-400",
  };

  if (isHidden) return null;

  return (
    <div
      className={`relative py-4 m-3 mt-10 rounded-lg px-7 ${backgroundColour[variant]}`}
    >
      <span className="text-lg">{message}</span>
      <span
        className={`absolute p-1 rounded-full right-3 top-2 ${hoverColour[variant]}`}
        onClick={() => setIsHidden(true)}
      >
        <X className="w-5 h-5" />
      </span>
    </div>
  );
}
