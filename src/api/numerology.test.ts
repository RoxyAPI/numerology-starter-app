/**
 * Tests for the numerology data layer. `@roxyapi/sdk` is mocked, so these run offline with no real key. They prove every `numerologyApi` method calls the matching SDK method with the spec body shape, unwraps `data`, and turns an SDK `{ error }` result into a thrown message the screens can catch.
 *
 * The mock SDK builds its numerology client once and returns the same instance from every `createRoxy` call, so the test can grab the same `jest.fn` handles the data layer holds. The factory is self-contained to satisfy the `jest.mock` hoisting rule.
 */

import { createRoxy } from '@roxyapi/sdk';

jest.mock('@roxyapi/sdk', () => {
  const numerology = {
    calculateLifePath: jest.fn(),
    generateNumerologyChart: jest.fn(),
    calculatePersonalYear: jest.fn(),
    calculateExpression: jest.fn(),
    calculateSoulUrge: jest.fn(),
    calculateNumCompatibility: jest.fn(),
    getNumberMeaning: jest.fn(),
  };
  return { createRoxy: () => ({ numerology }) };
});

import { numerologyApi } from './numerology';

const mockNumerology = createRoxy('test-key').numerology as unknown as Record<string, jest.Mock>;

const ok = <T>(data: T) => ({ data, error: undefined });

beforeEach(() => {
  for (const fn of Object.values(mockNumerology)) fn.mockReset();
});

describe('numerologyApi success paths', () => {
  it('getLifePath forwards the birth date in the body', async () => {
    mockNumerology.calculateLifePath.mockResolvedValue(ok({ number: 7, type: 'single', meaning: { title: 'The Seeker' } }));
    const result = await numerologyApi.getLifePath({ year: 1990, month: 7, day: 15 });
    expect(mockNumerology.calculateLifePath).toHaveBeenCalledWith({ body: { year: 1990, month: 7, day: 15 } });
    expect(result.number).toBe(7);
  });

  it('getChart forwards name and date in the body', async () => {
    mockNumerology.generateNumerologyChart.mockResolvedValue(ok({ profile: { name: 'Jane Smith' }, coreNumbers: {} }));
    const chart = await numerologyApi.getChart({ fullName: 'Jane Smith', year: 1990, month: 7, day: 15 });
    expect(mockNumerology.generateNumerologyChart).toHaveBeenCalledWith({
      body: { fullName: 'Jane Smith', year: 1990, month: 7, day: 15 },
    });
    expect(chart.profile.name).toBe('Jane Smith');
  });

  it('getPersonalYear forwards month, day, and year', async () => {
    mockNumerology.calculatePersonalYear.mockResolvedValue(ok({ personalYear: 3, theme: 'Expansion' }));
    const pyear = await numerologyApi.getPersonalYear({ month: 7, day: 15, year: 2026 });
    expect(mockNumerology.calculatePersonalYear).toHaveBeenCalledWith({ body: { month: 7, day: 15, year: 2026 } });
    expect(pyear.personalYear).toBe(3);
  });

  it('getExpression forwards the full name', async () => {
    mockNumerology.calculateExpression.mockResolvedValue(ok({ number: 5 }));
    const expr = await numerologyApi.getExpression({ fullName: 'John Smith' });
    expect(mockNumerology.calculateExpression).toHaveBeenCalledWith({ body: { fullName: 'John Smith' } });
    expect(expr.number).toBe(5);
  });

  it('getSoulUrge forwards the full name', async () => {
    mockNumerology.calculateSoulUrge.mockResolvedValue(ok({ number: 9 }));
    await numerologyApi.getSoulUrge({ fullName: 'John Smith' });
    expect(mockNumerology.calculateSoulUrge).toHaveBeenCalledWith({ body: { fullName: 'John Smith' } });
  });

  it('getCompatibility forwards both people in the body', async () => {
    mockNumerology.calculateNumCompatibility.mockResolvedValue(ok({ overallScore: 82, rating: 'Strong' }));
    const body = { person1: { lifePath: 7 }, person2: { lifePath: 3 } };
    const compat = await numerologyApi.getCompatibility(body);
    expect(mockNumerology.calculateNumCompatibility).toHaveBeenCalledWith({ body });
    expect(compat.overallScore).toBe(82);
  });

  it('getNumberMeaning forwards the number as a string path param', async () => {
    mockNumerology.getNumberMeaning.mockResolvedValue(ok({ number: 11, meaning: { title: 'The Intuitive' } }));
    const meaning = await numerologyApi.getNumberMeaning(11);
    expect(mockNumerology.getNumberMeaning).toHaveBeenCalledWith({ path: { number: '11' } });
    expect(meaning.number).toBe(11);
  });
});

describe('numerologyApi error paths', () => {
  it('throws when the SDK returns an error result', async () => {
    mockNumerology.calculateLifePath.mockResolvedValue({ data: undefined, error: { error: 'boom', code: 'internal_error' } });
    await expect(numerologyApi.getLifePath({ year: 1990, month: 7, day: 15 })).rejects.toThrow(
      'Failed to calculate Life Path number',
    );
  });

  it('throws when the SDK returns no data', async () => {
    mockNumerology.getNumberMeaning.mockResolvedValue({ data: undefined, error: undefined });
    await expect(numerologyApi.getNumberMeaning(7)).rejects.toThrow('Failed to fetch number meaning');
  });
});
