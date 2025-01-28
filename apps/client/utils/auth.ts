
import { redirect } from "next/navigation";

export const logout = () => {
    redirect('/login');
}