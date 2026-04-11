export enum PostStatus {
  EMPTY = '<empty>',
  ACTIVE = 'active',
  HOLD = 'hold',
  SOLD = 'sold',
  CLOSED = 'closed'
}

export enum AssetType {
  CONDO = 'condo',
  TOWNHOME = 'townhome',
  HOUSE = 'house',
  LAND = 'land'
}

export enum PostType {
  SALE = 'sale',
  RENT = 'rent'
}

export enum AreaUnit {
  WHOLE = 'whole',
  SQM = 'sqm',
  SQW = 'sqw',
  NGAN = 'ngan',
  RAI = 'rai'
}

export enum TimeUnit {
  YEAR = 'year',
  MONTH = 'month',
  WEEK = 'week',
  DAY = 'day'
}

export type PriceUnit = AreaUnit | TimeUnit;

export enum Condition {
  USED = 'used',
  NEW = 'new'
}

export interface Facility {
  id: string;
  label: string;
}

export interface Spec {
  id: string;
  label: string;
  value: number;
}

export interface Location {
  lat: number;
  lng: number;
}

export interface Address {
  subDistrictLabel: string;
  subDistrictId: string;
  districtLabel: string;
  districtId: string;
  provinceLabel: string;
  provinceId: string;
  regionId: string;
  location: Location;
}

export interface Views {
  post: number;
  phone: number;
  line: number;
}

export interface Stats {
  views: Views;
  shares: number;
  pins: number;
}

export interface Post {
  _id: string;
  title: string;
  slug: string;
  desc: string;
  assetType: AssetType;
  postType: PostType;
  price: number;
  status: PostStatus;
  thumbnail: string;
  images: string[];
  facilities: Facility[];
  specs: Spec[];
  address: Address;
  stats: Stats;
  cid: number;
  postNumber: string;

  isStudio?: boolean;
  video?: string;
  land?: number;
  landUnit?: AreaUnit;
  area?: number;
  areaUnit?: AreaUnit;
  priceUnit?: PriceUnit;
  condition?: Condition;
  refId?: string;

  createdAt: string;
  createdBy: string;
  updatedAt?: string;
  updatedBy?: string;
}
