const mockUpdateDoc = jest.fn();
const mockDoc = jest.fn();

jest.mock('firebase/firestore', () => ({
  doc:       mockDoc,
  updateDoc: mockUpdateDoc,
  getDoc:    jest.fn(),
  setDoc:    jest.fn(),
  serverTimestamp: jest.fn(() => ({})),
}));

jest.mock('@/lib/firebase', () => ({ db: {}, auth: {} }));

import { becomeDriver } from '@/features/auth/services/userService';

describe('becomeDriver', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUpdateDoc.mockResolvedValue(undefined);
    mockDoc.mockReturnValue('doc-ref');
  });

  it('sets role to driver and status to pending', async () => {
    await becomeDriver('uid-1', 'car');
    const [, updateData] = mockUpdateDoc.mock.calls[0];
    expect(updateData.role).toBe('driver');
    expect(updateData.status).toBe('pending');
  });

  it('stores vehicleType correctly', async () => {
    await becomeDriver('uid-1', 'motorcycle');
    const [, updateData] = mockUpdateDoc.mock.calls[0];
    expect(updateData.vehicleType).toBe('motorcycle');
  });

  it('trims and stores plateNumber when provided', async () => {
    await becomeDriver('uid-1', 'car', '  B-XX 1234  ');
    const [, updateData] = mockUpdateDoc.mock.calls[0];
    expect(updateData.plateNumber).toBe('B-XX 1234');
  });

  it('stores empty string for plateNumber when omitted', async () => {
    await becomeDriver('uid-1', 'bicycle');
    const [, updateData] = mockUpdateDoc.mock.calls[0];
    expect(updateData.plateNumber).toBe('');
  });

  it('includes phone when provided', async () => {
    await becomeDriver('uid-1', 'car', '', '+49 176 123 4567');
    const [, updateData] = mockUpdateDoc.mock.calls[0];
    expect(updateData.phone).toBe('+49 176 123 4567');
  });

  it('omits phone field when not provided', async () => {
    await becomeDriver('uid-1', 'car');
    const [, updateData] = mockUpdateDoc.mock.calls[0];
    expect(updateData.phone).toBeUndefined();
  });

  it('targets the correct Firestore document path', async () => {
    await becomeDriver('uid-abc', 'car');
    expect(mockDoc).toHaveBeenCalledWith({}, 'users', 'uid-abc');
  });
});
