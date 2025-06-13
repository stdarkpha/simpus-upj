<template>
    <div class="w-full h-48 flex flex-row group items-end p-4 rounded-md gap-3 relative z-10">

        <!-- <motion.div :layout-id="props.motion_id ?? `card-${props.id}`"
            class="aspect-[2/3] shadow-img h-full group-hover:h-[180px] group-hover:mb-2 transition-all shrink-0 rounded-md overflow-hidden relative"
            :style="`--color :${props.color}`">
            <img class="w-full h-full object-cover" :src="props.img" alt="Clean Code">
        </motion.div> -->
<!-- 
        <motion.div :layout-id="`category-${props.id}`" class="aspect-[2/3] h-full shadow-img shrink-0 relative">
            <img :style="`box-shadow: 0 24px 32px -4px rgba(${props.color}, 1);`"
                class="w-full h-full object-cover rounded-md" :src="props.img" alt="Clean Code">
        </motion.div> -->

        <div class="h-full flex flex-col items-start justify-between overflow-hidden grow py-2 gap-2">
            <div class="w-full flex flex-col gap-2">
                <h1 :class="props.type ? 'text-lg' : ''" class="font-bold leading-tight line-clamp-2">
                    {{ props.title }}
                </h1>
                <p :class="props.type ? 'text-sm' : 'text-xs'" class="font-bold text-red-600">
                    Author: {{ props.author }}
                </p>
                <div v-if="!props.type" v-html="props.description ?? 'Tidak Ada Deskripsi'"
                    class="text-xs text-gray-500 line-clamp-2">
                </div>
                <template v-else>
                    <div class="w-full h-1.5 bg-red-500 rounded my-1"></div>
                    <div class="text-xs">
                        Sisa waktu:
                        <span class="font-bold text-red-600">
                            {{ waktuPinjam }}
                        </span>
                    </div>
                </template>
            </div>
            <!-- <div class="w-full h-1 bg-red-600 relative rounded-xl"></div> -->

            <div v-if="!props.type" :class="props.type ? 'text-xs' : 'text-sm'"
                class="flex items-center justify-between font-medium w-full">
                <p v-if="props.stock">Tersedia
                    <span class="font-bold text-red-600">
                        {{ props.stock }} Buku
                    </span>
                </p>
                <p v-else class="text-red-600">Tidak Tersedia</p>
                <p
                    class="flex items-center gap-1 font-medium group-hover:text-red-600 group-hover:gap-2 transition-all">
                    Detail
                    <Icon icon="mdi:arrow-right" />
                </p>
            </div>
        </div>

        <div :style="`background-color: ${props.type ? 'rgba(' + props.color + ', .1)' : '#fff'}`"
            :class="!props.type ? 'shadow' : ''" class="w-full h-full rounded-lg absolute left-0 bottom-0 -z-10">
        </div>
    </div>
</template>

<script lang="ts" setup>
import { Icon } from '@iconify/vue';
import { motion } from 'motion-v';
const props = defineProps<{
    type?: boolean;
    id: Number;
    title: string;
    color: string;
    stock: number;
    img: string;
    author: string;
    description?: string | null;
    item_data: any
    motion_id?: string;
}>()

const item_active = ref<any>(null);

const countdown = ref('');

function updateCountdown() {
    const now = new Date();
    const end = new Date();
    end.setDate(now.getDate() + 3);
    end.setHours(0, 0, 0, 0);

    const diff = end.getTime() - now.getTime();
    if (diff <= 0) {
        countdown.value = 'Waktu Habis';
        return;
    }
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);

    countdown.value = `${days} Hari ${hours} Jam ${minutes} Menit`;
}

updateCountdown();
setInterval(updateCountdown, 60000);

const waktuPinjam = computed(() => countdown.value);
</script>

<style scoped>
.shadow-img {
    box-shadow: 0 0px 8px -8px rgba(var(--color), 0.1);
    transition: all .8 ease;
}

.group:hover .shadow-img,
.swiper-slide-active .shadow-img {
    box-shadow: 0 24px 24px -8px rgba(var(--color), 1);
}

.swiper-slide-active .shadow-img {
    height: 180px;
    margin-bottom: 8px;
}
</style>