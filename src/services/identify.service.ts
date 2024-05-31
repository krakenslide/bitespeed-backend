import { Contact, linkPrecedenceConstant } from "../models/contact.model";
import contactRepo from "../repositories/contact.repository";

interface ContactDTO {
  contact: {
    primaryContactId: number;
    emails: string[];
    phoneNumbers: string[];
    secondaryContactIds: number[];
  };
}

export class IdentifyService {
  async union(phoneNumber?: string, email?: string) {
    let contactByPhone: Contact | undefined,
      contactByEmail: Contact | undefined;

    if (phoneNumber) {
      contactByPhone = await contactRepo.getContactByPhoneNumber(phoneNumber);
    }
    if (email) {
      contactByEmail = await contactRepo.getContactByEmail(email);
    }

    if (!contactByPhone && !contactByEmail) {
      const newContact = new Contact(
        linkPrecedenceConstant.primary,
        phoneNumber,
        email,
      );
      await contactRepo.create(newContact);
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

      const linkedId = existingContact?.linkedId || existingContact?.id;
      const newContact = new Contact(
        linkPrecedenceConstant.secondary,
        phoneNumber,
        email,
        linkedId,
      );
      await contactRepo.create(newContact);
    }

    if (
      contactByPhone &&
      contactByEmail &&
      contactByPhone.id !== contactByEmail.id
    ) {
      let contactByPhoneParent = contactByPhone;
      if (contactByPhone.linkedId) {
        const contactParent = await contactRepo.getContactById(
          contactByPhone.linkedId,
        );
        if (contactParent) {
          contactByPhoneParent = contactParent;
        }
      }

      let contactByEmailParent = contactByEmail;
      if (contactByEmail.linkedId) {
        const contactParent = await contactRepo.getContactById(
          contactByEmail.linkedId,
        );
        if (contactParent) {
          contactByEmailParent = contactParent;
        }
      }

      if (contactByPhoneParent.createdAt < contactByEmailParent.createdAt) {
        await this.linkContacts(contactByEmail, contactByPhoneParent);
      } else {
        await this.linkContacts(contactByPhone, contactByEmailParent);
      }
    }
  }

  async linkContacts(contact: Contact, parentContact: Contact) {
    if (contact.linkedId === parentContact.id) return;

    await contactRepo.updateLinkedId(contact.id!, parentContact.id!);

    await contactRepo.updateManyLinkedIds(contact.id!, parentContact.id!);
  }

  async find(phoneNumber?: string, email?: string): Promise<ContactDTO> {
    await this.union(phoneNumber, email);

    let contact: Contact | undefined;
    if (phoneNumber) {
      contact = await contactRepo.getContactByPhoneNumber(phoneNumber);
    }
    if (!contact && email) {
      contact = await contactRepo.getContactByEmail(email);
    }
    if (!contact) {
      throw new Error("contact not found");
    }

    const primaryContactId = contact.linkedId ? contact.linkedId : contact.id;

    const emails = new Set<string>();
    const phoneNumbers = new Set<string>();
    const secondaryContactIds: number[] = [];

    const contacts = await contactRepo.getAllLinkedToId(primaryContactId!);
    contacts.forEach((elem) => {
      if (elem.id === primaryContactId || elem.linkedId === primaryContactId) {
        if (elem.email) emails.add(elem.email);
        if (elem.phoneNumber) phoneNumbers.add(elem.phoneNumber);
        if (elem.id !== primaryContactId) secondaryContactIds.push(elem.id!);
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
