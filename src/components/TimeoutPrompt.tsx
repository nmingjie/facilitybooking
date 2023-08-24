import { extendSession } from '@/api/modules/Users';
import { setLogout, setUserInfo, setUserToken } from '@/redux/modules/user/action';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { PiWarningCircle } from 'react-icons/pi';
import { connect } from 'react-redux';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const TimeoutPrompt = (props: any) => {
  const { show, setUserToken, setUserInfo, setLogout, isShowProps } = props;
  const [timer, setTimer] = useState(60);
  const [visibilityS, setVisibilityS] = useState(0);
  const router = useRouter();

  const [desktopFilterOpen, setDesktopFilterOpen] = React.useState(isShowProps);

  const handleImHere = async () => {
    const res = await extendSession();
    if (res.status === 200) {
      show(false);
      const newUersInfo = Object.assign({}, res.data);
      delete newUersInfo.token;
      setUserInfo(newUersInfo);
      setUserToken(res.data.token);
      sessionStorage.setItem('token', res.data.token);
    } else {
      router.push('/login');
      setLogout(true);
      show(false);
    }
  }

  useEffect(() => {
    if (timer > 0) {
      const tId = setInterval(() => {
        setTimer(timer - 1 - visibilityS);
        setVisibilityS(0);
      }, 1000);

      return () => clearInterval(tId);
    } else {
      router.push('/login');
      setLogout(true);
      sessionStorage.clear();
      show(false);
    }
  }, [timer]);

  useEffect(() => {
    let start: any, end: any;
    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState === 'hidden') {
        start = new Date().getTime();
      } else if (document.visibilityState === 'visible') {
        end = new Date().getTime();

        const resTime = Math.floor((parseInt(end) - parseInt(start)) / 1000);
        if (resTime < 60) {
          setVisibilityS(resTime);
        }
      }
    });
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[999] bg-white/[0.5] backdrop-blur-sm">
      <div className='flex flex-col bg-white w-[350px] sm:w-[550px] h-[300px] shadow-lg'>
        <div className='flex m-8 items-center'>
          <PiWarningCircle className='text-[38px] text-[#FFA400]' />
          <span className='ml-4 text-[#2a2a2a] text-[30px] font-black'>Are you still here?</span>
        </div>
        <div className='text-[25px] mx-8'>
          If not, we&apos;ll close this session in: <span className='text-destructive'>{timer}s</span>
        </div>
        <div className='w-full flex justify-end items-end flex-1 p-4'>
          <div className='w-[80px] bg-[#006CEB] h-[45px] flex items-center justify-center text-white cursor-pointer' onClick={() => handleImHere()}>I&apos;m here</div>
        </div>
      </div>
    </div>
    // <Dialog open={desktopFilterOpen} onOpenChange={setDesktopFilterOpen}>
    //   <DialogContent>
    //     <DialogHeader className="bg-[#3A3A3A] text-white">
    //       <DialogTitle>
    //         <div className='flex items-center'>
    //           <PiWarningCircle className='text-[32px] text-[#FFA400]' /> &nbsp;Are you still here?
    //         </div>
    //       </DialogTitle>
    //     </DialogHeader>

    //     <div>
    //       <div className='text-[25px] mx-8'>
    //         If not, we&apos;ll close this session in: <span className='text-destructive'>{timer} seconds</span>
    //       </div>
    //       <div className='w-full flex justify-end items-end flex-1 p-4'>
    //         <div className='w-[80px] bg-[#006CEB] h-[45px] flex items-center justify-center text-white cursor-pointer' onClick={() => handleImHere()}>I&apos;m here</div>
    //       </div>
    //     </div>
    //   </DialogContent>
    // </Dialog>
  );
};

const mapStateToProps = (state: any) => state;
const mapDispatchToProps = {
  setUserToken,
  setUserInfo,
  setLogout
};
export default connect<any, any, any>(mapStateToProps, mapDispatchToProps)(TimeoutPrompt);