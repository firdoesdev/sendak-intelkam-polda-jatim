# Role & Permission Feature
Buatkan CRUD untuk fitur Role & Permission. Tujuannya adalah untuk mengelola peran pengguna dan izin akses dalam sebuah aplikasi. Fitur ini harus mencakup:
1. **Role Management**:
   - Create Role: Menambahkan peran baru dengan nama dan deskripsi.
   - Read Role: Melihat daftar semua peran yang ada.
   - Update Role: Memperbarui informasi peran yang sudah ada.
   - Delete Role: Menghapus peran yang tidak lagi diperlukan.
2. **Permission Management**:
   - Create Permission: Menambahkan izin baru dengan nama dan deskripsi.
   - Read Permission: Melihat daftar semua izin yang ada.
   - Update Permission: Memperbarui informasi izin yang sudah ada.
   - Delete Permission: Menghapus izin yang tidak lagi diperlukan.
3. **Assigning Permissions to Roles**:
   - Menetapkan satu atau lebih izin ke peran tertentu.
   - Menghapus izin dari peran tertentu.
4. **User Role Assignment**:
   - Menetapkan satu atau lebih peran ke pengguna tertentu.
   - Menghapus peran dari pengguna tertentu.
5. **Access Control**:
   - Implementasikan mekanisme kontrol akses berdasarkan peran dan izin yang ditetapkan.
   - Pastikan bahwa hanya pengguna dengan izin yang sesuai yang dapat mengakses fitur tertentu dalam aplikasi.
6. **Audit Logging**:
   - Catat semua perubahan yang dilakukan pada peran, izin, dan penugasan pengguna.
   - Simpan informasi tentang siapa yang melakukan perubahan dan kapan perubahan tersebut dilakukan.
Pastikan untuk menggunakan praktik terbaik dalam pengelolaan keamanan dan validasi data selama implementasi fitur ini.

# Existing Feature
Jika fitur Role & Permission sudah ada dalam aplikasi, lakukan hal berikut:
1. Tinjau dan evaluasi implementasi saat ini untuk memastikan bahwa semua fungsi CRUD berjalan dengan baik.
2. Periksa apakah mekanisme kontrol akses sudah diterapkan dengan benar berdasarkan peran dan izin.
3. Pastikan bahwa audit logging mencatat semua perubahan yang relevan dengan benar.
4. Identifikasi area yang memerlukan perbaikan atau peningkatan, seperti menambahkan validasi data yang lebih ketat atau memperbaiki antarmuka pengguna.
5. Dokumentasikan setiap perubahan atau peningkatan yang dilakukan pada fitur Role & Permission.
6. Uji fitur secara menyeluruh untuk memastikan bahwa semua fungsi berjalan sesuai harapan dan tidak ada celah keamanan.
Jika ada kekurangan atau bug yang ditemukan selama tinjauan, segera lakukan perbaikan dan pengujian ulang untuk memastikan stabilitas dan keamanan fitur tersebut.
Pastikan untuk mengikuti praktik terbaik dalam pengelolaan keamanan dan validasi data selama proses tinjauan dan perbaikan.

# Informasi Tambahan
- Untuk saat ini, fitur Role ada dalam aplikasi, namun fitur Permission belum ada. Bisa diperiksa lebih lanjut pada folder `App/Http/Controllers/IAM/RoleController.php`.
- Pastikan untuk menambahkan fitur Permission sesuai dengan standar yang ada pada fitur Role.
- Pastikan tidak ada Regression pada fitur Role saat menambahkan fitur Permission.
- Library Role Permission menggunakan Spatie Laravel Permission (https://spatie.be/docs/laravel-permission/v6/introduction).
- Jika fitur Role & Permission sudah terimplementasi, tambahkan route menu pada `resources/js/components/app-sidebar.tsx` pada part `IamNavItems` untuk mengakses halaman Role & Permission di sidebar aplikasi.