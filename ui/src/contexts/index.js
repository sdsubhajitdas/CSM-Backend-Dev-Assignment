import QueryProvider from "./QueryContextProvider";
import { AuthenticationProvider } from "./AuthenticationContextProvider";

export default function ContextProviders({ children }) {
  return (
    <QueryProvider>
      <AuthenticationProvider>{children}</AuthenticationProvider>
    </QueryProvider>
  );
}
