import { PrismaClient, VenueCategory } from '@prisma/client';

const prisma = new PrismaClient();

const TOUR_API_KEY = process.env.TOUR_API_KEY;
const BASE_URL = 'https://apis.data.go.kr/B551011/KorService2';

//Content Type to VenueCategoryMapping
const CONTENT_TYPE_MAP: Record<string, VenueCategory> = {
  '12': 'ATTRACTION', // 관광지
  '14': 'CULTURE', // 문화시설
  '28': 'ACTIVITY', // 레포츠
  '32': 'HOTEL', // 숙박
  '38': 'SHOPPING', // 쇼핑
  '39': 'RESTAURANT', // 음식점
};

//AREA Code for Major City
const AREA_CODES = [
  { code: '1', name: '서울' },
  { code: '6', name: '부산' },
  { code: '4', name: '대구' },
  { code: '2', name: '인천' },
  { code: '5', name: '광주' },
  { code: '3', name: '대전' },
  { code: '7', name: '울산' },
  { code: '31', name: '경기도' },
  { code: '32', name: '강원도' },
  { code: '33', name: '충청북도' },
  { code: '34', name: '충청남도' },
  { code: '35', name: '전라북도' },
  { code: '36', name: '전라남도' },
  { code: '37', name: '경상북도' },
  { code: '38', name: '경상남도' },
  { code: '39', name: '제주도' },
];

interface TourApiItem {
  contentid: string;
  contenttypeid: string;
  title: string;
  addr1?: string;
  addr2?: string;
  mapx?: string; // longitude
  mapy?: string; // latitude
  tel?: string;
  firstimage?: string;
  firstimage2?: string;
  areacode?: string;
  sigungucode?: string;
}

type ImageSource = 'OAUTH_API' | 'TOUR_API' | 'USER_UPLOAD';

interface IVenueImage {
  imageSource: ImageSource;
  imageUrl: string;
  isThumbnail: boolean;
}

async function fetchTourData(
  contentTypeId: string,
  areaCode: string,
  pageNo: number = 1,
): Promise<TourApiItem[]> {
  const params = new URLSearchParams({
    numOfRows: '100',
    pageNo: String(pageNo),
    MobileOS: 'ETC',
    MobileApp: 'TripTags',
    _type: 'json',
    contentTypeId: contentTypeId,
    areaCode: areaCode,
  });
  const url = `${BASE_URL}/areaBasedList2?serviceKey=${TOUR_API_KEY}&${params.toString()}`;

  try {
    const response = await fetch(url);
    const text = await response.text();

    if (contentTypeId === '12' && areaCode === '1') {
      console.log('API URL:', url);
      console.log('API Response:', text.substring(0, 500));
    }
    /* eslint-disable @typescript-eslint/no-unsafe-assignment */
    /* eslint-disable @typescript-eslint/no-unsafe-member-access */
    /* eslint-disable @typescript-eslint/no-unsafe-return */
    let data: any;
    try {
      data = JSON.parse(text);
    } catch {
      console.error('Failed to parse JSON:', text.substring(0, 200));
      return [];
    }
    //debug
    if (contentTypeId === '12' && areaCode === '1') {
      console.log(
        'API Response Sample:',
        JSON.stringify(data, null, 2).substring(0, 500),
      );
    }

    if (data.response?.body?.items?.item) {
      const items = data.response.body.items.item;
      return Array.isArray(items) ? items : [items];
    }
    //check for error response
    if (data.response?.header?.resultCode != '0000') {
      console.error(`API Error: ${data.response?.header?.resultMsg}`);
    }
    return [];
  } catch (error) {
    console.error(
      `Error fetching data for type ${contentTypeId}, area ${areaCode}:`,
      error,
    );
    return [];
  }
}

function extractCityDistract(addr: string): {
  city: string;
  district: string;
} {
  const parts = addr.split(' ');
  return {
    city: parts[0] || '',
    district: parts[1] || '',
  };
}

async function main() {
  if (!TOUR_API_KEY) {
    console.error('API_KEY not found');
    process.exit(1);
  }
  console.log('Tourism Data seed 구동');

  //Venue와 Region의 User인 SystemUser를 생성
  let systemUser = await prisma.user.findFirst({
    where: { email: 'system@triptags.com' },
  });

  console.log('sytemUser생성');
  if (!systemUser) {
    systemUser = await prisma.user.create({
      data: {
        email: 'system@triptags.com',
        nickname: 'TripTags System',
        provider: 'LOCAL',
        role: 'ADMIN',
        password: 'password-set-for-admin-seed',
      },
    });
    console.log('시스템 유저 생성완료');
  } else {
    console.log('기존 User의 정보를 활용합니다');
  }

  //Category를 기준으로 내부 데이터를 순회
  for (const [contentTypeId, category] of Object.entries(CONTENT_TYPE_MAP)) {
    console.log(`${category} 영역을 불러옵니다`);

    //AREA_CODE를 차례로 해당 Category의 데이터 호출
    for (const area of AREA_CODES) {
      const items = await fetchTourData(contentTypeId, area.code);

      if (items.length === 0) continue;
      console.log(`${area.name}에는 ${items.length}개의 item이 있습니다`);

      //fetch결과에서 x,y좌표
      for (const item of items) {
        if (!item.mapx || !item.mapy) continue;
        console.log('item의 세부내역 : ', item);

        const latitude = parseFloat(item.mapy);
        const longitude = parseFloat(item.mapx);
        const imageList: IVenueImage[] = [];

        if (isNaN(latitude) || isNaN(longitude)) continue;

        if (item.firstimage) {
          imageList.push({
            imageSource: 'TOUR_API',
            imageUrl: item.firstimage,
            isThumbnail: !item.firstimage2,
          });
        }
        if (item.firstimage2) {
          imageList.push({
            imageSource: 'TOUR_API',
            imageUrl: item.firstimage2,
            isThumbnail: true,
          });
        }

        //   const checked = await prisma.venue.findUnique({
        //     where: { tourApiContentId: item.contentid },
        //   });

        //   if (checked) {
        //     totalSkipped++;
        //     continue;
        //   }
        const address = [item.addr1, item.addr2].filter(Boolean).join(' ');
        const { city, district } = extractCityDistract(address);
        const targetCity = city || area.name;
        const targetDistrict = district || area.name;

        try {
          const region = await prisma.region.upsert({
            where: {
              country_city_district: {
                country: 'KR',
                city: targetCity,
                district: targetDistrict,
              },
            },
            update: {},
            create: {
              city: targetCity,
              country: 'KR',
              district: district,
            },
          });
          await prisma.venue.create({
            data: {
              name: { ko: item.title, en: '' },
              venueCategory: category,
              detailedAddress: address || null,
              latitude,
              longitude,
              tourApiContentId: item.contentid,
              regionId: region.id,
              createdBy: systemUser.id,

              venueDetail: {
                create: {
                  description: {
                    ko: `${item.title}에 대한 설명입니다.`,
                    en: '',
                  },
                  phoneNumber: item.tel || null,
                },
              },
            },
          });
        } catch (error) {
          console.error(`${item.title}생성에 실패하였습니다.`, error);
        }
      }
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch((e) => {
    console.error('error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
