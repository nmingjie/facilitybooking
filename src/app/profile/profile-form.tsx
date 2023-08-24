"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";

import { Separator } from "@/components/ui/separator";
import { store } from "@/redux";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const profileFormSchema = z.object({
  username: z
    .string()
    .min(2, {
      message: "Username must be at least 2 characters.",
    })
    .max(30, {
      message: "Username must not be longer than 30 characters.",
    }),
  email: z
    .string({
      required_error: "Please select an email to display.",
    })
    .email(),
  bio: z.string().max(160).min(4),
  urls: z
    .array(
      z.object({
        value: z.string().url({ message: "Please enter a valid URL." }),
      })
    )
    .optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

// This can come from your database or API.
const defaultValues: Partial<ProfileFormValues> = {

  bio: "I own a computer.",
  urls: [
    { value: "https://shadcn.com" },
    { value: "http://twitter.com/shadcn" },
  ],
};

type UserInfo = {
  firstName: string;
  lastName: string;
  email: string;
  designation: string;
  companyName: string;
  phoneNumber: string;
  companyAddress: string
}

export function ProfileForm() {
  const userInfo = store.getState().user.userinfo;
  const [effectUserInfo, setEffectUserInfo] = useState<UserInfo>();
  const router = useRouter();

  useEffect(() => {
    setEffectUserInfo(userInfo);
  }, [userInfo]);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: "onChange",
  });

  const { fields, append } = useFieldArray({
    name: "urls",
    control: form.control,
  });

  function onSubmit(data: ProfileFormValues) {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  const handleRouterChangePwd = () => {
    router.push('/password/change');
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex gap-4">
          <div className="flex-grow">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name: </FormLabel>
                  {effectUserInfo?.firstName}
                  <FormControl>
                    {/* <Input placeholder="Placeholder" {...field} /> */}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex-grow">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name: </FormLabel>
                  {effectUserInfo?.lastName}
                  <FormControl>
                    {/* <Input placeholder="Placeholder" {...field} /> */}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email: </FormLabel>
              {effectUserInfo?.email}
              <FormControl>
                {/* <Input placeholder="Placeholder" {...field} /> */}
              </FormControl>
              {/* <FormDescription>
                You can manage verified email addresses in your{" "}
                <Link href="/examples/forms">email settings</Link>.
              </FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Designation: </FormLabel>
              {effectUserInfo?.designation}
              <FormControl>
                {/* <Input placeholder="Placeholder" {...field} /> */}
              </FormControl>
              {/* <FormDescription>
                You can manage verified email addresses in your{" "}
                <Link href="/examples/forms">email settings</Link>.
              </FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Comopany Name: </FormLabel>
              {effectUserInfo?.companyName}
              <FormControl>
                {/* <Input placeholder="Placeholder" {...field} /> */}
              </FormControl>
              {/* <FormDescription>
                You can manage verified email addresses in your{" "}
                <Link href="/examples/forms">email settings</Link>.
              </FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mobile No.: </FormLabel>
              {effectUserInfo?.phoneNumber}
              <FormControl>
                {/* <Input placeholder="Placeholder" {...field} /> */}
              </FormControl>
              {/* <FormDescription>
                You can manage verified email addresses in your{" "}
                <Link href="/examples/forms">email settings</Link>.
              </FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Address: </FormLabel>
              {effectUserInfo?.companyAddress}
              <FormControl>
                {/* <Input placeholder="Placeholder" {...field} /> */}
              </FormControl>
              {/* <FormDescription>
                You can manage verified email addresses in your{" "}
                <Link href="/examples/forms">email settings</Link>.
              </FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />
        {/* <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us a little bit about yourself"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                You can <span>@mention</span> other users and organizations to
                link to them.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        /> */}
        {/* <Button type="submit">Update profile</Button> */}

        <Separator />

        {/* <h3 className="text-lg font-medium">Password</h3> */}
        {/* <p> Password </p>

        <p> ************ </p> */}
        {/* <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="Placeholder" {...field} />
              </FormControl>
              <FormDescription>
                You can manage verified email addresses in your{" "}
                <Link href="/examples/forms">email settings</Link>.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        /> */}
        <Button onClick={() => handleRouterChangePwd()}>Change Passowrd</Button>
        <Separator />
      </form>
    </Form>
  );
}
