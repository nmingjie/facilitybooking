"use client";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import * as z from "zod";
import { connect } from "react-redux";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import LoadingOverlay from "@/components/LoadingCustom";
import { forgotpassword } from "@/api/modules/Users";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { setUserInfo, setUserToken } from "@/redux/modules/user/action";
import logo from '../../../../public/logo.svg';
import requestResetPage from '../../../../public/forgetpwd.png';
import Image from 'next/image';

const loginFormSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .min(1, { message: "This field has to be filled." })
    .email("Oops. This doesn't look like a valid email.")
});

function ForgotPwd(props: any) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [showLoading, setShowLoading] = useState(false);

  const onSubmit: SubmitHandler<FieldValues> = async (data: any) => {
    console.log("data is", data);
    setIsLoading(true);
    setShowLoading(true);

    try {
      const res: any = await forgotpassword(data.emial, data);
      if (res.data.isSuccess) {
        setIsLoading(false);
        if (res.data.data) {
          sessionStorage.setItem('resetPwdToken', res.data.data);
          sessionStorage.setItem('email', data.email);
          router.push('/password/reset');
        }
      }
      setIsLoading(false);
      setShowLoading(false);
    } catch (err: any) {
      console.log(err);
      setIsLoading(false);
      setShowLoading(false);
      if (err) {
        setLoginError(err.response.data)
      }
    }
  };

  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      // email: "",
      // password: "",
    },
  });

  return (
    <div className="mt-10 mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
      <div className="flex xl:w-[928px] items-center mt-4 mb-4 space-x-4">
        <Image className="h-14 lg:h-16 w-auto" src={logo} alt="Login" />
        <label className="text-3xl lg:text-5xl text-gray-900">
          FEM Services
        </label>
      </div>

      <div className="flex xl:w-[928px] min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 bg-gradient-to-b from-blue-100 to-white rounded-3xl mt-4 mb-4 border border-gray-200">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <Image className="mx-auto h-72 w-auto" src={requestResetPage} alt="ForgetPassword" />
        </div>

        <div className="flex flex-row sm:mx-auto sm:w-full sm:max-w-sm text-[#666666] text-sm">
          <div className="sm:w-full">
            <div className="mb-2 w-[280px] text-[14px]">
              Enter the email address associated with your account.
            </div>
            <div className="w-[280px]">
              We will email you a link to reset your password.
            </div>
          </div>
        </div>

        <div className="mt-2 sm:mx-auto sm:w-full sm:max-w-sm">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#666666]">Email Address*</FormLabel>
                    <FormControl>
                      <Input
                        className="bg-white"
                        placeholder="Enter your email address"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <p className="text-center text-sm text-[12px] font-medium text-destructive"> {loginError !== "" ? loginError : ""}</p>
              <Button type="submit"
                className="flex w-full justify-center px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                disabled={isLoading}>
                Send
              </Button>
            </form>
          </Form>
        </div>
      </div>

      {
        showLoading && <LoadingOverlay />
      }
    </div >
  );
}

const mapStateToProps = (state: any) => state;
const mapDispatchToProps = {
  setUserToken,
  setUserInfo
};
export default connect(mapStateToProps, mapDispatchToProps)(ForgotPwd);