"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const TOUR_API_KEY = process.env.TOUR_API_KEY;
const BASE_URL = 'https://apis.data.go.kr/B551011/KorService2';
const CONTENT_TYPE_MAP = {
    '12': 'ATTRACTION',
    '14': 'CULTURE',
    '28': 'ACTIVITY',
    '32': 'HOTEL',
    '38': 'SHOPPING',
    '39': 'RESTAURANT',
};
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
async function fetchTourData(contentTypeId, areaCode, pageNo = 1) {
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
        let data;
        try {
            data = JSON.parse(text);
        }
        catch {
            console.error('Failed to parse JSON:', text.substring(0, 200));
            return [];
        }
        if (contentTypeId === '12' && areaCode === '1') {
            console.log('API Response Sample:', JSON.stringify(data, null, 2).substring(0, 500));
        }
        if (data.response?.body?.items?.item) {
            const items = data.response.body.items.item;
            return Array.isArray(items) ? items : [items];
        }
        if (data.response?.header?.resultCode != '0000') {
            console.error(`API Error: ${data.response?.header?.resultMsg}`);
        }
        return [];
    }
    catch (error) {
        console.error(`Error fetching data for type ${contentTypeId}, area ${areaCode}:`, error);
        return [];
    }
}
function getRegionLevels(addr) {
    const addrInfo = addr.split(' ').filter(Boolean);
    if (!addr || addr.trim() === ' ')
        return null;
    if (addrInfo.length === 0)
        return null;
    const country = 'KR';
    const city = addrInfo[0];
    const district = addrInfo[1];
    console.log('City: ', city, 'District: ', district);
    return [country, city, district].filter(Boolean);
}
async function getOrCreateRegion(levels) {
    let parentId = null;
    for (let i = 0; i < levels.length; i++) {
        const levelName = levels[i];
        const currentLevel = i + 1;
        let region = await prisma.region.findFirst({
            where: {
                name: levelName,
                level: currentLevel,
                parentId: parentId,
            },
        });
        if (!region) {
            region = await prisma.region.create({
                data: {
                    name: levelName,
                    level: currentLevel,
                    parentId: parentId,
                },
            });
        }
        parentId = region.id;
    }
    if (!parentId) {
        throw new Error('Region Id를 생성하는데 실패하였습니다');
    }
    return parentId;
}
async function main() {
    if (!TOUR_API_KEY) {
        console.error('API_KEY not found');
        process.exit(1);
    }
    console.log('Tourism Data seed 구동');
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
    }
    else {
        console.log('기존 User의 정보를 활용합니다');
    }
    for (const [contentTypeId, category] of Object.entries(CONTENT_TYPE_MAP)) {
        console.log(`${category} 영역을 불러옵니다`);
        for (const area of AREA_CODES) {
            const items = await fetchTourData(contentTypeId, area.code);
            if (items.length === 0)
                continue;
            console.log(`${area.name}에는 ${items.length}개의 item이 있습니다`);
            for (const item of items) {
                if (!item.mapx || !item.mapy)
                    continue;
                console.log('item의 세부내역 : ', item);
                const latitude = parseFloat(item.mapy);
                const longitude = parseFloat(item.mapx);
                const imageList = [];
                if (isNaN(latitude) || isNaN(longitude))
                    continue;
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
                const address = [item.addr1, item.addr2].filter(Boolean).join(' ');
                const regionLevels = getRegionLevels(address);
                if (!regionLevels) {
                    console.warn('주소가 없는 데이터는 표시할수 없어 Skip합니다');
                    continue;
                }
                try {
                    const currentRegionId = await getOrCreateRegion(regionLevels);
                    await prisma.venue.create({
                        data: {
                            name: { ko: item.title, en: '' },
                            venueCategory: category,
                            detailedAddress: address || null,
                            latitude,
                            longitude,
                            tourApiContentId: item.contentid,
                            regionId: currentRegionId,
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
                }
                catch (error) {
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
//# sourceMappingURL=seed-tourism.js.map