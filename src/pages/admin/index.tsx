import { NextPage } from "next";
import { signOut } from "next-auth/react";
import { GetServerSidePropsContext } from "next";
import { getServerAuthSession } from "../../server/auth";
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



