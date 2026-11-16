"use client";

import * as React from "react";

type SiteImageOverrides = Record<string, string>;
type SiteImageCaptions = Record<string, string>;

const SiteImagesContext = React.createContext<{
  overrides: SiteImageOverrides;
  imageCaptions: SiteImageCaptions;
  brochureUrl: string;
  termsConditionsUrl: string;
  youtubeUrl: string;
}>({
  overrides: {},
  imageCaptions: {},
  brochureUrl: "",
  termsConditionsUrl: "",
  youtubeUrl: "",
});

export function SiteImagesProvider({
  overrides,
  imageCaptions,
  brochureUrl,
  termsConditionsUrl,
  youtubeUrl,
  children,
}: {
  overrides: SiteImageOverrides;
  imageCaptions: SiteImageCaptions;
  brochureUrl: string;
  termsConditionsUrl: string;
  youtubeUrl: string;
  children: React.ReactNode;
}) {
  return (
    <SiteImagesContext.Provider
      value={{
        overrides,
        imageCaptions,
        brochureUrl,
        termsConditionsUrl,
        youtubeUrl,
      }}
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

export function useTermsConditionsUrl() {
  const { termsConditionsUrl } = React.useContext(SiteImagesContext);
  return termsConditionsUrl
    ? "/api/terms-and-conditions"
    : "/Dangracif-Offer-Letter-and-Addendum.pdf";
}
