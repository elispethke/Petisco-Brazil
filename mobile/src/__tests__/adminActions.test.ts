const mockUpdateDoc = jest.fn();
const mockDoc       = jest.fn();
const mockAddDoc    = jest.fn();
const mockGetDoc    = jest.fn();

jest.mock('firebase/firestore', () => ({
  doc:             mockDoc,
  updateDoc:       mockUpdateDoc,
  addDoc:          mockAddDoc,
  getDoc:          mockGetDoc,
  collection:      jest.fn(),
  query:           jest.fn(),
  where:           jest.fn(),
  orderBy:         jest.fn(),
  onSnapshot:      jest.fn(),
  serverTimestamp: jest.fn(() => ({})),
}));

jest.mock('@/lib/firebase', () => ({ db: {}, auth: {} }));

import { updateUserStatus } from '@/features/auth/services/userService';
import { assignDriver, updateOrderStatus } from '@/features/order/services/orderService';

describe('Admin: driver approval', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUpdateDoc.mockResolvedValue(undefined);
    mockDoc.mockReturnValue('doc-ref');
  });

  it('sets status to approved', async () => {
    await updateUserStatus('uid-driver', 'approved');
    const [, data] = mockUpdateDoc.mock.calls[0];
    expect(data.status).toBe('approved');
  });

  it('sets status to blocked', async () => {
    await updateUserStatus('uid-driver', 'blocked');
    const [, data] = mockUpdateDoc.mock.calls[0];
    expect(data.status).toBe('blocked');
  });

  it('targets the correct user document', async () => {
    await updateUserStatus('uid-abc', 'approved');
    expect(mockDoc).toHaveBeenCalledWith({}, 'users', 'uid-abc');
  });
});

describe('Admin: order assignment', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUpdateDoc.mockResolvedValue(undefined);
    mockDoc.mockReturnValue('doc-ref');
  });

  it('sets assignedDriverId and status to accepted', async () => {
    await assignDriver('order-1', 'driver-1');
    const [, data] = mockUpdateDoc.mock.calls[0];
    expect(data.assignedDriverId).toBe('driver-1');
    expect(data.status).toBe('accepted');
  });

  it('throws if orderId is empty', async () => {
    await expect(assignDriver('', 'driver-1')).rejects.toThrow();
  });

  it('throws if driverId is empty', async () => {
    await expect(assignDriver('order-1', '')).rejects.toThrow();
  });

  it('targets the correct order document', async () => {
    await assignDriver('order-xyz', 'driver-xyz');
    expect(mockDoc).toHaveBeenCalledWith({}, 'orders', 'order-xyz');
  });
});

describe('Admin: status transitions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUpdateDoc.mockResolvedValue(undefined);
    mockDoc.mockReturnValue('doc-ref');
  });

  it('can advance order to delivering', async () => {
    await updateOrderStatus('order-1', 'delivering');
    const [, data] = mockUpdateDoc.mock.calls[0];
    expect(data.status).toBe('delivering');
  });

  it('can advance order to delivered', async () => {
    await updateOrderStatus('order-1', 'delivered');
    const [, data] = mockUpdateDoc.mock.calls[0];
    expect(data.status).toBe('delivered');
  });
});
