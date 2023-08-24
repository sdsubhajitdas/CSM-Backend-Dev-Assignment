import useAuthentication from "../hooks/useAuthentication";
import { Trash2 } from "lucide-react";

export default function ItemsGrid() {
  const {
    authentication: { user },
  } = useAuthentication();

  return (
    <>
      <h2 className="mt-5 mb-3 text-3xl">
        {user.fullName.split(" ")[0]}'s uploaded images
      </h2>
      <div className="grid grid-cols-3 gap-8 px-2 py-5 border border-black rounded">
        {new Array(10).fill(1).map((_, index) => (
          <div key={index} className="p-3 border border-blue-500 rounded">
            <img
              src="https://random.imagecdn.app/500/500"
              alt="Uploaded view"
              className="border border-black"
            />

            <div className="flex mt-1">
              <span className="my-auto text-lg italic text-gray-700 truncate grow">
                example.png
              </span>
              <button className="px-5 py-1.5 rounded-full hover:bg-blue-500 hover:text-white">
                <Trash2 className="h-full aspect-square" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
