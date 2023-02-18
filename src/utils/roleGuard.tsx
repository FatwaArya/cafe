import { GetServerSidePropsContext } from "next";
import { getServerAuthSession } from "../server/auth";
import { Session } from "next-auth";

type Callback = (data: { session: Session }) => void;

type RoleRedirects = {
    [key: string]: {
        [key: string]: string;
    };
};


const roleRedirects: RoleRedirects = {
    cashier: {
        ADMIN: "/admin",
        MANAGER: "/manager",
    },
    manager: {
        ADMIN: "/admin",
        CASHIER: "/cashier",
    },
    admin: {
        MANAGER: "/manager",
        CASHIER: "/cashier",
    },
};

export async function roleGuard(
    ctx: GetServerSidePropsContext,
    cb: Callback,
    role: string
) {
    try {
        const session = await getServerAuthSession(ctx);
        if (!session) {
            return {
                redirect: {
                    destination: "/",
                    permanent: false,
                },
            };
        }
        //@ts-ignore
        const redirectDestination = roleRedirects[role][session.user?.role as string]
        if (redirectDestination) {
            return {
                redirect: {
                    destination: redirectDestination,
                    permanent: false,
                },
            };
        }

        return cb({ session });
    } catch (error) {
        return {
            redirect: {
                destination: "/",
                permanent: false,
            },
        };
    }
}
