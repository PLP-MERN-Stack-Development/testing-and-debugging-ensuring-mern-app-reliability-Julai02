import { add, multiply } from '../../utils/calc';

describe('calc util', () => {
  it('adds two numbers', () => {
    expect(add(1, 2)).toBe(3);
  });

  it('multiplies two numbers', () => {
    expect(multiply(2, 3)).toBe(6);
  });
});
