import { createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import {
  INITIAL_MEMBERS,
  INITIAL_TRANSACTIONS,
  INITIAL_EXPENSES,
} from '../data/mockData';
import { WASTE_TYPES, getWasteType, MOCK_BUYERS } from '../data/wasteTypes';
import { nextMemberId, nextEntityId } from '../utils/idGenerator';
import { todayIso } from '../utils/format';

const STORAGE_KEY = 'watebank_prototype_data_v1';

// Backward compatibility: any member record (old localStorage data or old
// mock data) that predates memberType/studentId/gradeLevel gets safe
// defaults here. Nothing about member.id is ever touched, so existing
// transaction.memberId references keep matching.
function normalizeMember(member) {
  const memberType = member.memberType === 'student' ? 'student' : 'community';
  return {
    ...member,
    memberType,
    studentId: memberType === 'student' ? member.studentId ?? null : null,
    gradeLevel: memberType === 'student' ? member.gradeLevel ?? null : null,
  };
}

function normalizeMembers(members) {
  return (members || []).map(normalizeMember);
}

function loadInitialState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...parsed, members: normalizeMembers(parsed.members) };
    }
  } catch (err) {
    console.warn('ไม่สามารถโหลดข้อมูลจาก LocalStorage ได้', err);
  }
  return {
    members: normalizeMembers(INITIAL_MEMBERS),
    transactions: INITIAL_TRANSACTIONS,
    expenses: INITIAL_EXPENSES,
  };
}

function getMemberBalanceFromTx(transactions, memberId) {
  return transactions
    .filter((t) => t.memberId === memberId)
    .reduce((sum, t) => sum + (t.credit || 0) - (t.debit || 0), 0);
}

export function validateDataAction(state, action) {
  switch (action.type) {
    case 'ADD_MEMBER': {
      const { name, phone, memberType, studentId, gradeLevel } = action.payload;
      const nameValid = typeof name === 'string' && name.trim() !== '';
      const phoneValid = typeof phone === 'string' && phone.trim() !== '';
      const memberTypeValid = memberType === 'student' || memberType === 'community';

      if (!nameValid || !phoneValid || !memberTypeValid) {
        return 'ข้อมูลสมาชิกไม่ถูกต้อง';
      }

      if (memberType === 'student') {
        const studentIdValid = typeof studentId === 'string' && studentId.trim() !== '';
        const gradeLevelValid = typeof gradeLevel === 'string' && gradeLevel.trim() !== '';
        if (!studentIdValid || !gradeLevelValid) {
          return 'กรุณากรอกรหัสนักเรียนและระดับชั้น';
        }
      }

      return '';
    }

    case 'ADD_PURCHASE': {
      const { memberId, items } = action.payload;
      const memberExists = state.members.some((member) => member.id === memberId);
      const itemsValid =
        Array.isArray(items) &&
        items.length > 0 &&
        items.every(
          (item) =>
            item &&
            getWasteType(item.wasteTypeId) &&
            Number.isFinite(Number(item.quantity)) &&
            Number(item.quantity) > 0
        );

      return !memberExists || !itemsValid ? 'ข้อมูลการรับซื้อไม่ถูกต้อง' : '';
    }

    case 'ADD_SALE': {
      const { buyer, wasteTypeId, quantity } = action.payload;
      const wasteType = getWasteType(wasteTypeId);
      const quantityValid = Number.isFinite(Number(quantity)) && Number(quantity) > 0;
      const buyerValid = MOCK_BUYERS.includes(buyer);

      if (!wasteType || !quantityValid || !buyerValid) {
        return 'ข้อมูลการขายไม่ถูกต้อง';
      }

      const currentStock = selectStockFor(state, wasteTypeId);
      if (Number(quantity) > currentStock) {
        return 'จำนวนที่ขายมากกว่าสินค้าคงเหลือ';
      }

      return '';
    }

    case 'ADD_WITHDRAWAL': {
      const { memberId, amount } = action.payload;
      const memberExists = state.members.some((member) => member.id === memberId);
      const amountValid = Number.isFinite(Number(amount)) && Number(amount) > 0;
      const currentBalance = getMemberBalanceFromTx(state.transactions, memberId);

      if (Number(amount) > currentBalance) {
        return 'จำนวนเงินที่ถอนเกินยอดเงินคงเหลือ';
      }

      return !memberExists || !amountValid
        ? 'ข้อมูลการถอนเงินไม่ถูกต้อง'
        : '';
    }

    case 'ADD_EXPENSE': {
      const { category, description, amount, date } = action.payload;
      const dateValid =
        typeof date === 'string' &&
        date.trim() !== '' &&
        !Number.isNaN(new Date(`${date}T00:00:00`).getTime());
      const categoryValid = typeof category === 'string' && category.trim() !== '';
      const descriptionValid = typeof description === 'string' && description.trim() !== '';
      const amountValid = Number.isFinite(Number(amount)) && Number(amount) > 0;

      return !dateValid || !categoryValid || !descriptionValid || !amountValid
        ? 'ข้อมูลค่าใช้จ่ายไม่ถูกต้อง'
        : '';
    }

    default:
      return '';
  }
}

