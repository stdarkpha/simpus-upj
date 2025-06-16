<template>
   <div class="flex w-full">
      <div class="grow shrink rounded-2xl overflow-hidden relative">
         <motion.div :animate="{ opacity: [1, 0.3, 1] }" :transition="{ repeat: Infinity, duration: 1 }" class="absolute w-1/3 aspect-square top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
            <div class="w-8 z-50 m-4 aspect-square absolute rounded-tl-lg top-0 left-0 border-t-4 border-l-4 border-white" />
            <div class="w-8 z-50 m-4 aspect-square absolute rounded-tr-lg top-0 right-0 border-t-4 border-r-4 border-white" />
            <div class="w-8 z-50 m-4 aspect-square absolute rounded-bl-lg bottom-0 left-0 border-b-4 border-l-4 border-white" />
            <div class="w-8 z-50 m-4 aspect-square absolute rounded-br-lg bottom-0 right-0 border-b-4 border-r-4 border-white" />
         </motion.div>

         <motion.div class="absolute text-xl font-medium top-1/3 -translate-y-16 left-1/2 -translate-x-1/2 z-10 text-white overflow-hidden">Scan QR Code Mu Disini</motion.div>
         <qrcode-stream :track="paintOutline" :formats="['qr_code']" @detect="onDetect" />
      </div>
      <div class="shrink-0 max-w-md w-full h-[calc(85vh-200px)]">
         <div class="flex pl-8 items-center justify-between mb-2">
            <h1 class="text-xl font-bold">Daftar Request</h1>
            <button class="bg-primary text-sm text-white px-4 py-2 rounded-lg shadow hover:bg-primary/90 transition-colors" @click="scanned = []">Clear</button>
         </div>
         <div class="flex flex-col-reverse gap-4 h-auto max-h-full p-6 overflow-y-auto scrollbar-thin">
            <div v-if="scanned.length > 0" v-for="item in scanned" class="p-4 pt-0 bg-background rounded-lg shadow-lg shadow-gray-400/10">
               <div class="flex items-center justify-between mb-2">
                  <div class="font-semibold uppercase">{{ item.transaction_id }}</div>
                  <div
                     :class="{
                        'bg-orange-600 text-orange-100': item.status_request == 'pending',
                        'bg-green-600 text-green-100': item.status_request == 'approve',
                        'bg-red-600 text-red-100': item.status_request == 'reject',
                     }"
                     class="text-xs capitalize px-2 py-1.5 rounded"
                  >
                     {{ item.status_request }}
                  </div>
               </div>

               <div class="flex items-center justify-between mb-2">
                  <div class="text-sm capitalize w-full">
                     {{ item.status == "pending" ? "Peminjaman" : "Pengembalian" }}
                     <div class="p-2 bg-gray-200 font-medium w-full block rounded-md mt-1">
                        {{
                           new Date(item.lend_date).toLocaleDateString("id-ID", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                           })
                        }}
                        -
                        {{
                           new Date(item.return_date).toLocaleDateString("id-ID", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                           })
                        }}
                     </div>
                  </div>
               </div>
               <div class="flex items-center justify-between">
                  <div class="text-sm capitalize">
                     <span class="block">Nama </span>
                     {{ item.user_details.name }}
                  </div>
                  <div class="text-sm capitalize text-right">
                     <span class="block">{{ item.user_details.role == "mahasiswa" ? "NIM" : "NIDN" }}</span>
                     {{ item.user_details.uid }}
                  </div>
               </div>
            </div>

            <div v-else class="text-center text-gray-500 bg-gray-50 py-8 rounded-md flex items-center flex-col">
               <Icon icon="mdi:barcode-scan" class="text-6xl text-gray-300 mb-4" />
               <h2 class="text-sm font-semibold mb-2">Belum ada kode yang dipindai</h2>
            </div>
         </div>
      </div>
   </div>
</template>

<script setup lang="ts">
import { motion } from "motion-v";
import { Icon } from "@iconify/vue";
import { QrcodeStream } from "vue-qrcode-reader";
import "vue3-toastify/dist/index.css";
import { useLocalStorage } from "@vueuse/core";

const scanned = useLocalStorage<any[]>("scanned-codes", []);

// const productStore = useProductStore();
//@ts-ignore
import BeepSound from "/beep2.mp3";
import FailedSound from "/beep-error.wav";

import { toast } from "vue3-toastify";
let beep: any;
let beep_fail: any;

onMounted(() => {
   beep = new Audio(BeepSound);
   beep_fail = new Audio(FailedSound);
});

const onDetect = async (detectedCodes: any) => {
   detectedCodes.forEach(async (code: any) => {
      const json = JSON.parse(code.rawValue);
      console.log("Detected code:", json);

      if (json.status == "reject" || json.status == "returned" || !json.id_lending) {
         toast.error("Kode Tidak Valid.", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
         });
         beep_fail.play();
         return;
      }

      // store scanned code
      scanned.value.push({
         ...json,
         status_request: "pending",
         time: new Date().toLocaleString(),
         id_request: crypto.randomUUID(),
      });

      // Get the video element from the qrcode-stream
      const video = document.querySelector("video");
      if (video) {
         const canvas = document.createElement("canvas");
         canvas.width = video.videoWidth;
         canvas.height = video.videoHeight;
         const ctx = canvas.getContext("2d");
         if (ctx) {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const base64Image = canvas.toDataURL("image/png");
            console.log("Base64 Image:", base64Image);
            // You can use base64Image as needed (e.g., save, upload, etc.)
         }
      }

      toast.success("Scan Berhasil, Harap Tunggu..", {
         position: "top-right",
         autoClose: 3000,
         hideProgressBar: true,
         closeOnClick: true,
         pauseOnHover: true,
      });

      beep.play();
   });
};

function paintOutline(detectedCodes: any, ctx: any) {
   for (const detectedCode of detectedCodes) {
      const [firstPoint, ...otherPoints] = detectedCode.cornerPoints;

      ctx.strokeStyle = "red";

      ctx.beginPath();
      ctx.moveTo(firstPoint.x, firstPoint.y);
      for (const { x, y } of otherPoints) {
         ctx.lineTo(x, y);
      }
      ctx.lineTo(firstPoint.x, firstPoint.y);
      ctx.closePath();
      ctx.stroke();
   }
}
</script>

<style scoped>
.scrollbar-thin {
   scrollbar-width: thin;
}
</style>
