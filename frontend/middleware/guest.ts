export default defineNuxtRouteMiddleware((to, from) => {
    const { status, data } = useAuth()

    // status.value is 'authenticated' or 'unauthenticated'
    if (status.value === 'authenticated') {
        // Correct Path: Check for the 'data' property inside the session data
        //@ts-ignore
        if (data.value?.data?.role === 'admin') {
            return navigateTo('/admin/')
        }
        // For any other authenticated user
        return navigateTo('/app/dashboard')
    }
})