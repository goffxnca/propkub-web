import {
  Post,
  PostStatus,
  PostType,
  AssetType
} from '../../src/posts/posts.schema';
import { faker } from '@faker-js/faker';
import { Types } from 'mongoose';

const now = new Date();

// Base post template
export const basePost: Post = {
  _id: '1',
  title: 'Luxury Condo in Bangkok',
  slug: 'luxury-condo-bangkok_P001',
  desc: faker.lorem.paragraph(),
  assetType: AssetType.CONDO,
  postType: PostType.SALE,
  price: 5000000,
  status: PostStatus.ACTIVE,
  thumbnail: faker.image.url(),
  images: [faker.image.url(), faker.image.url(), faker.image.url()],
  facilities: [
    { id: 'pool', label: 'Swimming Pool' },
    { id: 'gym', label: 'Gym' }
  ],
  specs: [
    { id: '1', label: 'Bedrooms', value: 2 },
    { id: '2', label: 'Bathrooms', value: 2 }
  ],
  address: {
    provinceId: '1',
    provinceLabel: 'Bangkok',
    districtId: '1',
    districtLabel: 'Phra Nakhon',
    subDistrictId: '1',
    subDistrictLabel: 'Phra Borom Maha Ratchawang',
    regionId: '1',
    location: {
      lat: 13.7563,
      lng: 100.5018
    }
  },
  stats: {
    views: {
      post: 1,
      phone: 1,
      line: 1
    },
    shares: 1,
    pins: 1
  },
  rstats: {
    views: {
      post: 1,
      phone: 1,
      line: 1
    },
    shares: 1,
    pins: 1
  },
  cid: 1,
  postNumber: 'P001',
  createdAt: now,
  createdBy: new Types.ObjectId().toString()
};

export const createPost = (overrides: Partial<Post> = {}): Post => {
  const merged = {
    ...basePost,
    postNumber: Math.random().toString(), //Generate random string for now, in prod codes, it will be sent from frontend in as epoch number
    ...overrides
  };

  // Deep merge for nested objects
  if (overrides.address) {
    merged.address = {
      ...basePost.address,
      ...overrides.address
    };
  }

  return merged;
};
