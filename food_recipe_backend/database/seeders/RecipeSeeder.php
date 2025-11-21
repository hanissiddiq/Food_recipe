<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RecipeSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('recipes')->insert([
            [
                'title' => 'Rendang Padang',
                'ingredients' => 'Daging sapi, santan, cabai merah, bawang merah, bawang putih, lengkuas, jahe, kunyit, serai, daun jeruk, garam',
                'steps' => '1. Haluskan bumbu. 2. Masak santan dengan bumbu hingga mendidih. 3. Masukkan daging sapi. 4. Masak dengan api kecil hingga kuah menyusut dan berminyak.',
                'image' => 'rendang.jpg'
            ],
            [
                'title' => 'Sate Ayam Madura',
                'ingredients' => 'Daging ayam, kecap manis, bawang putih, bawang merah, kacang tanah, gula merah, cabai, jeruk limau',
                'steps' => '1. Potong ayam dan tusukkan ke batang sate. 2. Buat bumbu kacang. 3. Bakar sate hingga matang sambil dioles kecap. 4. Sajikan dengan bumbu kacang.',
                'image' => 'sate_ayam.jpg'
            ],
            [
                'title' => 'Gudeg Jogja',
                'ingredients' => 'Nangka muda, telur, santan, gula merah, daun salam, lengkuas, bawang merah, bawang putih',
                'steps' => '1. Masukkan semua bahan ke dalam panci. 2. Masak dengan api kecil selama beberapa jam hingga meresap. 3. Sajikan dengan telur dan krecek.',
                'image' => 'gudeg.jpg'
            ],
            [
                'title' => 'Pempek Palembang',
                'ingredients' => 'Ikan tenggiri, tepung tapioka, telur, garam, bawang putih, cuka, gula merah, cabai',
                'steps' => '1. Campur ikan dan tapioka. 2. Bentuk sesuai jenis pempek. 3. Rebus sampai mengapung. 4. Goreng dan sajikan dengan cuka.',
                'image' => 'pempek.jpg'
            ],
            [
                'title' => 'Rawon Surabaya',
                'ingredients' => 'Daging sapi, kluwek, bawang merah, bawang putih, lengkuas, kunyit, ketumbar, daun jeruk, tauge, sambal',
                'steps' => '1. Haluskan bumbu termasuk kluwek. 2. Tumis bumbu hingga harum. 3. Masukkan daging dan air. 4. Masak hingga daging empuk. 5. Sajikan dengan tauge dan sambal.',
                'image' => 'rawon.jpg'
            ],
        ]);
    }
}
