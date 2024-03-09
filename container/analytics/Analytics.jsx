import React, {useState, useEffect} from "react";
import {MdOutlineQrCode, MdOutlineContentCopy} from "react-icons/md";
import {IoAnalyticsSharp} from "react-icons/io5";
import {BsInfoCircleFill} from "react-icons/bs";
import {toast} from "react-toastify";
import Popover from "react-popover";
import moment from "moment";
import {QrModalUrl} from "../../components/QrModalUrl";
import {MdArrowBackIosNew} from "react-icons/md";
import {MdArrowForwardIos} from "react-icons/md";
import {Modal} from "../../components/LoginModels";
import {ThreeDots} from "react-loader-spinner";
import {RiExpandUpDownFill} from "react-icons/ri";
import Image from "next/image";
import {Link as ScrollLink} from "react-scroll";
import {GraphModal} from "../../components/GraphModal";
import {RiShareForwardLine} from "react-icons/ri";

export default function Analytics() {
  const [urlData, setUrlData] = useState([]);
  const [baseUrl, setBaseUrl] = useState("");
  const [popoverOpenIndex, setPopoverOpenIndex] = useState(-1);
  const [popoverInfo, setPopoverInfo] = useState(-1);
  const [popoverQr, setPopoverQr] = useState(-1);
  const [popoverRedirect, setPopoverRedirect] = useState(-1);
  const [popoverAnalytics, setPopoverAnalytics] = useState(-1);
  const [popoverSort, setPopoverSort] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenLogin, setIsOpenLogin] = useState(false);
  const [isOpenGraph, setIsOpenGraph] = useState(false);
  const [selectedItem, setSelectedItem] = useState();
  const [isToken, setIsToken] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(0);
  const [sortOrder, setSortOrder] = useState("desc");
  const [isloading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchMyUrls();
    const fetchUrl = window?.location.href;
    const modifiedUrl = fetchUrl.replace(/www\./, "");
    setBaseUrl(modifiedUrl);
    const token = localStorage.getItem("token");
    if (token) {
      setIsToken(true);
    } else {
      setIsToken(false);
    }
  }, [page, sortOrder]);

  const fetchMyUrls = async () => {
    try {
      let headers = {
        "Content-Type": "application/json",
      };

      const token = await localStorage.getItem("token");

      if (token) {
        headers.token = token;
      }
      const ipAddressResponse = await fetch("https://api.ipify.org?format=json");
      const {ip} = await ipAddressResponse.json();

      const response = await fetch(
        `/api/shorten?ip=${ip}&page=${page}&sort=${sortOrder}`,
        {
          method: "GET",
          headers: headers,
        },
      );
      const data = await response.json();

      if (data.success) {
        setUrlData(data.response.data);
        setTotalCount(data.response.totalCount);
        setIsLoading(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error signing in:", error);
    }
  };

  const paginateData = (pageNumber) => {
    setIsLoading(true);
    setPage(pageNumber);
  };
  const toggleSortOrder = (newSortOrder) => {
    setIsLoading(true);
    setSortOrder(newSortOrder);
  };

  const copyToClipboard = (shortUrl) => {
    navigator.clipboard
      .writeText(`${baseUrl}${shortUrl}`)
      .then(() => {
        toast.success("Copy Successfully");
      })
      .catch((error) => {
        console.error("Error copying to clipboard:", error);
      });
  };

  const toggleModal = (modalState, url) => {
    switch (modalState) {
      case "qrModal":
        setSelectedItem(url);
        setIsOpen(!isOpen);
        break;
      case "loginModal":
        setIsOpenLogin(!isOpenLogin);
        break;
      case "graphModal":
        setSelectedItem(url);
        setIsOpenGraph(!isOpenGraph);
        break;

      default:
        break;
    }
  };

  return (
    <section
      id="myurls"
      className="relative flex items-center justify-center w-full min-h-full py-14 bg-white select-none">
      <div className="2xl:px-[146px] xl:px-36 lg:px-32 md:px-22 sm:px-16 px-6 flex-col xl:flex-col w-full flex items-center max-w-screen-2xl">
        <div className="w-full flex flex-col justify-center items-center">
          <div className="flex mb-3 md:justify-center justify-start w-full select-none">
            <h1 className="font-sans font-bold text-[12px] text-pink bg-pink bg-opacity-15 rounded-3xl py-2 px-5 text-left select-none">
              My Shorten URLs
            </h1>
          </div>
          <h1 className="text-black font-sans font-bold md:text-[36px] text-[28px] select-none">
            One short link, infinite possibilities
          </h1>
          <h1 className="md:text-[18px] text-[16px] font-sans font-medium pt-3 md:text-center text-left select-none">
            A short link is a powerful marketing tool when you use it carefully. It is not
            just a <br className="hidden lg:flex" /> link but a medium between your
            customer and their destination.
          </h1>
          <div className="w-full flex xl:flex-row justify-between items-center my-8 md:gap-8 flex-col gap-5">
            <div className="w-full bg-white md:px-8 md:py-10 p-5 rounded-[15px] shadow-3xl select-none">
              <Image
                src="/Smart_targeting.png"
                width={70}
                height={70}
                alt="Picture of the author"
              />
              <h1 className="text-black font-sans font-semibold md:text-[24px] text-[22px] pt-5 pb-4">
                Smart Targeting
              </h1>
              <h1 className="text-black font-sans md:text-[16px] text-[14px]">
                Target your customer to increase your reach and redirect them to a
                relevant page. Add a pixel to retarget them in your social media ad
                campaign to capture tham.
              </h1>
            </div>
            <div className="w-full bg-white md:px-8 md:py-10 p-5 rounded-[15px] shadow-3xl select-none">
              <Image
                src="/In_depth.png"
                width={70}
                height={70}
                alt="Picture of the author"
              />
              <h1 className="text-black font-sans font-semibold md:text-[24px] text-[22px] pt-5 pb-4">
                In-Depth Analytics
              </h1>
              <h1 className="text-black font-sans md:text-[16px] text-[14px]">
                Share your links to your network and measure data to optimize your
                marketing campaign's performance. Reach an audience that fits your needs.
              </h1>
            </div>
            <div className="w-full bg-white md:px-8 md:py-10 p-5 rounded-[15px] shadow-3xl select-none">
              <Image
                src="/Digital_experience2.png"
                width={70}
                height={70}
                alt="Picture of the author"
              />
              <h1 className="text-black font-sans font-semibold md:text-[24px] text-[22px] pt-5 pb-4">
                Digital Experience
              </h1>
              <h1 className="text-black font-sans md:text-[16px] text-[14px]">
                Use various powerful tools increase conversion and provide a non-intrusive
                experience to your customers without disengaging them.
              </h1>
            </div>
          </div>
        </div>
        {!urlData ||
          (Array.isArray(urlData) && urlData.length === 0 && (
            <div className="w-full py-5 bg-pink mb-2 rounded-[15px] flex justify-center items-center bg-opacity-20">
              <ScrollLink
                onClick={() => {
                  window.scrollTo(0, 0);
                }}
                spy={true}
                smooth={true}
                offset={-90}
                duration={300}
                className="text-pink font-semibold font-sans underline underline-offset-2 pr-2 cursor-pointer">
                Shorten Now
              </ScrollLink>{" "}
              to see your history
            </div>
          ))}
        {urlData && urlData.length > 0 && (
          <>
            <h1 className="text-black font-sans font-bold md:text-[36px] text-[28px] select-none text-center mt-2 mb-6">
              Tracking Your Shortened Links: A History Log
            </h1>
            <div className="overflow-hidden w-full overflow-x-auto rounded-[10px]">
              <table className="min-w-full ">
                <thead className=" bg-pink text-left text-white">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-4 font-sans font-medium select-none">
                      Short Link
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 font-sans font-medium select-none">
                      Original Link
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 font-sans font-medium select-none">
                      Badge
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 font-sans font-medium select-none">
                      Clicks
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 font-sans font-medium flex items-center select-none">
                      <p>Date</p>
                      <div>
                        <Popover
                          isOpen={popoverSort}
                          body={
                            <div className="px-4 py-2 text-white rounded-md shadow-xl popover-content bg-bghover ">
                              {sortOrder === "asc" ? "Sort By New" : "Sort By Old"}
                            </div>
                          }>
                          <button
                            onMouseEnter={() => setPopoverSort(true)}
                            onMouseLeave={() => setPopoverSort(false)}
                            onClick={() =>
                              toggleSortOrder(sortOrder === "asc" ? "desc" : "asc")
                            }
                            className="pt-2 pl-2">
                            <RiExpandUpDownFill size={18} color="#fff" />
                          </button>
                        </Popover>
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 font-sans font-medium select-none">
                      Analytics
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {isToken
                    ? urlData.map((url, index) => (
                        <tr
                          key={index}
                          className="bg-primary border-y-[5px] border-white bg-opacity-10">
                          <td className="whitespace-nowrap px-6 py-3 font-medium flex flex-row items-center justify-between">
                            <p>
                              {baseUrl}
                              {url.shortUrl}
                            </p>

                            <div className="gap-2 flex ml-2">
                              <Popover
                                isOpen={popoverOpenIndex === index}
                                body={
                                  <div className="px-4 py-2 text-white rounded-t-md shadow-xl popover-content bg-bghover">
                                    Copy to clipboard
                                  </div>
                                }>
                                <button
                                  onMouseEnter={() => setPopoverOpenIndex(index)}
                                  onMouseLeave={() => setPopoverOpenIndex(-1)}
                                  onClick={() => {
                                    copyToClipboard(url.shortUrl);
                                  }}
                                  className="bg-pink px-3 py-3 rounded-full bg-opacity-10  hover:bg-white  transition-all duration-500 delay-75 ease-in-out">
                                  <MdOutlineContentCopy size={20} color="#E93266" />
                                </button>
                              </Popover>
                              <Popover
                                isOpen={popoverRedirect === index}
                                body={
                                  <div className="px-4 py-2 text-white rounded-t-md shadow-xl popover-content bg-bghover">
                                    Click to redirect
                                  </div>
                                }>
                                <a
                                  href={`${baseUrl}${url.shortUrl}`}
                                  target="_blank"
                                  onMouseEnter={() => setPopoverRedirect(index)}
                                  onMouseLeave={() => setPopoverRedirect(-1)}
                                  className="bg-pink px-3 py-3 rounded-full bg-opacity-10  hover:bg-white  transition-all duration-500 delay-75 ease-in-out">
                                  <RiShareForwardLine size={20} color="#E93266" />
                                </a>
                              </Popover>
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-6 py-3 font-medium  ">
                            <div className="flex flex-row gap-3 items-center">
                              <p>
                                {url.originalUrl.length > 30
                                  ? `${url.originalUrl.substring(0, 30)}...`
                                  : url.originalUrl}
                              </p>
                              <div>
                                <Popover
                                  isOpen={popoverInfo === index}
                                  body={
                                    <div className="px-4 py-2 text-white rounded-md shadow-xl popover-content bg-bghover ">
                                      {url.originalUrl}
                                    </div>
                                  }>
                                  <button
                                    onMouseEnter={() => setPopoverInfo(index)}
                                    onMouseLeave={() => setPopoverInfo(-1)}
                                    className="pt-[5px]">
                                    <BsInfoCircleFill size={25} color="#9e9e9e" />
                                  </button>
                                </Popover>
                              </div>
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-6 py-3">
                            <div className="flex flex-row gap-1">
                              {url.isCustom === true && (
                                <Image
                                  src="/custom.png"
                                  width={600}
                                  height={600}
                                  className="w-10 h-10"
                                />
                              )}
                              {url.isDefault === true && (
                                <Image
                                  src="/default.png"
                                  width={600}
                                  height={600}
                                  className="w-10 h-10"
                                />
                              )}
                              {url.isIpAddress === true && (
                                <Image
                                  src="/ip.png"
                                  width={600}
                                  height={600}
                                  className="w-10 h-10"
                                />
                              )}
                              {url.isOneTime === true && (
                                <Image
                                  src="/onetime.png"
                                  width={600}
                                  height={600}
                                  className="w-10 h-10"
                                />
                              )}
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-6 py-3 font-medium">
                            {url.clicks}
                          </td>
                          <td className="whitespace-nowrap px-6 py-3 font-medium">
                            {moment(url.updated_at).format("MMM D, YYYY")}
                          </td>
                          <td className="whitespace-nowrap px-6 py-3 font-medium flex flex-row items-center gap-5">
                            <div>
                              <Popover
                                isOpen={popoverQr === index}
                                body={
                                  <div className="px-4 py-2 text-white rounded-md shadow-xl popover-content bg-bghover">
                                    Generate QR Code
                                  </div>
                                }>
                                <button
                                  onMouseEnter={() => setPopoverQr(index)}
                                  onMouseLeave={() => setPopoverQr(-1)}
                                  onClick={() => toggleModal("qrModal", url)}
                                  className="bg-pink px-3 py-3 rounded-full bg-opacity-10  hover:bg-white  transition-all duration-500 delay-75 ease-in-out">
                                  <MdOutlineQrCode size={20} color="#E93266" />
                                </button>
                              </Popover>
                            </div>
                            <div>
                              <Popover
                                isOpen={popoverAnalytics === index}
                                body={
                                  <div className="px-4 py-2 text-white rounded-md shadow-xl popover-content bg-bghover">
                                    See full Analytics
                                  </div>
                                }>
                                <button
                                  onMouseEnter={() => setPopoverAnalytics(index)}
                                  onMouseLeave={() => setPopoverAnalytics(-1)}
                                  onClick={() => toggleModal("graphModal", url)}
                                  className="bg-pink px-3 py-3 rounded-full bg-opacity-10  hover:bg-white  transition-all duration-500 delay-75 ease-in-out">
                                  <IoAnalyticsSharp size={20} color="#E93266" />
                                </button>
                              </Popover>
                            </div>
                          </td>
                        </tr>
                      ))
                    : urlData.slice(0, 4).map((url, index) => (
                        <tr
                          key={index}
                          className="bg-primary border-y-[5px] border-white bg-opacity-10">
                          <td className="whitespace-nowrap px-6 py-3 font-medium flex flex-row items-center justify-between">
                            <p>
                              {baseUrl}
                              {url.shortUrl}
                            </p>

                            <div className="gap-2 flex ml-2">
                              <Popover
                                isOpen={popoverOpenIndex === index}
                                body={
                                  <div className="px-4 py-2 text-white rounded-t-md shadow-xl popover-content bg-bghover">
                                    Copy to clipboard
                                  </div>
                                }>
                                <button
                                  onMouseEnter={() => setPopoverOpenIndex(index)}
                                  onMouseLeave={() => setPopoverOpenIndex(-1)}
                                  onClick={() => {
                                    copyToClipboard(url.shortUrl);
                                  }}
                                  className="bg-pink px-3 py-3 rounded-full bg-opacity-10  hover:bg-white  transition-all duration-500 delay-75 ease-in-out">
                                  <MdOutlineContentCopy size={20} color="#E93266" />
                                </button>
                              </Popover>
                              <Popover
                                isOpen={popoverRedirect === index}
                                body={
                                  <div className="px-4 py-2 text-white rounded-t-md shadow-xl popover-content bg-bghover">
                                    Click to redirect
                                  </div>
                                }>
                                <a
                                  href={`${baseUrl}${url.shortUrl}`}
                                  target="_blank"
                                  onMouseEnter={() => setPopoverRedirect(index)}
                                  onMouseLeave={() => setPopoverRedirect(-1)}
                                  className="bg-pink px-3 py-3 rounded-full bg-opacity-10  hover:bg-white  transition-all duration-500 delay-75 ease-in-out">
                                  <RiShareForwardLine size={20} color="#E93266" />
                                </a>
                              </Popover>
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-6 py-3 font-medium  ">
                            <div className="flex flex-row gap-3">
                              <p>
                                {url.originalUrl.length > 30
                                  ? `${url.originalUrl.substring(0, 30)}...`
                                  : url.originalUrl}
                              </p>
                              <div>
                                <Popover
                                  isOpen={popoverInfo === index}
                                  body={
                                    <div className="px-4 py-2 text-white rounded-md shadow-xl popover-content bg-bghover ">
                                      {url.originalUrl}
                                    </div>
                                  }>
                                  <button
                                    onMouseEnter={() => setPopoverInfo(index)}
                                    onMouseLeave={() => setPopoverInfo(-1)}>
                                    <BsInfoCircleFill size={20} color="#9e9e9e" />
                                  </button>
                                </Popover>
                              </div>
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-6 py-3">
                            <div className="flex flex-row gap-1">
                              {url.isCustom === true && (
                                <Image
                                  src="/custom.png"
                                  width={600}
                                  height={600}
                                  className="w-10 h-10"
                                />
                              )}
                              {url.isDefault === true && (
                                <Image
                                  src="/default.png"
                                  width={600}
                                  height={600}
                                  className="w-10 h-10"
                                />
                              )}
                              {url.isIpAddress === true && (
                                <Image
                                  src="/ip.png"
                                  width={600}
                                  height={600}
                                  className="w-10 h-10"
                                />
                              )}
                              {url.isOneTime === true && (
                                <Image
                                  src="/onetime.png"
                                  width={600}
                                  height={600}
                                  className="w-10 h-10"
                                />
                              )}
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-6 py-3 font-medium">
                            {url.clicks}
                          </td>
                          <td className="whitespace-nowrap px-6 py-3 font-medium">
                            {moment(url.updated_at).format("MMM D, YYYY")}
                          </td>
                          <td className="whitespace-nowrap px-6 py-3 font-medium flex flex-row items-center gap-5">
                            <div>
                              <Popover
                                isOpen={popoverQr === index}
                                body={
                                  <div className="px-4 py-2 text-white rounded-md shadow-xl popover-content bg-bghover">
                                    Generate QR Code
                                  </div>
                                }>
                                <button
                                  onMouseEnter={() => setPopoverQr(index)}
                                  onMouseLeave={() => setPopoverQr(-1)}
                                  onClick={() => toggleModal("qrModal", url)}
                                  className="bg-pink px-3 py-3 rounded-full bg-opacity-10  hover:bg-white  transition-all duration-500 delay-75 ease-in-out">
                                  <MdOutlineQrCode size={20} color="#E93266" />
                                </button>
                              </Popover>
                            </div>
                            <div>
                              <Popover
                                isOpen={popoverAnalytics === index}
                                body={
                                  <div className="px-4 py-2 text-white rounded-md shadow-xl popover-content bg-bghover">
                                    See full Analytics
                                  </div>
                                }>
                                <button
                                  onMouseEnter={() => setPopoverAnalytics(index)}
                                  onMouseLeave={() => setPopoverAnalytics(-1)}
                                  onClick={() => toggleModal("graphModal", url)}
                                  className="bg-pink px-3 py-3 rounded-full bg-opacity-10  hover:bg-white  transition-all duration-500 delay-75 ease-in-out">
                                  <IoAnalyticsSharp size={20} color="#E93266" />
                                </button>
                              </Popover>
                            </div>
                          </td>
                        </tr>
                      ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {urlData.length > 3 && !isToken && (
          <div className=" w-full sm:h-[75px] 2xl:mt-[-6.5%] xl:mt-[-7%] lg:mt-[-10%] h-[75px] md:mt-[-12%] xsm:mt-[-24%] mt-[-28%] backdrop-blur-sm bg-white/30 text-black font-medium font-sans flex  gap-1 justify-center items-center sm:text-[16px] text-[12px]">
            <button
              onClick={() => toggleModal("loginModal")}
              className="text-pink font-semibold font-sans underline underline-offset-2">
              Register Now
            </button>{" "}
            to enjoy Unlimited History
          </div>
        )}
        <Modal isOpen={isOpenLogin} setIsOpen={setIsOpenLogin} />

        {isToken && totalCount > 6 && (
          <div className="bg-primary bg-opacity-10 w-full px-6 py-3 flex flex-row items-center gap-5 justify-center rounded-b-lg h-16">
            {isloading ? (
              <ThreeDots
                visible={true}
                height="40"
                width="40"
                color="#E93266"
                radius="9"
                ariaLabel="three-dots-loading"
                wrapperStyle={{}}
                wrapperClass=""
              />
            ) : (
              <>
                <button
                  onClick={() => paginateData(page - 1)}
                  disabled={page === 0}
                  className="bg-pink px-2 py-2 rounded-[10px] bg-opacity-10  hover:bg-white  transition-all duration-500 delay-75 ease-in-out">
                  <MdArrowBackIosNew size={20} color="#E93266" />
                </button>
                {[...Array(Math.ceil(totalCount / 4)).keys()].map((pageNumber) => {
                  if (
                    pageNumber === page ||
                    pageNumber === page - 1 ||
                    pageNumber === page + 1
                  ) {
                    return (
                      <button
                        key={pageNumber}
                        onClick={() => paginateData(pageNumber)}
                        className={`text-pink font-sans font-semibold ${
                          page === pageNumber
                            ? "bg-pink px-3 py-1 rounded-full text-white font-sans text-[14px]"
                            : ""
                        }`}>
                        {pageNumber + 1}
                      </button>
                    );
                  }

                  if (pageNumber === 0 || pageNumber === Math.ceil(totalCount / 4) - 1) {
                    return (
                      <span
                        key={pageNumber}
                        className="text-pink font-sans font-semibold">
                        ...
                      </span>
                    );
                  }
                  return null;
                })}
                <button
                  onClick={() => paginateData(page + 1)}
                  disabled={page === Math.ceil(totalCount / 4) - 1}
                  className="bg-pink px-2 py-2 rounded-[10px] bg-opacity-10  hover:bg-white  transition-all duration-500 delay-75 ease-in-out">
                  <MdArrowForwardIos size={20} color="#E93266" />
                </button>
              </>
            )}
          </div>
        )}
        <QrModalUrl
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          BaseUrl={baseUrl}
          selectedItem={selectedItem}
        />
        <GraphModal
          isOpen={isOpenGraph}
          setIsOpen={setIsOpenGraph}
          BaseUrl={baseUrl}
          selectedItem={selectedItem}
        />
      </div>
    </section>
  );
}
