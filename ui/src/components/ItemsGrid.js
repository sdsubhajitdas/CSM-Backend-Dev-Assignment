import useAuthentication from "../hooks/useAuthentication";
import { Download } from "lucide-react";

export default function ItemsGrid({ images }) {
  const {
    authentication: { user },
  } = useAuthentication();

  return (
    <>
      <h2 className="mt-5 mb-3 text-3xl">
        {user.fullName.split(" ")[0]}'s uploaded images
      </h2>
      <div className="grid grid-cols-3 gap-8 px-2 py-5 border border-black rounded">
        {images.length === 0 ? (
          <h3 className="col-span-3 text-lg text-center">Nothing to display</h3>
        ) : null}
        {images.map((image) => (
          <div key={image._id} className="p-3 border border-blue-500 rounded">
            <img
              src={image.url}
              alt={image.fullName}
              className="border border-black object-fit"
            />

            <div className="flex mt-1">
              <span className="my-auto text-lg italic text-gray-700 truncate grow">
                {image.fullName}
              </span>
              <a
                className="px-5 py-1.5 rounded-full hover:bg-blue-500 hover:text-white"
                href={image.url}
                alt={image.fullName}
                target="_blank"
                rel="noreferrer"
                download
              >
                <Download className="h-full aspect-square" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
