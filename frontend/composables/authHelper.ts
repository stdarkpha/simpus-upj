const { signIn, data } = useAuth();
import { toast } from "vue-sonner";

export const isLoggin = ref(false);
export const loggedIn = ref(false);

export const userLogin = async (email: string, password: string) => {
    isLoggin.value = true;
    if (!email || !password) {
        toast.error("Please enter your email and password");
        isLoggin.value = false;
        return;
    }
    const payload = {
        email: email,
        password: password
    }
    try {
        await signIn(payload, { redirect: false });
        loggedIn.value = true;

        // Check for callback URL in query parameters
        const route = useRoute();
        const router = useRouter();
        const callbackUrl = route.query.callbackUrl as string;

        //@ts-ignore
        if (data.value?.data?.role == "admin") {
            isLoggin.value = false;
            toast.success("Login successful" + data.value?.data?.name);
            // Redirect to callback URL if it exists, otherwise go to admin dashboard
            return router.push(callbackUrl || "/admin");
        }
        isLoggin.value = false;
        // Redirect to callback URL if it exists, otherwise go to user dashboard
        return router.push(callbackUrl || "/app/dashboard");
    } catch (err: any) {
        toast.error("login failed, please check your credentials");
        console.error(err);
        isLoggin.value = false;
    }
};