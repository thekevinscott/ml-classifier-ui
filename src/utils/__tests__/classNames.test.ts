import classNames from '../classNames';

describe('classNames', () => {
  test('it handles nothing', () => {
    expect(classNames()).toEqual('');
  });

  test('it handles a single class', () => {
    expect(classNames('foo')).toEqual('foo');
  });

  test('it handles multiple classes', () => {
    expect(classNames('foo', 'bar', 'baz')).toEqual('foo bar baz');
  });

  test('it does not include undefined or null', () => {
    expect(classNames('foo', undefined, null, 'baz')).toEqual('foo baz');
  });

  test('it handles an object where value is true', () => {
    expect(classNames({
      foo: true,
    })).toEqual('foo');
  });

  test('it handles an object where value are true and false', () => {
    expect(classNames({
      foo: true,
      bar: false,
    })).toEqual('foo');
  });

  test('it handles an object where value are true and false', () => {
    expect(classNames('bar', {
      foo: true,
      quom: false,
    }, 'baz')).toEqual('bar foo baz');
  });
});