function reducer(state, action) {
  switch (action.type) {
    case 'ADD_MEMBER': {
      const validationError = validateDataAction(state, action);
      if (validationError) {
        throw new Error(validationError);
      }

      const id = nextMemberId(state.members);
      const memberType = action.payload.memberType === 'student' ? 'student' : 'community';
      const member = {
        id,
        name: action.payload.name,
        phone: action.payload.phone,
        memberType,
        studentId: memberType === 'student' ? action.payload.studentId : null,
        gradeLevel: memberType === 'student' ? action.payload.gradeLevel : null,
      };
      return { ...state, members: [...state.members, member] };
    }
    case 'ADD_PURCHASE': {
      // payload: { memberId, items: [{ wasteTypeId, quantity }] }
      const validationError = validateDataAction(state, action);
      if (validationError) {
        throw new Error(validationError);
      }

      const { memberId, items } = action.payload;
      const reference = nextEntityId('PUR-', collectRefs(state.transactions, 'PUR-'));
      let runningBalance = getMemberBalanceFromTx(state.transactions, memberId);
      const date = todayIso();
      const newTx = items.map((item) => {
        const wasteType = getWasteType(item.wasteTypeId);
        const amount = Number(item.quantity) * wasteType.purchasePrice;
        runningBalance += amount;
        return {
          id: null, // real sequential id assigned below via assignSequentialIds
          type: 'purchase',
          date,
          memberId,
          wasteTypeId: item.wasteTypeId,
          description: `รับซื้อ${wasteType.name}`,
          quantity: Number(item.quantity),
          unit: wasteType.unit,
          pricePerUnit: wasteType.purchasePrice,
          amount,
          credit: amount,
          debit: 0,
          balanceAfter: runningBalance,
          reference,
        };
      });
      // ensure unique sequential ids even within same batch
      const withUniqueIds = assignSequentialIds(state.transactions, newTx);
      return { ...state, transactions: [...state.transactions, ...withUniqueIds] };
    }
    case 'ADD_SALE': {
      const validationError = validateDataAction(state, action);
      if (validationError) {
        throw new Error(validationError);
      }

      const { buyer, wasteTypeId, quantity } = action.payload;
      const wasteType = getWasteType(wasteTypeId);
      const amount = Number(quantity) * wasteType.salePrice;
      const reference = nextEntityId('SALE-', collectRefs(state.transactions, 'SALE-'));
      const tx = {
        id: nextEntityId('TX', state.transactions),
        type: 'sale',
        date: todayIso(),
        memberId: null,
        wasteTypeId,
        description: `ขาย${wasteType.name}ให้${buyer}`,
        buyer,
        quantity: Number(quantity),
        unit: wasteType.unit,
        pricePerUnit: wasteType.salePrice,
        amount,
        credit: 0,
        debit: 0,
        balanceAfter: null,
        reference,
      };
      return { ...state, transactions: [...state.transactions, tx] };
    }
    case 'ADD_WITHDRAWAL': {
      const validationError = validateDataAction(state, action);
      if (validationError) {
        throw new Error(validationError);
      }

      const { memberId, amount } = action.payload;
      const currentBalance = getMemberBalanceFromTx(state.transactions, memberId);
      const reference = nextEntityId('WD-', collectRefs(state.transactions, 'WD-'));
      const tx = {
        id: nextEntityId('TX', state.transactions),
        type: 'withdrawal',
        date: todayIso(),
        memberId,
        wasteTypeId: null,
        description: 'ถอนเงินสด',
        quantity: null,
        unit: null,
        pricePerUnit: null,
        amount: Number(amount),
        credit: 0,
        debit: Number(amount),
        balanceAfter: currentBalance - Number(amount),
        reference,
      };
      return { ...state, transactions: [...state.transactions, tx] };
    }
    case 'ADD_EXPENSE': {
      const validationError = validateDataAction(state, action);
      if (validationError) {
        throw new Error(validationError);
      }

      const { category, description, amount, date } = action.payload;
      const expense = {
        id: nextEntityId('EX', state.expenses),
        date,
        category,
        description,
        amount: Number(amount),
      };
      return { ...state, expenses: [...state.expenses, expense] };
    }
    case 'RESET_DATA': {
      return {
        members: normalizeMembers(INITIAL_MEMBERS),
        transactions: INITIAL_TRANSACTIONS,
        expenses: INITIAL_EXPENSES,
      };
    }
    default:
      return state;
  }
}

