import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { ThemeSwitcher } from "@/components/layout/ThemeSwitcher";

/**
 * Bottom utility row: language + theme toggles.
 * Server Component — the individual switchers handle their own client state.
 */
export function LoginFooter() {
  return (
    <div className="pt-1 flex items-center justify-center gap-2">
      <LanguageSwitcher />
      <ThemeSwitcher />
    </div>
  );
}