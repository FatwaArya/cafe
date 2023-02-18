import { GetServerSidePropsContext, type NextPage } from "next";

import { signIn } from "next-auth/react";

import Head from "next/head";
import { useState } from "react";
import { FcGoogle } from 'react-icons/fc';
import { getServerAuthSession } from "../server/auth";
import Image from "next/image";

const Home: NextPage = () => {
  const [email, setEmail] = useState("")

  return (
    <>
      <Head>
        <title>Sign in</title>

      </Head>
      <div className="h-screen bg-slate-50">
        <div className="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8 ">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <Image
              className="mx-auto h-12 w-auto rotate-90"
              src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
              alt="Workflow"
            />
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign in to your account</h2>

          </div>

          <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
              <form className="space-y-6" onSubmit={async (e) => {
                e.preventDefault();
                signIn("auth0", { email: email })
              }}>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email address
                  </label>
                  <div className="mt-1">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      onChange={
                        (e) => {
                          setEmail(e.target.value)
                        }

                      }
                      required
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>



                <div>
                  <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Sign in
                  </button>
                </div>
              </form>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Or continue with</span>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-1">
                  <div>
                    <button
                      onClick={() => signIn("google")}
                      className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    >
                      <FcGoogle className="text-xl" />

                      <span className="ml-3">Sign in with Google</span>

                    </button>
                  </div>


                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </>
  );
};


export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const session = await getServerAuthSession(ctx);
  if (session) {
    if (session.user?.role === "ADMIN") {
      return {
        redirect: {
          destination: "/admin",
          permanent: false,
        },
      };
    }
    if (session.user?.role === "MANAGER") {
      return {
        redirect: {
          destination: "/manager",
          permanent: false,
        },
      };
    }
    if (session.user?.role === "CASHIER") {
      return {
        redirect: {
          destination: "/cashier",
          permanent: false,
        },
      };
    }
  }
  return {
    props: {},
  };
}

export default Home;
