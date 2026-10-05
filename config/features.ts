/**
 * Feature flag helper.
 *
 * Usage:
 *   import { isEnabled } from "@/config/features";
 *   if (isEnabled("portfolio")) { ... }
 *
 * A feature is enabled when it is set to `true` in siteConfig.features.
 * Note: `feature` is a free string, so a key that is not in siteConfig.features
 * silently returns false. Only use keys that exist in config/site.ts.
 */

import { siteConfig } from "./site";

type FeatureKey = keyof typeof siteConfig.features;

export function isEnabled(feature: string): boolean {
  return siteConfig.features[feature as FeatureKey] === true;
}
