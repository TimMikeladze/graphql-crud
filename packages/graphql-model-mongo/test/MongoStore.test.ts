import mongoist from 'mongoist';
import {
  MongoStore,
} from '../src';

describe('MongoStore', () => {
  const mongo = new MongoStore({
    connection: 'mongodb://localhost/graphql-model-mongo',
  });

  beforeEach(async () => {
    await mongo.db.dropDatabase();
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

  describe('find one', () => {
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
          id: 'xxxxxxxxxxxx',
        },
        type: {
          name: 'Foo',
        } as any,
      });
      expect(res).toBeNull();
    });
  });

  describe('find many', () => {
    it('can find many', async () => {
      await mongo.create({
        data: {
          name: 'foo',
        },
        type: {
          name: 'Foo',
        } as any,
      });

      await mongo.create({
        data: {
          name: 'foo',
        },
        type: {
          name: 'Foo',
        } as any,
      });

      const res = await mongo.find({
        where: {

        },
        type: {
          name: 'Foo',
        } as any,
      });

      expect(res[0]).toMatchObject({
        name: 'foo',
      });

      expect(res[1]).toMatchObject({
        name: 'foo',
      });

      expect(res).toHaveLength(2);
    });
    it('returns empty array if not found', async () => {
      const res = await mongo.find({
        where: {
          id: 'xxxxxxxxxxxx',
        },
        type: {
          name: 'Foo',
        } as any,
      });
      expect(res).toHaveLength(0);
    });
  });

  describe('update', () => {
    it('updates existing', async () => {
      const { id } = await mongo.create({
        data: {
          name: 'foo',
        },
        type: {
          name: 'Foo',
        } as any,
      });

      const res = await mongo.update({
        where: {
          id,
        },
        data: {
          name: 'foo2',
        },
        type: {
          name: 'Foo',
        } as any,
      });

      expect(res).toBe(true);

      const found = await mongo.findOne({
        where: {
          id,
        },
        type: {
          name: 'Foo',
        } as any,
      });

      expect(found).toMatchObject({
        id: mongoist.ObjectId(id),
        name: 'foo2',
      });
    });
    it('returns false if no matches', async () => {
      await mongo.create({
        data: {
          name: 'foo',
        },
        type: {
          name: 'Foo',
        } as any,
      });

      const res = await mongo.update({
        where: {
          name: 'foo2',
        },
        data: {
          name: 'foo2',
        },
        type: {
          name: 'Foo',
        } as any,
      });

      expect(res).toBe(false);
    });
  });
});
