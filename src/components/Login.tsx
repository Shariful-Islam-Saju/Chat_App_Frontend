"use client";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition, useState } from "react";

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
import { loginFormSchema } from "@/app/model/authSchemas";
import axiosInstance from "@/lib/axios";
import axios from "axios";

type FormValues = z.infer<typeof loginFormSchema>;

export default function LoginForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (data: FormValues) => {
    setError(null); // Reset previous error

    startTransition(async () => {
      try {
        const res = await axiosInstance.post(`/api/auth/login`, {
          email: data.email,
          password: data.password,
        });
        // If login is successful, clear error
        setError(null);
        form.reset();
        return res.data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          // error is an AxiosError
          const errMsg = error.response?.data || error.message;
          setError(errMsg);
        } else {
          setError("Something unexpected occurs!!!");
        }
      }
    });
  };

  return (
    <div className="flex justify-center items-center min-h-screen px-4">
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
              {error && (
                <div className="bg-red-300 border border-red-400 text-red-700 px-4 py-1 rounded">
                  {error}
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
