export interface CardInfo {
  id: number;
  title: string;
  titleTow: string;
  descriptionOne: string;
  descriptionTwo: string;
  image: string;
  describeFooter: string;
}
export interface CardOffer {
  id: number;
  title: string;
  estado: string;
  dayInActive: string;
  time: string;
  image: string[];
  store: {
    nameTienda: string;
    logoTienda: string;
    sitioTienda: string;
    numVistas: string;
    offer: boolean;
  };
  totalProd: number;
}
export interface CardStores {
  id: number;
  logoStore: string;
  nameStore: string;
  sitioStore: string;
  linkStore: string;
}
