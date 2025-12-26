"use client";

import AuthLayout from "@/components/AuthLayout";
import FormInput from "@/components/FormInput";
import { registerSchema } from "@/lib/validation";

export default function RegisterPage() {
  function handleSubmit(formData: FormData) {
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
    };

    const result = registerSchema.safeParse(data);
    if (!result.success) {
      alert("Validation failed");
      return;
    }

    alert("Registration successful (dummy)");
  }

  return (
    <AuthLayout title="Register">
      <form action={handleSubmit}>
        <FormInput label="Name" name="name" />
        <FormInput label="Email" name="email" />
        <FormInput label="Password" type="password" name="password" />
        <button type="submit">Register</button>
      </form>
    </AuthLayout>
  );
}
