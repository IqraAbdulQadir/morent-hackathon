'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';

interface Car {
  _id: string;
  name: string;
  type: string;
  image: any;
  pricePerDay: number; // Updated to number
  fuelCapacity: string;
  transmission: string;
  seatingCapacity: string;
}

export default function Page() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<string>("");
  const [minPrice, setMinPrice] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);

  useEffect(() => {
    const fetchCars = async () => {
      const query =
        '*[_type == "car"]{_id, name, type, image, pricePerDay, fuelCapacity, transmission, seatingCapacity}';
      const data = await client.fetch(query);
      setCars(data);
      setLoading(false);
    };

    fetchCars();
  }, []);

  // Filter cars based on type and price range
  const filteredCars = cars.filter((car) => {
    const matchesType = selectedType ? car.type === selectedType : true;
    const matchesPrice =
      (minPrice === null || car.pricePerDay >= minPrice) &&
      (maxPrice === null || car.pricePerDay <= maxPrice);
    return matchesType && matchesPrice;
  });

  // Group filtered cars by type
  const groupedCars = filteredCars.reduce((acc, car) => {
    (acc[car.type] = acc[car.type] || []).push(car);
    return acc;
  }, {} as Record<string, Car[]>);

  return (
    <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-8">
      <h1 className="text-2xl font-bold text-center my-6">Categories</h1>
      {/* Filters */}
      <section className="filters w-full flex flex-col gap-4 mb-6">
        <div className="flex flex-wrap gap-4">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="p-2 border rounded-md"
          >
            <option value="">All Types</option>
            <option value="SUV">SUV</option>
            <option value="Sedan">Sedan</option>
            <option value="Hatchback">Hatchback</option>
            {/* Add more types as needed */}
          </select>
          <input
            type="number"
            placeholder="Min Price"
            value={minPrice || ""}
            onChange={(e) => setMinPrice(e.target.value ? parseFloat(e.target.value) : null)}
            className="p-2 border rounded-md"
          />
          <input
            type="number"
            placeholder="Max Price"
            value={maxPrice || ""}
            onChange={(e) => setMaxPrice(e.target.value ? parseFloat(e.target.value) : null)}
            className="p-2 border rounded-md"
          />
        </div>
      </section>

      {/* Display Filtered Cars */}
      <div className="w-full bg-[#f6f7f9] p-4 sm:p-6 flex flex-col gap-10">
        {loading ? (
          <p className="text-center">Loading...</p>
        ) : (
          Object.keys(groupedCars).map((type) => (
            <section key={type} className="mb-6">
              <h2 className="text-xl font-bold mb-4">{type}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {groupedCars[type].map((car) => (
                  <Card
                    key={car._id}
                    className="w-full h-auto flex flex-col justify-between border shadow-lg"
                  >
                    <CardHeader>
                      <CardTitle className="w-full flex items-center justify-between text-lg">
                        {car.name}
                      </CardTitle>
                      <CardDescription className="text-sm text-gray-500">
                        {car.type}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="w-full flex flex-col items-center justify-center gap-4">
                      <Image
                        src={urlFor(car.image).url()}
                        alt={car.name}
                        width={220}
                        height={120}
                        className="rounded-lg object-contain"
                      />
                    </CardContent>
                    <CardFooter className="w-full flex items-center justify-between px-4 py-2 bg-gray-100">
                      <p className="font-semibold text-gray-700">
                        ${car.pricePerDay}/day
                      </p>
                      <Link href={`/cars/${car._id}`}>
                        <button className="bg-[#3563e9] px-4 py-2 text-white rounded-md text-sm">
                          Rent Now
                        </button>
                      </Link>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </section>
          ))
        )}
      </div>
    </div>
  );
}