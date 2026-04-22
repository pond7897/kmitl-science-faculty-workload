import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-[#f0ebe5]">
          Unauthorized
        </h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-[#8b7f77]">
          You don&apos;t have permission to access this page.
        </p>
        <div className="mt-6 flex items-center justify-end gap-2">
          <Button asChild variant="secondary">
            <Link href="/dashboard">Go to dashboard</Link>
          </Button>
          <Button asChild>
            <Link href="/login">Back to login</Link>
          </Button>
        </div>
      </Card>
    </div>
  );
}
