import React from 'react';
import { FaRegFileAlt, FaShippingFast, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { Button, Timeline } from 'antd';

enum Status {
  PENDING = "PENDING",
  TOSHIP = "TOSHIP",
  TORECEIVE = "TORECEIVE",
  DELIVERED = "DELIVERED",
  CANCELED = "CANCELED"
}

interface Account {
  id: number;
  username: string;
  staff?: {
    code: string;
    name: string;
    email: string;
    phone: string;
  };
  customer?: {
    id: number;
    code: string;
    name: string;
    email: string;
    phone: string;
    addressResponseDTOS: Array<{
      id: number;
      phone: string;
      name: string;
      province: string;
      district: string;
      ward: string;
      detail: string;
      defaultAddress: boolean;
    }>;
  };
}

interface BillHistory {
  id: number;
  status: Status;
  note: string;
  createdDate: string;
  updatedDate?: string;
  account: Account;
}

interface Bill {
  status: Status;
}

interface Props {
  billHistory: BillHistory[];
  bill: Bill;
  showModal: (isCancel: boolean) => void;
}

const OrderStatusTimeline: React.FC<Props> = ({ billHistory, bill, showModal }) => {
  // Helper function to map status to display text and color
  const getStatusDetails = (status: Status) => {
    switch (status) {
      case Status.PENDING:
        return {
          text: 'Chờ xác nhận',
          color: '#FFA500',
          icon: <FaRegFileAlt />
        };
      case Status.TOSHIP:
        return {
          text: 'Chờ giao hàng',
          color: '#024FA0',
          icon: <FaShippingFast />
        };
      case Status.TORECEIVE:
        return {
          text: 'Đang giao hàng',
          color: '#1E90FF',
          icon: <FaShippingFast />
        };
      case Status.DELIVERED:
        return {
          text: 'Hoàn thành',
          color: '#50B846',
          icon: <FaCheckCircle />
        };
      case Status.CANCELED:
        return {
          text: 'Đã hủy',
          color: '#9C281C',
          icon: <FaTimesCircle />
        };
      default:
        return {
          text: 'Không xác định',
          color: '#808080',
          icon: null
        };
    }
  };

  // Ensure the timeline includes all status stages
  const generateFullTimeline = () => {
    const statuses = [
      Status.PENDING,
      Status.TOSHIP,
      Status.TORECEIVE,
      Status.DELIVERED,
      Status.CANCELED
    ];

    return statuses.map(status => {
      // Find the matching history item for this status
      const matchedHistory = billHistory.find(item => item.status === status);

      const { text, color, icon } = getStatusDetails(status);

      return {
        status,
        text,
        color,
        icon,
        date: matchedHistory?.createdDate || null,
        note: matchedHistory?.note || null
      };
    });
  };

  const fullTimeline = generateFullTimeline();

  return (
    // <div className="container overflow-x-auto mb-3">
    //     <Timeline mode="left" style={{ height: '500px' }}>
    //         {fullTimeline.map((item, index) => (
    //             <Timeline.Item
    //                 key={index}
    //                 dot={item.icon}
    //                 color={item.color}
    //             >
    //                 <h6 className="mt-2">{item.text}</h6>
    //                 {item.date && (
    //                     <div>
    //                         Ngày: {new Date(item.date).toLocaleString()}
    //                         {item.note && (
    //                             <>
    //                                 <br />
    //                                 Ghi chú: {item.note}
    //                             </>
    //                         )}
    //                     </div>
    //                 )}
    //             </Timeline.Item>
    //         ))}
    //     </Timeline>

    //     <div className="d-flex">
    //         <div className="flex-grow-1">
    //             {bill.status !== Status.DELIVERED && (
    //                 <>
    //                     {bill.status === Status.PENDING && (
    //                         <Button 
    //                             type="primary" 
    //                             danger 
    //                             className="me-1" 
    //                             onClick={() => showModal(true)}
    //                         >
    //                             Hủy đơn
    //                         </Button>
    //                     )}
    //                     {bill.status !== Status.CANCELED && (
    //                         <Button 
    //                             type="primary" 
    //                             onClick={() => showModal(false)}
    //                         >
    //                             {bill.status === Status.PENDING ? 'Xác nhận' : 'Hoàn thành'}
    //                         </Button>
    //                     )}
    //                 </>
    //             )}
    //         </div>
    //     </div>
    // </div>
    <div className="container mx-auto px-4 py-8">
    <div className="relative">
      <div className="flex justify-between items-center">
        {fullTimeline.map((item, index) => (
          <div key={index} className="flex flex-col items-center relative w-1/5">
            <div
              className={`w-14 h-14 rounded-full flex items-center justify-center
                ${item.status === Status.CANCELED ? 'bg-gray-200' : 'bg-green-500'}
                text-white mb-2`}
            >
              {item.icon}
            </div>
            
            <div className="text-center">
              <div className="text-sm font-medium">{item.text}</div>
              {item.date && (
                <div className="text-xs text-gray-500 mt-1">
                  {new Date(item.date).toLocaleString('vi-VN', {
                    hour: '2-digit',
                    minute: '2-digit',
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                  })}
                </div>
              )}
            </div>

            {index < fullTimeline.length - 1 && (
              <div className="absolute top-7 left-full w-full h-[2px] bg-green-500 -z-10" 
                   style={{ width: 'calc(100% - 1rem)' }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
{/* 
    <div className="mt-8 text-gray-600 text-sm">
      Người bán đã gửi hàng. Bạn sẽ nhận được sản phẩm dự kiến vào 30-09-2020.
    </div> */}

    <div className="mt-4 flex justify-end">
      <button className="bg-red-500 text-white px-6 py-2 rounded-md">
        Đã Nhận Hàng
      </button>
    </div>
  </div>
  );
};

export default OrderStatusTimeline;