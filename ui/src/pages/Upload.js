import { UploadCloud, ArrowLeftSquare } from "lucide-react";
import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import Alert from "../components/Alert";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import FileUploadBox from "../components/FileUploadBox";
import FileUploadList from "../components/FileUploadList";
import useAuthentication from "../hooks/useAuthentication";

export default function Upload() {
  const axios = useAxiosPrivate();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const {
    authentication: { user },
  } = useAuthentication();

  function handleFileSubmit(e) {
    const formData = new FormData();
    formData.append("file", selectedFiles[0]);
    axios
      .post("/api/file/upload", formData)
      .then((data) => console.log(data))
      .catch((err) => console.error(err));
  }

  return (
    <div>
      <FileUploadBox
        selectedFiles={selectedFiles}
        setSelectedFiles={setSelectedFiles}
      />
      <FileUploadList selectedFiles={selectedFiles} />

      <div className="flex justify-between max-w-xl mx-auto mt-10">
        <button
          className="px-5 py-3 text-lg text-white bg-blue-500 border border-black rounded hover:bg-blue-700"
          onClick={handleFileSubmit}
        >
          <UploadCloud className="inline mr-4" />
          Upload
        </button>
        <Link to="/">
          <button className="px-5 py-3 text-lg text-white bg-red-500 border border-black rounded hover:bg-red-700">
            <ArrowLeftSquare className="inline mr-4" />
            Cancel
          </button>
        </Link>
      </div>

      {selectedFiles.length > 0 && user.subscription.tier === "FREE" ? (
        <Alert
          variant="warn"
          message="You can upload only one image at once and can upload only one image per hour. Upgrade to Pro tier to unlock upload limits."
        />
      ) : null}
    </div>
  );
}
