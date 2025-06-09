const { signIn, data } = useAuth();
import { toast } from "vue-sonner";

export const isLoggin = ref(false);
export const loggedIn = ref(false);

export const userLogin = async (email: string, password: string) => {
    isLoggin.value = true;
    const payload = {
        email: email,
        password: password
    }
    try {
        await signIn(payload, { redirect: false });
        loggedIn.value = true;
        //@ts-ignore
        if (data.value?.data?.role == "admin") {
            isLoggin.value = false;
            toast.success("Login successful" + data.value?.data?.name);
            return useRouter().push("/admin");
        }
        isLoggin.value = false;
        return useRouter().push("/app/dashboard");
    } catch (err: any) {
        toast.error("login failed, please check your credentials");
        console.error(err);
        isLoggin.value = false;
    }
};