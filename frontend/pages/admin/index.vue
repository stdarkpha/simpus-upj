<template>
   <div class="flex-col flex">
      <div class="flex-1 space-y-4">
         <div class="flex max-md:flex-wrap items-center justify-between space-y-2">
            <h2 class="text-3xl font-bold tracking-tight">Dashboard</h2>
         </div>
         <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
               <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle class="text-sm font-medium"> Total Buku </CardTitle>
                  <Icon icon="ph:books-fill" class="text-xl" />
               </CardHeader>
               <CardContent>
                  <div class="text-2xl font-bold">
                     {{ dashboardStats?.overview?.total_books || 0 }}
                  </div>
                  <p class="text-xs text-muted-foreground">Buku pada perpustakaan</p>
               </CardContent>
            </Card>
            <Card>
               <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle class="text-sm font-medium"> Total Pengguna </CardTitle>
                  <Icon icon="mdi:user-group" class="text-xl" />
               </CardHeader>
               <CardContent>
                  <div class="text-2xl font-bold">
                     {{ dashboardStats?.overview?.total_users || 0 }}
                  </div>
                  <p class="text-xs text-muted-foreground">Mahasiswa Terdaftar</p>
               </CardContent>
            </Card>
            <Card>
               <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle class="text-sm font-medium"> Total Peminjaman </CardTitle>
                  <Icon icon="mdi:book-play" class="text-xl" />
               </CardHeader>
               <CardContent>
                  <div class="text-2xl font-bold">
                     {{ dashboardStats?.overview?.total_lendings || 0 }}
                  </div>
                  <p class="text-xs text-muted-foreground">Peminjaman Buku</p>
               </CardContent>
            </Card>
            <Card>
               <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle class="text-sm font-medium"> Total Pengembalian </CardTitle>
                  <Icon icon="mdi:book-sync" class="text-xl" />
               </CardHeader>
               <CardContent>
                  <div class="text-2xl font-bold">
                     {{ dashboardStats?.overview?.total_returns || 0 }}
                  </div>
                  <p class="text-xs text-muted-foreground">Pengembalian Buku</p>
               </CardContent>
            </Card>
         </div>
         <div class="grid gap-4 md:grid-cols-2">
            <Card>
               <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle class="text-sm font-medium">Most Borrowed Books</CardTitle>
                  <Icon icon="mdi:book-multiple" class="text-xl" />
               </CardHeader>
               <CardContent>
                  <div class="space-y-3">
                     <div v-for="(book, index) in dashboardStats?.most_borrowed_books?.slice(0, 3)" :key="book.id"
                        class="flex items-center space-x-3">
                        <div class="text-sm font-medium text-muted-foreground w-4">{{ index + 1 }}.</div>
                        <img v-if="book.img" :src="book.img" :alt="book.title" class="w-8 h-10 object-cover rounded" />
                        <div class="flex-1 min-w-0">
                           <p class="text-sm font-medium truncate">{{ book.title }}</p>
                           <p class="text-xs text-muted-foreground">{{ book.borrow_count }} peminjaman</p>
                        </div>
                     </div>
                  </div>
               </CardContent>
            </Card>
            <Card>
               <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle class="text-sm font-medium">Top Active Users</CardTitle>
                  <Icon icon="mdi:account-star" class="text-xl" />
               </CardHeader>
               <CardContent>
                  <div class="space-y-3">
                     <div v-for="(user, index) in dashboardStats?.top_users?.slice(0, 3)" :key="user.id"
                        class="flex items-center space-x-3">
                        <div class="text-sm font-medium text-muted-foreground w-4">{{ index + 1 }}.</div>
                        <div class="flex-1 min-w-0">
                           <p class="text-sm font-medium truncate">{{ user.name }}</p>
                           <p class="text-xs text-muted-foreground">{{ user.lending_count }} peminjaman • {{ user.role
                           }}</p>
                        </div>
                     </div>
                  </div>
               </CardContent>
            </Card>
         </div>
         <div class="max-w-full">
            <Card>
               <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle class="text-sm font-medium">Grafik Analitik </CardTitle>
                  <Icon icon="solar:chart-bold" class="text-xl" />
               </CardHeader>
               <CardContent>
                  <div class="h-80 w-full">
                     <canvas ref="chartCanvas" class="w-full h-full"></canvas>
                  </div>
               </CardContent>
            </Card>
         </div>
      </div>
   </div>
