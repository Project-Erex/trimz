import React, {useState} from "react";
import {Dialog} from "@headlessui/react";
import {motion, AnimatePresence} from "framer-motion";
import {RxCross2} from "react-icons/rx";
import {FaGoogle, FaEyeSlash, FaEye} from "react-icons/fa";
import {MdEmail} from "react-icons/md";
import {toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {FallingLines} from "react-loader-spinner";

export const Modal = ({isOpen, setIsOpen}) => {
  const [isVisible, setVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const ipAddressResponse = await fetch("https://api.ipify.org?format=json");

      const {ip} = await ipAddressResponse.json();

      const response = await fetch("/api/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({email, password, ipAddress: ip}),
      });
      const data = await response.json();
      if (data.success) {
        localStorage.setItem("token", data.token);
        toast.success(data.message);
      } else {
        toast.success(data.message);
        localStorage.setItem("token", data.token);
      }
    } catch (error) {
      console.error("Error signing in:", error);
    } finally {
      setEmail("");
      setPassword("");
      setLoading(false);
      setIsOpen(!isOpen);
    }
  };

  const toggle = () => {
    setVisible(!isVisible);
  };
  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog
          open={isOpen}
          onClose={setIsOpen}
          as="div"
          className="fixed inset-0 z-10 flex items-center justify-center overflow-y-auto backdrop-blur-sm">
          <div className="flex flex-col h-full px-8 pt-5 overflow-hidden text-center lg:pt-10 lg:pb-8 md:pt-14 md:pb-8 ">
            <Dialog.Overlay />

            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 opacity-30 bg-bghero"></div>
            </div>

            <motion.div
              className="flex items-end justify-center min-h-screen px-4 pt-4 pb-20 md:pb-0 text-cente sm:block sm:p-0  "
              initial={{
                opacity: 0,
                scale: 0.75,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                transition: {
                  ease: "easeOut",
                  duration: 0.15,
                },
              }}
              exit={{
                opacity: 0,
                scale: 0.75,
                transition: {
                  ease: "easeIn",
                  duration: 0.15,
                },
              }}>
              <span
                className="hidden sm:inline-block sm:align-middle sm:h-screen"
                aria-hidden="true">
                &#8203;
              </span>
              <div
                className="inline-block overflow-hidden align-bottom transition-all transform border-2 border-gray border-opacity-25  rounded-[15px] shadow-xl bg-bghero sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-headline">
                <div className="md:w-[400px] w-full h-auto ">
                  <div className="relative flex w-full px-4 py-4 border-b-2 border-dotted border-lightGray ">
                    <div className="flex items-center justify-center w-full ">
                      <p className="font-sans text-2xl font-semibold text-gray ">
                        Sign In
                      </p>
                    </div>
                    <div className="absolute right-5 ">
                      <button
                        type="button"
                        tabIndex={0}
                        className="flex items-center justify-center px-2 py-2 border rounded-lg border-lightGray bg-bghero"
                        onClick={() => setIsOpen(false)}>
                        <RxCross2 size={20} />
                      </button>
                    </div>
                  </div>
                  <div className="px-10 py-10 bg-bghero">
                    <button className="w-full drop-shadow-md">
                      <div className="flex w-full rounded-[10px] bg-pink ">
                        <div className="flex items-center justify-center w-1/5 h-12 px-2 border-r-2 border-white border-opacity-45">
                          <FaGoogle size={25} color="#ffffff" />
                        </div>
                        <div className="flex items-center rounded-r-[10px] justify-center w-4/5 bg-pink">
                          <p className="font-sans text-base font-semibold text-white">
                            Sign in with Google
                          </p>
                        </div>
                      </div>
                    </button>

                    <div className="py-5">
                      <p className="font-sans text-lg font-medium text-black">Or</p>
                    </div>
                    {/* *********************************************************************************** */}

                    <div className="flex flex-col w-full gap-6 drop-shadow-md">
                      <div className="flex w-full ">
                        <div className="w-4/5 font-sans  rounded-l-[10px]">
                          <input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            type="email"
                            placeholder="Email"
                            className="w-full h-12  rounded-l-[10px] pl-5  outline-none bg-white"
                          />
                        </div>
                        <div className="flex items-center justify-center w-1/5  rounded-r-[10px] bg-white">
                          <MdEmail color="#AFAFAF" size={20} />
                        </div>
                      </div>
                      {/* ************** */}
                      <div className="flex w-full drop-shadow-md ">
                        <div className="w-4/5 font-sans rounded-l-[10px] bg-purple-400">
                          <input
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            type={!isVisible ? "password" : "text"}
                            placeholder="Password"
                            className="w-full h-12  rounded-l-[10px] pl-5  outline-none bg-white"
                          />
                        </div>
                        <div
                          onClick={toggle}
                          className="flex items-center justify-center w-1/5  rounded-r-[10px] bg-white">
                          {isVisible ? (
                            <FaEye color="#AFAFAF" size={20} />
                          ) : (
                            <FaEyeSlash color="#AFAFAF" size={20} />
                          )}
                        </div>
                      </div>

                      {/* *********************************************************************************** */}
                      <button
                        type="submit"
                        onClick={handleSignUp}
                        disabled={loading}
                        className="w-full h-12 justify-center items-center flex drop-shadow-md text-white font-sans font-semibold text-lg rounded-[10px] bg-primary">
                        {loading ? (
                          <FallingLines
                            color="#fff"
                            width="45"
                            visible={true}
                            ariaLabel="falling-circles-loading"
                          />
                        ) : (
                          "Sign In"
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </Dialog>
      )}
    </AnimatePresence>
  );
};