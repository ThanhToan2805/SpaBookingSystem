import { useEffect, useState } from "react";
import LayoutWrapper from "../../components/Layout/LayoutWrapper";
import { categoryApi } from "../../api/categoryApi";
import CategoryCard from "../../components/UI/CategoryCard";

export default function CategoriesList() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    categoryApi.getAll().then(setCategories).catch(console.error);
  }, []);

  return (
    <LayoutWrapper>
      <div className="py-8">
        <h2 className="text-3xl md:text-4xl font-bold mb-3 text-center text-gray-800">
          Danh mục dịch vụ
        </h2>
        <p className="text-center text-gray-500 mb-8 text-sm">
          Khám phá các nhóm dịch vụ tại LumiSpa.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <CategoryCard key={cat.id} category={cat} />
          ))}
        </div>
      </div>
    </LayoutWrapper>
  );
}