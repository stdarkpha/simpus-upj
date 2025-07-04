<template>
   <div>
      <!-- Hero Section -->
      <div class="w-full relative z-10 overflow-hidden">
         <!-- Background Pattern -->
         <div class="absolute w-full h-full -z-10
            bg-gradient-to-b from-red-400 to-red-600
         ">
            <img src="/background.webp" alt="background" class="w-full h-full opacity-10 object-cover">
         </div>

         <!-- Main Content -->
         <div class="relative z-10">
            <!-- Navigation -->
            <nav class="container mx-auto px-4 py-6 flex items-center justify-between">
               <div class="flex items-center space-x-3">
                  <img src="/logo white.png" alt="SIMPUS Logo" class="w-12 h-12">
                  <h1 class="text-2xl font-bold text-white">Simpus UPJ</h1>
               </div>
               <div class="flex items-center space-x-8">
                  <NuxtLink to="/login" class="text-white hover:text-red-100 font-medium transition-colors">
                     Masuk
                  </NuxtLink>
                  <NuxtLink to="/register"
                     class="bg-white text-red-600 px-6 py-2 rounded-full font-semibold hover:bg-red-50 transition-colors">
                     Daftar
                  </NuxtLink>
               </div>
            </nav>

            <!-- Hero Content -->
            <div class="container mx-auto px-4 py-20">
               <div class="flex gap-16 flex-col items-center">
                  <div class="space-y-8 flex flex-col items-center">
                     <div class="text-center flex flex-col">
                        <h1 class="text-5xl lg:text-6xl font-bold text-white leading-tight">
                           Sistem Informasi
                           <span class="">Perpustakaan </span>
                           <span class="">UPJ</span>
                        </h1>
                        <p class="text-xl max-w-4xl text-red-100 mt-6 leading-relaxed">
                           Platform modern untuk mengelola peminjaman buku dengan teknologi terdepan.
                           Akses mudah, cepat, dan aman untuk seluruh civitas akademika.
                        </p>
                     </div>

                     <div class="flex flex-col sm:flex-row gap-4">
                        <NuxtLink to="/register"
                           class="bg-white text-red-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-red-50 transition-colors inline-flex items-center justify-center">
                           <Icon icon="mdi:account-plus" class="mr-2 text-xl" />
                           Mulai Sekarang
                        </NuxtLink>
                        <button @click="scrollToFeatures"
                           class="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-red-600 transition-colors inline-flex items-center justify-center">
                           <Icon icon="mdi:information" class="mr-2 text-xl" />
                           Pelajari Lebih Lanjut
                        </button>
                     </div>
                  </div>

                  <div class="relative z-10 w-full bg-white rounded-2xl shadow-2xl p-6 pb-16">
                     <div class="space-y-6">
                        <div class="flex items-center justify-center space-x-3">
                           <Icon icon="mdi:chart-line" class="text-red-600 text-2xl" />
                           <h3 class="text-lg font-semibold">Statistik Real-time</h3>
                        </div>
                        <div class="grid grid-cols-2 sm:grid-cols-4 gap-8">
                           <div class="text-center">
                              <div class="text-3xl font-bold text-red-600">{{ stats?.total_books || 0 }}</div>
                              <p class="text-sm text-gray-600">Total Buku</p>
                           </div>
                           <div class="text-center">
                              <div class="text-3xl font-bold text-red-600">{{ stats?.total_users || 0 }}</div>
                              <p class="text-sm text-gray-600">Pengguna Aktif</p>
                           </div>
                           <div class="text-center">
                              <div class="text-3xl font-bold text-red-600">{{ stats?.total_categories || 0 }}</div>
                              <p class="text-sm text-gray-600">Kategori</p>
                           </div>
                           <div class="text-center">
                              <div class="text-3xl font-bold text-red-600">{{ stats?.active_lendings || 0 }}</div>
                              <p class="text-sm text-gray-600">Peminjaman Aktif</p>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>

      <!-- Feature 1: Peminjaman Digital -->
      <section class="py-20 bg-white">
         <div class="container mx-auto px-4">
            <div class="text-center mb-16">
               <h2 class="text-4xl font-bold text-gray-900 mb-4">Fitur Unggulan</h2>
               <p class="text-xl text-gray-600 max-w-3xl mx-auto">
                  SIMPUS hadir dengan berbagai fitur modern yang memudahkan pengelolaan dan akses perpustakaan digital
               </p>
            </div>
            <div class="grid lg:grid-cols-2 gap-12 items-center">
               <div class="space-y-6">
                  <div
                     class="inline-flex items-center space-x-2 bg-red-100 text-red-600 px-4 py-2 rounded-full text-sm font-semibold">
                     <Icon icon="mdi:book-play" class="text-lg" />
                     <span>Peminjaman Digital</span>
                  </div>
                  <h2 class="text-4xl font-bold text-gray-900">
                     Sistem Peminjaman Buku Modern
                  </h2>
                  <p class="text-xl text-gray-600 leading-relaxed">
                     Nikmati kemudahan meminjam buku tanpa harus datang ke perpustakaan. Sistem digital kami
                     memungkinkan
                     Anda mengajukan peminjaman kapan saja, di mana saja dengan proses yang cepat dan mudah.
                  </p>
                  <ul class="space-y-3">
                     <li class="flex items-center space-x-3">
                        <Icon icon="mdi:check-circle" class="text-green-500 text-xl" />
                        <span class="text-gray-700">Peminjaman online 24/7</span>
                     </li>
                     <li class="flex items-center space-x-3">
                        <Icon icon="mdi:check-circle" class="text-green-500 text-xl" />
                        <span class="text-gray-700">Tracking status real-time</span>
                     </li>
                     <li class="flex items-center space-x-3">
                        <Icon icon="mdi:check-circle" class="text-green-500 text-xl" />
                        <span class="text-gray-700">Reminder otomatis pengembalian</span>
                     </li>
                  </ul>
               </div>
               <div class="relative">
                  <div class="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-8 shadow-xl">
                     <div class="bg-white rounded-xl p-6 shadow-lg">
                        <div class="flex items-center space-x-3 mb-4">
                           <Icon icon="mdi:book-open-page-variant" class="text-red-600 text-2xl" />
                           <h3 class="font-semibold text-lg">Buku Tersedia</h3>
                        </div>
                        <div class="space-y-3">
                           <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <span class="text-sm font-medium">Deep Learning</span>
                              <span class="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Tersedia</span>
                           </div>
                           <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <span class="text-sm font-medium">Machine Learning</span>
                              <span class="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Tersedia</span>
                           </div>
                           <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <span class="text-sm font-medium">Data Science</span>
                              <span class="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">Dipinjam</span>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      <!-- Feature 2: QR Code System -->
      <section class="py-20 bg-gray-50">
         <div class="container mx-auto px-4">
            <div class="grid lg:grid-cols-2 gap-12 items-center">
               <div class="relative order-2 lg:order-1">
                  <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 shadow-xl">
                     <div class="bg-white rounded-xl p-6 shadow-lg text-center">
                        <div class="mb-4">
                           <h3 class="font-semibold text-lg mb-2">Scan QR Code</h3>
                           <p class="text-sm text-gray-600">Untuk mengambil buku</p>
                        </div>
                        <div class="w-32 h-32 bg-gray-900 rounded-lg mx-auto mb-4 flex items-center justify-center">
                           <div class="w-24 h-24 bg-white rounded grid grid-cols-3 gap-1 p-2">
                              <div class="bg-black rounded-sm"></div>
                              <div class="bg-white"></div>
                              <div class="bg-black rounded-sm"></div>
                              <div class="bg-white"></div>
                              <div class="bg-black rounded-sm"></div>
                              <div class="bg-white"></div>
                              <div class="bg-black rounded-sm"></div>
                              <div class="bg-white"></div>
                              <div class="bg-black rounded-sm"></div>
                           </div>
                        </div>
                        <div class="flex items-center justify-center space-x-2 text-sm text-green-600">
                           <Icon icon="mdi:check-circle" class="text-lg" />
                           <span>Berhasil discan</span>
                        </div>
                     </div>
                  </div>
               </div>
               <div class="space-y-6 order-1 lg:order-2">
                  <div
                     class="inline-flex items-center space-x-2 bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-sm font-semibold">
                     <Icon icon="mdi:qrcode-scan" class="text-lg" />
                     <span>QR Code System</span>
                  </div>
                  <h2 class="text-4xl font-bold text-gray-900">
                     Teknologi QR Code Terdepan
                  </h2>
                  <p class="text-xl text-gray-600 leading-relaxed">
                     Ambil dan kembalikan buku dengan mudah menggunakan QR Code. Teknologi canggih yang menghemat waktu
                     dan mengurangi antrian di perpustakaan.
                  </p>
                  <ul class="space-y-3">
                     <li class="flex items-center space-x-3">
                        <Icon icon="mdi:check-circle" class="text-green-500 text-xl" />
                        <span class="text-gray-700">Proses pengambilan instan</span>
                     </li>
                     <li class="flex items-center space-x-3">
                        <Icon icon="mdi:check-circle" class="text-green-500 text-xl" />
                        <span class="text-gray-700">Validasi otomatis</span>
                     </li>
                     <li class="flex items-center space-x-3">
                        <Icon icon="mdi:check-circle" class="text-green-500 text-xl" />
                        <span class="text-gray-700">Tracking lokasi buku</span>
                     </li>
                  </ul>
               </div>
            </div>
         </div>
      </section>

      <!-- Feature 3: Real-time Notifications -->
      <section class="py-20 bg-white">
         <div class="container mx-auto px-4">
            <div class="grid lg:grid-cols-2 gap-12 items-center">
               <div class="space-y-6">
                  <div
                     class="inline-flex items-center space-x-2 bg-purple-100 text-purple-600 px-4 py-2 rounded-full text-sm font-semibold">
                     <Icon icon="mdi:bell-ring" class="text-lg" />
                     <span>Real-time Notifications</span>
                  </div>
                  <h2 class="text-4xl font-bold text-gray-900">
                     Notifikasi Langsung & Akurat
                  </h2>
                  <p class="text-xl text-gray-600 leading-relaxed">
                     Tetap update dengan semua aktivitas perpustakaan Anda. Dapatkan notifikasi real-time untuk
                     setiap perubahan status peminjaman, pengingat tenggat, dan update penting lainnya.
                  </p>
                  <ul class="space-y-3">
                     <li class="flex items-center space-x-3">
                        <Icon icon="mdi:check-circle" class="text-green-500 text-xl" />
                        <span class="text-gray-700">Push notification mobile</span>
                     </li>
                     <li class="flex items-center space-x-3">
                        <Icon icon="mdi:check-circle" class="text-green-500 text-xl" />
                        <span class="text-gray-700">Email notification</span>
                     </li>
                     <li class="flex items-center space-x-3">
                        <Icon icon="mdi:check-circle" class="text-green-500 text-xl" />
                        <span class="text-gray-700">In-app notifications</span>
                     </li>
                  </ul>
               </div>
               <div class="relative">
                  <div class="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-8 shadow-xl">
                     <div class="space-y-4">
                        <div class="bg-white rounded-xl p-4 shadow-lg">
                           <div class="flex items-center space-x-3">
                              <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                 <Icon icon="mdi:check" class="text-green-600 text-lg" />
                              </div>
                              <div class="flex-1">
                                 <h4 class="font-semibold text-sm">Peminjaman Disetujui</h4>
                                 <p class="text-xs text-gray-600">Buku "Deep Learning" siap diambil</p>
                              </div>
                              <span class="text-xs text-gray-400">2m ago</span>
                           </div>
                        </div>
                        <div class="bg-white rounded-xl p-4 shadow-lg">
                           <div class="flex items-center space-x-3">
                              <div class="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                                 <Icon icon="mdi:clock" class="text-yellow-600 text-lg" />
                              </div>
                              <div class="flex-1">
                                 <h4 class="font-semibold text-sm">Reminder Pengembalian</h4>
                                 <p class="text-xs text-gray-600">Jatuh tempo dalam 2 hari</p>
                              </div>
                              <span class="text-xs text-gray-400">1h ago</span>
                           </div>
                        </div>
                        <div class="bg-white rounded-xl p-4 shadow-lg">
                           <div class="flex items-center space-x-3">
                              <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                 <Icon icon="mdi:book-plus" class="text-blue-600 text-lg" />
                              </div>
                              <div class="flex-1">
                                 <h4 class="font-semibold text-sm">Buku Baru Tersedia</h4>
                                 <p class="text-xs text-gray-600">5 buku AI telah ditambahkan</p>
                              </div>
                              <span class="text-xs text-gray-400">3h ago</span>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      <!-- Feature 4: Analytics Dashboard -->
      <section class="py-20 bg-gray-50">
         <div class="container mx-auto px-4">
            <div class="grid lg:grid-cols-2 gap-12 items-center">
               <div class="relative order-2 lg:order-1">
                  <div class="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8 shadow-xl">
                     <div class="bg-white rounded-xl p-6 shadow-lg">
                        <h3 class="font-semibold text-lg mb-4">Dashboard Analytics</h3>
                        <div class="grid grid-cols-2 gap-4 mb-6">
                           <div class="text-center p-3 bg-red-50 rounded-lg">
                              <div class="text-2xl font-bold text-red-600">156</div>
                              <div class="text-xs text-gray-600">Total Buku</div>
                           </div>
                           <div class="text-center p-3 bg-blue-50 rounded-lg">
                              <div class="text-2xl font-bold text-blue-600">89</div>
                              <div class="text-xs text-gray-600">Dipinjam</div>
                           </div>
                        </div>
                        <div
                           class="h-20 bg-gradient-to-r from-red-200 via-blue-200 to-green-200 rounded-lg flex items-end justify-between p-2">
                           <div class="w-3 bg-red-500 rounded-t" style="height: 60%"></div>
                           <div class="w-3 bg-blue-500 rounded-t" style="height: 80%"></div>
                           <div class="w-3 bg-green-500 rounded-t" style="height: 40%"></div>
                           <div class="w-3 bg-red-500 rounded-t" style="height: 90%"></div>
                           <div class="w-3 bg-blue-500 rounded-t" style="height: 70%"></div>
                        </div>
                     </div>
                  </div>
               </div>
               <div class="space-y-6 order-1 lg:order-2">
                  <div
                     class="inline-flex items-center space-x-2 bg-green-100 text-green-600 px-4 py-2 rounded-full text-sm font-semibold">
                     <Icon icon="mdi:chart-box" class="text-lg" />
                     <span>Analytics Dashboard</span>
                  </div>
                  <h2 class="text-4xl font-bold text-gray-900">
                     Analisis Data Komprehensif
                  </h2>
                  <p class="text-xl text-gray-600 leading-relaxed">
                     Pantau aktivitas perpustakaan dengan dashboard analytics yang lengkap. Lihat statistik peminjaman,
                     buku populer, dan tren penggunaan untuk optimasi layanan perpustakaan.
                  </p>
                  <ul class="space-y-3">
                     <li class="flex items-center space-x-3">
                        <Icon icon="mdi:check-circle" class="text-green-500 text-xl" />
                        <span class="text-gray-700">Statistik real-time</span>
                     </li>
                     <li class="flex items-center space-x-3">
                        <Icon icon="mdi:check-circle" class="text-green-500 text-xl" />
                        <span class="text-gray-700">Report otomatis</span>
                     </li>
                     <li class="flex items-center space-x-3">
                        <Icon icon="mdi:check-circle" class="text-green-500 text-xl" />
                        <span class="text-gray-700">Data visualization</span>
                     </li>
                  </ul>
               </div>
            </div>
         </div>
      </section>

      <!-- Feature 5: Pencarian Cerdas -->
      <section class="py-20 bg-white">
         <div class="container mx-auto px-4">
            <div class="grid lg:grid-cols-2 gap-12 items-center">
               <div class="space-y-6">
                  <div
                     class="inline-flex items-center space-x-2 bg-indigo-100 text-indigo-600 px-4 py-2 rounded-full text-sm font-semibold">
                     <Icon icon="mdi:magnify" class="text-lg" />
                     <span>Pencarian Cerdas</span>
                  </div>
                  <h2 class="text-4xl font-bold text-gray-900">
                     Sistem Pencarian AI-Powered
                  </h2>
                  <p class="text-xl text-gray-600 leading-relaxed">
                     Temukan buku yang Anda cari dengan mudah menggunakan teknologi pencarian cerdas berbasis AI.
                     Sistem kami memahami konteks pencarian dan memberikan hasil yang paling relevan.
                  </p>
                  <ul class="space-y-3">
                     <li class="flex items-center space-x-3">
                        <Icon icon="mdi:check-circle" class="text-green-500 text-xl" />
                        <span class="text-gray-700">Pencarian berdasarkan konteks</span>
                     </li>
                     <li class="flex items-center space-x-3">
                        <Icon icon="mdi:check-circle" class="text-green-500 text-xl" />
                        <span class="text-gray-700">Auto-complete intelligent</span>
                     </li>
                     <li class="flex items-center space-x-3">
                        <Icon icon="mdi:check-circle" class="text-green-500 text-xl" />
                        <span class="text-gray-700">Filter multi-kategori</span>
                     </li>
                     <li class="flex items-center space-x-3">
                        <Icon icon="mdi:check-circle" class="text-green-500 text-xl" />
                        <span class="text-gray-700">Rekomendasi personal</span>
                     </li>
                  </ul>
               </div>
               <div class="relative">
                  <div class="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl p-8 shadow-xl">
                     <div class="bg-white rounded-xl p-6 shadow-lg">
                        <div class="space-y-4">
                           <div class="relative">
                              <input type="text" placeholder="Cari buku, penulis, atau topik..."
                                 class="w-full p-4 pr-12 border-2 border-indigo-200 rounded-lg focus:border-indigo-500 outline-none">
                              <Icon icon="mdi:magnify"
                                 class="absolute right-4 top-1/2 transform -translate-y-1/2 text-indigo-400 text-xl" />
                           </div>
                           <div class="space-y-2">
                              <div class="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                                 <Icon icon="mdi:book" class="text-indigo-600 text-lg" />
                                 <span class="text-sm text-gray-700">Machine Learning untuk Pemula</span>
                              </div>
                              <div class="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                                 <Icon icon="mdi:book" class="text-indigo-600 text-lg" />
                                 <span class="text-sm text-gray-700">Deep Learning dengan Python</span>
                              </div>
                              <div class="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                                 <Icon icon="mdi:book" class="text-indigo-600 text-lg" />
                                 <span class="text-sm text-gray-700">Artificial Intelligence Handbook</span>
                              </div>
                           </div>
                           <div class="text-center pt-2">
                              <span class="text-xs text-gray-500">Menampilkan 156 hasil untuk "machine learning"</span>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      <!-- Feature 6: Multi Platform -->
      <section class="py-20 bg-gray-50">
         <div class="container mx-auto px-4">
            <div class="grid lg:grid-cols-2 gap-12 items-center">
               <div class="relative order-2 lg:order-1">
                  <div class="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 shadow-xl">
                     <div class="bg-white rounded-xl p-6 shadow-lg text-center">
                        <h3 class="font-semibold text-lg mb-6">Download Aplikasi Mobile</h3>
                        <div class="space-y-4">
                           <a href="#" class="block group">
                              <img
                                 src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                                 alt="Download on Google Play"
                                 class="h-14 mx-auto group-hover:scale-105 transition-transform duration-300">
                           </a>
                           <a href="#" class="block group">
                              <img
                                 src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg"
                                 alt="Download on the App Store"
                                 class="h-14 mx-auto group-hover:scale-105 transition-transform duration-300">
                           </a>
                        </div>
                        <div class="mt-6 pt-6 border-t border-gray-200">
                           <div class="flex items-center justify-center space-x-6">
                              <div class="text-center">
                                 <Icon icon="mdi:cellphone-android" class="text-green-600 text-2xl mb-1" />
                                 <p class="text-xs text-gray-600">Android</p>
                              </div>
                              <div class="text-center">
                                 <Icon icon="mdi:apple-ios" class="text-blue-600 text-2xl mb-1" />
                                 <p class="text-xs text-gray-600">iOS</p>
                              </div>
                              <div class="text-center">
                                 <Icon icon="mdi:web" class="text-purple-600 text-2xl mb-1" />
                                 <p class="text-xs text-gray-600">Web</p>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
               <div class="space-y-6 order-1 lg:order-2">
                  <div
                     class="inline-flex items-center space-x-2 bg-gray-800 text-white px-4 py-2 rounded-full text-sm font-semibold">
                     <Icon icon="mdi:devices" class="text-lg" />
                     <span>Multi Platform</span>
                  </div>
                  <h2 class="text-4xl font-bold text-gray-900">
                     Akses Dari Mana Saja
                  </h2>
                  <p class="text-xl text-gray-600 leading-relaxed">
                     SIMPUS hadir di berbagai platform untuk kemudahan akses. Gunakan aplikasi mobile untuk
                     pengalaman optimal atau akses melalui web browser kapan saja, di mana saja.
                  </p>
                  <ul class="space-y-3">
                     <li class="flex items-center space-x-3">
                        <Icon icon="mdi:check-circle" class="text-green-500 text-xl" />
                        <span class="text-gray-700">Progressive Web App (PWA)</span>
                     </li>
                     <li class="flex items-center space-x-3">
                        <Icon icon="mdi:check-circle" class="text-green-500 text-xl" />
                        <span class="text-gray-700">Native mobile experience</span>
                     </li>
                     <li class="flex items-center space-x-3">
                        <Icon icon="mdi:check-circle" class="text-green-500 text-xl" />
                        <span class="text-gray-700">Sinkronisasi real-time</span>
                     </li>
                     <li class="flex items-center space-x-3">
                        <Icon icon="mdi:check-circle" class="text-green-500 text-xl" />
                        <span class="text-gray-700">Offline mode support</span>
                     </li>
                  </ul>
                  <div class="pt-4">
                     <p class="text-sm text-gray-500 italic">
                        * Aplikasi mobile akan segera tersedia di Play Store dan App Store
                     </p>
                  </div>
               </div>
            </div>
         </div>
      </section>

      <!-- Popular Books Section -->
      <section class="py-20">
         <div class="container mx-auto px-4">
            <div class="text-center mb-16">
               <h2 class="text-4xl font-bold text-gray-900 mb-4">Koleksi Buku Terpopuler</h2>
               <p class="text-xl text-gray-600">
                  Jelajahi koleksi buku terlengkap dengan berbagai kategori menarik
               </p>
            </div>

            <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 mb-12">
               <div v-for="book in popularBooks?.slice(0, 12)" :key="book.id" class="group cursor-pointer">
                  <div
                     class="aspect-[2/3] bg-gray-200 rounded-lg overflow-hidden mb-4 shadow-lg group-hover:shadow-xl transition-shadow">
                     <img v-if="book.img" :src="book.img" :alt="book.title"
                        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                     <div v-else
                        class="w-full h-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center">
                        <Icon icon="ph:books-fill" class="text-white text-4xl" />
                     </div>
                  </div>
                  <h3 class="font-semibold text-gray-900 line-clamp-2 mb-2">{{ book.title }}</h3>
                  <p class="text-sm text-red-600 font-medium">{{ book.author }}</p>
                  <p class="text-xs text-gray-500 mt-1">{{ book.category?.name }}</p>
               </div>
            </div>

            <div class="text-center">
               <NuxtLink to="/register"
                  class="bg-red-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-red-700 transition-colors inline-flex items-center">
                  <Icon icon="mdi:library" class="mr-2 text-xl" />
                  Jelajahi Semua Buku
               </NuxtLink>
            </div>
         </div>
      </section>

      <!-- Categories Section -->
      <section class="py-20 bg-gray-50">
         <div class="container mx-auto px-4">
            <div class="text-center mb-16">
               <h2 class="text-4xl font-bold text-gray-900 mb-4">Kategori Buku</h2>
               <p class="text-xl text-gray-600">
                  Temukan buku sesuai minat dan kebutuhan akademik Anda
               </p>
            </div>

            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
               <div v-for="category in categories" :key="category.id"
                  class="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow group cursor-pointer">
                  <div class="flex items-center justify-between mb-4">
                     <h3 class="text-lg font-semibold text-gray-900 capitalize">{{ category.name }}</h3>
                     <div
                        class="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center group-hover:bg-red-600 transition-colors">
                        <Icon icon="mdi:book-open-page-variant"
                           class="text-red-600 group-hover:text-white transition-colors text-xl" />
                     </div>
                  </div>
                  <p class="text-gray-600 text-sm mb-4">
                     Koleksi lengkap buku {{ category.name.toLowerCase() }} untuk mendukung pembelajaran
                  </p>
                  <div class="flex items-center justify-between">
                     <span class="text-2xl font-bold text-red-600">{{ category.books?.length || 0 }}</span>
                     <span class="text-sm text-gray-500">buku tersedia</span>
                  </div>
               </div>
            </div>
         </div>
      </section>

      <!-- How It Works Section -->
      <section class="py-20">
         <div class="container mx-auto px-4">
            <div class="text-center mb-16">
               <h2 class="text-4xl font-bold text-gray-900 mb-4">Cara Menggunakan SIMPUS</h2>
               <p class="text-xl text-gray-600">
                  Proses sederhana dalam 4 langkah mudah
               </p>
            </div>

            <div class="grid lg:grid-cols-4 gap-8">
               <div class="text-center group">
                  <div
                     class="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                     <Icon icon="mdi:account-plus" class="text-white text-3xl" />
                  </div>
                  <div class="w-8 h-1 bg-red-200 mx-auto mb-6 lg:hidden"></div>
                  <h3 class="text-xl font-semibold mb-4">1. Daftar Akun</h3>
                  <p class="text-gray-600">
                     Buat akun menggunakan NIM dan data diri untuk verifikasi sebagai mahasiswa UPJ
                  </p>
               </div>

               <div class="text-center group">
                  <div
                     class="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                     <Icon icon="mdi:book-search" class="text-white text-3xl" />
                  </div>
                  <div class="w-8 h-1 bg-red-200 mx-auto mb-6 lg:hidden"></div>
                  <h3 class="text-xl font-semibold mb-4">2. Cari Buku</h3>
                  <p class="text-gray-600">
                     Gunakan fitur pencarian atau jelajahi kategori untuk menemukan buku yang diinginkan
                  </p>
               </div>

               <div class="text-center group">
                  <div
                     class="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                     <Icon icon="mdi:cart" class="text-white text-3xl" />
                  </div>
                  <div class="w-8 h-1 bg-red-200 mx-auto mb-6 lg:hidden"></div>
                  <h3 class="text-xl font-semibold mb-4">3. Ajukan Peminjaman</h3>
                  <p class="text-gray-600">
                     Tambahkan buku ke keranjang dan ajukan permohonan peminjaman dengan mudah
                  </p>
               </div>

               <div class="text-center group">
                  <div
                     class="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                     <Icon icon="mdi:qrcode-scan" class="text-white text-3xl" />
                  </div>
                  <h3 class="text-xl font-semibold mb-4">4. Scan & Ambil</h3>
                  <p class="text-gray-600">
                     Setelah disetujui, scan QR Code untuk mengambil buku di perpustakaan
                  </p>
               </div>
            </div>
         </div>
      </section>

      <!-- CTA Section -->
      <section class="py-20 bg-red-600">
         <div class="container mx-auto px-4 text-center">
            <h2 class="text-4xl font-bold text-white mb-6">
               Siap Memulai Perjalanan Literasi Digital?
            </h2>
            <p class="text-xl text-red-100 mb-10 max-w-2xl mx-auto">
               Bergabunglah dengan ribuan mahasiswa UPJ yang telah merasakan kemudahan akses perpustakaan digital
            </p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
               <NuxtLink to="/register"
                  class="bg-white text-red-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-red-50 transition-colors inline-flex items-center justify-center">
                  <Icon icon="mdi:rocket-launch" class="mr-2 text-xl" />
                  Daftar Gratis Sekarang
               </NuxtLink>
               <NuxtLink to="/login"
                  class="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-red-600 transition-colors inline-flex items-center justify-center">
                  <Icon icon="mdi:login" class="mr-2 text-xl" />
                  Sudah Punya Akun?
               </NuxtLink>
            </div>
         </div>
      </section>



      <!-- Footer -->
      <footer class="bg-gray-900 text-white py-16">
         <div class="container mx-auto px-4">
            <div class="flex justify-between flex-wrap gap-8">
               <!-- Company Info -->
               <div class="">
                  <div class="flex items-center space-x-3 mb-6">
                     <img src="/logo white.png" alt="SIMPUS Logo" class="w-12 h-12">
                     <h3 class="text-2xl font-bold">Simpus UPJ</h3>
                  </div>
                  <p class="text-gray-400 mb-6 leading-relaxed max-w-md">
                     Sistem Informasi Perpustakaan Universitas Pembangunan Jaya yang modern dan terintegrasi.
                     Mendigitalkan akses perpustakaan untuk masa depan yang lebih cerdas.
                  </p>
                  <div class="flex items-center space-x-4 mb-6">
                     <div class="flex items-center space-x-2 text-gray-400">
                        <Icon icon="mdi:email" class="text-lg" />
                        <span class="text-sm">perpustakaan@upj.ac.id</span>
                     </div>
                     <div class="flex items-center space-x-2 text-gray-400">
                        <Icon icon="mdi:phone" class="text-lg" />
                        <span class="text-sm">+62 21 7560 1000</span>
                     </div>
                  </div>
                  <!-- Social Media -->
                  <div class="flex space-x-4">
                     <a href="#"
                        class="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors">
                        <Icon icon="mdi:instagram" class="text-lg" />
                     </a>
                     <a href="#"
                        class="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors">
                        <Icon icon="mdi:twitter" class="text-lg" />
                     </a>
                     <a href="#"
                        class="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors">
                        <Icon icon="mdi:youtube" class="text-lg" />
                     </a>
                     <a href="#"
                        class="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors">
                        <Icon icon="mdi:linkedin" class="text-lg" />
                     </a>
                  </div>
               </div>

               <!-- Alamat and google maps iframe -->
               <div class="max-w-md">
                  <h4 class="text-lg font-semibold mb-6 text-white">Alamat</h4>
                  <p class="text-gray-400 mb-4">
                     Jl. Raya Jatiuwung No.KM. 1, Jatiuwung, Kec. Jatiuwung, Kota Tangerang, Banten 15135
                  </p>
                  <iframe
                     src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126632.123456789!2d106.123456789!3d-6.123456789!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e699b123456789%3A0x123456789abcdef0!2sUniversitas%20Pembangunan%20Jaya!5e0!3m2!1sen!2sid!4v1612345678900"
                     width="100%" height="200" style="border:0;" loading="lazy"></iframe>
               </div>

               <!-- Quick Links -->
               <div>
                  <h4 class="text-lg font-semibold mb-6 text-white">Akses Cepat</h4>
                  <ul class="space-y-3">
                     <li>
                        <NuxtLink to="/register" class="text-gray-400 hover:text-white transition-colors text-sm">
                           Daftar Akun
                        </NuxtLink>
                     </li>
                     <li>
                        <NuxtLink to="/login" class="text-gray-400 hover:text-white transition-colors text-sm">
                           Masuk
                        </NuxtLink>
                     </li>
                     <li>
                        <a href="#" class="text-gray-400 hover:text-white transition-colors text-sm">
                           Panduan Penggunaan
                        </a>
                     </li>
                     <li>
                        <a href="#" class="text-gray-400 hover:text-white transition-colors text-sm">
                           FAQ
                        </a>
                     </li>
                     <li>
                        <a href="#" class="text-gray-400 hover:text-white transition-colors text-sm">
                           Kebijakan Privasi
                        </a>
                     </li>
                     <li>
                        <a href="#" class="text-gray-400 hover:text-white transition-colors text-sm">
                           Syarat & Ketentuan
                        </a>
                     </li>
                  </ul>
               </div>

               <!-- Download Apps -->
               <div>
                  <h4 class="text-lg font-semibold mb-6 text-white">Download Aplikasi</h4>
                  <div class="space-y-4">
                     <a href="#" class="block group">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                           alt="Download on Google Play"
                           class="h-12 group-hover:scale-105 transition-transform duration-300 filter brightness-90 hover:brightness-100">
                     </a>
                     <a href="#" class="block group">
                        <img
                           src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg"
                           alt="Download on the App Store"
                           class="h-12 group-hover:scale-105 transition-transform duration-300 filter brightness-90 hover:brightness-100">
                     </a>
                  </div>
               </div>
            </div>

            <!-- Copyright -->
            <div class="border-t border-gray-800 mt-8 pt-6 text-center">
               <p class="text-gray-400 text-sm">
                  &copy; 2025 SIMPUS - Universitas Pembangunan Jaya. All rights reserved.
               </p>
               <p class="text-gray-500 text-xs mt-2">
                  Developed with Hardwork & Passion | Farouq Mulya Al Simabua
               </p>
            </div>
         </div>
      </footer>
   </div>
