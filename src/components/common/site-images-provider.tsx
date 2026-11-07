"use client";

import * as React from "react";

type SiteImageOverrides = Record<string, string>;
type SiteImageCaptions = Record<string, string>;

const SiteImagesContext = React.createContext<{
  overrides: SiteImageOverrides;
  imageCaptions: SiteImageCaptions;
  brochureUrl: string;
  youtubeUrl: string;
}>({ overrides: {}, imageCaptions: {}, brochureUrl: "", youtubeUrl: "" });

export function SiteImagesProvider({
  overrides,
  imageCaptions,
  brochureUrl,
  youtubeUrl,
  children,
}: {
  overrides: SiteImageOverrides;
  imageCaptions: SiteImageCaptions;
  brochureUrl: string;
  youtubeUrl: string;
  children: React.ReactNode;
}) {
  return (
    <SiteImagesContext.Provider
      value={{ overrides, imageCaptions, brochureUrl, youtubeUrl }}
    >
      {children}
    </SiteImagesContext.Provider>
  );
}

export function useSiteImage(src: string) {
  const { overrides } = React.useContext(SiteImagesContext);
  return overrides[src] || src;
}

export function useSiteImageResolver() {
  const { overrides } = React.useContext(SiteImagesContext);
  return React.useCallback(
    (src: string) => overrides[src] || src,
    [overrides]
  );
}

export function useSiteImageCaptionResolver() {
  const { imageCaptions } = React.useContext(SiteImagesContext);
  return React.useCallback(
    (src: string, fallback: string) => imageCaptions[src] ?? fallback,
    [imageCaptions]
  );
}

export function useBrochureUrl() {
  const { brochureUrl } = React.useContext(SiteImagesContext);
  return brochureUrl
    ? "/api/brochure"
    : "/downloads/fidelis-court-brochure.pdf";
}

export function useYoutubeUrl() {
  return React.useContext(SiteImagesContext).youtubeUrl;
}
