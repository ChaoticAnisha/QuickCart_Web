"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/lib/validation";
import { z } from "zod";
import FormInput from "@/components/FormInput";

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: z.infer<typeof loginSchema>) => {
    console.log("Login Data", data);
  };

  return (
    <div className="max-w-md mx-auto mt-20">
      <h2 className="text-2xl font-bold mb-6">Login</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormInput label="Email" {...register("email")} error={errors.email?.message} />
        <FormInput label="Password" type="password" {...register("password")} error={errors.password?.message} />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Login</button>
      </form>
    </div>
  );
}