import { GetServerSidePropsContext } from "next";
import { getServerAuthSession } from "../server/auth";

export async function roleGuard(
    ctx: GetServerSidePropsContext,
    cb: any,
    role: string
) {
    const session = await getServerAuthSession(ctx);
    if (!session) {
        return {
            redirect: {
                destination: "/",
                permanent: false,
            },
        };
    }

    if (role === "cashier") {
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
    }

    if (role === "manager") {
        if (session.user?.role === "ADMIN") {
            return {
                redirect: {
                    destination: "/admin",
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

    if (role === "admin") {
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

    return cb({ session });
}