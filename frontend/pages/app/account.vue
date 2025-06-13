<template>
    <div>
        <div class="bg-red-600 w-full h-64 absolute top-0 left-0 -z-10 rounded-bl-2xl rounded-br-2xl">
        </div>

        <header>
            <div class="container p-4 flex flex-col gap-4">
                <div class="text-center">
                    <h1 class="text-2xl font-bold text-white">
                        {{ data?.data.name }}
                    </h1>
                    <p class="text-white">
                        <span class="capitalize">{{ data?.data.role }}</span> |
                        NIM: {{ data?.data.uid }} |
                        {{ data?.data.email }}
                    </p>
                </div>

                <!-- Filter Search -->
                <div
                    class="bg-white shadow-xl shadow-slate-400/10 w-full flex flex-col items-center justify-center rounded-md p-4">
                    <h1 class="text-lg font-bold mb-2">Total Peminjaman</h1>

                    <div class="w-full items-center text-center flex gap-6">
                        <div class="flex-1">
                            <canvas id="loanChart" class="w-full"></canvas>
                        </div>
                        <hr class="h-16 border-l border-gray-200" />
                        <div class="flex-1">
                            <p class="font-bold text-2xl">75</p>
                            <span class="text-xs text-gray-400">
                                Tepat Waktu
                            </span>
                        </div>
                        <hr class="h-16 border-l border-gray-200" />
                        <div class="flex-1">
                            <p class="font-bold text-2xl">25</p>
                            <span class="text-xs text-gray-400">
                                Terlambat
                            </span>
                        </div>
                    </div>

                </div>

            </div>
        </header>
        <section class="mb-8">
            <div class="container flex items-baseline-last justify-between p-4">
                <h1 class="text-xl font-bold">
                    Buku Pinjaman
                </h1>
                <NuxtLink class="font-bold text-red-600" to="/app/history">Lihat Semua</NuxtLink>
            </div>

            <div class="max-w-screen w-full overflow-hidden">
                <Suspense>
                    <UserHomeLending />
                    <template #fallback>
                        <div class="w-full py-24 text-gray-600 flex items-center justify-center">
                            <Icon icon="mingcute:loading-3-line" class="text-4xl animate-spin " />
                            Harap Tunggu...
                        </div>
                    </template>
                </Suspense>
            </div>
        </section>

        <section>
            <div class="container px-4">
                <div class="flex items-baseline-last justify-between ">
                    <h1 class="text-xl font-bold">
                        Pengaturan
                    </h1>
                    <a class="font-bold text-red-600" href="#">Lihat Semua</a>
                </div>

                <div class="flex flex-col gap-4 my-4">
                    <motion.div :while-press="{ scale: 0.9 }"
                        class="active:bg-gray-200 select-none bg-white w-full flex items-center justify-start gap-2 text-xs p-4 rounded-md font-bold shadow border-transparent transition-all">
                        <Icon icon="gg:profile" class="text-gray-800 text-2xl" />
                        Update Foto
                    </motion.div>
                    <motion.div :while-press="{ scale: 0.9 }"
                        class="active:bg-gray-200 select-none bg-white w-full flex items-center justify-start gap-2 text-xs p-4 rounded-md font-bold shadow border-transparent transition-all">
                        <Icon icon="tabler:forms" class="text-gray-800 text-2xl" />
                        Update Profile
                    </motion.div>
                    <motion.div :while-press="{ scale: 0.9 }" @click="signOut({ callbackUrl: '/login' });"
                        class="active:bg-red-600 bg-red-100 w-full flex items-center justify-start gap-2 active:text-white text-xs p-4 rounded-md font-bold border-2 border-red-600 text-red-600 transition-all">
                        <Icon icon="tabler:logout" class="text-2xl" />
                        Keluar
                    </motion.div>
                </div>
            </div>
        </section>
    </div>
</template>

<script lang="ts" setup>
import { Icon } from '@iconify/vue';
import { motion } from 'motion-v';
import Chart from 'chart.js/auto';
const { data, token, signOut } = useAuth();

const loanChart = ref<any>(null);

onMounted(() => {
    const ctx = document.getElementById('loanChart') as HTMLCanvasElement;
    loanChart.value = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Tepat Waktu', 'Terlambat'],
            datasets: [{
                data: [75, 25],
                backgroundColor: ['#E7000B', '#DFE4EA'],
                borderRadius: 20, // Rounded corners
                offset: 0, // Offset for the inner circle
            }],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '75%',
            plugins: {
                legend: {
                    display: false,
                },
                // Add total text in the middle
                tooltip: {
                    enabled: true,
                },
            },
        },
        plugins: [{
            // Custom plugin for center text
            id: 'centerText',
            beforeDraw(chart: any) {
                const { ctx, width, height } = chart;
                ctx.save();
                ctx.font = 'bold 20px Arial';
                ctx.fillStyle = '#333';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('100', width / 2, height / 2);
                ctx.restore();
            }
        }]
    });
});

definePageMeta({
    middleware: ["auth"],
    pageTransition: {
        name: "fade",
        mode: "out-in",
    },
});
</script>

<style></style>