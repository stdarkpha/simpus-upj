// middleware/auth.ts
export default defineNuxtRouteMiddleware((to, from) => {
    const { status } = useAuth()

    if (status.value === 'unauthenticated') {
        return navigateTo('/login?callbackUrl=' + encodeURIComponent(to.fullPath))
    }
})