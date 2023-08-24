import { useRef } from "react";
import { UploadCloud } from "lucide-react";
import useAuthentication from "../hooks/useAuthentication";

export default function FileUploadBox({
  selectedFiles,
  setSelectedFiles,
  disabled,
}) {
  const uploadBoxRef = useRef(null);
  const {
    authentication: { user },
  } = useAuthentication();

  function handleFileDrop(e) {
    const files = e.target.files;
    if (user.subscription.tier === "FREE") {
      if (selectedFiles.length === 0) {
        setSelectedFiles([files[0]]);
      }
    } else {
      setSelectedFiles((prev) => [...prev, ...files]);
    }
  }

  return (
    <div
      className="relative max-w-xl p-4 mx-auto border border-blue-500 rounded-lg hover:opacity-70"
      ref={uploadBoxRef}
      onDragEnter={() => uploadBoxRef.current.classList.add("opacity-70")}
      onDragLeave={() => uploadBoxRef.current.classList.remove("opacity-70")}
      onDrop={() => uploadBoxRef.current.classList.remove("opacity-70")}
    >
      <div className="flex flex-col p-5 text-gray-700 border-2 border-black border-dashed rounded-lg bg-blue-50">
        <UploadCloud className="w-full h-48 aspect-square" />
        <p className="text-xl font-medium text-center">
          Click or drag & drop your files here
        </p>
      </div>
      <input
        className="absolute top-0 bottom-0 left-0 right-0 m-4 opacity-0"
        type="file"
        onChange={handleFileDrop}
        accept="image/*"
        multiple={user.subscription.tier === "PRO"}
        disabled={disabled}
      />
    </div>
  );
}
