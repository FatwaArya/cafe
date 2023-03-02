import Head from "next/head";
import Link from "next/link";

export default function Custom404() {
    return (
        <>
            {/*
    This example requires updating your template:
    ```
    <html class="h-full">
    <body class="h-full">
    ```
  */}
            <Head>
                <title> Sorry, we couldn’t find the page you’re looking for.</title>
            </Head>
            <div className="flex h-screen min-h-full flex-col bg-white pt-16 pb-12">
                <main className="mx-auto flex w-full max-w-7xl flex-grow flex-col justify-center px-4 sm:px-6 lg:px-8">

                    <div className="py-16">
                        <div className="text-center">
                            <p className="text-sm font-semibold uppercase tracking-wide text-secondary">
                                404 error
                            </p>
                            <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
                                Page <span className="text-secondary">not found.</span>
                            </h1>
                            <p className="mt-2 text-base text-gray-500">
                                Sorry, we couldn’t find the page you’re looking for.
                            </p>
                            <div className="mt-6">
                                <Link
                                    href="/"
                                    className="text-base font-medium text-secondary hover:text-primary"
                                >
                                    Go back home<span aria-hidden="true"> &rarr;</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </main>
                <footer className="mx-auto w-full max-w-7xl flex-shrink-0 px-4 sm:px-6 lg:px-8">
                    <nav className="flex justify-center space-x-4">
                        <a
                            href="#"
                            className="text-sm font-medium text-gray-500 hover:text-gray-600"
                        >
                            Contact Support
                        </a>
                        <span
                            className="inline-block border-l border-gray-300"
                            aria-hidden="true"
                        />
                        <a
                            href="#"
                            className="text-sm font-medium text-gray-500 hover:text-gray-600"
                        >
                            Status
                        </a>
                        <span
                            className="inline-block border-l border-gray-300"
                            aria-hidden="true"
                        />
                        <a
                            href="#"
                            className="text-sm font-medium text-gray-500 hover:text-gray-600"
                        >
                            Twitter
                        </a>
                    </nav>
                </footer>
            </div>
        </>
    );
}
