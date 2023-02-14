import { signOut } from "next-auth/react";
import { GetServerSidePropsContext } from "next";
import { getServerAuthSession } from "../../server/auth";
import { ReactElement } from "react";
import CashierLayout from "../../components/layouts/cashierLayout";
import { WikuPage } from "../_app";


const Cashier: WikuPage = () => {
    return (
        <>
            hello cashier
            assa
            <button
                onClick={() => signOut(
                    { callbackUrl: "/" }
                )}
            >sign out</button>
        </>
    )
}


Cashier.getLayout = function getLayout(page: ReactElement) {
    return <CashierLayout>{page}</CashierLayout>
};
Cashier.authRequired = true;
Cashier.role = "cashier";


export default Cashier

//prevent other roles from accessing this page

// export async function getServerSideProps(ctx: GetServerSidePropsContext) {
//     return roleGuard(ctx, (session: any) => ({
//         props: {
//             session,
//         },
//     }), "cashier")
// }





