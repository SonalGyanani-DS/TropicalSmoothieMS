export interface Interval {
  start: string;
  end: string;
}

export interface DayHour {
  openIntervals?: Interval[];
  isClosed?: boolean;
}

export interface HolidayHours {
  date: Date;
  openIntervals?: Interval[];
  isClosed?: boolean;
  isRegularHours?: boolean;
}

export type DayStringType =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export interface Hours {
  monday?: DayHour;
  tuesday?: DayHour;
  wednesday?: DayHour;
  thursday?: DayHour;
  friday?: DayHour;
  saturday?: DayHour;
  sunday?: DayHour;
  holidayHours?: HolidayHours[];
  reopenDate?: string;
}

export type HoursDoc = {
  openIntervals: Interval;
  isClosed:boolean;
  date: string | number | Date;
  monday: DayHour;
  tuesday: DayHour;
  wednesday: DayHour;
  thursday: DayHour;
  friday: DayHour;
  saturday: DayHour;
  sunday: DayHour;
  holidayHours?: HolidayHours[];
  reopenDate?: Date| undefined;
}[];

export enum PickupAndDeliveryServices {
  IN_STORE_PICKUP = "In-Store Pickup",
  CURBSIDE_PICKUP = "Curbside Pickup",
  PICKUP_NOT_OFFERED = "Pickup Not Offered",
  DELIVERY = "Delivery",
  SAME_DAY_DELIVERY = "Same Day Delivery",
  NO_CONTACT_DELIVERY = "No-Contact Delivery",
  DELIVERY_NOT_OFFERED = "Delivery Not Offered",
}

export interface Address {
  line1?: string;
  line2?: string;
  line3?: string;
  sublocality?: string;
  city?: string;
  region?: string;
  postalCode?: string;
  extraDescription?: string;
  countryCode?: string;
}

export interface ImageThumbnail {
  url: string;
  width: number;
  height: number;
}

export interface Image {
  url: string;
  width: number;
  height: number;
  thumbnails?: ImageThumbnail[];
  alternateText?: string;
}

export interface ComplexImage {
  image: Image;
  details?: string;
  description?: string;
  clickthroughUrl?: string;
}

export interface Coordinate {
  latitude?: number;
  longitude?: number;
}

export interface EntityReference {
  entityId: string;
  name: string;
}

export interface FeaturedMessage {
  description?: string;
  url?: string;
}

export enum LocationType {
  LOCATION = "Location",
  HEALTHCARE_FACILITY = "Healthcare Facility",
  HEALTHCARE_PROFESSIONAL = "Healthcare Professional",
  ATM = "ATM",
  RESTAURANT = "Restaurant",
  HOTEL = "Hotel",
}

export interface MenuUrl {
  url?: string;
  displayUrl?: string;
  preferDisplayUrl?: boolean;
}

export interface OrderUrl {
  url?: string;
  displayUrl?: string;
  preferDisplayUrl?: boolean;
}

export enum PaymentOptions {
  ALIPAY = "Alipay",
  AMERICANEXPRESS = "American Express",
  ANDROIDPAY = "Google Pay",
  APPLEPAY = "Apple Pay",
  ATM = "ATM",
  ATMQUICK = "ATM Quick",
  BACS = "BACS",
  BANCONTACT = "Bancontact",
  BANKDEPOSIT = "Bank Deposit",
  BANKPAY = "Bank Pay",
  BGO = "Bank/Giro Overschrijving",
  BITCOIN = "Bitcoin",
  Bar = "Bargeld",
  CARTASI = "CartaSi",
  CASH = "Cash",
  CCS = "CCS",
  CHECK = "Check",
  CONB = "Contactloos betalen",
  CVVV = "Cadeaubon/VVV bon",
  DEBITNOTE = "Debit Note",
  DINERSCLUB = "Diners Club",
  DIRECTDEBIT = "Direct Debit",
  DISCOVER = "Discover",
  ECKARTE = "Girokarte",
  ECOCHEQUE = "EcoCheque",
  EKENA = "E-kena",
  EMV = "Elektronische Maaltijdcheques",
  FINANCING = "Financing",
  GOPAY = "GoPay",
  HAYAKAKEN = "Hayakaken",
  HEBAG = "He-Bag",
  IBOD = "iBOD",
  ICCARDS = "IC Cards",
  ICOCA = "Icoca",
  ID = "iD",
  IDEAL = "iDeal",
  INCA = "Incasso",
  INVOICE = "Invoice",
  JCB = "JCB",
  JCoinPay = "J−Coin Pay",
  JKOPAY = "JKO Pay",
  KITACA = "Kitaca",
  KLA = "Klantenkaart",
  KLARNA = "Klarna",
  LINEPAY = "LINE Pay",
  MAESTRO = "Maestro",
  MANACA = "Manaca",
  MASTERCARD = "MasterCard",
  MIPAY = "Mi Pay",
  MONIZZE = "Monizze",
  MPAY = "MPay",
  Manuelle_Lastsch = "Manuelle Lastschrift",
  Merpay = "メルPay",
  NANACO = "nanaco",
  NEXI = "Nexi",
  NIMOCA = "Nimoca",
  OREM = "Onder Rembours",
  PASMO = "Pasmo",
  PAYBACKPAY = "Payback Pay",
  PAYBOX = "Paybox",
  PAYCONIQ = "Payconiq",
  PAYPAL = "PayPal",
  PAYPAY = "PayPay",
  PAYSEC = "PaySec",
  PIN = "PIN",
  POSTEPAY = "Postepay",
  QRCODE = "QR Code Payment",
  QUICPAY = "QUICPay",
  RAKUTENEDY = "Rakuten Edy",
  RAKUTENPAY = "楽天Pay",
  SAMSUNGPAY = "Samsung Pay",
  SODEXO = "Sodexo",
  SUGOCA = "Sugoca",
  SUICA = "Suica",
  SWISH = "Swish",
  TICKETRESTAURANT = "Ticket Restaurant",
  TOICA = "Toica",
  TRAVELERSCHECK = "Traveler's Check",
  TSCUBIC = "TS CUBIC",
  TWINT = "Twint",
  UNIONPAY = "China UnionPay",
  VEV = "Via een verzekering",
  VISA = "Visa",
  VISAELECTRON = "Visa Electron",
  VOB = "Vooruit betalen",
  VOUCHER = "Voucher",
  VPAY = "V PAY",
  WAON = "WAON",
  WECHATPAY = "WeChat Pay",
  WIRETRANSFER = "Wire Transfer",
  Yucho_Pay = "ゆうちょPay",
  ZELLE = "Zelle",
  AuPay = "auPay",
  DBarai = "d払い ",
  Überweisung = "Banküberweisung",
}

