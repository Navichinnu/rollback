import React from "react";
import { useState, useEffect } from "react";
import Router from 'next/router';
import { Auth } from 'aws-amplify';
import Image from "next/image";
import countries from "../countries.json";
import employees from "../employees.json";
import roles from "../roles.json";
import industries from "../industries.json";
import Loader from "../common/Loader";
import { message } from "antd";
// import { redirectURL } from "../serverConfig";
import axios from "axios";
import { getOAuthHeaders } from "../oAuthValidation";
import { useRouter } from "next/router";

const SignUp = () => {
  const redirectURL = process.env.NEXT_PUBLIC_redirectURL;
  const domainURL = process.env.NEXT_PUBLIC_domain;
  const pricingURL = process.env.NEXT_PUBLIC_pricingURL;
  const policyURL = process.env.NEXT_PUBLIC_policyURL;
  const router = useRouter();
  const { planId, freeTrial, country, username } = router.query;
  let paramsPlanId, paramsFreeTrial, paramsCountry, paramsUsername;
  if (planId !== undefined) {
    paramsPlanId = planId;
  };
  if (freeTrial !== undefined) {
    paramsFreeTrial = freeTrial;
  };
  if (country !== undefined) {
    paramsCountry = country;
  };
  if (username !== undefined) {
    paramsUsername = username;
  };
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("86!}gkkVPD}3");
  const [company, setCompany] = useState("");
  const [countryList, setCountryList] = useState("");
  const [firstnameError, setFirstnameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [companyError, setCompanyError] = useState(false);
  const [roleError, setRoleError] = useState(false);
  const [phoneError, setPhoneError] = useState(false);
  const [industryError, setIndustryError] = useState(false);
  const [employeError, setEmployeError] = useState(false);
  const [postalError, setPostalError] = useState(false);
  const [countryError, setCountryError] = useState(false);
  const [regionError, setRegionError] = useState(false);
  const [termsError,setTermsError] = useState(false)
  const [phone, setPhone] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [loading, setLoading] = useState(false);
  const [regions, setRegions] = useState([]);
  const [code, setCode] = useState("");
  const [postalcode, setPostalcode] = useState("");
  const [role, setRole] = useState("");
  const [employee, setEmployee] = useState("");
  const [region, setRegion] = useState("");
  const [industry, setIndustry] = useState("");

  const check = async () => {
    setLoading(true);
    try {
      await Auth.currentSession();
      if (paramsPlanId) {
        const authHeaders = await getOAuthHeaders();
        if (authHeaders.email && authHeaders.tenantId) {
          let tempBody = {
            username: authHeaders.email,
            processed: "N",
            cancelled: "N",
            tenantId: authHeaders.tenantId,
            planDetails: JSON.stringify({
              planId: paramsPlanId,
              trial: paramsFreeTrial,
              country: paramsCountry
            })
          };
          await axios.post(`/api/upsertSubscriptionCart`, tempBody, {}).then(res => {
            if (res.status === 200) {
              let d = new Date();
              d.setTime(d.getTime() + (365 * 24 * 60 * 60 * 1000));
              let expires = "expires=" + d.toUTCString();
              let domain = "domain=" + domainURL;
              document.cookie = "cart" + "=" + JSON.stringify({ planDetails: JSON.stringify({ planId: paramsPlanId, trial: paramsFreeTrial, country: paramsCountry }) }) + ";" + expires + ";path=/" + ";secure=true" + ";SameSite=Strict" + ";" + domain;
              // Router.push(`${redirectURL}`);
              Router.push("/choose-tenant");
            } else {
              setLoading(false);
              message.error("Something is wrong in upsertSubscriptionCart");
            };
          });
        };
      } else {
        Router.push(`${redirectURL}`);
      };
    } catch (error) {
      setLoading(false);
      Router.push(`${window.location.href}`);
    };
  };

  useEffect(() => {
    if (router.isReady) {
      if (paramsUsername) {
        setEmail(decodeURIComponent(paramsUsername));
      };
      if (paramsPlanId) {
        check();
      } else {
        Router.push(`${pricingURL}`);
      };
    };
  }, [router.isReady]);

  const handleRegister = async (event) => {
    setLoading(true);
    event.preventDefault();
    const fields = [
      { value: firstname, setError: setFirstnameError },
      { value: email, setError: setEmailError },
      { value: company, setError: setCompanyError },
      { value: role, setError: setRoleError },
      { value: industry, setError: setIndustryError },
      { value: employee, setError: setEmployeError },
      { value: code, setError: setCountryError },
      { value: region, setError: setRegionError,required: regions.length > 0 },
      { value: phone, setError: setPhoneError },
      // { value: postalcode, setError: setPostalError }
    ];
  
    let isValid = true;
  
    fields.forEach(field => {
      if (field.required && field.value.trim() === '') {
        field.setError(true);
        isValid = false;
      } else {
        field.setError(false);
      }
    });

      const agreeToTerms = event.target.elements.terms.checked;
      if (!agreeToTerms) {
        setTermsError(true);
        isValid = false;
      } else {
        setTermsError(false);
      }

    if (isValid) {
      
      try {
        let tempBody = {
          username: email,
          processed: "N",
          cancelled: "N",
          planDetails: JSON.stringify({
            planId: paramsPlanId,
            trial: paramsFreeTrial,
            country: paramsCountry
          })
        };
  
        const response = await axios.post(`/api/upsertSubscriptionCart`, tempBody, {});
  
        if (response.status === 200) {
          const { user } = await Auth.signUp({
            username: email,
            password,
            attributes: {
              email,
              "custom:company": company,
              "custom:country": countryList,
              "custom:firstname": firstname,
              "custom:lastname": lastname,
              "custom:role": role,
              "custom:industry": industry,
              "custom:employees": employee,
              "custom:region": region,
              "custom:invite_user": "N",
              "custom:postalcode": postalcode,
              "phone_number": `${code.replace(" ", "")}${phone}`,
            }
          });
  
          if (user) {
            Router.push({
              pathname: '/thank-you',
              query: { username: email } // Pass your prop as a query parameter
            });
          }
        } else {
          message.error("Something is wrong in upsertSubscriptionCart");
        }
  
      } catch (error) {
        message.error(error.message);
      }
    }
    setLoading(false);
  };

  const handleCountry = (ev) => {
    setCountryList(ev.target.value)
    countries.countries.map(country => {
      if (country.name === ev.target.value) {
        if (country.states !== undefined) {
          setRegions(Object.values(country.states));
        } else {
          setRegion("");
          setRegions([]);
        };
        setCode(country.code);
      }
    })
  };

  const handleSignIn = () => {
    setLoading(true);
    if (paramsPlanId) {
      Router.push({
        pathname: '/sign-in',
        query: { planId: paramsPlanId, freeTrial: paramsFreeTrial, country: paramsCountry } // Pass your prop as a query parameter
      });
    } else {
      Router.push('/sign-in');
    };
  };

  const handlePostalCodeChange = (ev) => {
    console.log(ev)
    const value = ev.target.value;
    setPostalcode(value);
    
    const validPostalCode = /^\d{6}$/.test(value);
    setPostalError(!validPostalCode);
  };

  const validateEmail = (email) => {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email);
  };

  return (
    <div>
      {loading === true ? (
          <div className="absolute left-0 top-0 flex flex-col justify-center items-center w-full h-full bg-white-o-87 rounded-[12px]">
            <Loader />
          </div>
        ) : null}
        <div className="min-h-screen bg-blue py-3" style={{ fontFamily: 'Inter' }}>
          <div style={{ maxWidth: "85rem" }} className="mx-auto  sm:px-6 lg:px-8 grid md:grid-cols-2 md:gap-8">
            <div className="md:col-span-1 mt-4 px-3">
              <div className="flex flex-col h-full ">
                <Image src="/images/Newlogo-white.svg"
                  alt="Logo" width={150} height={210} />
                <h1 className="font-semibold text-white mt-2 md:mt-4" style={{ fontSize: '1.6rem' }}>
                  The best retail experience, Anytime Anywhere!
                </h1>
                <p className="mt-2 text-white hidden md:block" style={{ fontSize: '1rem' }}>
                  Looking to take your retail business to the next level? Our powerful software gives you the tools you need to grow your business like a pro
                </p>
                <p />
                <div className="cont mt-4 text-s text-white hidden md:flex md:items-center md:justify-start flex-shrink-0">
                  <Image alt="Logo" src="/images/Vector.png" width="22" height="22" />
                  <p className="des ml-2">Unified commerce capabilities</p>
                </div>
                <div className="cont mt-4 text-s text-white hidden md:flex md:items-center md:justify-start flex-shrink-0">
                  <Image alt="Logo" src="/images/Vector.png" width="22" height="22" />
                  <p className="des">Provide a customer-centric experience with real-time data across all your touchpoints</p>
                </div>
                <div className="cont mt-4 text-s text-white hidden md:flex md:items-center md:justify-start flex-shrink-0">
                  <Image alt="Logo" src="/images/Vector.png" width="22" height="22" />
                  <p className="des">A clean, intuitive interface that is easy for both customers and employees to use</p>
                </div>
                <div className="cont mt-4 text-s text-white hidden md:flex md:items-center md:justify-start flex-shrink-0">
                  <Image alt="Logo" src="/images/Vector.png" width="22" height="22" />
                  <p className="des">The ability to manage multiple stores from a single app, transfer inventory between locations, and view sales and performance metrics for each store</p>
                </div>
                <div className="cont mt-4 text-s text-white hidden md:block" style={{ textAlign: '-webkit-center' }}>
                  <Image alt="Logo" src="/images/signupImage.svg" width={300} height={300} />
                </div>
              </div>
            </div>
            <div className="md:col-span-1 px-3 mt-4">
              <div className="shadow h-full py-5 px-7" style={{ backgroundColor: '#D9D9D9', paddingTop: '' }}>
                <h2 className="" style={{ fontWeight: '600', fontSize: '19px', fontFamily: 'Inter', fontStyle: 'normal', }}>Please fill out the information below to create your account</h2>
                <span className="ff-inter text-[12px] font-medium">After completing this form, we'll send you a verification email along with an One Time Password</span>
                <form onSubmit={handleRegister}>
                  <div className="flex flex-wrap">
                    <div className=" w-full mb-2 md:w-1/2 md:pr-2">
                      <input
                        value={firstname}
                        type="text"
                        id="firstname"
                        name="firstname"
                        placeholder="First name"
                        className="w-full px-4 py-2 text-xs mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none"                        
                        style={{ borderRadius: '4px', color: '#101828' }}
                        onChange={(ev) => { setFirstname(ev.target.value) }}
                      />
                       {firstnameError &&<p className="text-red-500 text-xs" style={{display:firstnameError?"block":"none"}}>Please enter your first name.</p>}
                    </div>
                    <div className=" w-full md:w-1/2 md:pl-2">
                      <input
                        value={lastname}
                        type="text"
                        id="lastname"
                        name="lastname"
                        placeholder="Last name"
                        className="w-full px-4 py-2 mt-2 text-xs border focus:border-blue-500 focus:bg-white focus:outline-none"
                        required={false}
                        style={{ borderRadius: '4px', color: '#101828' }}
                        onChange={(ev) => { setLastname(ev.target.value) }}
                      />
                    </div>
                  </div>
                  <div className="mb-2">
                    <input
                      value={email}
                      type="email"
                      id="email"
                      name="email"
                      placeholder="Email"
                      className="w-full px-4 py-2 text-xs mt- border focus:border-blue-500 focus:bg-white focus:outline-none"
                      style={{ borderRadius: '4px', color: '#101828',marginTop:firstnameError?"":"0.5rem" }}
                      onChange={(ev) => { setEmail(ev.target.value) }}
                    />
                   {emailError || (email && !validateEmail(email)) ? (
                      <p className="text-red-500 text-xs mt-1">Please enter a valid email address.</p>
                    ) : null}
                  </div>
                  {/* <span style={{ float: 'right', fontSize: '12px' }}>The verification link will be sent to this email</span> */}
                  <div  className="flex flex-wrap">
                  <div className="mb-2 w-full md:w-1/2 md:pr-2">
                    <input
                      value={company}
                      type="company"
                      id="company"
                      name="company"
                      placeholder="Company"
                      className="w-full px-4 py-2 text-xs  border focus:border-blue-500 focus:bg-white focus:outline-none"
                      
                      style={{ borderRadius: '4px', color: '#101828',marginTop:emailError?"":"0.5rem" }}
                      onChange={(ev) => { setCompany(ev.target.value) }}
                    />
                    {companyError && <p className="text-red-500 text-xs mt-1">Please enter your Compamy name.</p>}
                  </div>
                  <div className="mb-2 w-full md:w-1/2 md:pl-2">
                    <select
                      value={role}
                      id="role"
                      name="role"
                      className="w-full px-4 py-2 text-xs   border focus:border-blue-500 focus:bg-white focus:outline-none text-ellipsis"
                      defaultValue=""
                      style={{ borderRadius: "4px", color: "#101828", appearance: "none", WebkitAppearance: "none", MozAppearance: "none", backgroundColor: 'white',marginTop:emailError?"":"0.5rem" }}
                      onChange={(ev) => { setRole(ev.target.value) }}
                    >
                      <option value="" disabled hidden>Role</option>
                      {roles.roles.map(role => {
                        return (
                          <option value={role.value}>{role.value}</option>
                        )
                      })}
                    </select>
                    {roleError && <p className="text-red-500 text-xs mt-1">Please select your role.</p>}
                  </div>
                  
                  </div>
                  <div className="flex flex-wrap">
                    <div className="mb-2 w-full md:w-1/2 md:pr-2">
                      <select
                        value={industry}
                        id="industry"
                        name="industry"
                        className="w-full px-4 py-2 text-xs  border focus:border-blue-500 focus:bg-white focus:outline-none text-ellipsis"
                        
                        style={{ borderRadius: "4px", color: "#101828", appearance: "none", WebkitAppearance: "none", MozAppearance: "none", backgroundColor: 'white',marginTop:companyError?"":"0.5rem" }}
                        onChange={(ev) => { setIndustry(ev.target.value) }}
                      >
                        <option value="" disabled hidden>Industry</option>
                        {industries.industries.map((industry) => {
                          const childOptions = industry.children.map((child) => (
                            <option value={child.value} key={child.value}>
                              {child.value}
                            </option>
                          ));
                          return (
                            <optgroup label={industry.value} key={industry.value}>
                              {childOptions}
                            </optgroup>
                          );
                        })}
                      </select>
                      {industryError && <p className="text-red-500 text-xs mt-1">Please select industry type.</p>}
                    </div>
                    <div className="mb-2 w-full md:w-1/2 md:pl-2">
                      <select
                        value={employee}
                        id="employees"
                        name="employees"
                        className="w-full px-4 py-2 text-xs  border focus:border-blue-500 focus:bg-white focus:outline-none"
                        
                        defaultValue=""
                        style={{ borderRadius: "4px", color: "#101828", appearance: "none", WebkitAppearance: "none", MozAppearance: "none", backgroundColor: 'white',marginTop:roleError?"":"0.5rem" }}
                        onChange={(ev) => { setEmployee(ev.target.value) }}
                      >
                        <option value="" disabled hidden>Employees</option>
                        {employees.employess.map(employee => {
                          return (
                            <option value={employee.value}>{employee.value}</option>
                          )
                        })}
                      </select>
                      {employeError && <p className="text-red-500 text-xs mt-1">Please select employee count.</p>}
                    </div>
                  </div>
                  <div className="flex flex-wrap">
                    <div className="mb-2 w-full md:w-1/2 md:pr-2">
                      <select
                        value={countryList}
                        id="country"
                        name="country"
                        className="w-full px-4 py-2 text-xs  border focus:border-blue-500 focus:bg-white focus:outline-none text-ellipsis"
                        
                        defaultValue=""
                        style={{ borderRadius: "4px", color: "#101828", appearance: "none", WebkitAppearance: "none", MozAppearance: "none", backgroundColor: 'white',marginTop:industryError?"":"0.5rem" }}
                        onChange={handleCountry}
                      >
                        <option value="" disabled hidden>Country</option>
                        {countries.countries.map(country => {
                          return (
                            <option value={country.name}>{country.name}</option>
                          )
                        })}
                      </select>
                      {countryError && <p className="text-red-500 text-xs mt-1">Please select your country.</p>}
                    </div>
                    <div className="mb-2 w-full md:w-1/2 md:pl-2">
                      <select
                        value={region}
                        id="region"
                        name="region"
                        className="w-full px-4 py-2 text-xs  border focus:border-blue-500 focus:bg-white focus:outline-none text-ellipsis"
                        
                        defaultValue=""
                        disabled={regions.length > 0 ? false : true}
                        style={{ borderRadius: "4px", color: "#101828", appearance: "none", WebkitAppearance: "none", MozAppearance: "none", backgroundColor: 'white',marginTop:employeError?"":"0.5rem" }}
                        onChange={(ev) => { setRegion(ev.target.value) }}
                      >
                        <option value="" disabled hidden>Region</option>
                        {regions.map(region => {
                          return (
                            <option value={region}>{region}</option>
                          )
                        })}
                      </select>
                      {region.length>0?regionError && <p className="text-red-500 text-xs mt-1">Please select your region.</p>:""}
                    </div>
                  </div>
                  <div className="flex flex-wrap">
                    <div className="w-full md:w-1/2 md:pr-2 space-x-0 flex">
                      <div className="flex flex-col w-full">
                        <div className="flex" style={{marginTop:countryError?"":"0.5rem"}}>
                          <input
                            value={code}
                            type="code"
                            id="code"
                            name="code"
                            placeholder="code"
                            className="w-2/6 px-4 py-2 text-xs mr-1  border focus:border-blue-500 focus:bg-white focus:outline-none"
                            style={{ borderRadius: '4px', color: '#101828' }}
                            disabled={true}
                          />
                          <input
                            value={phone}
                            type="phone"
                            id="phone"
                            name="phone"
                            placeholder="Phone"
                            className="px-4 py-2 text-xs w-4/6 border focus:border-blue-500 focus:bg-white focus:outline-none"
                            pattern="[0-9]{10}"
                            style={{ borderRadius: '4px', color: '#101828' }}
                            onChange={(ev)=>{setPhone(ev.target.value)}}
                          />
                        </div>
                        {phoneError && (
                          <p className="text-red-500 text-xs mt-1">Please enter your Phone number.</p>
                        )}
                        {phone !== "" && !phone.match(/^[0-9]{10}$/) && (
                        <p className="text-red-500 text-xs mt-1">Please enter a valid mobile number.</p>
                      )}
                      </div>
                    </div>
                    <div className="mb-4 w-full md:w-1/2 md:pl-2">
                      <input
                        value={postalcode}
                        type="postal code"
                        id="postalcode"
                        name="postalcode"
                        placeholder="Postal Code"
                        className="w-full px-4 py-2 text-xs border focus:border-blue-500 focus:bg-white focus:outline-none"
                        style={{ borderRadius: '4px', color: '#101828',marginTop:regionError?"":"0.5rem" }}
                        onChange={handlePostalCodeChange}
                      />
                      {postalError && (
                        <p className="text-red-500 text-xs mt-1">Please enter valid postal code.</p>
                      )}
                    </div>
                  </div>
                  <div className="mb-1">
                    <label htmlFor="terms" className="inline-flex items-center">
                      <input
                        type="checkbox"
                        id="terms"
                        name="terms"
                        className="mr-2"
                        
                        style={{ borderRadius: '4px', height: '20px', width: '20px' }}
                      />
                      <span className="text-xsm" style={{ color: '#667085', fontSize: '12px' }}>
                        I agree to the
                        <a style={{ color: '#508FDA' }} onClick={()=>{window.open(`${policyURL}`)}} className="ml-1 text-blue-500">
                        CW Suite Terms & Policy
                        </a>
                      </span>
                    </label>
                    {termsError && <p className="text-red-500 text-xs ">Please agree to the Terms&conditions.</p>}
                  </div>
                  <div className="mt-1" style={{ textAlign: 'center' }}>
                    <button
                      type="submit"
                      style={{ backgroundColor: '#91C507', borderRadius: '4px', width: '50%', float: 'center' }}
                      className="px-4 py-[0.4rem] shadow text-white font-semibold hover:bg-blue-600 focus:outline-none"
                    // onClick={handleRegister}
                    >
                      Sign Up
                    </button>
                    <p className="mt-4" style={{ fontSize: '12px', fontWeight: '400', fontStyle: 'normal', fontFamily: 'Inter', color: '#101828' }}>This site is protected by reCAPTCHA Enterprise and the Google Privacy Policy and Terms of Service apply</p>
                    <span style={{ fontSize: '12px', fontWeight: '400', fontStyle: 'normal', fontFamily: 'Inter', color: "#101828" }}>Already have an account?</span> <a onClick={handleSignIn} className="text-[#2AA8DF] ff-inter col-span-1" style={{ fontSize: "0.8rem", cursor: "pointer" }}>Sign In</a>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      
    </div>
  );
};

export default SignUp;