import React from "react";

interface Product {
  id: number;
  name: string;
  discount: number;
  colors: number;
  sizes: number;
  price: number;
  originalPrice?: number;
  imageUrl: string;
}

const products: Product[] = [
  {
    id: 1,
    name: "Áo Polo len basic FSTP073",
    discount: 10,
    colors: 2,
    sizes: 4,
    price: 405000,
    originalPrice: 450000,
    imageUrl: "https://via.placeholder.com/200",
  },
  {
    id: 2,
    name: "Áo Polo dài tay basic FWTP065",
    discount: 34,
    colors: 3,
    sizes: 4,
    price: 299000,
    originalPrice: 450000,
    imageUrl: "https://via.placeholder.com/200",
  },
  {
    id: 3,
    name: "Áo T shirt họa tiết in Determination phối lưới FSTS053",
    discount: 0,
    colors: 1,
    sizes: 3,
    price: 320000,
    imageUrl: "https://via.placeholder.com/200",
  },
  {
    id: 4,
    name: "Áo T shirt họa tiết in Speedhunters FSTS041",
    discount: 20,
    colors: 3,
    sizes: 3,
    price: 280000,
    originalPrice: 350000,
    imageUrl: "https://via.placeholder.com/200",
  },
  {
    id: 5,
    name: "Áo T shirt họa tiết in Overpowering FSTS046",
    discount: 0,
    colors: 1,
    sizes: 3,
    price: 350000,
    imageUrl: "https://via.placeholder.com/200",
  },
];

const RecommendProduct: React.FC = () => {
  return (
    <div className="max-w-screen-xl mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {products.map((product) => (
          <div key={product.id} className="border rounded-lg overflow-hidden shadow-lg">
            <div className="relative">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-[200px] object-cover"
              />
              {product.discount > 0 && (
                <span className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded">
                  -{product.discount}%
                </span>
              )}
            </div>
            <div className="p-4 text-center">
              <p className="text-sm text-gray-500">
                +{product.colors} Màu sắc &middot; +{product.sizes} Kích thước
              </p>
              <h3 className="text-lg font-semibold">{product.name}</h3>
              <div className="mt-2">
                <span className="text-red-600 font-bold text-lg">
                  {product.price.toLocaleString()}₫
                </span>
                {product.originalPrice && (
                  <span className="text-gray-400 line-through text-sm ml-2">
                    {product.originalPrice.toLocaleString()}₫
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendProduct;
