"use client";

import { forwardRef, useRef, useImperativeHandle } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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

type PublicUserPropsParam = {
  handleSubmitClick?: Function;
};

const PublicUserInfo =  forwardRef(function (props: PublicUserPropsParam, ref) {
  const submitRef = useRef(null);
  const onSubmit: SubmitHandler<FieldValues> = async (data: any) => {
    if (props.handleSubmitClick) props.handleSubmitClick(data);
  };

  const personalDetails = z.object({
    firstName: z
      .string({ required_error: "Please Input First name" })
      .min(1, { message: "Please Input First name" }),
    lastName: z
      .string({ required_error: "Please Input Last name" })
      .min(1, { message: "Please Input Last name" }),
    email: z
      .string({ required_error: "Please Input email" })
      .min(1, { message: "Please Input Email" }),
    phoneNumber: z
      .string({ required_error: "Please Input Mobile number" })
      .min(1, { message: "Please Input Mobile number" }),
    companyAddress: z.string(),
    companyName: z.string(),
    designation: z.string(),
  });

  const form = useForm<z.infer<typeof personalDetails>>({
    resolver: zodResolver(personalDetails),
    defaultValues: {
      companyAddress: "",
      companyName: "",
      designation: "",
    },
  });

  useImperativeHandle(ref, () => {
    return {
      handleClickOnSubmit: submitRef?.current,
    };
  });
  return (
    <div>
      <div className="text-lg font-bold flex-col gap-4 pb-4">
        Personal Details
      </div>
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex flex-row w-full">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem className="w-1/2 pr-2">
                    <FormLabel>
                      First name <span className="text-red-600">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="bg-white"
                        placeholder="Enter first name here"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-left" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem className="w-1/2 pl-2">
                    <FormLabel>
                      Last name <span className="text-red-600">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="bg-white"
                        placeholder="Enter last name here"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-left" />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Email <span className="text-red-600">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="bg-white"
                      placeholder="Enter email here"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-left" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Mobile number <span className="text-red-600">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="bg-white"
                      placeholder="Enter mobile number here"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-left" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="companyAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company address</FormLabel>
                  <FormControl>
                    <Input
                      className="bg-white"
                      placeholder="Enter company address here"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company name</FormLabel>
                  <FormControl>
                    <Input
                      className="bg-white"
                      placeholder="Enter company name here"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="designation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Designation</FormLabel>
                  <FormControl>
                    <Input
                      className="bg-white"
                      placeholder="Enter designation here"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button
              type="submit"
              ref={submitRef}
              className="h-0 w-0 opacity-0"
            />
          </form>
        </Form>
      </div>
    </div>
  );
});

PublicUserInfo.displayName = "PublicUserInfo;"
export default PublicUserInfo;