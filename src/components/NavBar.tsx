"use client";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import * as React from "react";
import logo from '../../public/logo.svg';
import user from '../../public/navbaruser.svg';
import menu from '../../public/navbarmenu.svg';
import Image from 'next/image';
import { store } from "@/redux";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { loginOut } from "@/api/modules/Users";
import { connect } from 'react-redux';
import { setLogout } from "@/redux/modules/user/action";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";

const components: { title: string; href: string; description?: string }[] = [
  {
    title: "Search Facilities",
    href: "/facility/home",
  },
  {
    title: "View Booking",
    href: "/facility/bookings",
  },
];
const fbaAdminComponents: { title: string; href: string; description?: string }[] = [
  {
    title: "Maintenance",
    href: "/admin/fba/maintenance/list",
  }
];

const navigation = [
  {
    name: "Facility Booking",
    href: "javascript:;",
    children: [
      {
        name: "Search Facilities",
        href: "/facility/home",
        children: []
      }, {
        name: "View Booking",
        href: "/facility/bookings",
        children: []
      },
    ]
  },
  // {
  //   name: "Aircon Extension",
  //   href: "javascript:;",
  //   current: false,
  //   children: []
  // },
  {
    name: "FBA Admin",
    href: "javascript:;",
    children: [{
      name: "Maintenance",
      href: "/admin/fba/maintenance/list",
    }]
  }
];

const navigationUser = [
  {
    name: "Contact Us",
    href: "javascript:;",
    children: []
  },
  {
    name: "FAQ",
    href: "javascript:;",
    children: []
  },
  {
    name: "Setting",
    href: "/profile",
    children: []
  },
  {
    name: "Logout",
    href: "/login",
    children: []
  },
];

