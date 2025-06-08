const { signIn, data } = useAuth();
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

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
            return useRouter().push("/admin");
        }
        isLoggin.value = false;
        return useRouter().push("/app/dashboard");
    } catch (err: any) {
        toast(
            "Login failed. Please check your credentials.",
            {
                "theme": "auto",
                "type": "error",
                "pauseOnHover": false
            });
        console.error(err);
        isLoggin.value = false;
    }
};