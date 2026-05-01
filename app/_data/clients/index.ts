import type { ClientFixture } from "./types";
import { atlasAthletic } from "./atlas-athletic";
import { veniceGym } from "./venice-gym";

export const CLIENTS: Record<string, ClientFixture> = {
  [atlasAthletic.slug]: atlasAthletic,
  [veniceGym.slug]: veniceGym,
};

export const DEFAULT_CLIENT_SLUG = atlasAthletic.slug;

export function getClient(slug: string | undefined): ClientFixture {
  if (!slug) return CLIENTS[DEFAULT_CLIENT_SLUG];
  return CLIENTS[slug] ?? CLIENTS[DEFAULT_CLIENT_SLUG];
}

export type { ClientFixture, ScenarioEvent, Channel, Side } from "./types";
