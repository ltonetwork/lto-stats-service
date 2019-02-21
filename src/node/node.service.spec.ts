import { Test, TestingModule } from '@nestjs/testing';
import { NodeModuleConfig } from './node.module';
import { NodeService } from './node.service';
import { NodeApiService } from './node-api.service';

describe('NodeService', () => {
  let module: TestingModule;
  let nodeService: NodeService;
  let nodeApiService: NodeApiService;

  function spy() {
    const fakeTransaction = {
      id: 'fake_transaction',
      blockHeight: '1',
      position: '0',
    };

    const node = {
      getNodeWallet: jest.spyOn(nodeService, 'getNodeWallet'),
      getUnconfirmedAnchor: jest.spyOn(nodeService, 'getUnconfirmedAnchor'),
      getNodeStatus: jest.spyOn(nodeService, 'getNodeStatus'),
    };

    const api = {
      getNodeAddresses: jest.spyOn(nodeApiService, 'getNodeAddresses'),
      getUnconfirmedTransactions: jest.spyOn(nodeApiService, 'getUnconfirmedTransactions'),
      getLastBlock: jest.spyOn(nodeApiService, 'getLastBlock'),
      getBlock: jest.spyOn(nodeApiService, 'getBlock'),
      getBlocks: jest.spyOn(nodeApiService, 'getBlocks'),
      getNodeStatus: jest.spyOn(nodeApiService, 'getNodeStatus'),
    };

    return { api, node };
  }

  beforeEach(async () => {
    module = await Test.createTestingModule(NodeModuleConfig).compile();
    await module.init();

    nodeService = module.get<NodeService>(NodeService);
    nodeApiService = module.get<NodeApiService>(NodeApiService);
  });

  afterEach(async () => {
    await module.close();
  });

  describe('getNodeWallet()', () => {
    test('should get the node wallet address', async () => {
      const spies = spy();

      const response = { status: 200, data: ['fake_address'] };
      spies.api.getNodeAddresses.mockImplementation(() => Promise.resolve(response as any));

      expect(await nodeService.getNodeWallet()).toBe(response.data[0]);
      expect(spies.api.getNodeAddresses.mock.calls.length).toBe(1);
    });
  });

  describe('getUnconfirmedAnchor()', () => {
    test('should get the unconfirmed anchor', async () => {
      const spies = spy();

      const response = { status: 200, data: [{ id: 'fake_id', type: 12, data: [{ value: 'base64:fake_hash' }] }] };
      spies.api.getUnconfirmedTransactions.mockImplementation(() => Promise.resolve(response as any));

      expect(await nodeService.getUnconfirmedAnchor('fake_hash')).toBe(response.data[0].id);
      expect(spies.api.getUnconfirmedTransactions.mock.calls.length).toBe(1);
    });
  });

  describe('getLastBlockHeight()', () => {
    test('should get last block height', async () => {
      const spies = spy();

      const response = { status: 200, data: { height: 1 } };
      spies.api.getLastBlock.mockImplementation(() => Promise.resolve(response as any));

      expect(await nodeService.getLastBlockHeight()).toBe(response.data.height);
      expect(spies.api.getLastBlock.mock.calls.length).toBe(1);
    });
  });

  describe('getBlock()', () => {
    test('should get block by id', async () => {
      const spies = spy();

      const response = { status: 200, data: { id: 'fake_id' } };
      spies.api.getBlock.mockImplementation(() => Promise.resolve(response as any));

      expect(await nodeService.getBlock('fake_id')).toBe(response.data);
      expect(spies.api.getBlock.mock.calls.length).toBe(1);
    });
  });

  describe('getBlocks()', () => {
    test('should get blocks by range', async () => {
      const spies = spy();

      const responses = [
        { status: 200, data: [{ height: 1 }, { height: 100 }] },
        { status: 200, data: [{ height: 101 }, { height: 200 }] },
        { status: 200, data: [{ height: 201 }, { height: 300 }] },
        { status: 200, data: [{ height: 301 }, { height: 400 }] },
        { status: 200, data: [{ height: 401 }, { height: 500 }] },
        { status: 200, data: [{ height: 501 }, { height: 555 }] },
      ];

      spies.api.getBlocks
        .mockImplementationOnce(() => responses[0] as any)
        .mockImplementationOnce(() => responses[1] as any)
        .mockImplementationOnce(() => responses[2] as any)
        .mockImplementationOnce(() => responses[3] as any)
        .mockImplementationOnce(() => responses[4] as any)
        .mockImplementationOnce(() => responses[5] as any);

      expect(await nodeService.getBlocks(1, 555)).toEqual([
        { height: 1 }, { height: 100 },
        { height: 101 }, { height: 200 },
        { height: 201 }, { height: 300 },
        { height: 301 }, { height: 400 },
        { height: 401 }, { height: 500 },
        { height: 501 }, { height: 555 },
      ]);
      expect(spies.api.getBlocks.mock.calls.length).toBe(6);
      expect(spies.api.getBlocks.mock.calls)
        .toEqual([[1, 100], [101, 200], [201, 300], [301, 400], [401, 500], [501, 555]]);
    });
  });

  describe('getNodeStatus()', () => {
    it('should return the status data is received', async () => {
      const spies = spy();
      const expectData = {
        status: {
          blockchainHeight: 1,
          stateHeight: 1,
          updatedTimestamp: 1549617037043,
          updatedDate: "2019-02-08T09:10:37.043Z"
        }
      };

      spies.api.getNodeStatus.mockImplementation(() =>  Promise.resolve({ data: expectData } as any));

      expect(await nodeService.getNodeStatus()).toEqual(expectData);
    });
  });

  describe('isNodeHealthy()', () => {
    it('should return true when the node is healthy', async () => {
      const spies = spy();
      spies.node.getNodeStatus.mockImplementation(() =>  Promise.resolve({ blockchainHeight: 1 } as any));

      expect(await nodeService.isNodeHealthy()).toBeTruthy();
    });

    it('should return true when the node is healthy', async () => {
      const spies = spy();
      spies.node.getNodeStatus.mockImplementation(() =>  Promise.resolve({} as any));

      expect(await nodeService.isNodeHealthy()).toBeFalsy();
    });

    it('should return false when the node is not healthy', async () => {
      const spies = spy();
      spies.node.getNodeStatus.mockImplementation(() => { throw new Error(); });

      expect(await nodeService.isNodeHealthy()).toBeFalsy();
    });
  });

  describe('getNodeInfo()', () => {
    it('should return the status data is received', async () => {
      const spies = spy();
      spies.node.getNodeStatus.mockImplementation(() =>  Promise.resolve({ blockchainHeight: 1 } as any));
      spies.node.getNodeWallet.mockImplementation(() =>  'fake_address' as any);

      expect(await nodeService.getNodeInfo()).toEqual({
        status: {
          blockchainHeight: 1
        },
        address: 'fake_address'
      });
    });
  });
});
