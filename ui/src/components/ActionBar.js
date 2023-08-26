import { UploadCloud, DollarSign } from "lucide-react";
import { Link } from "react-router-dom";

export default function ActionBar() {
  return (
    <div className="flex gap-5 px-2 py-5 border border-black rounded">
      <ActionBarButton
        icon={<UploadCloud className="inline" />}
        text="Upload Image"
        link="/upload"
      />
      <ActionBarButton
        icon={<DollarSign className="inline" />}
        text="Upgrade to Pro tier"
        link="/checkout"
      />
    </div>
  );
}

function ActionBarButton({ icon, text, link }) {
  let buttonElement = (
    <button className="px-3 py-2 text-white bg-blue-500 rounded hover:bg-blue-700">
      {icon} {text}
    </button>
  );
  return link ? <Link to={link}>{buttonElement}</Link> : buttonElement;
}
