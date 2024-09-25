import { joinURL, encodeQueryItem } from "ufo";
import type { ProviderGetImage } from "@nuxt/image";
import { createOperationsGenerator } from "#image";

const operationsGenerator = createOperationsGenerator({
  keyMap: {
    width: "w",
    height: "h",
    dpr: "dpr",
    fit: "fit",
    gravity: "g",
    quality: "q",
    format: "f",
    sharpen: "sharpen"
  },
  valueMap: {
    fit: {
      cover: "cover",
      contain: "contain",
      fill: "scale-down",
      outside: "crop",
      inside: "pad"
    },
    gravity: {
      auto: "auto",
      side: "side"
    }
  },
  joinWith: ",",
  formatter: (key: string, val: string) => encodeQueryItem(key, val)
});

export const getImage: ProviderGetImage = (src, { modifiers = {} } = {}) => {
  const operations = operationsGenerator(modifiers);

  return {
    url: joinURL(src + (operations ? "/" + operations : ""))
  };
};
