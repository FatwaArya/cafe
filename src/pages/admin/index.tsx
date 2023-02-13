import { NextPage } from "next";
import { signOut } from "next-auth/react";
import { GetServerSidePropsContext } from "next";
import { getServerAuthSession } from "../../server/auth";
import { roleGuard } from "../../utils/guard";
const Admin: NextPage = () => {
    return (
        <>
            hello Admin

            <button
                onClick={() => signOut(
                    { callbackUrl: "/" }
                )}
            >sign out</button>
        </>
    )
}

export default Admin

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
    return roleGuard(ctx, (session: any) => ({
        props: {
            session,
        },
    }), "admin")
}
//prevent other roles from accessing this page

// export async function getServerSideProps(ctx: GetServerSidePropsContext) {
//     const session = await getServerAuthSession(ctx);

//     if (session) {
//         if (session.user?.role === "ADMIN") {
//             return {
//                 redirect: {
//                     destination: "/admin",
//                     permanent: false,
//                 },
//             };
//         }

//         if (session.user?.role === "MANAGER") {
//             return {
//                 redirect: {
//                     destination: "/manager",
//                     permanent: false,
//                 },
//             };

//         }

//     }


//     return {
//         props: {
//             session,
//         },

//     };

// }





