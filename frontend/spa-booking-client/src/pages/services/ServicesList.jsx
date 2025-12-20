import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import LayoutWrapper from "../../components/Layout/LayoutWrapper";
import { serviceApi } from "../../api/serviceApi";
import ServiceCard from "../../components/UI/ServiceCard";

export default function ServicesList() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);

  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get("categoryId");

  // Filters
  const [keyword, setKeyword] = useState("");
  const [priceRange, setPriceRange] = useState([0, 2000000]);
  const [sortBy, setSortBy] = useState("name");
  const [sortDesc, setSortDesc] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 9;
  const [isLastPage, setIsLastPage] = useState(false);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryId, keyword, priceRange, sortBy, sortDesc, page]);

  useEffect(() => {
    if (!loading) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [page, loading]);

  const load = async () => {
    try {
      setLoading(true);

      const params = {
        searchKeyword: keyword || null,
        minPrice: priceRange[0],
        maxPrice: priceRange[1],
        sortBy,
        sortDesc,
        page,
        pageSize,
      };

      if (categoryId) params.categoryId = categoryId;

      const res = await serviceApi.getAdvanced(params);
      setServices(res);

      const nextParams = { ...params, page: page + 1 };
      const nextPageData = await serviceApi.getAdvanced(nextParams);
      setIsLastPage(nextPageData.length === 0);
    } catch (err) {
      console.error("Lỗi load services:", err);
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = () => {
    setKeyword("");
    setPriceRange([0, 2000000]);
    setSortBy("name");
    setSortDesc(false);
    setPage(1);
  };

  return (
    <LayoutWrapper>
      <div className="py-8">
        <h2 className="text-3xl md:text-4xl font-bold mb-2 text-gray-900">
          Danh sách dịch vụ
          {categoryId ? " theo danh mục" : ""}
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          Lọc và tìm kiếm dịch vụ phù hợp với nhu cầu của bạn.
        </p>

        <div className="flex flex-col md:flex-row gap-6">
          {/* LEFT FILTER SIDEBAR */}
          <div className="w-full md:w-72 shrink-0 md:sticky md:top-24 h-max p-5 bg-white rounded-2xl shadow border border-gray-100">
            <h3 className="font-semibold text-lg mb-4 text-gray-800">
              Bộ lọc dịch vụ
            </h3>

            {/* Search */}
            <div className="mb-4">
              <label className="font-medium text-sm text-gray-700">
                Tìm kiếm
              </label>
              <input
                type="text"
                className="mt-1 border border-gray-300 rounded-lg px-3 py-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Nhập tên dịch vụ..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
            </div>

            {/* Sort By */}
            <div className="mb-4">
              <label className="font-medium text-sm text-gray-700">
                Sắp xếp theo
              </label>
              <select
                className="mt-1 border border-gray-300 rounded-lg px-3 py-2 w-full text-sm"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="name">Tên</option>
                <option value="price">Giá</option>
                <option value="duration">Thời lượng</option>
              </select>
            </div>

            {/* Sort Order */}
            <div className="mb-4">
              <label className="font-medium text-sm text-gray-700">
                Thứ tự
              </label>
              <select
                className="mt-1 border border-gray-300 rounded-lg px-3 py-2 w-full text-sm"
                value={sortDesc ? "desc" : "asc"}
                onChange={(e) =>
                  setSortDesc(e.target.value === "desc")
                }
              >
                <option value="asc">Tăng dần</option>
                <option value="desc">Giảm dần</option>
              </select>
            </div>

            {/* Price Range */}
            <div className="mb-4">
              <label className="font-medium text-sm text-gray-700">
                Khoảng giá
              </label>

              <input
                type="range"
                min="0"
                max="2000000"
                step="50000"
                value={priceRange[0]}
                onChange={(e) =>
                  setPriceRange([
                    Number(e.target.value),
                    priceRange[1],
                  ])
                }
                className="w-full mt-2"
              />

              <input
                type="range"
                min="0"
                max="2000000"
                step="50000"
                value={priceRange[1]}
                onChange={(e) =>
                  setPriceRange([
                    priceRange[0],
                    Number(e.target.value),
                  ])
                }
                className="w-full"
              />

              <div className="flex justify-between text-xs text-gray-600 mt-1">
                <span>
                  {priceRange[0].toLocaleString()} VND
                </span>
                <span>
                  {priceRange[1].toLocaleString()} VND
                </span>
              </div>
            </div>

            {/* Reset */}
            <button
              onClick={resetFilters}
              className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-100"
            >
              Đặt lại bộ lọc
            </button>
          </div>

          {/* RIGHT SERVICE LIST */}
          <div className="flex-1">
            {loading ? (
              <p className="text-gray-500">Loading...</p>
            ) : !services || services.length === 0 ? (
              <p className="text-gray-500">
                Không có service nào.
              </p>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {services.map((s) => (
                    <ServiceCard key={s.id} service={s} />
                  ))}
                </div>

                {/* PAGINATION */}
                <div className="flex justify-center gap-3 mt-8">
                  {/* PREVIOUS */}
                  <button
                    disabled={page === 1}
                    onClick={() =>
                      setPage((p) => Math.max(1, p - 1))
                    }
                    className={`px-4 py-2 rounded-lg border text-sm font-medium ${
                      page === 1
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    Trước
                  </button>

                  <span className="px-4 py-2 font-medium text-sm">
                    Trang {page}
                  </span>

                  {/* NEXT */}
                  <button
                    disabled={isLastPage}
                    onClick={() => setPage((p) => p + 1)}
                    className={`px-4 py-2 rounded-lg border text-sm font-medium ${
                      isLastPage
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    Sau
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </LayoutWrapper>
  );
}