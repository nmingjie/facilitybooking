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
import Link from "next/link";
import { connect, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from "react-icons/ai";
import LoadingOverlay from "@/components/LoadingCustom";
import { guestLogin, login } from "@/api/modules/Users";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { setShowChangePwd, setUserInfo, setUserToken } from "@/redux/modules/user/action";

const loginFormSchema = z.object({
  email: z
    .string({required_error: "Email is required"})
    .min(1, { message: "This field has to be filled." })
    .email("Oops. This doesn't look like a valid email.")
  ,
  password: z
    .string({required_error: "Password is required"})
    .min(8, { message: "Oops. This doesn't look like a valid password." })
});

function Login(props: any) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [count, setCount] = useState(0);
  const { setUserToken, setUserInfo, setShowChangePwd } = props;
  const [showLoading, setShowLoading] = useState(false);
  const [effectShowChangePwd, setEffectShowChangePwd] = useState(false);
  const showChangePwd = useSelector((state: any) => state.user.showChangePwd);

  useEffect(() => {
    if (count >= 5) setIsLoading(true);
  }, [count])

  useEffect(() => {
    setEffectShowChangePwd(showChangePwd);
  }, [showChangePwd]);

  const onSubmit: SubmitHandler<FieldValues> = async (data: any) => {
    setIsLoading(true);
    setShowLoading(true);

    try {
      const res: any = await login(data);
      if (res.status === 200) {
        setIsLoading(false);
        loginHandleFn(res);
      }
      setIsLoading(false);
      setShowLoading(false);
    } catch (err: any) {
      setIsLoading(false);
      setShowLoading(false);
      if (err) {
        setCount(count + 1);
        setLoginError(err.response.data)
      }
    }

    setShowChangePwd(false);
  };

  const handleGuestLogin = async () => {
    const res: any = await guestLogin();
    if (res.status === 200) {
      loginHandleFn(res);
    }
  }

  const loginHandleFn = (res: any) => {
    const newUersInfo = Object.assign({}, res.data);
    delete newUersInfo.token;
    setUserInfo(newUersInfo);
    setUserToken(res.data.token);
    sessionStorage.setItem('token', res.data.token);
    sessionStorage.setItem('email', res.data.email);
    router.push('/facility/home');
  }

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
        <img className="h-14 lg:h-16 w-auto" src="./logo.svg" alt="Login" />
        <label className="text-3xl lg:text-5xl text-gray-900">
          Facility Booking
        </label>
      </div>

      {
        effectShowChangePwd &&
        (
          <div className="sm:h-[70px] h-[95px]">
            <div className="bg-[#008550] w-full absolute left-0 p-3 text-white flex">
              <div>
                <AiOutlineCheckCircle className="text-[25px] mr-1" />
              </div>
              <div className="flex flex-col">
                <span>You have successfully reset your password.</span>
                <span>You can now log into your account with your new password.</span>
              </div>
            </div>
          </div>
        )
      }

      <div className="flex xl:w-[928px] min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 bg-gradient-to-b from-blue-100 to-white rounded-3xl mt-4 mb-4 border border-gray-200">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img className="mx-auto h-72 w-auto" src="./login.png" alt="Login" />
        </div>

        {
          count >= 5 && <div className="p-2 flex bg-[#de2f18] sm:mx-auto sm:w-full sm:max-w-sm flex flex-row text-white text-sm">
            <div className="flex flex-row text-[24px] ml-1">
              <AiOutlineCloseCircle />
            </div>
            <div className="ml-2">
              <div className="mb-2 w-[230px] sm:w-full">Your account has been locked due to 5 consecutive failed login attempts.</div>
              <div className="w-[230px] sm:w-full">
                Please contact JTC at contactus@jtc.gov.sg to unlock you accountm, or you can&nbsp;
                <Link href='/login'>
                  <span className="text-[#0055b8] underline underline-offset-1">
                    forget your password
                  </span>.
                </Link>
              </div>
            </div>
          </div>
        }

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
                        placeholder="Enter your email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="h-[5px]"></div>
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#666666]">Password*</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter your password"
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
                disabled={isLoading && count <= 5}>
                Login
              </Button>
            </form>
          </Form>
        </div>
        <div className="mt-4 mx-auto text-sm">
          <div className="cursor-pointer font-semibold text-blue-600 hover:text-text-blue-500" onClick={() => router.push('/password/forgot')}>
            Forgot password?
          </div>
        </div>

        <div className="mt-6 pt-6 mx-auto w-full max-w-[896px] text-sm border-t text-center">
          <div className="cursor-pointer font-semibold text-blue-600 hover:text-text-blue-500" onClick={() => handleGuestLogin()}>
            Continue as Public User
          </div>
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
  setUserInfo,
  setShowChangePwd
};

interface StateProps {

  isOn: boolean
}

interface DispatchProps {
  setUserToken: (data: any) => any,
  setUserInfo: (data: any) => any,
  setShowChangePwd: (data: any) => any,
}

interface OwnProps {
  backgroundColor: string
}


export default connect<any, DispatchProps, any>(mapStateToProps, mapDispatchToProps)(Login);

// export default Login;