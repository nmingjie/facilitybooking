import React from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FaFacebook, FaInstagram, FaYoutube, FaLinkedin } from "react-icons/fa6";

function Footer() {
  return (
    <div className="pt-4 lg:pt-16 bg-gray-600 text-white w-full mt-auto">
      <div className="w-full lg:w-10/12 md:w-11/12 lg:mx-auto md:mx-auto">
        <div className="container mx-auto">
          <div className="flex items-center mb-4 xl:mb-4 lg:mb-4">
            <p className="text-3xl text-white">JTC</p>
          </div>
          <div className="block text-white text-lg mb-5 md:hidden flex flex-col gap-y-4 pb-4">
            <text>
              Subscribe to our newsletter and stay updated on what’s happening
              at JTC.
              {/* Subscribe Button */}
            </text>
            <div>
              <Button> Subscribe Now</Button>
            </div>
            <Separator />
          </div>
        </div>

        <div className="container mx-auto">
          <div className="xl:flex lg:flex md:flex pt-2 justify-between pb-8">
            <div className="w-11/12 xl:w-1/3 lg:w-1/3 lg:mx-0 xl:mx-0">
              <div className="flex items-center mb-6 pt-3">
                <ul className="list-none">
                  <li>The JTC Summit</li>
                  <li>8 Jurong Town Hall Road</li>
                  <li>Singapore 609434</li>
                </ul>
              </div>

              <p className="font-bold mb-6">
                <a href="tel:1800 568 7000">
                  1800 568 7000 (Local)
                </a>
              </p>

              <div className="flex items-center mb-6 xl:mb-0 lg:mb-0 max-w-xs">
                <p className="text-sm text-gray-400">
                  Hotline is available from Mondays to Fridays, 8:30am - 6:00pm,
                  excluding public holidays.
                </p>
              </div>
            </div>
            <div className="w-11/12 xl:w-1/3 lg:w-1/3 lg:mx-0 pt-3 grid grid-cols-2 md:grid-cols-1 gap-y-0 text-base">
              <a href="https://www.jtc.gov.sg/about-jtc/who-we-are"> About JTC</a>
              <a href="https://www.jtc.gov.sg/about-jtc/careers/join-us"> Careers</a>
              <a href="https://www.jtc.gov.sg/about-jtc/resources/annual-reports"> Resources</a>
              <a href="https://www.jtc.gov.sg/other-forms"> Other forms</a>
            </div>

            <div className="flex-col w-11/12 xl:w-1/2 lg:w-1/2 lg:mx-0 xl:mx-0 pt-3 lg:flex lg:gap-y-8">
              <div className="hidden md:block md:flex md:flex-col md:gap-y-8">
                <p className="text-white text-xl mb-5">
                  Subscribe to our newsletter and stay updated on what’s
                  happening at JTC.
                </p>
                <div>
                  <Button>
                    <a href="https://form.gov.sg/5c627be7b678e100172f476e">Subscribe Now</a>
                  </Button>
                </div>
              </div>

              <div className="xl:flex xl:items-center">
                <div className="w-11/12 lg:mx-0 xl:mx-0 pt-6 grid grid-cols-2 lg:grid-cols-3 font-bold mb-5">
                  <a href="https://www.jtc.gov.sg/about-jtc/contact-us"> Contact JTC</a>
                  <a href="https://www.jtc.gov.sg/#enquiry"> Feedback</a>
                  <a href="https://www.reach.gov.sg/" target="_blank"> REACH</a>
                </div>
                <div className="w-11/12 xl:w-1/6 lg:w-1/6 sm:w-11/12 lg:mx-0 xl:mx-0 mt-8 lg:mt-8 xl:mt-0">
                  <div className="flex justify-start gap-x-6 pr-2 xl:pr-0 lg:pr-0 md:pr-0 sm:pr-0">
                    {/* Facebook */}
                    <a href="https://www.facebook.com/jtccorp">
                      <FaFacebook className="text-white" />
                    </a>
                    {/* Instagram */}
                    <div>
                      <a href="https://www.instagram.com/jtc_sg/">
                        <FaInstagram className="text-white" />
                      </a>
                    </div>
                    {/* Youtube */}
                    <div>
                      <a href="https://www.youtube.com/user/JTCsingapore">
                        <FaYoutube className="text-white" />
                      </a>
                    </div>
                    {/* LinkedIn */}
                    <div>
                      <a href="https://www.linkedin.com/company/jtc-corporation">
                        <FaLinkedin className="text-white" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <div className="flex flex-col md:flex-row xl:mt-8 mt-8 pt-6 pb-1 sm:pl-0">

            <div className="md:w-3/4 lg:mx-0 xl:mx-0 mb-6">
              <div className="grid grid-cols-2 md:grid-cols-none md:grid-flow-col gap-2 mb-5 text-gray-400 text-sm lg:text-xs xl:lg:text-sm">
                <a href="https://www.tech.gov.sg/report_vulnerability">Report Vulnerability</a>
                <a href="https://www.jtc.gov.sg/privacy-statement">Terms of Use</a>
                <a href="https://www.jtc.gov.sg/terms-of-use">Privacy Statement</a>
                <a href="https://form.gov.sg/forms/jtc/5ba1fae37890ef000f8aad95">Rate this Site</a>
                <a href="https://form.gov.sg/forms/jtc/5ba1fae37890ef000f8aad95">Sitemap</a>
              </div>
            </div>
            <div className="md:w-1/2 flex flex-col md:items-end lg:mx-0 xl:mx-0 mb-6 xl:mb-0 text-gray-400 text-sm">
              <p>&copy; 2023 JTC.</p>
              <p>Last updated 5 May 2023</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