</template>

<script lang="ts" setup>
definePageMeta({
   layout: "admin",
   middleware: ["admin"], // Use the new admin-auth middleware
});

import { Icon } from "@iconify/vue";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import Chart from 'chart.js/auto';

const { data } = useAuth();
const config = useRuntimeConfig().public.API_URL;
const { token } = useAuth();

// Fetch dashboard statistics
const { data: dashboardStats } = await useAsyncData('dashboard-stats', async () => {
   const response = await $fetch(`${config}lending/dashboard/stats`, {
      method: 'GET',
      headers: {
         Authorization: `Bearer ${token.value}`,
      },
   }) as any;
   return response.data;
});

const chartCanvas = ref<HTMLCanvasElement | null>(null);

onMounted(() => {
   if (loggedIn.value) {
      //@ts-ignore
      toast(`Welcome, ${data.value?.data?.name}`, {
         theme: "auto",
         type: "success",
         pauseOnHover: false,
      });

      loggedIn.value = false;
   }

   // Initialize chart
   nextTick(() => {
      if (chartCanvas.value && dashboardStats.value?.chart_data) {
         initChart();
      }
   });
});

const initChart = () => {
   if (!chartCanvas.value || !dashboardStats.value?.chart_data) return;

   const ctx = chartCanvas.value.getContext('2d');
   if (!ctx) return;

   // Create gradient functions
   const createGradient = (r: number, g: number, b: number) => {
      const gradient = ctx.createLinearGradient(0, 0, 0, 400);
      gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.4)`); // 40% opacity at top
      gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`); // 0% opacity at bottom
      return gradient;
   };

   // Prepare chart data
   const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

   const chartData = Array.from({ length: 12 }, (_, i) => {
      const monthData = dashboardStats.value.chart_data.find((d: any) => d.month === i + 1);
      return {
         month: months[i],
         total: monthData?.total || 0,
         returned: monthData?.returned || 0,
         late: monthData?.late || 0,
         overdue: monthData?.overdue || 0
      };
   });

   new Chart(ctx, {
      type: 'line',
      data: {
         labels: chartData.map(d => d.month),
         datasets: [
            {
               label: 'Total Peminjaman',
               data: chartData.map(d => d.total),
               borderColor: 'rgb(75, 192, 192)',
               backgroundColor: createGradient(75, 192, 192),
               fill: true,
               tension: 0.4
            },
            {
               label: 'Dikembalikan Tepat Waktu',
               data: chartData.map(d => d.returned),
               borderColor: 'rgb(34, 197, 94)',
               backgroundColor: createGradient(34, 197, 94),
               fill: true,
               tension: 0.4
            },
            {
               label: 'Terlambat',
               data: chartData.map(d => d.late),
               borderColor: 'rgb(239, 68, 68)',
               backgroundColor: createGradient(239, 68, 68),
               fill: true,
               tension: 0.4
            },
            {
               label: 'Overdue',
               data: chartData.map(d => d.overdue),
               borderColor: 'rgb(245, 101, 101)',
               backgroundColor: createGradient(245, 101, 101),
               fill: true,
               tension: 0.4
            }
         ]
      },
      options: {
         responsive: true,
         maintainAspectRatio: false,
         plugins: {
            title: {
               display: true,
               text: 'Statistik Peminjaman Buku (2025)'
            },
            legend: {
               position: 'bottom'
            }
         },
         scales: {
            y: {
               beginAtZero: true,
               ticks: {
                  stepSize: 1
               }
            }
         },
         interaction: {
            intersect: false,
            mode: 'index'
         },
         elements: {
            point: {
               radius: 4,
               hoverRadius: 6
            }
         }
      }
   });
};

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
</script>

<style></style>
