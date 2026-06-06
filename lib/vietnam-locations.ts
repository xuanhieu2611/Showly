export type District = { value: string; label: string };
export type Province = { value: string; label: string; districts: District[] };

export const PROVINCES: Province[] = [
  {
    value: "ho-chi-minh",
    label: "TP. Hồ Chí Minh",
    districts: [
      { value: "quan-1", label: "Quận 1" },
      { value: "quan-2", label: "Quận 2 (TP. Thủ Đức)" },
      { value: "quan-3", label: "Quận 3" },
      { value: "quan-4", label: "Quận 4" },
      { value: "quan-5", label: "Quận 5" },
      { value: "quan-6", label: "Quận 6" },
      { value: "quan-7", label: "Quận 7" },
      { value: "quan-8", label: "Quận 8" },
      { value: "quan-9", label: "Quận 9 (TP. Thủ Đức)" },
      { value: "quan-10", label: "Quận 10" },
      { value: "quan-11", label: "Quận 11" },
      { value: "quan-12", label: "Quận 12" },
      { value: "binh-thanh", label: "Bình Thạnh" },
      { value: "go-vap", label: "Gò Vấp" },
      { value: "phu-nhuan", label: "Phú Nhuận" },
      { value: "tan-binh", label: "Tân Bình" },
      { value: "tan-phu", label: "Tân Phú" },
      { value: "binh-tan", label: "Bình Tân" },
      { value: "thu-duc", label: "TP. Thủ Đức" },
      { value: "binh-chanh", label: "Bình Chánh" },
      { value: "can-gio", label: "Cần Giờ" },
      { value: "cu-chi", label: "Củ Chi" },
      { value: "hoc-mon", label: "Hóc Môn" },
      { value: "nha-be", label: "Nhà Bè" },
    ],
  },
  {
    value: "ha-noi",
    label: "Hà Nội",
    districts: [
      { value: "ba-dinh", label: "Ba Đình" },
      { value: "cau-giay", label: "Cầu Giấy" },
      { value: "dong-da", label: "Đống Đa" },
      { value: "ha-dong", label: "Hà Đông" },
      { value: "hai-ba-trung", label: "Hai Bà Trưng" },
      { value: "hoan-kiem", label: "Hoàn Kiếm" },
      { value: "hoang-mai", label: "Hoàng Mai" },
      { value: "long-bien", label: "Long Biên" },
      { value: "nam-tu-liem", label: "Nam Từ Liêm" },
      { value: "tay-ho", label: "Tây Hồ" },
      { value: "thanh-xuan", label: "Thanh Xuân" },
      { value: "bac-tu-liem", label: "Bắc Từ Liêm" },
      { value: "gia-lam", label: "Gia Lâm" },
      { value: "dong-anh", label: "Đông Anh" },
      { value: "soc-son", label: "Sóc Sơn" },
      { value: "thanh-tri", label: "Thanh Trì" },
    ],
  },
  {
    value: "da-nang",
    label: "Đà Nẵng",
    districts: [
      { value: "hai-chau", label: "Hải Châu" },
      { value: "cam-le", label: "Cẩm Lệ" },
      { value: "lien-chieu", label: "Liên Chiểu" },
      { value: "ngu-hanh-son", label: "Ngũ Hành Sơn" },
      { value: "son-tra", label: "Sơn Trà" },
      { value: "thanh-khe", label: "Thanh Khê" },
      { value: "hoa-vang", label: "Hòa Vang" },
    ],
  },
  {
    value: "can-tho",
    label: "Cần Thơ",
    districts: [
      { value: "ninh-kieu", label: "Ninh Kiều" },
      { value: "binh-thuy", label: "Bình Thủy" },
      { value: "o-mon", label: "Ô Môn" },
      { value: "thot-not", label: "Thốt Nốt" },
      { value: "cai-rang", label: "Cái Răng" },
    ],
  },
  {
    value: "hai-phong",
    label: "Hải Phòng",
    districts: [
      { value: "hong-bang", label: "Hồng Bàng" },
      { value: "le-chan", label: "Lê Chân" },
      { value: "ngo-quyen", label: "Ngô Quyền" },
      { value: "hai-an", label: "Hải An" },
      { value: "kien-an", label: "Kiến An" },
    ],
  },
  {
    value: "binh-duong",
    label: "Bình Dương",
    districts: [
      { value: "thu-dau-mot", label: "Thủ Dầu Một" },
      { value: "di-an", label: "Dĩ An" },
      { value: "thuan-an", label: "Thuận An" },
      { value: "ben-cat", label: "Bến Cát" },
      { value: "tan-uyen", label: "Tân Uyên" },
    ],
  },
  {
    value: "dong-nai",
    label: "Đồng Nai",
    districts: [
      { value: "bien-hoa", label: "Biên Hòa" },
      { value: "long-khanh", label: "Long Khánh" },
      { value: "nhon-trach", label: "Nhơn Trạch" },
      { value: "long-thanh", label: "Long Thành" },
    ],
  },
  {
    value: "khanh-hoa",
    label: "Khánh Hòa",
    districts: [
      { value: "nha-trang", label: "Nha Trang" },
      { value: "cam-ranh", label: "Cam Ranh" },
      { value: "ninh-hoa", label: "Ninh Hòa" },
    ],
  },
];

export function getProvinceLabel(value: string): string {
  return PROVINCES.find((p) => p.value === value)?.label ?? value;
}

export function getDistrictLabel(provinceValue: string, districtValue: string): string {
  const province = PROVINCES.find((p) => p.value === provinceValue);
  return province?.districts.find((d) => d.value === districtValue)?.label ?? districtValue;
}

export function getDistricts(provinceValue: string): District[] {
  return PROVINCES.find((p) => p.value === provinceValue)?.districts ?? [];
}
