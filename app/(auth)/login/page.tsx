import { LoginCard } from "@/components/auth/LoginCard";
import { LoginFooter } from "@/components/auth/LoginFooter";
import { LoginLogo } from "@/components/auth/LoginLogo";
import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <LoginCard>
      <LoginLogo />
      <LoginForm />
      <LoginFooter />
    </LoginCard>
  );
}