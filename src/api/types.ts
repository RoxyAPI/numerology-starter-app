/**
 * Type definitions for RoxyAPI Numerology API
 * Auto-generated from OpenAPI schema at https://roxyapi.com/api/v2/numerology/openapi.json
 * 
 * Regenerate with: npm run generate:types
 */

import type { paths, components } from './schema';

// Response types
export type LifePathResponse = paths['/life-path']['post']['responses']['200']['content']['application/json'];
export type ExpressionResponse = paths['/expression']['post']['responses']['200']['content']['application/json'];
export type SoulUrgeResponse = paths['/soul-urge']['post']['responses']['200']['content']['application/json'];
export type PersonalityResponse = paths['/personality']['post']['responses']['200']['content']['application/json'];
export type BirthDayResponse = paths['/birth-day']['post']['responses']['200']['content']['application/json'];
export type MaturityResponse = paths['/maturity']['post']['responses']['200']['content']['application/json'];
export type KarmicLessonsResponse = paths['/karmic-lessons']['post']['responses']['200']['content']['application/json'];
export type KarmicDebtResponse = paths['/karmic-debt']['post']['responses']['200']['content']['application/json'];
export type PersonalYearResponse = paths['/personal-year']['post']['responses']['200']['content']['application/json'];
export type CompatibilityResponse = paths['/compatibility']['post']['responses']['200']['content']['application/json'];
export type ChartResponse = paths['/chart']['post']['responses']['200']['content']['application/json'];
export type NumberMeaningResponse = paths['/meanings/{number}']['get']['responses']['200']['content']['application/json'];

// Request types - requestBody is required, just extract content
export type LifePathRequest = NonNullable<paths['/life-path']['post']['requestBody']>['content']['application/json'];
export type ExpressionRequest = NonNullable<paths['/expression']['post']['requestBody']>['content']['application/json'];
export type SoulUrgeRequest = NonNullable<paths['/soul-urge']['post']['requestBody']>['content']['application/json'];
export type PersonalityRequest = NonNullable<paths['/personality']['post']['requestBody']>['content']['application/json'];
export type BirthDayRequest = NonNullable<paths['/birth-day']['post']['requestBody']>['content']['application/json'];
export type MaturityRequest = NonNullable<paths['/maturity']['post']['requestBody']>['content']['application/json'];
export type KarmicLessonsRequest = NonNullable<paths['/karmic-lessons']['post']['requestBody']>['content']['application/json'];
export type KarmicDebtRequest = NonNullable<paths['/karmic-debt']['post']['requestBody']>['content']['application/json'];
export type PersonalYearRequest = NonNullable<paths['/personal-year']['post']['requestBody']>['content']['application/json'];
export type CompatibilityRequest = NonNullable<paths['/compatibility']['post']['requestBody']>['content']['application/json'];
export type ChartRequest = NonNullable<paths['/chart']['post']['requestBody']>['content']['application/json'];
