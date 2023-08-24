import Alert from "../components/Alert";
import ActionBar from "../components/ActionBar";
import ItemsGrid from "../components/ItemsGrid";
import { useQuery } from "@tanstack/react-query";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

export default function Home() {
  const axios = useAxiosPrivate();
  const { isLoading, isError, error, data } = useQuery({
    queryKey: ["get_images"],
    queryFn: () => {
      return axios.get("/api/image");
    },
  });

  return (
    <>
      <ActionBar />
      {isError ? (
        <Alert variant="error" message={error.response.data.message} />
      ) : (
        <ItemsGrid images={isLoading ? [] : data.data} />
      )}
    </>
  );
}
