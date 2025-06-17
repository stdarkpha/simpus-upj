<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Books;
use Illuminate\Support\Str;
use Faker\Factory as Faker;
use Carbon\Carbon;
use Illuminate\Support\Facades\File; // Required for file operations

class BookSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create();

        $booksData = [
            [
                "title" => "APracticalApproachToCompilerCo.png",
                "release_date" => "2017-01-01",
                "total_page" => 263
            ],
            [
                "title" => "IntroductionToArtificialIntell.png",
                "release_date" => "2017-01-01",
                "total_page" => 365
            ],
            [
                "title" => "IntroductionToCompilerDesign.png",
                "release_date" => "2017-01-01",
                "total_page" => 273
            ],
            [
                "title" => "IntroductionToDataScience.png",
                "release_date" => "2017-01-01",
                "total_page" => 227
            ],
            [
                "title" => "AdvancedDataAnalyticsUsingPyth.png",
                "release_date" => "2018-01-01",
                "total_page" => 195
            ],
            [
                "title" => "AppliedDeepLearning.png",
                "release_date" => "2018-01-01",
                "total_page" => 425
            ],
            [
                "title" => "AppliedNaturalLanguageProcessi.png",
                "release_date" => "2018-01-01",
                "total_page" => 158
            ],
            [
                "title" => "CloudComputing.png",
                "release_date" => "2018-01-01",
                "total_page" => 284
            ],
            [
                "title" => "DeepActiveLearning.png",
                "release_date" => "2018-01-01",
                "total_page" => 228
            ],
            [
                "title" => "DeepLearningForNaturalLanguage.png",
                "release_date" => "2018-01-01",
                "total_page" => 290
            ],
            [
                "title" => "DeepLearningInNaturalLanguageP.png",
                "release_date" => "2018-01-01",
                "total_page" => 338
            ],
            [
                "title" => "DeepLearningWithApplicationsUs.png",
                "release_date" => "2018-01-01",
                "total_page" => 228
            ],
            [
                "title" => "DeepLearningWithAzure.png",
                "release_date" => "2018-01-01",
                "total_page" => 298
            ],
            [
                "title" => "EmbeddedOperatingSystems.png",
                "release_date" => "2018-01-01",
                "total_page" => 244
            ],
            [
                "title" => "EvolutionaryApproachToMachineL.png",
                "release_date" => "2018-01-01",
                "total_page" => 254
            ],
            [
                "title" => "FundamentalsOfDiscreteMathForC.png",
                "release_date" => "2018-01-01",
                "total_page" => 518
            ],
            [
                "title" => "IntroductionToDeepLearning.png",
                "release_date" => "2018-01-01",
                "total_page" => 196
            ],
            [
                "title" => "IntroductionToDeepLearningBusi.png",
                "release_date" => "2018-01-01",
                "total_page" => 348
            ],
            [
                "title" => "IntroductionToParallelComputin.png",
                "release_date" => "2018-01-01",
                "total_page" => 263
            ],
            [
                "title" => "NetworkIntrusionDetectionUsing.png",
                "release_date" => "2018-01-01",
                "total_page" => 92
            ],
            [
                "title" => "NeuralNetworksAndDeepLearning.png",
                "release_date" => "2018-01-01",
                "total_page" => 512
            ],
            [
                "title" => "PracticalComputerVisionApplica.png",
                "release_date" => "2018-01-01",
                "total_page" => 421
            ],
            [
                "title" => "PracticalDockerWithPython.png",
                "release_date" => "2018-01-01",
                "total_page" => 195
            ],
            [
                "title" => "ProSQLServerOnLinux.png",
                "release_date" => "2018-01-01",
                "total_page" => 622
            ],
            [
                "title" => "BigDataAnalysisAndDeepLearning.png",
                "release_date" => "2019-01-01",
                "total_page" => 388
            ],
            [
                "title" => "BigDataProcessingUsingSparkInC.png",
                "release_date" => "2019-01-01",
                "total_page" => 275
            ],
            [
                "title" => "CloudComputingForGeospatialBig.png",
                "release_date" => "2019-01-01",
                "total_page" => 294
            ],
            [
                "title" => "DeepLearningAndMissingDataInEn.png",
                "release_date" => "2019-01-01",
                "total_page" => 188
            ],
            [
                "title" => "EmbeddedDeepLearning.png",
                "release_date" => "2019-01-01",
                "total_page" => 216
            ],
            [
                "title" => "LearnKerasForDeepNeuralNetwork.png",
                "release_date" => "2019-01-01",
                "total_page" => 192
            ],
            [
                "title" => "TextMining.png",
                "release_date" => "2019-01-01",
                "total_page" => 376
            ],
            [
                "title" => "UbiquitousComputingAndComputin.png",
                "release_date" => "2019-01-01",
                "total_page" => 132
            ],
            [
                "title" => "EdgeAI.png",
                "release_date" => "2020-01-01",
                "total_page" => 156
            ],
            [
                "title" => "Managing_Kubernetes.png",
                "realease_date" => null,
                "total_page" => 187
            ],
            [
                "title" => "migrating-offloading-software-paper.png",
                "realease_date" => null,
                "total_page" => 22
            ],
            [
                "title" => "Thoughtful_Machine_Learning_with_Python_-_A_Test-Driven_Approach.png",
                "realease_date" => null,
                "total_page" => 216
            ]
        ];

        // Define the source directory for original seeder images
        $sourceImagePath = public_path('seeder/books/');
        // Define the destination directory for "uploaded" book images
        $destinationUploadPath = public_path('uploads/books/');

        // Ensure the destination directory exists
        if (!File::isDirectory($destinationUploadPath)) {
            File::makeDirectory($destinationUploadPath, 0777, true, true);
        }

        foreach ($booksData as $data) {
            // Remove the .png extension and replace underscores with spaces for a cleaner title base
            $cleanTitle = str_replace(['.png', '_Book_', '_-_'], ['', ': ', ': '], $data['title']);
            $cleanTitle = str_replace('_', ' ', $cleanTitle);
            $cleanTitle = trim($cleanTitle);

            // Generate slug from the cleaned title
            $slug = Str::slug($cleanTitle, '-');

            // Generate a random release date between 2000 and 2025
            $releaseDate = Carbon::createFromDate(
                $faker->numberBetween(2000, 2025),
                $faker->numberBetween(1, 12),
                $faker->numberBetween(1, 28)
            )->format('Y-m-d');

            // Generate a random RGB color string
            $color = implode(', ', [
                $faker->numberBetween(0, 255),
                $faker->numberBetween(0, 255),
                $faker->numberBetween(0, 255)
            ]);

            // Simple description generation based on cleaned title
            $description = '<p>This insightful book, "' . $cleanTitle . '", explores key concepts and practical applications within its domain.</p>';

            // Generate a unique filename for the image, mimicking time() . '.png'
            $imageName = uniqid() . '.png';
            $sourceFile = $sourceImagePath . $data['title']; // Original filename from data
            $destinationFile = $destinationUploadPath . $imageName; // New unique filename

            // Check if the source image exists before attempting to copy
            if (File::exists($sourceFile)) {
                try {
                    File::copy($sourceFile, $destinationFile);
                    echo "Copied: " . $data['title'] . " to " . $imageName . "\n";
                } catch (\Exception $e) {
                    echo "Error copying " . $data['title'] . ": " . $e->getMessage() . "\n";
                    $imageName = null; // Set image to null if copy fails
                }
            } else {
                echo "Source image not found: " . $data['title'] . " (Skipping copy for this book)\n";
                $imageName = null; // Set image to null if source not found
            }

            Books::create([
                'img' => $imageName, // Store the generated filename (or null if copy failed/not found)
                'release_date' => $data['release_date'] ?? $releaseDate, // Use provided date or generated date
                'total_page' => $data['total_page'],
                'status' => 'active',
                'title' => $cleanTitle,
                'color' => $color,
                'slug' => $slug,
                'author' => $faker->name,
                'category_id' => $faker->numberBetween(1, 5),
                'stock' => $faker->numberBetween(1, 10),
                'description' => $description,
            ]);
        }
    }
}
