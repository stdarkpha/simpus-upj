<template>
   <div>
      <!-- Search Input -->
      <div class="relative my-4">
         <Label class="mb-4 block" for="latitude">Search</Label>
         <div class="flex gap-4 mb-4 relative">
            <Input v-model="searchQuery" @keyup.enter="searchLocation" @input="debouncedSearch" placeholder="Search for a location..." class="w-full p-2 border rounded" />
            <!-- Search Results Dropdown -->
            <ul v-if="searchQuery != ''" class="mt-1 absolute left-0 top-full bg-background w-full border rounded shadow-md z-[999]">
               <template v-if="searchResults.length">
                  <li v-for="place in searchResults" :key="place.place_id" @click="selectLocation(place)" class="p-2 cursor-pointer flex gap-4 items-center hover:bg-primary-foreground">
                     <Icon icon="grommet-icons:map" />
                     {{ place.display_name }}
                  </li>
               </template>
               <li v-if="isSearching" class="p-4 text-center flex items-center justify-center gap-4">
                  <Icon icon="eos-icons:three-dots-loading" class="text-xl" />
                  Searching...
               </li>
               <li v-else-if="!searchResults.length && searchQuery != ''" class="p-8 flex flex-col items-center justify-center text-center text-muted-foreground gap-2">
                  <Icon icon="tabler:map-x" class="animate__animated animate__headShake text-4xl" />
                  No results found
               </li>
            </ul>
         </div>
         <div class="flex w-full gap-4 mb-4">
            <div class="w-full">
               <Label class="mb-4 block" for="latitude">Latitude (Input Manual)</Label>
               <Input v-model="lat" @change="updateMarker(lat, lng)" type="text" id="latitude" />
            </div>
            <div class="w-full">
               <Label class="mb-4 block" for="longitude">Longitude (Input Manual)</Label>
               <Input v-model="lng" @change="updateMarker(lat, lng)" type="text" id="longitude" />
            </div>
         </div>
      </div>
      <div class="flex max-md:flex-col gap-8 w-full">
         <div class="w-full">
            <div class="mb-4 font-semibold">Choose Point</div>
            <div id="map" class="w-full z-10 h-[400px] rounded-lg shadow-md"></div>
         </div>
         <div v-if="lat && lng" class="w-full">
            <div class="mb-4 font-semibold">Preview</div>
            <iframe :src="`https://www.google.com/maps?q=${lat},${lng}&hl=es;z=14&output=embed`" class="w-full h-[400px] rounded-lg" style="border: 0" loading="lazy" ref="mapIframe"></iframe>
         </div>
      </div>
      <Button @click="saveLocation" class="mt-4">Update Location</Button>
   </div>
</template>

<script lang="ts" setup>
//@ts-ignore
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Icon } from "@iconify/vue";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

// Define refs for map and marker
const map = ref<L.Map | null>(null);
const marker = ref<L.Marker | null>(null);
const lat = ref<undefined | number>(-6.18423);
const lng = ref<undefined | number>(106.833622);

// Create custom icon
const customIcon = L.icon({
   iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
   iconSize: [25, 41],
   iconAnchor: [12, 41],
});

onMounted(() => {
   // Initialize map
   map.value = L.map("map");

   // Add tile layer
   L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a>",
   }).addTo(map.value);

   // Add marker with custom icon
   marker.value = L.marker([lat.value, lng.value], { icon: customIcon }).addTo(map.value);
   //@ts-ignore
   map.value?.setView([lat.value, lng.value], 16);

   // click event
   //@ts-ignore
   map.value?.on("click", (e: L.LeafletMouseEvent) => {
      const { lat: clickedLat, lng: clickedLng } = e.latlng;

      // Update state
      lat.value = clickedLat.toFixed(6);
      lng.value = clickedLng.toFixed(6);

      // Remove previous marker if exists
      console.log("Map:", map.value);
      console.log("Marker:", marker.value);
      if (marker.value && map.value) {
         map.value.removeLayer(marker.value);
      }

      // Add new marker with custom icon
      marker.value = L.marker([clickedLat, clickedLng], { icon: customIcon }).addTo(map.value);
   });
});

const searchQuery = ref(""); // Search input
interface Place {
   place_id: string;
   display_name: string;
   lat: string;
   lon: string;
}

const searchResults = ref<Place[]>([]); // Search results
const isSearching = ref(false);

// Function to update the marker
const updateMarker = (latitude: any, longitude: any) => {
   lat.value = latitude.toFixed(6);
   lng.value = longitude.toFixed(6);

   if (marker.value) {
      //@ts-ignore
      map.value?.removeLayer(marker.value);
   }

   marker.value = L.marker([latitude, longitude], { icon: customIcon }).addTo(map.value);
   //@ts-ignore
   map.value?.setView([latitude, longitude], 13);
};

const searchLocation = async () => {
   if (!searchQuery.value) return;
   isSearching.value = true;
   searchResults.value = [];

   const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery.value)}`;

   try {
      const response = await fetch(url);
      const data = await response.json();
      searchResults.value = data.slice(0, 5); // Limit results
   } catch (error) {
      console.error("Search error:", error);
   } finally {
      isSearching.value = false;
   }
};

import { useDebounceFn } from "@vueuse/core";
import { toast } from "vue-sonner";
const debouncedSearch = useDebounceFn(searchLocation, 250);
const client = useSanctumClient();

// Function to select a search result
const selectLocation = (place: any) => {
   searchQuery.value = "";
   searchResults.value = [];
   updateMarker(parseFloat(place.lat), parseFloat(place.lon));
   toast({
      title: "Location updated",
   });
};

await useAsyncData<any>("getLocation", () =>
   client(`setting/location`, {
      onResponse: ({ response }) => {
         // const { lat, lng } = response.data;
         console.log("Response:", response);

         const location = JSON.parse(response._data.value);

         if (location.lat && location.lng) {
            lat.value = parseFloat(location.lat);
            lng.value = parseFloat(location.lng);

            updateMarker(parseFloat(location.lat), parseFloat(location.lng));
         }
      },
   })
);

const saveLocation = async () => {
   const data = {
      name: "location",
      value: {
         lat: lat.value,
         lng: lng.value,
      },
   };

   await client("setting", {
      method: "POST",
      body: JSON.stringify(data),
      onResponse({ response }) {
         if (response._data.message) {
            toast({
               title: "Location saved",
            });
         }
      },
      onResponseError({ response }) {
         Object.keys(response._data.errors).forEach((key) => {
            response._data.errors[key].forEach(async (error: any) => {
               toast({
                  title: "Error",
                  description: error,
                  variant: "destructive",
               });
            });
         });
      },
   });
};
</script>

<style></style>
