export interface IFilesResp {
    id:                number;
    type:              string;
    name:              string;
    description:       string;
    requiredForSignup: boolean;
    active:            boolean;
    currentVersion:    Version;
    versions:          Version[];
}

export interface Version {
    id:             number;
    documentId:     number;
    version:        number;
    publicUrl:      string;
    fileSize:       number;
    checksumSha256: string;
    contentType:    string;
    changeSummary:  null;
    publishedAt:    Date;
    supersededAt:   Date | null;
    createdAt:      Date;
    published:      boolean;
    draft:          boolean;
}

export interface IGeneralPDF {
  type:           string;
  name:           string;
  currentVersion: CurrentVersion;
}

export interface CurrentVersion {
  publicUrl: string;
}
