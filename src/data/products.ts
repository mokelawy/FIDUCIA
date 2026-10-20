import teeBlack from "@/assets/tee-black.jpg";
import teeBrown from "@/assets/tee-brown.jpg";
import teeGray from "@/assets/tee-gray.jpg";

export type { Product, ProductColor } from "@/lib/catalog";

export const collections = [
  {
    slug: "essentials",
    name: "Essentials",
    nameAr: "الأساسيات",
    description: "The pieces you reach for daily. Neutral, quiet, built to last.",
    image: teeGray,
  },
  {
    slug: "core-black",
    name: "Core Black",
    nameAr: "الأسود الأساسي",
    description: "One tone, done properly. Deep blacks in heavyweight cotton.",
    image: teeBlack,
  },
  {
    slug: "neutrals",
    name: "Neutrals",
    nameAr: "الألوان الهادئة",
    description: "Warm off whites and espresso browns for effortless layering.",
    image: teeBrown,
  },
] as const;

export const formatPrice = (value: number) => `${value.toLocaleString("en-US")} EGP`;
