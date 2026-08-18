import { IProduct } from "./product-store.interface";

export interface IIterationRoomReq {
visibility: "PUBLICO" | "PRIVADO", // Puede ser "PUBLICO" o "PRIVADO"
scheduledAt: string,
productIds?: number[] // Opcional: IDs de productos adjuntos
}

export interface IIterarionRoomResp {
    id:                 number;
    creatorId:          number;
    creatorName:        string;
    creatorAvatarUrl:   string;
    visibility:         string;
    scheduledAt:        Date;
    videoRoomName:      string;
    videoRoomUrl:       string;
    videoRoomExpiresAt: Date;
    createdAt:          Date;
    roomStatus:         string;
    secondsUntilLive:   string;
    invitations?:        any[];
    products?:           IProduct[];
}
