import functionToTest from '../src/js/index'

test('functionToTest', () => {
  expect(functionToTest(1)).toEqual(2)
  expect(functionToTest('a')).toEqual('a1')
})
