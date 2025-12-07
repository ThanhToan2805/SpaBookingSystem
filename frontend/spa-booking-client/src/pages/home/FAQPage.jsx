import { useState } from "react";
import LayoutWrapper from "../../components/Layout/LayoutWrapper";

export default function FAQ() {
  const faqs = [
    {
      q: "Tôi cần tạo tài khoản để đặt lịch không?",
      a: "Có. Việc tạo tài khoản giúp bạn dễ dàng quản lý lịch hẹn, thanh toán và nhận thông báo từ LumiSpa.",
    },
    {
      q: "Tôi có thể hủy lịch không?",
      a: "Bạn có thể hủy lịch trước 2 giờ miễn phí. Hủy dưới 2 giờ có thể bị tính phí theo chính sách của spa.",
    },
    {
      q: "Thanh toán có an toàn không?",
      a: "Chúng tôi sử dụng VNPay và các chuẩn bảo mật cao cấp đảm bảo an toàn tuyệt đối cho giao dịch của bạn.",
    },
    {
      q: "Tôi có thể đặt lịch cho người khác?",
      a: "Hoàn toàn được! Chỉ cần nhập thông tin người sử dụng dịch vụ khi đặt lịch.",
    },
    {
      q: "Dịch vụ nào đang được yêu thích nhất?",
      a: "Massage toàn thân, Chăm sóc da chuyên sâu và Massage đá nóng là những dịch vụ được khách hàng đặt nhiều nhất.",
    },
  ];

  const [openIndex, setOpenIndex] = useState(null);

  return (
    <LayoutWrapper>
      <div className="py-16 bg-linear-to-br from-purple-50 via-white to-purple-100">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-bold text-center text-purple-700 mb-8">
            Câu hỏi thường gặp
          </h1>
          <p className="text-center text-gray-600 max-w-2xl mx-auto mb-10">
            Tổng hợp những thắc mắc phổ biến từ khách hàng khi sử dụng LumiSpa.
          </p>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="bg-white border border-slate-100 rounded-2xl shadow p-5 cursor-pointer transition hover:shadow-md"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-800">{faq.q}</h3>
                  <span className="text-purple-600 text-xl">
                    {openIndex === i ? "−" : "+"}
                  </span>
                </div>

                {openIndex === i && (
                  <p className="mt-3 text-gray-600 leading-relaxed">{faq.a}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </LayoutWrapper>
  );
}