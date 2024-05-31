export class Contact {
  public id?: number;
  public phoneNumber?: string;
  public email?: string;
  public linkedId?: number;
  public linkPrecedence: string;
  public createdAt: Date;
  public updatedAt: Date;
  public deletedAt?: Date;

  constructor(
    linkPrecedence: string,
    phoneNumber?: string,
    email?: string,
    linkedId?: number,
  ) {
    this.phoneNumber = phoneNumber;
    this.email = email;
    this.linkedId = linkedId;
    this.linkPrecedence = linkPrecedence;
    const currentDate = new Date();
    this.createdAt = currentDate;
    this.updatedAt = currentDate;
  }
}

export const linkPrecedenceConstant = {
  primary: "primary",
  secondary: "secondary",
};