</template>

<script lang="ts" setup>
import { Icon } from "@iconify/vue";

definePageMeta({
   layout: false // Use no layout for landing page
});

useSeoMeta({
   title: 'SIMPUS - Sistem Informasi Perpustakaan UPJ',
   description: 'Platform modern untuk mengelola peminjaman buku dengan teknologi terdepan. Akses mudah, cepat, dan aman untuk seluruh civitas akademika UPJ.',
   ogTitle: 'SIMPUS - Sistem Informasi Perpustakaan UPJ',
   ogDescription: 'Platform modern untuk mengelola peminjaman buku dengan teknologi terdepan.',
   ogType: 'website',
});

const config = useRuntimeConfig().public.API_URL;

// Fetch landing page data
const { data: stats } = await useAsyncData('landing-stats', async () => {
   try {
      const [booksResponse, categoriesResponse, usersResponse] = await Promise.all([
         $fetch<any>(`${config}books`),
         $fetch<any>(`${config}categories`),
         $fetch<any>(`${config}books`) // For counting active items
      ]);

      return {
         total_books: booksResponse.data?.length || 0,
         total_users: 1250, // Static count as user endpoint needs auth
         total_categories: categoriesResponse.data?.length || 0,
         active_lendings: 85 // Static count as lending endpoint needs auth
      };
   } catch (error) {
      return {
         total_books: 0,
         total_users: 0,
         total_categories: 0,
         active_lendings: 0
      };
   }
});

// Fetch popular books
const { data: popularBooks } = await useAsyncData('popular-books', async () => {
   try {
      const response = await $fetch<any>(`${config}books`) as { data: any[] };
      return response.data?.slice(0, 12) || [];
   } catch (error) {
      return [];
   }
});

// Fetch categories
const { data: categories } = await useAsyncData('categories', async () => {
   try {
      const response = await $fetch<any>(`${config}books/category`) as { data: any[] };
      return response.data || [];
   } catch (error) {
      return [];
   }
});

// Smooth scroll function
const scrollToFeatures = () => {
   const element = document.getElementById('features');
   if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
   }
};
</script>

<style scoped>
.line-clamp-2 {
   display: -webkit-box;
   -webkit-line-clamp: 2;
   line-clamp: 2;
   -webkit-box-orient: vertical;
   overflow: hidden;
}

/* Custom scrollbar */
html {
   scroll-behavior: smooth;
}

/* Background animation */
@keyframes float {

   0%,
   100% {
      transform: translateY(0px);
   }

   50% {
      transform: translateY(-20px);
   }
}

.hero-card {
   animation: float 6s ease-in-out infinite;
}
</style>
