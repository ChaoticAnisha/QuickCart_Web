"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "@/lib/validation";
import { z } from "zod";
import FormInput from "@/components/FormInput";

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: z.infer<typeof registerSchema>) => {
    console.log("Register Data", data);
  };

  return (
    <div className="max-w-md mx-auto mt-20">
      <h2 className="text-2xl font-bold mb-6">Register</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormInput label="Name" {...register("name")} error={errors.name?.message} />
        <FormInput label="Email" {...register("email")} error={errors.email?.message} />
        <FormInput label="Password" type="password" {...register("password")} error={errors.password?.message} />
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Register</button>
      </form>
    </div>
  );
}