function NavBar(props: any) {
  const userInfo = store.getState().user.userinfo;
  const router = useRouter();
  const [isShowMobileNav, setIsShowMobileNav] = useState(false);
  const [isShowMobileNavUser, setIsShowMobileNavUser] = useState(false);
  const [isChildShowMenu, setIsChildShowMenu] = useState(false);
  const [childrenList, setChildrenList] = useState([]);
  const [effectUserInfo, setEffectUserInfo] = useState<any>({});
  const [currenName, setCurrenName] = useState('');
  const { setLogout } = props;

  useEffect(() => {
    setEffectUserInfo(userInfo);
  }, [userInfo]);

  const handleSignOut = async () => {
    const res: any = await loginOut();
    if (res.status === 200) {
      setLogout(true);
      router.push('/login');
    }
  }

  const handleChildShowMenu = (i: any) => {
    if (i.children.length) {
      setIsChildShowMenu(!isChildShowMenu);
      setChildrenList(i.children);
      setCurrenName(i.name);
    }
  }

  const handleGoBack = () => {
    setIsChildShowMenu(false);
  }

  const handleShowMobileNav = () => {
    if (isShowMobileNavUser) return;
    setIsShowMobileNav(true);
  }

  const handleShowUserMenu = () => {
    if (isShowMobileNav) return;
    setIsShowMobileNavUser(true);
  }


  return (
    <div className="fixed top-0 bg-white inset-x-0 z-50 sm:shadow-xl">
      <sgds-masthead></sgds-masthead>
      <div className="mx-auto sm:px-6 lg:px-8 max-w-7xl">
        <div className="relative px-2 flex items-center justify-between">
          <div className="flex flex-1 sm:items-stretch sm:justify-start">
            <div className="flex flex-shrink-0">
              <Link href="/">
                <Image className="h-14 lg:h-16 w-auto" src={logo} alt="Login" />
              </Link>
            </div>
          </div>
          <div className="flex flex-col items-end">
            {
              effectUserInfo.role ? (
                <div className="flex sm:ml-6 text-blue-600  px-3 py-2 text-sm font-bold items-center gap-2">
                  <Image className="hidden sm:block h-6 w-6 font-black text-[#006ceb]" src={user} alt="user" onClick={() => router.push('/profile')} />
                  <Image className="sm:hidden h-6 w-6 font-black text-[#006ceb]" src={user} alt="user" onClick={() => handleShowUserMenu()} />
                  {effectUserInfo.role !== 'PUBLIC-USERS' && <span className="text-blue-500 hidden sm:block">{effectUserInfo?.userName} ({effectUserInfo.role})</span>}
                  {effectUserInfo.role !== 'PUBLIC-USERS' && <button className="text-red-500 hidden sm:block" onClick={() => handleSignOut()}>Log out</button>}
                </div>
              ) : (
                <Link href="/login">
                  <div className="flex sm:ml-6 text-blue-600 border-b-4 border-transparent hover:border-blue-700 hover:text-blue-700 px-3 py-2 text-sm font-bold items-center">
                    <Image className="h-6 w-6 font-black text-[#006ceb]" src={user} alt="user" /> &nbsp;Login
                  </div>
                </Link>
              )
            }

            {/* Desktop Panel */}
            <div className="hidden sm:ml-6 sm:block">
              <div className="flex space-x-4">
                <NavigationMenu>
                  <NavigationMenuList>
                    <NavigationMenuItem>
                      <NavigationMenuTrigger className="hover:text-blue-600 border-b-4 border-transparent hover:border-blue-600 px-3 py-2 text-sm font-medium">
                        Faciity Booking
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <ul className="grid gap-1 p-2 md:grid-cols-1 w-[200px]">
                          {
                            components.map((component) => (
                              <ListItem key={component.title} title={component.title} href={component.href} >
                                {component.description}
                              </ListItem>
                            ))
                          }
                        </ul>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                    {/* <NavigationMenuItem>
                            <Link href="#" legacyBehavior passHref>
                              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                Aircon Extension
                              </NavigationMenuLink>
                            </Link>
                          </NavigationMenuItem> */}
                    <NavigationMenuItem>
                      <NavigationMenuTrigger className="hover:text-blue-600 border-b-4 border-transparent hover:border-blue-600 px-3 py-2 text-sm font-medium">
                        <span>FBA&nbsp;&nbsp;Admin</span>
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <ul className="grid gap-1 p-2 md:grid-cols-1 w-[200px]">
                          {
                            fbaAdminComponents.map((component) => (
                              <ListItem key={component.title} title={component.title} href={component.href} >
                                {component.description}
                              </ListItem>
                            ))
                          }
                        </ul>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                      <Link href="#" legacyBehavior passHref>
                        <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                          Contact Us
                        </NavigationMenuLink>
                      </Link>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                      <Link href="#" legacyBehavior passHref>
                        <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                          FAQ
                        </NavigationMenuLink>
                      </Link>
                    </NavigationMenuItem>
                  </NavigationMenuList>
                </NavigationMenu>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                  <button type="button" className="p-1 text-black-400 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 border-b-4 border-transparent hover:border-blue-600 hover:text-blue-600">
                    <span className="sr-only ">Search</span>
                    <FaMagnifyingGlass className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile menu button*/}
          <div className="p-3 inset-y-0 right-0 flex items-center sm:hidden" onClick={() => handleShowMobileNav()}>
            <Image className="h-5 w-5 font-black text-[#006ceb]" src={menu} alt="menu" />
          </div>
        </div>

        {/* Mobile menu */}
        {
          isShowMobileNav &&
          <div className="sm:hidden bg-[#2a2a2a] flex flex-col h-[92vh] relative">
            <div className="text-white flex justify-end p-3 cursor-pointer" onClick={() => setIsShowMobileNav(false)}>Close</div>
            {
              navigation.map((item) => (
                item.children.length ?
                  <div key={item.name} className="p-3 text-white flex justify-between items-center" onClick={() => handleChildShowMenu(item)}>
                    {item.name}
                    {item.children.length > 0 && <AiOutlineRight className="text-[22px]" />}
                  </div>
                  :
                  <div key={item.name}>
                    <a key={item.name} className="p-3 text-white w-full flex justify-between items-center" href={item.href}>{item.name}</a>
                  </div>
              ))
            }

            {
              isChildShowMenu && <div className="sm:hidden bg-[#2a2a2a] w-full h-full text-white absolute top-0 left-0">
                <div className="p-3 flex items-center" onClick={() => handleGoBack()}>
                  <AiOutlineLeft className="text-[22px]" /> &nbsp;&nbsp; {currenName}
                </div>
                <div>
                  {
                    childrenList.map((child: any) => (
                      <a key={child.name} href={child.href} className="p-3 text-white w-full flex justify-between items-center">
                        {child.name}
                      </a>
                    ))
                  }
                </div>
              </div>
            }
          </div>
        }

        {/* Mobile menu user */}
        {
          isShowMobileNavUser &&
          <div className="sm:hidden bg-[#2a2a2a] flex flex-col h-[92vh] relative">
            <div className="text-white flex justify-end p-3 cursor-pointer" onClick={() => setIsShowMobileNavUser(false)}>Close</div>
            {
              navigationUser.map((item) => (
                <div key={item.name}>
                  {
                    (effectUserInfo.role === 'PUBLIC-USERS' && (item.name === 'Logout' || item.name === 'Setting')) ?
                      <></> :
                      item.name === 'Logout' ?
                        <div key={item.name} className="p-3 text-white w-full flex justify-between items-center cursor-pointer" onClick={() => handleSignOut()}>{item.name}</div> :
                        <a key={item.name} className="p-3 text-white w-full flex justify-between items-center" href={item.href}>{item.name}</a>
                  }
                </div>
              ))
            }
          </div>
        }
      </div>
    </div>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a ref={ref} className={`block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-[#212529] hover:text-white ${className}`} {...props}>
          <div className="text-sm font-medium leading-none">{title}</div>
          <span className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </span>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

const mapStateToProps = (state: any) => state;
const mapDispatchToProps = {
  setLogout
};
export default connect(mapStateToProps, mapDispatchToProps)(NavBar);