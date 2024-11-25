
import { Discount } from "@mui/icons-material";
import { useEffect, useState } from "react";

interface Voucher {
  id: number;
  name: string;
  code: string;
  startDate: string;
  endDate: string;
  status: string;
  quantity: number;
  maxPercent: number;
  minAmount: number;
  typeTicket: string;
}

interface VoucherWithDiscount extends Voucher {
  discountAmount: number;
}
// LUC CHỌN B CHO CALL USE BÊN NÀY NỮA LÀ ĐC MÀ U THOI BAT AN SU DUNG CUNG DC =
// COM CAOI GI NUA K B NHI
////  B XEM CHỖ NÀO BÊN CLINET BUG THÌ FIX THÔI GIỪO T CX KO NGHXI ĐC GI o man check out b fix het may cai do do 
const VoucherModal = ({
  onVoucherSelect,
  amount,
  isVoucherModalOpen,
  toggleVoucherModal,
}: {
  onVoucherSelect: (voucher: Voucher) => void;
  amount: number;
  isVoucherModalOpen: boolean;
  toggleVoucherModal: () => void;
}) => {
  const [voucherList, setVoucherList] = useState<VoucherWithDiscount[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchVoucherList = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:8080/api/v1/voucher/better-voucher?amount=${amount}`);
      if (!response.ok) {
        throw new Error("Lỗi khi tải danh sách phiếu giảm giá");
      }
      const data: Voucher[] = await response.json();

      // Tính số tiền giảm giá
      const vouchersWithDiscount: VoucherWithDiscount[] = data.map((voucher) => {
        const discountAmount = Math.min((voucher.maxPercent / 100) * amount, voucher.minAmount);
        return { ...voucher, discountAmount };
      });

      setVoucherList(vouchersWithDiscount);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isVoucherModalOpen) {
      fetchVoucherList();
    }
  }, [isVoucherModalOpen, amount]);

  const selectVoucher = (voucher: Voucher) => {
    onVoucherSelect(voucher);
    toggleVoucherModal();
  };

  return (
    <>
      {isVoucherModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
            <div className="flex justify-between items-center mb-4 border-b pb-2">
              <h2 className="text-xl font-semibold text-gray-800">Mã giảm giá dành cho bạn</h2>
              <button
                onClick={toggleVoucherModal}
                className="text-red-500 font-bold text-lg hover:text-red-700 transition-colors"
              >
                Đóng
              </button>
            </div>
            <div className="mt-4">
              {loading ? (
                <p className="text-center text-gray-600">Đang tải...</p>
              ) : error ? (
                <p className="text-center text-red-500">{error}</p>
              ) : voucherList.length === 0 ? (
                <p className="text-center text-gray-500">Không có phiếu giảm giá nào</p>
              ) : (
                voucherList.map((voucher: VoucherWithDiscount) => (
                  <div
                    key={voucher.id}
                    className="flex justify-between items-center py-4 border-b hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center">
                      {/* Icon giảm giá */}
                      <Discount className="h-6 w-6 text-blue-500 mr-2" />
                      <div>
                        <p className="text-lg font-semibold text-gray-800">{voucher.name}</p>
                        <p className="text-sm text-gray-600">Mã: {voucher.code}</p>
                        <p className="text-sm text-gray-600">
                          Giảm: {voucher.maxPercent}% - Tối thiểu:{" "}
                          {voucher.minAmount.toLocaleString("vi-VN")}₫
                        </p>
                        <p className="text-sm text-green-600 font-semibold">
                          Số tiền giảm: {voucher.discountAmount.toLocaleString("vi-VN")}₫
                        </p>
                      </div>
                    </div>
                    <button
                      className="text-blue-500 font-semibold hover:text-blue-700 transition-colors"
                      onClick={() => selectVoucher(voucher)}
                    >
                      Chọn
                    </button>
                  </div>
                ))
              )}
            </div>
            <div className="mt-4 text-center">
              <button
                onClick={() => alert("Load thêm mã giảm giá")}
                className="text-blue-500 font-semibold hover:text-blue-700"
              >
                Xem thêm ↓
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default VoucherModal;