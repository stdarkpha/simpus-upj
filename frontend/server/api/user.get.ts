// import { useSanctumClient } from '#imports';
// const client = useSanctumClient();

export default defineEventHandler(async (event) => {
    const response = await $fetch('http://127.0.0.1:8000/api/test'); // Replace with the actual external API URL
    return response;
});