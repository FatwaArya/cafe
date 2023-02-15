import { NextPage } from "next";
import { signOut } from "next-auth/react";
import { WikuPage } from "../_app";

const Manager: WikuPage = () => {
    return (
        <>
            hello manager

            <button
                onClick={() => signOut(
                )}
            >sign out</button>
        </>
    )
}


export default Manager










