const { sqlForPartialUpdate } = require('./sql');

describe('Test sqlForPartialUpdate', () => {
  test('Returns update object', () => {
    const dataToUpdate = {
      username: 'john123',
      firstName: 'John',
      lastName: 'Smith',
    };
    const jsToSql = {
      firstName: 'first_name',
      lastName: 'last_name',
      isAdmin: 'is_admin',
    };
    const results = sqlForPartialUpdate(dataToUpdate, jsToSql);
    expect(results.setCols).toBe(
      '"username"=$1, "first_name"=$2, "last_name"=$3'
    );
    expect(results.values).toEqual(['john123', 'John', 'Smith']);
    expect(results).toEqual({
      setCols: '"username"=$1, "first_name"=$2, "last_name"=$3',
      values: ['john123', 'John', 'Smith'],
    });
  });
});
