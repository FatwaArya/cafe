import { GetServerSidePropsContext } from "next";
import AdminLayout from "../../../components/admin/layout/adminLayout";
import { roleGuard } from "../../../utils/roleGuard";
import { WikuPage } from "../../_app";
import { ReactElement } from "react";
import MenuForm from "../../../components/admin/form/form";

const EditMenu: WikuPage = () => {
    return (
        <>
            <MenuForm />
        </>
    )
}


export default EditMenu

EditMenu.getLayout = function getLayout(page: ReactElement) {
    return <AdminLayout>{page}</AdminLayout>
};
EditMenu.authRequired = true;
export async function getServerSideProps(ctx: GetServerSidePropsContext) {
    return roleGuard(ctx, (session: any) => ({
        props: {
            session,
        },
    }), "admin")
}
