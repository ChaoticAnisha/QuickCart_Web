"use client";

import AuthLayout from "@/components/AuthLayout";
import FormInput from "@/components/FormInput";
import { loginSchema } from "@/lib/validation";

export default function LoginPage() {
  function handleSubmit(formData: FormData) {
    const data = {
      email: formData.get("email"),
      password: formData.get("password"),
    };

    const result = loginSchema.safeParse(data);
    if (!result.success) {
      alert("Validation failed");
      return;
    }

    alert("Login successful (dummy)");
  }

  return (
    <AuthLayout title="Login">
      <form action={handleSubmit}>
        <FormInput label="Email" name="email" />
        <FormInput label="Password" type="password" name="password" />
        <button type="submit">Login</button>
      </form>
    </AuthLayout>
  );
}
