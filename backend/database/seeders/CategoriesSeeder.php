<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Categories;

class CategoriesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            ['name' => 'Computer Science', 'slug' => 'computer-science'],
            ['name' => 'Information Technology', 'slug' => 'information-technology'],
            ['name' => 'Software Engineering', 'slug' => 'software-engineering'],
            ['name' => 'Data Science', 'slug' => 'data-science'],
            ['name' => 'Artificial Intelligence', 'slug' => 'artificial-intelligence'],
            ['name' => 'Networking', 'slug' => 'networking'],
            ['name' => 'Cyber Security', 'slug' => 'cyber-security'],
            ['name' => 'Database Systems', 'slug' => 'database-systems'],
            ['name' => 'Web Development', 'slug' => 'web-development'],
            ['name' => 'Mathematics', 'slug' => 'mathematics'],
            ['name' => 'Physics', 'slug' => 'physics'],
            ['name' => 'Engineering', 'slug' => 'engineering'],
            ['name' => 'Business Administration', 'slug' => 'business-administration'],
            ['name' => 'Economics', 'slug' => 'economics'],
            ['name' => 'Library Science', 'slug' => 'library-science'],
        ];

        foreach ($categories as $category) {
            Categories::create($category);
        }
    }
}
