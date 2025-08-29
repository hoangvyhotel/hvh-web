// interface UtilitiesForBooking {
//   Quantity: number;
//   Icon: string;
// }

// interface Document {
//   ID: string;
//   TypeID: "CCCD" | "CMND";
//   FullName: string;
//   Address: string;
//   BirthDay: string;
//   Gender: boolean;
//   EthnicGroup: string;
// }

// interface CarInfo {
//   LicensePlate: string;
// }

// interface Surcharge {
//   Content?: string;
//   Amout?: number;
// }

// interface Note {
//   Content?: string;
//   Discount?: number;
//   PayInAdvance?: number;
//   NegotiatedPrice?: number;
// }

// interface BookingPricing {
//   PriceType: string;
//   StartDate: string;
//   EndDate?: string;
//   AppliedFirstHourPrice?: number;
//   AppliedNextHourPrice?: number;
//   AppliedDayPrice?: number;
//   AppliedNightPrice?: number;
//   CalculatedAmount?: number;
// }

// interface GetBookingInfo {
//   BookingId: string;
//   RoomName: string;
//   TypeBooking: string;
//   Surcharge?: Surcharge[];
//   Notes?: Note[];
//   Utilities?: UtilitiesForBooking[];
//   Documents?: Document[];
//   CarInfos?: CarInfo[];
//   BookingPricing: BookingPricing[];
// }