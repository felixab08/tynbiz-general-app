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
export interface Product{
      id: number;
      nameProduct: string;
      marca: string;
      color:string;
      talla: string;
      image: string;
      link: string;
      price: string;
}
export interface Cardcreations {
  id: number;
  title: string;
  state: string;
  dayInActive: string;
  time: string;
  numVistas: string;
  offer: boolean;
  store: CardStores;
  products: Product[];
}
export interface creationStore {
    id: number;
    title: string;
    vivo: boolean;
    state: string;
    date: string;
    timeActive: string;
    timeForActive: string;
    timeAvailable: string;
    numVistas: string;
    offer: boolean;
    products: Product[];
}
