export interface IProfile {
id  :123;
email? :string;
firstName? :string;
lastName?  :string;
fullName?  :string;
phone? :string;
documentType?  :string;
documentNumber?  :string;
birthDate? :string;
gender?  :string;
storeId? :number;
role?  :string;
status?  :string;
avatarUrl? :string;
createdAt? :string;
updatedAt? :string;
}

export interface IProfileAvatar {
  fileName:    string;
  contentType: string;
  uploadType:  string;
  url?:        string;
}
export interface IRespProfileAvatar {
  uploadUrl: string;
  publicUrl: string;
}