export enum PriceRange {
  UNSPECIFIED = "Unspecified",
  ONE = "$",
  TWO = "$$",
  THREE = "$$$",
  FOUR = "$$$$",
}

export interface ReservationUrl {
  url?: string;
  displayUrl?: string;
  preferDisplayUrl?: boolean;
}

export enum Presentation {
  BUTTON = "Button",
  LINK = "Link",
}

export interface UberLink {
  text?: string;
  presentation: Presentation;
}

export interface UberTripBranding {
  text: string;
  url: string;
  description: string;
}

export interface WebsiteUrl {
  url?: string;
  displayUrl?: string;
  preferDisplayUrl?: boolean;
}

export interface ComplexVideo {
  url: string;
  video?: string;
  description?: string;
}

export interface Location {
  c_click_collect_availability: string;
  c_open_for_shopping: string;
  c_clickCollectAvaliability: string;
  c_openForShoppingAvailibitlity: string;
  accessHours?: Hours;
  blackOwnedBusiness?: boolean;
  brunchHours?: Hours;
  covid19InformationUrl?: string;
  covidMessaging?: string;
  deliveryHours?: Hours;
  dineInHours?: Hours;
  driveThroughHours?: Hours;
  fullyVaccinatedStaff?: boolean;
  happyHours?: Hours;
  holidayHoursConversationEnabled?: boolean;
  kitchenHours?: Hours;
  landingPageUrl?: string;
  linkedInUrl?: string;
  neighborhood?: string;
  nudgeEnabled?: boolean;
  onlineServiceHours?: Hours;
  phoneticName?: string;
  pickupAndDeliveryServices?: PickupAndDeliveryServices[];
  pickupHours?: Hours;
  primaryConversationContact?: string;
  proofOfVaccinationRequired?: boolean;
  reviewResponseConversationEnabled?: boolean;
  seniorHours?: Hours;
  slug?: string;
  takeoutHours?: Hours;
  what3WordsAddress?: string;
  additionalHoursText?: string;
  address: Address;
  addressHidden?: boolean;
  alternatePhone?: string;
  androidAppUrl?: string;
  associations?: string[];
  brands?: string[];
  description?: string;
  hours?: Hours;
  logo?: ComplexImage;
  name: string;
  cityCoordinate?: Coordinate;
  closed?: boolean;
  dm_directoryParents?: EntityReference[];
  c_featuredFAQs?: EntityReference[];
  displayCoordinate?: Coordinate;
  dropoffCoordinate?: Coordinate;
  emails?: string[];
  facebookEmail?: string;
  facebookPageUrl?: string;
  fax?: string;
  featuredMessage?: FeaturedMessage;
  photoGallery?: ComplexImage[];
  geocodedCoordinate?: Coordinate;
  instagramHandle?: string;
  iosAppUrl?: string;
  isoRegionCode?: string;
  keywords?: string[];
  languages?: string[];
  localPhone?: string;
  locationType?: LocationType;
  mainPhone?: string;
  menuUrl?: MenuUrl;
  mobilePhone?: string;
  orderUrl?: OrderUrl;
  paymentOptions?: PaymentOptions[];
  phones?: string;
  pickupCoordinate?: Coordinate;
  priceRange?: PriceRange;
  products?: string[];
  reservationUrl?: ReservationUrl;
  routableCoordinate?: Coordinate;
  services?: string[];
  shortName35?: string;
  shortName64?: string;
  specialities?: string[];
  id: string;
  timezone?: string;
  tollFreePhone?: string;
  ttyPhone?: string;
  twitterHandle?: string;
  uberClientId?: string;
  uberLink?: UberLink;
  uberTripBranding?: UberTripBranding;
  walkableCoordinate?: Coordinate;
  websiteUrl?: WebsiteUrl;
  yearEstablished?: number;
  yextDisplayCoordinate?: Coordinate;
  yextDropoffCoordinate?: Coordinate;
  yextPickupCoordinate?: Coordinate;
  yextRoutableCoordinate?: Coordinate;
  yextWalkableCoordinate?: Coordinate;
  videos?: ComplexVideo[];
}
