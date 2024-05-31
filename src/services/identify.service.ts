import { Contact, linkPrecedenceConstant } from "../models/contact";

interface ContactDTO {
  contact: {
    primaryContactId: number;
    emails: string[];
    phoneNumbers: string[];
    secondaryContactIds: number[];
  };
}

export class IdentifyService {
  store: Contact[] = [];

  union(phoneNumber?: string, email?: string) {
    let contactByPhone: Contact | undefined,
      contactByEmail: Contact | undefined;

    if (phoneNumber) {
      contactByPhone = this.store.find(
        (elem: Contact) => elem.phoneNumber === phoneNumber,
      );
    }
    if (email) {
      contactByEmail = this.store.find((elem: Contact) => elem.email === email);
    }

    if (!contactByPhone && !contactByEmail) {
      const id = this.store.length;
      const newContact = new Contact(
        id,
        phoneNumber,
        email,
        linkPrecedenceConstant.primary,
      );
      this.store.push(newContact);
      return;
    }
    if (
      (contactByPhone && !contactByEmail) ||
      (contactByEmail && !contactByPhone)
    ) {
      if (contactByPhone && (contactByPhone.email == email || !email)) return;
      if (
        contactByEmail &&
        (contactByEmail.phoneNumber == phoneNumber || !phoneNumber)
      )
        return;
      const existingContact = contactByPhone || contactByEmail;

      const id = this.store.length;
      const linkedId = existingContact?.linkedId || existingContact?.id;
      const newContact = new Contact(
        id,
        phoneNumber,
        email,
        linkPrecedenceConstant.secondary,
        linkedId,
      );
      this.store.push(newContact);
    }

    if (
      contactByPhone &&
      contactByEmail &&
      contactByPhone.id !== contactByEmail.id
    ) {
      const contactByPhoneParent =
        contactByPhone.linkedId !== undefined
          ? this.store[contactByPhone.linkedId]
          : contactByPhone;
      const contactByEmailParent =
        contactByEmail.linkedId !== undefined
          ? this.store[contactByEmail.linkedId]
          : contactByEmail;

      if (contactByPhoneParent.createdAt < contactByEmailParent.createdAt) {
        this.linkContacts(contactByEmail, contactByPhoneParent);
      } else {
        this.linkContacts(contactByPhone, contactByEmailParent);
      }
    }
  }

  linkContacts(contact: Contact, parentContact: Contact) {
    if (contact.linkedId === parentContact.id) return;

    contact.linkPrecedence = linkPrecedenceConstant.secondary;
    contact.linkedId = parentContact.id;
    contact.updatedAt = new Date();

    this.store.forEach((elem) => {
      if (elem.linkedId === contact.id) {
        elem.linkedId = parentContact.id;
        elem.updatedAt = new Date();
      }
    });
  }

  find(phoneNumber?: string, email?: string): ContactDTO {
    this.union(phoneNumber, email);

    let contact: Contact | undefined;
    if (phoneNumber) {
      contact = this.store.find((elem) => elem.phoneNumber === phoneNumber);
    }
    if (!contact && email) {
      contact = this.store.find((elem) => elem.email === email);
    }
    if (!contact) {
      return {
        contact: {
          primaryContactId: 0,
          emails: [],
          phoneNumbers: [],
          secondaryContactIds: [],
        },
      };
    }

    const primaryContactId =
      contact.linkPrecedence === linkPrecedenceConstant.primary
        ? contact.id
        : contact.linkedId;

    const emails = new Set<string>();
    const phoneNumbers = new Set<string>();
    const secondaryContactIds: number[] = [];

    this.store.forEach((elem) => {
      if (elem.id === primaryContactId || elem.linkedId === primaryContactId) {
        if (elem.email) emails.add(elem.email);
        if (elem.phoneNumber) phoneNumbers.add(elem.phoneNumber);
        if (elem.id !== primaryContactId) secondaryContactIds.push(elem.id);
      }
    });

    return {
      contact: {
        primaryContactId: primaryContactId!,
        emails: Array.from(emails),
        phoneNumbers: Array.from(phoneNumbers),
        secondaryContactIds: secondaryContactIds,
      },
    };
  }
}
