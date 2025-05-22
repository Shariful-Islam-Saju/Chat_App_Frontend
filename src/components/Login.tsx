"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { loginFormSchema } from "@/model/authSchemas";
import axiosInstance from "@/lib/axios";
import { isAxiosError } from "axios";
import { useUserStore } from "@/store/useUserStore";
import { useRouter } from "next/navigation";

type FormValues = z.infer<typeof loginFormSchema>;

export default function LoginForm() {
  const setUser = useUserStore((state) => state.setUser);
  const router = useRouter();
  const form = useForm<FormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutate, isPending, isError, error, isSuccess } = useMutation({
    mutationFn: async (data: FormValues) => {
      const res = await axiosInstance.post("/api/auth/login", data);
      return res.data;
    },
    onSuccess: (data) => {
      setUser(data);
      router.push("/dashboard");
    },
  });

  const onSubmit = (data: FormValues) => {
    mutate(data);
  };
  return (
    <div className="flex justify-center items-center min-h-[80vh] px-4">
      <Card className="w-full max-w-md border-none bg-[#DBE2EF] text-black">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Login</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="you@example.com"
                        className="border-gray-400"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        className="border-gray-400"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Error Section */}
              {isError && (
                <div className="bg-red-700 border border-red-400  text-red-200 px-4 py-1 rounded">
                  {isAxiosError(error)
                    ? error.response?.data?.message || "Login failed"
                    : "Something went wrong"}
                </div>
              )}

              {isSuccess && (
                <div className="bg-green-900 text-white px-4 py-1 rounded">
                  Login successful!
                </div>
              )}

              <Button disabled={isPending} type="submit" className="w-full">
                {isPending ? "Logging in..." : "Login"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
