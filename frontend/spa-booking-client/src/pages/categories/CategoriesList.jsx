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
      <h2 className="text-3xl font-bold mb-6 text-center">All Categories</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categories.map(cat => <CategoryCard key={cat.id} category={cat} />)}
      </div>
    </LayoutWrapper>
  );
}