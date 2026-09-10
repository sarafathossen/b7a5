import Link from "next/link";
import LoginForm from "../_components/loginForm";

export default function loginPage() {
  return (
    <>
      <div className="flex min-h-screen items-center justify-center" >

        <div className="w-full max-w-md space-y-6 rounded-lg border p-8 shadow-lg">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold">Welcome Back</h1>
            <p className="text-gray-500">Enter your credentials to access your account</p>
          </div>
          <LoginForm></LoginForm>
          <p className="text-center text-sm text-muted-foreground">
            New in Gearup Please register{" "}
            <Link
              href="/register"
              className="font-semibold text-primary hover:underline"
            >
              Register
            </Link>
          </p>

        </div>
      </div>
    </>
  )
}
