// Central data source for waste categories and pricing.
// Extensible: add subcategory, pricing tiers, etc. later without touching
// the pages that consume this list.

export const WASTE_TYPES = [
  {
    id: 'plastic',
    name: 'ขวดพลาสติก',
    unit: 'kg',
    purchasePrice: 10,
    salePrice: 12,
    subcategories: [], // reserved for future use
  },
  {
    id: 'paper',
    name: 'กระดาษ',
    unit: 'kg',
    purchasePrice: 8,
    salePrice: 10,
    subcategories: [],
  },
  {
    id: 'can',
    name: 'กระป๋อง',
    unit: 'kg',
    purchasePrice: 15,
    salePrice: 18,
    subcategories: [],
  },
  {
    id: 'glass',
    name: 'ขวดแก้ว',
    unit: 'kg',
    purchasePrice: 3,
    salePrice: 5,
    subcategories: [],
  },
  {
    id: 'metal',
    name: 'โลหะ',
    unit: 'kg',
    purchasePrice: 20,
    salePrice: 25,
    subcategories: [],
  },
];

export const getWasteType = (id) => WASTE_TYPES.find((w) => w.id === id);

export const INVENTORY_STATUS = {
  IN_STOCK: 'มีสินค้า',
  LOW: 'เหลือน้อย',
  OUT: 'หมด',
};

export function getInventoryStatus(quantity) {
  if (quantity <= 0) return INVENTORY_STATUS.OUT;
  if (quantity <= 10) return INVENTORY_STATUS.LOW;
  return INVENTORY_STATUS.IN_STOCK;
}

export const MOCK_BUYERS = ['ร้านรับซื้อ A', 'ร้านรับซื้อ B', 'บริษัทรีไซเคิล C'];

export const EXPENSE_CATEGORIES = [
  'วัสดุและอุปกรณ์',
  'ค่าเดินทาง',
  'ค่าดำเนินงาน',
  'อื่น ๆ',
];
