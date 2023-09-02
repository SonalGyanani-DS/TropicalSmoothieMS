import PhoneNumber from "libphonenumber-js";
const constant = {  
  originalSite: "https://www.tropicalsmoothiecafe.com/",
  radius: 50,
  slugify(slugString: string) {
    slugString.toLowerCase().toString();
    // eslint-disable-next-line no-useless-escape
    slugString = slugString.replace(/[&\/\\#^+()$~%.'":*?<>{}!@]/g, "");
    slugString = slugString.replaceAll("  ", "-");
    slugString = slugString.replaceAll(" ", "-");
    return slugString.toLowerCase();
  },
  formattedNumber(MobileNumber: string) {
    return new PhoneNumber(MobileNumber).formatNational();
  },
  metersToMiles: (meters: number) => {
    const miles = meters * 0.000621371;
    return Math.round(miles);
  },
  metersToMilesDecimal: (meters: number) => {
    const miles = meters * 0.000621371;
    return Math.round(miles);
  },
  convertToRtf(rtf: string) {
    rtf = rtf.replace(/\\par[d]?/g, "");
    rtf = rtf.replace(
      /\{\*?\\[^{}]+}|[{}]|\\\n?[A-Za-z]+\n?(?:-?\d+)?[ ]?/g,
      ""
    );
    rtf = rtf.replace("/", "");
    rtf = rtf.replace(";", "");
    rtf = rtf.replace("-", "");
    return rtf.replace(/\\'[0-9a-zA-Z]{2}/g, "").trim();
  },
  updateParamradius(radius: number) {
    const searchParams = new URLSearchParams(window.location.search);
    const r: number = constant.metersToMilesDecimal(radius);
    searchParams.set("r", r.toString());
    const newUrl =
      window.location.protocol +
      "//" +
      window.location.host +
      window.location.pathname +
      "?" +
      searchParams.toString();
    window.history.replaceState({}, "", newUrl);
  },
  addFilterParams(features: string) {
    const searchParams = new URLSearchParams(window.location.search);
    const searchFeatures = searchParams.getAll("features");
    if (searchFeatures.length > 0) {
      if (!searchFeatures.includes(features)) {
        searchParams.append("features", features);
      }
    } else {
      searchParams.set("features", features);
    }
    const newUrl =
      window.location.protocol +
      "//" +
      window.location.host +
      window.location.pathname +
      "?" +
      searchParams.toString();
    window.history.replaceState({}, "", newUrl);
  },
};

export default constant;
