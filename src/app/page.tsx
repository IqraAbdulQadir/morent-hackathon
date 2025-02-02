'use client';
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { client } from '../sanity/lib/client';
import { urlFor } from '../sanity/lib/image';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

interface Car {
  _id: string;
  name: string;
  type: string;
  image: any;
  pricePerDay: number;
  fuelCapacity: string;
  transmission: string;
  seatingCapacity: string;
}

function CarList() {
  const [currentPage, setCurrentPage] = useState(1);
  const carsPerPage = 12; // Number of cars to display per page
  const [cars, setCars] = useState<Car[]>([]);
  const [error, setError] = useState<string | null>(null); // State for error messages
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('search') || '';

  useEffect(() => {
    const fetchCars = async () => {
      try {
        let query = '*[_type == "car"]{_id, name, type, image, pricePerDay, fuelCapacity, transmission, seatingCapacity}';
        const data = await client.fetch(query);
        if (!data || data.length === 0) {
          setError("No products available");
        } else {
          setCars(data);
        }
      } catch (err) {
        setError("Failed to fetch cars. Please try again later.");
      }
    };

    fetchCars();
  }, []);

  // Filter cars based on search query
  const filteredCars = cars.filter((car) =>
    car.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination logic
  const indexOfLastCar = currentPage * carsPerPage;
  const currentCars = filteredCars.slice(0, indexOfLastCar);
  const totalPages = Math.ceil(filteredCars.length / carsPerPage);

  const handleShowMore = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="sec grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {error && <p className="text-red-500">{error}</p>} {/* Display error message */}
      {currentCars.length === 0 && !error ? ( // Check if there are no cars and no error
        <p>No products available</p>
      ) : (
        currentCars.map((car) => (
          <Card key={car._id} className="w-full max-w-[304px] mx-auto h-auto flex flex-col justify-between">
            <CardHeader>
              <CardTitle className="w-full flex items-center justify-between">
                {car.name}
              </CardTitle>
              <CardDescription>{car.type}</CardDescription>
            </CardHeader>
            <CardContent className="w-full flex flex-col items-center justify-center gap-4">
              <Image src={urlFor(car.image).url()} alt={car.name} width={220} height={68} />
              <div className="flex justify-between w-full">
                <div className="bg-gray-200 p-2 rounded text-center">
                  {car.fuelCapacity}
                </div>
                <div className="bg-gray-200 p-2 rounded text-center">
                  {car.seatingCapacity}
                </div>
                <div className="bg-gray-200 p-2 rounded text-center">
                  {car.transmission}
                </div>
              </div>
            </CardContent>
            <CardFooter className="w-full flex items-center justify-between">
              <p>${car.pricePerDay}/day</p>
              <Link href={`/cars/${car._id}`}>
                <button className="bg-[#3563e9] p-2 text-white rounded-xl w-[140px] h-[56px]">
                  Rent Now
                </button>
              </Link>
            </CardFooter>
          </Card>
        ))
      )}
      {/* Show More Button */}
      <section className="button w-full text-center mt-4">
        <button onClick={handleShowMore} disabled={currentPage === totalPages} className="bg-[#3563e9] px-4 py-2 text-white rounded-md">
          Show More Cars
        </button>
      </section>
    </div>
  );
}

export default function Home() {
  return (
    <div className="bg-[#f6f7f9] min-h-screen p-4 sm:p-6 lg:p-20 flex flex-col gap-10 font-[family-name:var(--font-geist-sans)]">
      {/* Popular Cars Section */}
      <section className="popular w-full flex flex-col gap-4">
        <h1 className="text-gray-500 text-lg sm:text-xl">Popular Car</h1>
        <Suspense fallback={<p>Loading cars...</p>}>
          <CarList />
        </Suspense>
      </section>
    </div>
  );
}