import { signOut } from "next-auth/react";
import { WikuPage } from "../_app";
import { ReactElement } from "react";
import { roleGuard } from "../../utils/roleGuard";
import AdminLayout from "../../components/admin/layout/adminLayout";
import { GetServerSidePropsContext } from "next";
const Admin: WikuPage = () => {
    return (
        <>
            <h1>Admin</h1>
        </>
    )
}

export default Admin



Admin.getLayout = function getLayout(page: ReactElement) {
    return <AdminLayout>{page}</AdminLayout>
};
Admin.authRequired = true;
export async function getServerSideProps(ctx: GetServerSidePropsContext) {
    return roleGuard(ctx, (session: any) => ({
        props: {
            session,
        },
    }), "admin")
}
