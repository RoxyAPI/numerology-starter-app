import { roxy } from './client';
import type {
  PostNumerologyLifePathData,
  PostNumerologyLifePathResponse,
  PostNumerologyChartData,
  PostNumerologyChartResponse,
  PostNumerologyPersonalYearData,
  PostNumerologyPersonalYearResponse,
  PostNumerologyExpressionData,
  PostNumerologyExpressionResponse,
  PostNumerologySoulUrgeData,
  PostNumerologySoulUrgeResponse,
  PostNumerologyCompatibilityData,
  PostNumerologyCompatibilityResponse,
  GetNumerologyMeaningsByNumberResponse,
} from '@roxyapi/sdk';

type SdkResult<T> = { data?: T; error?: unknown };

/**
 * Unwrap a Roxy SDK result, returning `data` or throwing a screen-friendly message. The SDK never throws on a non-2xx response: it returns `{ data, error }`, so every call site funnels through here to turn an error into one thrown `Error` the screens can catch.
 */
const unwrap = <T>(result: SdkResult<T>, message: string): T => {
  if (result.error || !result.data) throw new Error(message);
  return result.data;
};

/** Body shapes for the numerology calls. Pulled from the SDK request types so the screens cannot drift from the spec. */
export type LifePathRequest = NonNullable<PostNumerologyLifePathData['body']>;
export type ChartRequest = NonNullable<PostNumerologyChartData['body']>;
export type PersonalYearRequest = NonNullable<PostNumerologyPersonalYearData['body']>;
export type ExpressionRequest = NonNullable<PostNumerologyExpressionData['body']>;
export type SoulUrgeRequest = NonNullable<PostNumerologySoulUrgeData['body']>;
export type CompatibilityRequest = NonNullable<PostNumerologyCompatibilityData['body']>;

export const numerologyApi = {
  getLifePath: async (body: LifePathRequest): Promise<PostNumerologyLifePathResponse> =>
    unwrap(await roxy.numerology.calculateLifePath({ body }), 'Failed to calculate Life Path number'),

  getChart: async (body: ChartRequest): Promise<PostNumerologyChartResponse> =>
    unwrap(await roxy.numerology.generateNumerologyChart({ body }), 'Failed to generate numerology chart'),

  getPersonalYear: async (body: PersonalYearRequest): Promise<PostNumerologyPersonalYearResponse> =>
    unwrap(await roxy.numerology.calculatePersonalYear({ body }), 'Failed to calculate Personal Year'),

  getExpression: async (body: ExpressionRequest): Promise<PostNumerologyExpressionResponse> =>
    unwrap(await roxy.numerology.calculateExpression({ body }), 'Failed to calculate Expression number'),

  getSoulUrge: async (body: SoulUrgeRequest): Promise<PostNumerologySoulUrgeResponse> =>
    unwrap(await roxy.numerology.calculateSoulUrge({ body }), 'Failed to calculate Soul Urge number'),

  getCompatibility: async (body: CompatibilityRequest): Promise<PostNumerologyCompatibilityResponse> =>
    unwrap(await roxy.numerology.calculateNumCompatibility({ body }), 'Failed to calculate compatibility'),

  getNumberMeaning: async (number: number): Promise<GetNumerologyMeaningsByNumberResponse> =>
    unwrap(
      await roxy.numerology.getNumberMeaning({ path: { number: String(number) } }),
      'Failed to fetch number meaning',
    ),
};
