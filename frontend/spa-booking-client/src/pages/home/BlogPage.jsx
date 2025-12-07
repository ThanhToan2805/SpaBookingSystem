import LayoutWrapper from "../../components/Layout/LayoutWrapper";
import { Link } from "react-router-dom";

export default function Blog() {
  const posts = [
    {
      id: 1,
      title: "5 lợi ích tuyệt vời của massage toàn thân mà bạn chưa biết",
      image: "https://cdn.nhathuoclongchau.com.vn/unsafe/800x0/massage_body_co_tac_dung_gi_nhung_luu_y_khi_thuc_hien_5_354cc25b70.jpg",
      excerpt:
        "Massage không chỉ giúp thư giãn mà còn cải thiện lưu thông máu, giảm stress và tăng cường sức khỏe.",
    },
    {
      id: 2,
      title: "Chăm sóc da chuyên sâu – xu hướng làm đẹp 2025",
      image: "https://sumdfine.com/wp-content/uploads/2025/02/cham-soc-da-1.jpg",
      excerpt:
        "Công nghệ skincare hiện đại giúp chăm sóc da hiệu quả hơn bao giờ hết. Đây là 3 liệu trình được yêu thích nhất.",
    },
    {
      id: 3,
      title: "Cách chọn đúng dịch vụ spa phù hợp với cơ thể của bạn",
      image: "https://truongnauan.com/test_disk/photos/shares/cham-soc-sac-dep/spa-la-gi/spa-la-gi.jpg",
      excerpt:
        "Mỗi cơ thể cần phương pháp chăm sóc khác nhau. Đây là hướng dẫn chọn dịch vụ spa theo tình trạng cơ thể.",
    },
  ];

  return (
    <LayoutWrapper>
      <div className="py-16 bg-linear-to-br from-purple-50 via-white to-purple-100">
        <div className="max-w-6xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-bold text-center text-purple-700 mb-8">
            Blog & Tin tức
          </h1>
          <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
            Những bài viết hữu ích về chăm sóc da, sức khỏe và trải nghiệm spa để bạn hiểu cơ thể mình hơn.
          </p>

          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-2xl shadow-lg border border-purple-50 overflow-hidden hover:-translate-y-1 hover:shadow-2xl transition"
              >
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-48 object-cover"
                />

                <div className="p-6 flex flex-col">
                  <h2 className="text-xl font-semibold text-gray-900 hover:text-purple-600 transition mb-3">
                    {post.title}
                  </h2>
                  <p className="text-gray-600 text-sm flex-1">{post.excerpt}</p>

                  <Link
                    to=""
                    className="mt-4 text-purple-600 font-medium hover:underline"
                  >
                    Đọc thêm →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </LayoutWrapper>
  );
}