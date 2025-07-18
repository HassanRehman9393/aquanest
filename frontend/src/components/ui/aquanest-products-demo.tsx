import { BentoCard, BentoGrid } from "@/components/ui/bento-grid";
import Image from "next/image";

const products = [
  {
    name: "Water Bottles",
    href: "/products",    background: (
      <Image 
        className="absolute inset-0 w-full h-full object-cover" 
        src="https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop"
        alt="Premium water bottles in various sizes"
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
      />
    ),
    className: "col-span-1",
  },
  {
    name: "Water Gallons",
    href: "/products",    background: (
      <Image 
        className="absolute inset-0 w-full h-full object-cover" 
        src="https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=800&h=600&fit=crop"
        alt="Large water gallons for home and office"
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
      />
    ),
    className: "col-span-1",
  },
  {
    name: "Water Dispensers",
    href: "/products",    background: (
      <Image 
        className="absolute inset-0 w-full h-full object-cover" 
        src="https://images.unsplash.com/photo-1563787702-459ac2e7b5dc?w=800&h=600&fit=crop"
        alt="Modern water dispensers with hot and cold options"
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
      />
    ),
    className: "col-span-1",
  },
];

function AquaNestProductsDemo() {
  return (
    <BentoGrid className="lg:grid-cols-3 md:grid-cols-2 grid-cols-1">
      {products.map((product) => (
        <BentoCard key={product.name} {...product} />
      ))}
    </BentoGrid>
  );
}

export { AquaNestProductsDemo };