// Helpers used only inside the reducer above -------------------------------
function collectRefs(transactions, prefix) {
  return transactions
    .filter((t) => t.reference && t.reference.startsWith(prefix))
    .map((t) => ({ id: t.reference }));
}

function assignSequentialIds(existingTransactions, newTxDrafts) {
  let pool = [...existingTransactions];
  return newTxDrafts.map((draft) => {
    const id = nextEntityId('TX', pool);
    const withId = { ...draft, id };
    pool = [...pool, withId];
    return withId;
  });
}

const DataStateContext = createContext(null);
const DataDispatchContext = createContext(null);

export function DataProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadInitialState);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (err) {
      console.warn('ไม่สามารถบันทึกข้อมูลลง LocalStorage ได้', err);
    }
  }, [state]);

  const value = useMemo(() => ({ state, dispatch }), [state]);

  return (
    <DataStateContext.Provider value={value}>
      <DataDispatchContext.Provider value={dispatch}>
        {children}
      </DataDispatchContext.Provider>
    </DataStateContext.Provider>
  );
}

export function useDataStore() {
  const ctx = useContext(DataStateContext);
  if (!ctx) throw new Error('useDataStore ต้องถูกใช้ภายใน DataProvider');
  return ctx;
}

// ---------------------------------------------------------------------------
// Derived selectors. All numbers on every page should flow through these so
// the same transaction list always produces the same answer everywhere.
// ---------------------------------------------------------------------------

export function selectMemberBalance(state, memberId) {
  return getMemberBalanceFromTx(state.transactions, memberId);
}

export function selectMembersWithBalance(state) {
  return state.members.map((m) => ({
    ...m,
    balance: selectMemberBalance(state, m.id),
  }));
}

export function selectMemberTransactions(state, memberId) {
  return state.transactions
    .filter((t) => t.memberId === memberId)
    .slice()
    .sort((a, b) => new Date(b.date) - new Date(a.date));
}

export function selectRecentTransactions(state, limit = 8) {
  return state.transactions
    .slice()
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, limit);
}

export function selectInventory(state) {
  return WASTE_TYPES.map((wasteType) => {
    const purchased = state.transactions
      .filter(
        (t) =>
          t.type === 'purchase' &&
          t.wasteTypeId === wasteType.id
      )
      .reduce((sum, t) => sum + (t.quantity || 0), 0);

    const sold = state.transactions
      .filter(
        (t) =>
          t.type === 'sale' &&
          t.wasteTypeId === wasteType.id
      )
      .reduce((sum, t) => sum + (t.quantity || 0), 0);

    return {
      ...wasteType,
      quantity: purchased - sold,
    };
  });
}

export function selectStockFor(state, wasteTypeId) {
  const inventory = selectInventory(state);
  const item = inventory.find((i) => i.id === wasteTypeId);
  return item ? item.quantity : 0;
}

export function selectTotals(state) {
  const totalPurchaseQuantity = state.transactions
    .filter((t) => t.type === 'purchase' && !t.isOpeningStock)
    .reduce((sum, t) => sum + (t.quantity || 0), 0);

  const totalPurchaseValue = state.transactions
    .filter((t) => t.type === 'purchase' && !t.isOpeningStock)
    .reduce((sum, t) => sum + (t.amount || 0), 0);

  const totalSalesValue = state.transactions
    .filter((t) => t.type === 'sale')
    .reduce((sum, t) => sum + (t.amount || 0), 0);

  const totalExpenses = state.expenses.reduce(
    (sum, e) => sum + (e.amount || 0),
    0
  );

  return {
    memberCount: state.members.length,
    totalPurchaseQuantity,
    totalPurchaseValue,
    totalSalesValue,
    totalExpenses,
    totalStock: selectInventory(state).reduce(
      (sum, i) => sum + i.quantity,
      0
    ),
  };
}

export function selectExpensesSorted(state) {
  return state.expenses
    .slice()
    .sort((a, b) => new Date(b.date) - new Date(a.date));
}
