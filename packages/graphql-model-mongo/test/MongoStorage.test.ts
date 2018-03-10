import mongoist from 'mongoist';
import {
  MongoStorage,
} from '../src';

describe('MongoStorage', () => {
  const mongo = new MongoStorage({
    connection: 'mongodb://localhost/test',
  });

  describe('create', () => {
    it('can create', async () => {
      const res = await mongo.create({
        data: {
          name: 'foo',
        },
        type: {
          name: 'Foo',
        } as any,
      });

      expect(res).toMatchObject({
        id: expect.any(mongoist.ObjectId),
        name: 'foo',
      });
    });
  });

  describe('find', () => {
    it('can find one', async () => {
      const { id } = await mongo.create({
        data: {
          name: 'foo',
        },
        type: {
          name: 'Foo',
        } as any,
      });

      const res = await mongo.findOne({
        where: {
          id,
        },
        type: {
          name: 'Foo',
        } as any,
      });

      expect(res).toMatchObject({
        id: mongoist.ObjectId(id),
        name: 'foo',
      });
    });
    it('returns null if not found', async () => {
      const res = await mongo.findOne({
        where: {
          id: 'does not exist',
        },
        type: {
          name: 'Foo',
        } as any,
      });
      expect(res).toBeNull();
    });
  });
});
