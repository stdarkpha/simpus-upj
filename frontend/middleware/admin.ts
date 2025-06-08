export default defineNuxtRouteMiddleware((to, from) => {
    const { status, data } = useAuth()

    if (status.value === 'unauthenticated') {
        return navigateTo('/login?callbackUrl=' + encodeURIComponent(to.fullPath))
    }

    if (status.value === 'authenticated') {
        // @ts-ignore
        if (data.value?.data?.role !== 'admin') {
            return navigateTo('/app/dashboard')
        }
    }
})
