import { Link } from "react-router-dom";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useAuthentication from "../hooks/useAuthentication";

export default function Navbar() {
  const {
    authentication: { user },
  } = useAuthentication();

  return (
    <nav className="flex gap-5 px-5 py-3 text-white bg-blue-500">
      <Link to="/" className="text-3xl font-bold">
        Assignment
      </Link>
      <span className="my-auto ml-auto text-xl font-medium">
        Welcome back {user.fullName}
      </span>
      <SubscriptionTier variant={user.subscription.tier} />
      <LogoutButton />
    </nav>
  );
}

function LogoutButton() {
  const axios = useAxiosPrivate();
  const { setAuthentication } = useAuthentication();

  async function logout() {
    await axios.get("api/authentication/logout");
    setAuthentication((previous) => ({
      ...previous,
      isAuthenticated: false,
      user: null,
    }));
  }

  return (
    <button
      className="px-3 py-1.5 bg-white border border-black rounded font-medium text-black"
      onClick={logout}
    >
      Logout
    </button>
  );
}

function SubscriptionTier({ variant }) {
  return (
    <span className="px-2 py-1 my-auto font-medium text-blue-500 bg-white border border-black rounded-full">
      Subscription Tier: {variant}
    </span>
  );
}
