import React, { useEffect, useState } from "react";
import useCheckMobile from "../hook/useCheckMobile";
import { BiSolidDownArrow } from "react-icons/bi";
import { MdArrowForwardIos } from "react-icons/md";
import { useAuth } from "../hook/useAuth";
import { useLocalStorage } from "../hook/useLocalStorage";

import NavItems from "./navItem";

export default function NavMenu(props) {
  const [user, setUser] = useState({});
  const { logout } = useAuth();

  const mobile = useCheckMobile();

  const removeThaiVowels = (str) => {
    const thaiVowels =
      /[\u0E31\u0E34-\u0E3A\u0E47-\u0E4E\u0E40\u0E41\u0E42\u0E43\u0E44]/g;
    return str.replace(thaiVowels, "");
  };

  useEffect(() => {
    let data = window.localStorage.getItem("user");
    data = JSON.parse(data);
    let name = data.name.substring(0, data.name.indexOf(" "));
    let surname = data.name.substring(data.name.indexOf(" ") + 1);
    let fname = removeThaiVowels(name).substring(0, 1);
    let fsurname = removeThaiVowels(surname).substring(0, 1);
    setUser({ name: name, surname: surname, fname: fname, fsurname: fsurname });

    document.title = "World Fair Solution";
  }, []);

  const [click, setClick] = useState(false);

  const menuClick = () => {
    setClick(!click);
  };

  const [dropDown, setDrop] = useState(false);

  const userDropdown = () => {
    setDrop(!dropDown);
  };

  const Dept = useLocalStorage("user")[0].Dept;
  const Acc = useLocalStorage("user")[0].ALevel;

  useEffect(() => {
    props.menu(click);
  }, [click]);

  return (
    <div>
      <div className="relative z-[999] print:hidden">
        <nav>
          <div className="fixed top-0 z-[997] w-full flex justify-between items-center px-5 p-3 shadow-lg bg-white">
            <div className="flex items-center gap-2">
              <div className="md:hidden" onClick={menuClick}>
                <div
                  className={`border border-black w-6 h-0 bg-black mb-1 transition duration-300 ${
                    click && "rotate-45 translate-y-1.5"
                  }`}
                ></div>
                <div
                  className={`border border-black w-6 h-0 bg-black mb-1 transition duration-300 ${
                    click && "opacity-0"
                  }`}
                ></div>
                <div
                  className={`border border-black w-6 h-0 bg-black transition duration-300 ${
                    click && "-rotate-45 -translate-y-1.5"
                  }`}
                ></div>
              </div>
              <div className="w-[12%]">
                <img src={require("../img/logo-wf.png")} alt="logo wf" />
              </div>
              <div className="text-sm font-medium md:text-xl">
                World Fair Solution
              </div>
            </div>
            <div className="relative">
              {user.name != undefined && !mobile ? (
                <div
                  className="flex gap-1 items-center cursor-pointer"
                  onClick={userDropdown}
                >
                  <div>{user.name + " " + user.surname}</div>
                  <div className="text-sm">
                    <BiSolidDownArrow />
                  </div>
                </div>
              ) : (
                <div
                  className="flex gap-1 items-center cursor-pointer"
                  onClick={userDropdown}
                >
                  <div className="border rounded-full w-fit px-2 py-1">
                    {user.fname + user.fsurname}{" "}
                  </div>
                  <div className="text-sm">
                    <BiSolidDownArrow />
                  </div>
                </div>
              )}
              <div
                className={`fixed top-0 left-0 w-full ${
                  dropDown ? "h-full" : "hidden"
                }`}
                onClick={userDropdown}
              ></div>
              <div
                className={`absolute top-[40px] md:top-[30px] border rounded-lg bg-white w-[150px] right-0 md:w-full py-3 text-end transition-height duration-500 ease-in-out h-0 ${
                  dropDown ? "h-fit" : "hidden"
                }`}
              >
                <ul>
                  <li className="py-2 px-4 hover:bg-slate-400 hover:text-white">
                    Profile
                  </li>
                  <li
                    onClick={logout}
                    className="py-2 px-4 hover:bg-slate-400 hover:text-white"
                  >
                    Logout
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </nav>
        {click && mobile && (
          <div className="bg-slate-600 fixed top-0 left-0 z-[900] w-full h-full opacity-30"></div>
        )}
        <div
          className={`text-white w-3/4 sm:w-1/2 md:w-[220px] bg-stone-500 h-full -translate-x-[105%] transition duration-300  ${
            click && "translate-x-[0%]"
          } fixed z-[996] top-[50px] shadow-lg`}
        >
          <div className="h-[calc(100%-80px)] overflow-y-scroll">
            <ul className="pt-5 ">
              {NavItems.map((n, i) => (
                <li
                  className={`py-2 pl-4 ${
                    n.sub != undefined
                      ? ""
                      : "hover:bg-neutral-200 hover:text-stone-500"
                  } border-t border-white first:border-none ${
                    n.show != "all"
                      ? n.show.filter(
                          (s) => s.dept == Dept && s.acc == Acc
                        )[0] != undefined
                        ? ""
                        : "hidden"
                      : ""
                  }`}
                >
                  {n.url != "" ? (
                    <a href={n.url} onClick={() => setClick(!click)}>
                      {n.title}
                    </a>
                  ) : (
                    n.title
                  )}
                  {n.sub != undefined && (
                    <ul>
                      {n.sub.map((s, i) => (
                        <li
                          className={`py-1 pl-4 hover:bg-neutral-200 hover:text-stone-500 hover:border-l-4 hover:border-red-500 ${
                            s.show != "all"
                              ? s.show.filter(
                                  (s) => s.dept == Dept && s.acc == Acc
                                )[0] != undefined
                                ? ""
                                : "hidden"
                              : ""
                          }`}
                        >
                          <a href={s.url} onClick={() => setClick(!click)}>
                            {s.title}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </div>
          <div className="absolute top-6 -right-[32px] z-[9999] max-md:hidden">
            <div className="flex flex-col bg-stone-500 w-8 h-16 justify-center items-center rounded-r-xl">
              <div
                className={`${!click ? "" : "rotate-180"}`}
                onClick={menuClick}
              >
                <MdArrowForwardIos />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
