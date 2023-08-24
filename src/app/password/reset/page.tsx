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
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from "react-icons/ai";
import LoadingOverlay from "@/components/LoadingCustom";
import { resetpassword } from "@/api/modules/Users";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { setShowChangePwd, setUserInfo, setUserToken } from "@/redux/modules/user/action";
import logo from '../../../../public/logo.svg';
import resetPage from '../../../../public/forgetchangepwd.png';
import Image from 'next/image';

const forgetFormSchema = z.object({
  newPwd: z.string({required_error: "New Password is required"}).min(8, 'Value must contain at least 8 characters'),
  confirmPwd: z.string({required_error: "Confirm Password is required"})
})

function ForgotChangePwd(props: any) {
  const router = useRouter();
  const [newPwdRed, setNewPwdRed] = useState(false);
  const [confirmRed, setConfirmRed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmPwdShowRed, setConfirmPwdShowRed] = useState(false);
  const [initShowPassIcon, setInitShowPassIcon] = useState(false);
  const [loginError, setLoginError] = useState("");
  const { setShowChangePwd } = props;
  const [showLoading, setShowLoading] = useState(false);
  const [pwdReg, setPwdReg] = useState([
    {
      key: 'uppercase',
      isShow: false,
      text: 'At least one uppercase alphabetic character.'
    },
    {
      key: 'lowercase',
      isShow: false,
      text: 'At least one lowercase alphabetic character.'
    },
    {
      key: 'snumeric',
      isShow: false,
      text: 'At least one snumeric character.'
    },
    {
      key: 'special',
      isShow: false,
      text: 'At least one special character(eg, #, $, %, !, &, *)'
    }]
  );

  const onSubmit: SubmitHandler<FieldValues> = async (data: any) => {
    setIsLoading(true);
    const params = {
      "token": sessionStorage.getItem('resetPwdToken'),
      "userName": sessionStorage.getItem('email'),
      "newPassword": data.newPwd,
      "confirmPassword": data.confirmPwd
    }

    try {
      const res: any = await resetpassword(data.email, params);
      console.log(res)
      if (res.data.isSuccess) {
        setShowChangePwd(true);
        setIsLoading(false);
        router.push('/login');
        sessionStorage.removeItem('email');
        sessionStorage.removeItem('resetPwdToken');
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

  const form = useForm<z.infer<typeof forgetFormSchema>>({
    resolver: zodResolver(forgetFormSchema),
    defaultValues: {
      // email: "",
      // password: "",
    },
  });

  useEffect(() => {
    const data = form.getValues();

    if (data.newPwd !== undefined) {
      if (data.newPwd === '') {
        setNewPwdRed(true);
      }
      else setNewPwdRed(false);

      if (data.newPwd.length) setInitShowPassIcon(true);
      else setInitShowPassIcon(false);
    }

    if (data.confirmPwd !== undefined) {
      if (data.confirmPwd === '') setConfirmRed(true);
      else setConfirmRed(false);
    }


    if (data.newPwd !== data.confirmPwd && data.newPwd !== undefined && data.confirmPwd !== undefined) {
      setConfirmRed(true);
      setConfirmPwdShowRed(true);
      setIsLoading(true);
    } else {
      setConfirmRed(false);
      setIsLoading(false);
      setConfirmPwdShowRed(false);
    }

    if (data.newPwd !== undefined) {
      if (/[A-Z]/.test(data.newPwd)) {
        handlePwdList('uppercase', true);
      } else {
        setNewPwdRed(true);
        handlePwdList('uppercase', false);
      }

      if (/[a-z]/.test(data.newPwd)) {
        handlePwdList('lowercase', true);
      } else {
        setNewPwdRed(true);
        handlePwdList('lowercase', false);
      }

      if (/[\d]/.test(data.newPwd)) {
        handlePwdList('snumeric', true);
      } else {
        setNewPwdRed(true);
        handlePwdList('snumeric', false);
      }

      if (/[!@#$%^&*]/.test(data.newPwd)) {
        handlePwdList('special', true);
      } else {
        setNewPwdRed(true);
        handlePwdList('special', false);
      }
    }
  }, [form.watch().newPwd, form.watch().confirmPwd]);

  const handlePwdList = (type: string, isPass: boolean) => {
    const tempArr = [...pwdReg];
    tempArr.map(item => {
      if (item.key === type && isPass) {
        item.isShow = isPass;
      } else if (item.key === type) {
        item.isShow = isPass;
      }
    })

    setPwdReg(tempArr);
  }

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
          <Image className="mx-auto h-72 w-auto" src={resetPage} alt="Login" />
        </div>

        <div className="mt-2 sm:mx-auto sm:w-full sm:max-w-sm">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="newPwd"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={newPwdRed ? 'text-destructive' : "text-[#666666]"}>New Password*</FormLabel>
                    <FormControl>
                      <Input
                        className="bg-white"
                        type="password"
                        placeholder="Enter your new password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                    <div>
                      {
                        initShowPassIcon && (pwdReg.map(
                          item => (
                            <span key= {item.text} className="text-[12px] text-[#666666] flex items-center mb-2">
                              {
                                item.isShow
                                  ? <AiOutlineCheckCircle className="text-[#008550] text-[20px] mr-1" />
                                  : <AiOutlineCloseCircle className="text-destructive text-[20px] mr-1" />
                              }
                              {item.text}
                            </span>
                          )
                        ))
                      }
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPwd"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={confirmRed ? 'text-destructive' : "text-[#666666]"}>Confirm Password*</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter your password again"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                    {
                      confirmPwdShowRed &&
                      <div className="sm:mx-auto items-center justify-center sm:w-full sm:max-w-sm flex flex-row text-destructive text-sm">
                        <div className="w-[260px] sm:w-full text-[12px] text-center">Your new password and confirm password do not match.</div>
                      </div>
                    }

                  </FormItem>
                )}
              />
              <p className="text-center text-sm text-[12px] font-medium text-destructive"> {loginError !== "" ? loginError : ""}</p>
              <Button type="submit"
                className="flex w-full justify-center px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                disabled={isLoading}>
                Change my Password
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
  setUserInfo,
  setShowChangePwd
};
export default connect(mapStateToProps, mapDispatchToProps)(ForgotChangePwd);