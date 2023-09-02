declare module "*.svg";
declare module "*.png";
declare module "*.jpg";
declare module "react-geocode";
declare module "jquery";
declare module "@splidejs/react-splide" {
  export const Splide: React.ComponentType<
    Partial<typeof import("@splidejs/react-splide")> & {
      className?: string;
      options?: unknown;
      id?: string;
    }
  >;

  export const SplideSlide: React.ComponentType<
    Partial<typeof import("@splidejs/react-splide")> & {
      className?: string;
    }
  >;
  export default Splide;
}
declare module "@yext/rtf-converter";
declare module "react-dom";
