<template>
    <div class="flex flex-col gap-4 px-4 pb-16">
        <div class="flex items-baseline justify-between pt-6">
            <h1 class="text-2xl font-bold ">Tas Saya</h1>
            <div class="font-bold text-red-600">Total: {{ cart_data?.data?.length }}</div>
        </div>

        <div v-if="cart_data?.data?.length > 0" class="flex flex-col gap-4">
            <div v-for="item in cart_data?.data"
                class="flex items-center gap-4 p-2 shadow-md shadow-slate-400/10 rounded-md">
                <div class="h-32 shrink-0">
                    <img :src="item.book.img" class="w-auto rounded-md overflow-hidden h-full object-cover" alt="Buku">
                </div>
                <div>
                    <h1 class="line-clamp-2 font-bold leading-tight">Clean Code: A Handbook of Agile Software
                        Craftsmanship
                    </h1>
                    <div class="flex items-start justify-between flex-wrap gap-x-4 mt-2">
                        <div class="text-sm">
                            <p class="text-red-600">Author: Robert C. Martin</p>
                            <p class="text-gray-500">Tersedia: 1</p>
                        </div>
                        <button @click="deleteItem(item.id)"
                            class="hover:bg-red-600 text-red-600 ml-auto mb-2 hover:text-white text-xs py-3 px-4 rounded-full font-bold border-2 border-red-600 transition-colors">
                            Hapus Buku
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <motion.div :initial="{ opacity: 0, y: 100 }"
            :animate="{ opacity: 1, y: 0, transition: { delay: 0.2, duration: 0.6 } }" v-else
            class="flex flex-col items-center justify-center h-96 bg-gray-50">
            <motion.div
                :animate="{ opacity: 1, y: 0, x: [0, -20, 20, -20, 20, 0], transition: { duration: 0.8, delay: .1 } }">
                <Icon icon="mdi:book-remove" class="text-8xl text-gray-200" />
            </motion.div>
            <h1 class="text-xl font-bold mt-4 text-red-600">Tas Anda Kosong</h1>
            <p class="text-gray-400 max-w-xs text-center">Silakan tambahkan buku untuk meminjam.</p>
        </motion.div>

        <div v-if="cart_data?.data?.length > 0" class="flex gap-4 fixed bottom-24 w-full left-0 px-4">
            <motion.div :while-press="{ scale: 0.9 }" @click="clearCart()"
                class="active:bg-gray-800 bg-white w-full flex items-center justify-center gap-2 active:text-white text-xs p-4 rounded-md font-bold border-2 border-gray-800 transition-all">
                <Icon icon="iconamoon:trash" class="text-gray-800 text-xl" />
                Bersihkan
            </motion.div>
            <motion.div :while-press="{ scale: 0.9 }" @click="isLend = true"
                class="bg-red-600 text-white w-full flex items-center justify-center gap-2 text-xs p-4 rounded-md font-bold border-2 border-red-600 transition-colors">
                <Icon icon="bi:bag-check" class="text-xl" />
                Pinjam ({{ cart_data?.data?.length }})
            </motion.div>
        </div>

        <Teleport to="body">
            <AnimatePresence>
                <div v-if="isLend"
                    class="fixed bottom-0 left-0 w-full h-screen bg-white/50 backdrop-blur-md z-50 flex items-center justify-center p-8">
                    <motion.div :initial="{ opacity: 0, y: 100 }"
                        :animate="{ opacity: 1, y: 0, transition: { duration: 0.5 } }"
                        :exit="{ opacity: 0, scale: 1.2, filter: 'blur(8px)', transition: { duration: 0.5 } }"
                        v-on-click-outside="() => isLend = false"
                        class="flex flex-col bg-white shadow-xl shadow-slate-400/20 rounded-md z-10 w-full max-w-md gap-2 p-4">
                        <h1 class="text-2xl font-bold text-center my-4">Pilih Durasi Peminjaman</h1>

                        <div class="flex w-full rounded-md border bg-gray-100">
                            <motion.label :while-press="{ scale: 0.9 }"
                                class="relative w-full flex items-center justify-center px-4 py-3 z-10"
                                v-for="item in [1, 3, 5]">
                                <input type="radio" name="duration" :value="item" @change="custom_duration = null"
                                    v-model="duration" class="peer sr-only" />
                                <span class="text-gray-400 text-right font-semibold peer-checked:text-red-600">
                                    {{ item }} Hari
                                </span>
                                <span v-if="item == duration" layoud-id="duration"
                                    class="absolute bg-white transition-all border-2 border-red-500 top-0 left-0 w-full h-full -z-10">
                                </span>
                            </motion.label>
                        </div>

                        <span class="w-full text-center text-gray-400">atau</span>

                        <div :class="custom_duration ? 'border-2 border-red-500 bg-white' : 'bg-gray-100'"
                            class="w-full border transition-all flex items-center justify-center rounded-md ">
                            <input type="number" v-model="custom_duration" @focus="() => duration = null"
                                @focusout="sanitizeInput" placeholder="Masukkan .." :min="1" :max="14"
                                class="w-32 px-4 py-3 outline-none border-none focus:ring-0 focus:border-red-500" />
                            Hari
                        </div>

                        <span class="w-full font-semibold text-sm text-red-600 text-right mt-2">** Batas Maximal 14
                            Hari</span>

                        <div class="flex gap-4 mt-8 w-full">
                            <motion.button :while-press="{ scale: 0.9 }" @click="isLend = false"
                                class="active:bg-gray-800 w-full flex items-center justify-center gap-2 active:text-white text-xs p-4 rounded-md font-bold border-2 border-gray-800 transition-all">
                                <Icon icon="material-symbols:cancel-outline-rounded" class="text-gray-800 text-xl" />
                                Batalkan
                            </motion.button>
                            <motion.button :while-press="{ scale: 0.9 }" @click="confirmLend"
                                class="bg-red-600 text-white w-full flex items-center justify-center gap-2 text-xs p-4 rounded-md font-bold border-2 border-red-600 transition-colors">
                                <Icon icon="bi:bag-check" class="text-xl" />
                                Konfirmasi
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            </AnimatePresence>
        </Teleport>
    </div>
