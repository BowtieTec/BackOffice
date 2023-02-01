export interface IParkingLot {
  url_base: string;
  id: string;
  name: string;
  address: string;
  parking_spaces: string;
  special_parking_spaces: string;
  rules: string;
  status: number;
  nit: string;
  business_address: string;
  business_name: string;
  minutes_to_exit: number;
  is_show_map: number;
  currency: number;
  is_TAS: number;
  phone_numbers: string[];
  is_our_visa_credential: number;
  url_logo: string;
  url_tariff?: any;
  url_background: string;
  is_draft: number;
  lane_number: number;
}

export interface IParkingLotUpdate {
  parkingId: string;
  url_base?: string;
  id?: string;
  name?: string;
  address?: string;
  parking_spaces?: string;
  special_parking_spaces?: string;
  status?: number;
  nit?: string;
  business_address?: string;
  business_name?: string;
  minutes_to_exit?: number;
  is_show_map?: number;
  is_TAS?: number;
  phone_numbers?: string[];
  is_our_visa_credential?: number;
  url_logo?: string;
  url_tariff?: any;
  url_background?: string;
  is_draft?: number;
  lane_number?: number;
}
