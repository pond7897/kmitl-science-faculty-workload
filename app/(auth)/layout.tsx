import { isAuthenticated } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

/**
 * Auth route group layout.
 * Guards against already-authenticated visits and provides the page shell.
 */
export default async function AuthLayout({ children }: Props) {
  const authenticated = await isAuthenticated();

  if (authenticated) {
    redirect("/dashboard");
  }

  return (
    <div
      className="
        min-h-screen
        bg-[#FDF3EC] dark:bg-[#18110C]
        flex items-center justify-center
        [background-image:radial-gradient(circle,#F2651A22_1.5px,transparent_1.5px)]
        dark:[background-image:radial-gradient(circle,#F2651A18_1.5px,transparent_1.5px)]
        [background-size:28px_28px]
      "
    >
      {children}
    </div>
  );
}