</template>

<script lang="ts" setup>
definePageMeta({
    middleware: ["auth"],
    pageTransition: {
        name: "fade",
        mode: "out-in",
    },
});
import { Icon } from "@iconify/vue";
import { AnimatePresence, motion } from "motion-v";
import { vOnClickOutside } from '@vueuse/components'

const duration = ref<number | null>(1);
const custom_duration = ref<number | null>(null);

const isLend = ref(false);

const config = useRuntimeConfig().public.API_URL;
const { token } = useAuth();

const sanitizeInput = () => {
    // make sure the input is a number and within the range
    if (custom_duration.value !== null) {
        custom_duration.value = Math.max(1, Math.min(14, custom_duration.value));
    } else {
        custom_duration.value = 7;
    }
}

const { data: cart_data, refresh } = await useAsyncData<any>("cart", async () => {
    return await $fetch(`${config}lending/cart`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token.value}`,
        },
    });
});

import Swal from "sweetalert2";

const deleteItem = async (id: number) => {
    // swal konfirmasi
    const result = await Swal.fire({
        title: "Konfirmasi",
        text: "Apakah Anda yakin ingin menghapus buku ini dari tas?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Ya, hapus",
        cancelButtonText: "Tidak, batalkan",
    });

    try {
        await $fetch(`${config}lending/cart/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token.value}`,
            },
        });
        await refresh();
    } catch (error) {
        Swal.fire({
            icon: "error",
            title: "Gagal menghapus buku dari tas",
            text: "Terjadi kesalahan saat menghapus buku. Silakan coba lagi.",
        });
    }
};

const clearCart = async () => {
    // swal konfirmasi
    const result = await Swal.fire({
        title: "Konfirmasi",
        text: "Apakah Anda yakin ingin menghapus semua buku dari tas?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Ya, hapus semua",
        cancelButtonText: "Tidak, batalkan",
    });

    if (result.isConfirmed) {
        try {
            await $fetch(`${config}lending/cart/clear`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token.value}`,
                },
            });
            await refresh();
            Swal.fire({
                icon: "success",
                title: "Berhasil",
                text: "Semua buku telah dihapus dari tas.",
            });
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Gagal menghapus buku dari tas",
                text: "Terjadi kesalahan saat menghapus buku. Silakan coba lagi.",
            });
        }
    }
};

const confirmLend = async () => {
    // check if duration is set
    if (!duration.value && !custom_duration.value) {
        Swal.fire({
            icon: "error",
            title: "Pilih Durasi Peminjaman",
            text: "Silakan pilih durasi peminjaman sebelum melanjutkan.",
        });
        return;
    }

    // swal konfirmasi
    const result = await Swal.fire({
        title: "Konfirmasi",
        text: "Apakah Anda yakin ingin meminjam buku ini?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Ya, pinjam",
        cancelButtonText: "Tidak, batalkan",
    });

    if (result.isConfirmed) {
        try {
            await $fetch(`${config}lending/confirm`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token.value}`,
                },
                body: {
                    days: custom_duration.value ?? duration.value,
                },
            });
            await refresh();
            Swal.fire({
                icon: "success",
                title: "Berhasil",
                text: "Buku telah berhasil dipinjam.",
            });
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Gagal meminjam buku",
                text: "Terjadi kesalahan saat meminjam buku. Silakan coba lagi.",
            });
        }
    }
};
</script>

<style></style>