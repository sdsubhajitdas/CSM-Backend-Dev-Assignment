import { useState } from "react";
import Alert from "../components/Alert";
import { Link, Navigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import FileUploadBox from "../components/FileUploadBox";
import FileUploadList from "../components/FileUploadList";
import useAuthentication from "../hooks/useAuthentication";
import { UploadCloud, ArrowLeftSquare } from "lucide-react";

export default function Upload() {
  const axios = useAxiosPrivate();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const {
    authentication: { user },
  } = useAuthentication();

  const { error, isError, isLoading, isSuccess, mutate } = useMutation({
    mutationFn: () => {
      const formData = new FormData();
      formData.append("file", selectedFiles[0]);
      return axios.post("/api/file/upload", formData);
    },
  });

  if (isSuccess) return <Navigate to="/" />;

  return (
    <div>
      <FileUploadBox
        selectedFiles={selectedFiles}
        setSelectedFiles={setSelectedFiles}
        disabled={isLoading}
      />

      <FileUploadList selectedFiles={selectedFiles} />

      <div className="flex justify-between max-w-xl mx-auto mt-10">
        <button
          className="px-5 py-3 text-lg text-white bg-blue-500 border border-black rounded hover:bg-blue-700 disabled:bg-gray-500"
          onClick={mutate}
          disabled={isLoading}
        >
          <UploadCloud className="inline mr-4" />
          Upload
        </button>
        <Link to="/">
          <button
            className="px-5 py-3 text-lg text-white bg-red-500 border border-black rounded hover:bg-red-700 disabled:bg-gray-500"
            disabled={isLoading}
          >
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
      {isError ? (
        <Alert variant="error" message={error.response.data.message} />
      ) : null}
    </div>
  );
}
