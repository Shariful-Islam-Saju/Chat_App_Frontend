"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import Image from "next/image";

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
import { registerFormSchema } from "@/model/authSchemas";
import axiosInstance from "@/lib/axios";
import { isAxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { useUserStore } from "@/store/useUserStore";
import { useRouter } from "next/navigation";
type FormValues = z.infer<typeof registerFormSchema>;

export default function RegisterForm() {
  const [preview, setPreview] = useState<string | null>(null);
  const setUser = useUserStore((state) => state.setUser);
  const router = useRouter();
  const form = useForm<FormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      avatar: undefined,
    },
  });

  const avatarFile = form.watch("avatar");

  if (avatarFile && avatarFile[0] && !preview) {
    const file = avatarFile[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  }

  const { mutate, isPending, error } = useMutation({
    mutationFn: async (data: FormValues) => {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("password", data.password);
      if (data.avatar && data.avatar[0]) {
        formData.append("avatar", data.avatar[0]);
      }

      const res = await axiosInstance.post("/api/auth/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return res.data;
    },
    onSuccess: (data) => {
      form.reset();
      setPreview(null);
      setUser(data);
      router.push("/dashboard");
    },
    onError: (err) => {
      if (isAxiosError(err)) {
        console.log(err.response?.data);
      }
    },
  });

  const onSubmit = async (data: FormValues) => {
    mutate(data);
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh] px-4">
      <Card className="w-full max-w-md border-none bg-[#DBE2EF] text-black">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Register</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Avatar Upload */}
              <FormField
                control={form.control}
                name="avatar"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-center gap-3">
                    {preview ? (
                      <Image
                        src={preview}
                        alt="Avatar"
                        width={80}
                        height={80}
                        className="rounded-full w-[80px] h-[80px] object-cover"
                      />
                    ) : (
                      <div className="w-[80px] h-[80px] rounded-full bg-muted flex items-center justify-center text-sm text-muted-foreground">
                        No Image
                      </div>
                    )}

                    <FormControl>
                      <div className="relative">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => field.onChange(e.target.files)}
                          id="avatar"
                          name="avatar"
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        <label
                          htmlFor="avatar"
                          className="inline-flex items-center justify-center bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium cursor-pointer hover:bg-primary/90 transition"
                        >
                          Upload Avatar
                        </label>
                      </div>
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Your name"
                        className="border-gray-400"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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

              {error && isAxiosError(error) && (
                <div className="bg-red-700 border border-red-400 text-red-200 px-4 py-1 rounded">
                  {error.response?.data?.message ||
                    "Something went wrong. Please try again."}
                </div>
              )}

              <Button disabled={isPending} type="submit" className="w-full">
                {isPending ? "Registering..." : "Register"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
