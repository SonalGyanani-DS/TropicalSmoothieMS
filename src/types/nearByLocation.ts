interface Location {
  data: {
    name: string;
    slug?: string;
    id: number;
    address: {
      city?: string;
      line1?: string;
    };
    c_crossStreetInfo?: string;
    hours?: {
      today: {
        start: string;
        end: string;
      }[];
    };
    timezone: string;
  };
}

export type nearByLocation = {
  json(): unknown;
  response?:
    | {
        results: Location[];
      }
    | undefined;
};
