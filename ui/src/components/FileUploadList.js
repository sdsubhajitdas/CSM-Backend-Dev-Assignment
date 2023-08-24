import { FileImage } from "lucide-react";

export default function FileUploadList({ selectedFiles }) {
  return selectedFiles.length > 0 ? (
    <ul className="max-w-xl p-4 mx-auto mt-5 border border-blue-500 rounded-lg">
      {selectedFiles.map((file) => (
        <li key={file.name} className="relative px-2 py-3 bg-blue-100 rounded">
          <FileImage className="inline w-16 h-16" />
          <span className="absolute text-xl italic font-semibold top-3 right-3 left-24">
            {file.name}
          </span>
          <span className="absolute italic bottom-4 right-3 left-24">
            {file.size} bytes
          </span>
          <span className="absolute text-xs italic bottom-4 right-2">
            {file.lastModifiedDate.toString().split(" (")[0]}
          </span>
        </li>
      ))}
    </ul>
  ) : null;
}
