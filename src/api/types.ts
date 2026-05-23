/**
 * Numerology response types, re-exported from `@roxyapi/sdk` so the screens import stable names without depending on the SDK's path-based type names. The SDK ships these types from the same OpenAPI spec the API serves, so they cannot drift from the live responses.
 */

export type {
  PostNumerologyLifePathResponse as LifePathResponse,
  PostNumerologyChartResponse as ChartResponse,
  PostNumerologyPersonalYearResponse as PersonalYearResponse,
  PostNumerologyExpressionResponse as ExpressionResponse,
  PostNumerologySoulUrgeResponse as SoulUrgeResponse,
  PostNumerologyCompatibilityResponse as CompatibilityResponse,
  GetNumerologyMeaningsByNumberResponse as NumberMeaningResponse,
} from '@roxyapi/sdk';
