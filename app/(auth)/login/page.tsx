import { LoginCard, LoginFooter, LoginForm, LoginLogo } from "@/components/auth";

export default function LoginPage() {
  return (
    <LoginCard>
      <LoginLogo />
      <LoginForm />
      <LoginFooter />
    </LoginCard>
  );
}