import { NextPage } from "next";
import { signOut } from "next-auth/react";
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



