import RoomItem from '../../../components/items/RoomItem';
import Header from '../../../layouts/HotelManagementLayout/Header';

const RoomManagement = () => {
  // Seed data dựa trên giao diện mẫu
  const roomsData = [
    {
      id: '001',
      floor: 0,
      hourlyPrice: 60000,
      hourlyDiscount: 20000,
      nightPrice: 200000,
      dailyPrice: 300000,
      status: 'maintenance', // bảo trì
      actions: ['UPDATE', 'DELETE']
    },
    {
      id: '101',
      floor: 1,
      hourlyPrice: 60000,
      hourlyDiscount: 20000,
      nightPrice: 200000,
      dailyPrice: 300000,
      status: 'operating', // đang hoạt động
      actions: ['UPDATE', 'DELETE']
    },
    {
      id: '102',
      floor: 1,
      hourlyPrice: 60000,
      hourlyDiscount: 20000,
      nightPrice: 180000,
      dailyPrice: 300000,
      status: 'operating',
      actions: ['UPDATE', 'DELETE']
    },
    {
      id: '103',
      floor: 1,
      hourlyPrice: 60000,
      hourlyDiscount: 20000,
      nightPrice: 200000,
      dailyPrice: 350000,
      status: 'operating',
      actions: ['UPDATE', 'DELETE']
    },
    {
      id: '201',
      floor: 2,
      hourlyPrice: 60000,
      hourlyDiscount: 20000,
      nightPrice: 200000,
      dailyPrice: 350000,
      status: 'operating',
      actions: ['UPDATE', 'DELETE']
    },
    {
      id: '202',
      floor: 2,
      hourlyPrice: 60000,
      hourlyDiscount: 20000,
      nightPrice: 180000,
      dailyPrice: 300000,
      status: 'operating',
      actions: ['UPDATE', 'DELETE']
    },
    {
      id: '203',
      floor: 2,
      hourlyPrice: 60000,
      hourlyDiscount: 20000,
      nightPrice: 200000,
      dailyPrice: 300000,
      status: 'maintenance',
      actions: ['UPDATE', 'DELETE']
    }
  ];

  return (
    <>
      <div className="border-b border-gray-300 mb-8" style={{ borderBottomWidth: '0.5px' }}>
        <Header />
      </div>

      <div className="p-6">
        {/* Header Table */}
        <div className="grid grid-cols-12 gap-2 py-4 px-4 bg-gray-50 border-b border-gray-300 font-semibold text-gray-700">
          <div className="col-span-1">Phòng</div>
          <div className="col-span-1">Tầng</div>
          <div className="col-span-5">Giá</div>
          <div className="col-span-2">Tình trạng</div>
          <div className="col-span-3 text-center">Actions</div>
        </div>

        {/* Room List */}
        <div className="bg-white">
          {roomsData.map((room, index) => (
            <RoomItem key={room.id} room={room} />
          ))}
        </div>
      </div>
    </>
  );
};

export default RoomManagement;
