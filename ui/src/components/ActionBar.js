import { Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { UploadCloud, DollarSign, X } from "lucide-react";
import useAuthentication from "../hooks/useAuthentication";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import Alert from "../components/Alert";

export default function ActionBar() {
  const axios = useAxiosPrivate();
  const {
    authentication: { user },
    setAuthentication,
  } = useAuthentication();
  const { error, isError, isLoading, mutate } = useMutation({
    mutationFn: () => {
      return axios.post("api/payment/unsubscribe");
    },
    onSuccess: (data) => {
      setAuthentication((previous) => ({
        ...previous,
        user: { ...previous.user, ...data.data.user },
      }));
    },
  });

  return (
    <>
      <div className="flex gap-5 px-2 py-5 border border-black rounded">
        <ActionBarButton
          icon={<UploadCloud className="inline" />}
          text="Upload Image"
          link="/upload"
        />
        <ActionBarButton
          icon={<DollarSign className="inline" />}
          text={
            user.subscription.tier === "FREE"
              ? "Upgrade to Pro tier"
              : "Already upgraded to Pro tier"
          }
          link="/checkout"
          disabled={user.subscription.tier === "PRO"}
        />
        {user.subscription.tier === "PRO" ? (
          <ActionBarButton
            icon={<X className="inline" />}
            text="Cancel Subscription"
            disabled={isLoading}
            action={mutate}
          />
        ) : null}
      </div>
      {isError ? (
        <Alert variant="error" message={error.response.data.message} />
      ) : null}
    </>
  );
}

function ActionBarButton({ icon, text, link, disabled, action }) {
  let buttonElement = (
    <button
      className="px-3 py-2 text-white bg-blue-500 rounded hover:bg-blue-700 disabled:bg-gray-500"
      disabled={disabled}
      onClick={action}
    >
      {icon} {text}
    </button>
  );
  return link ? <Link to={link}>{buttonElement}</Link> : buttonElement;
}
