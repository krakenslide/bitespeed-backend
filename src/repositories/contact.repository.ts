import { getRepository } from "typeorm";
import { ContactEntity } from "../entities/contact.entity";
import { Contact, linkPrecedenceConstant } from "../models/contact.model";

function contactToContactEntity(contact: Contact): ContactEntity {
  const contactEntity = new ContactEntity();
  if (contact.email) {
    contactEntity.email = contact.email;
  }
  if (contact.phoneNumber) {
    contactEntity.phoneNumber = contact.phoneNumber;
  }
  if (contact.linkedId) {
    contactEntity.linkedId = contact.linkedId;
  }

  contactEntity.linkPrecedence = contact.linkPrecedence;

  return contactEntity;
}

export default {
  getContactById: async function (id: number): Promise<Contact | undefined> {
    try {
      const contactRepository = getRepository(ContactEntity);
      const contact = await contactRepository.findOne({
        where: { id },
      });
      return contact || undefined;
    } catch (error) {
      console.error("Error retrieving contact by id:", error);
      throw error;
    }
  },

  getContactByPhoneNumber: async function (
    phoneNumber: string,
  ): Promise<Contact | undefined> {
    try {
      const contactRepository = getRepository(ContactEntity);
      const contact = await contactRepository.findOne({
        where: { phoneNumber },
      });
      return contact || undefined;
    } catch (error) {
      console.error("Error retrieving contact by phone number:", error);
      throw error;
    }
  },

  getContactByEmail: async function (
    email: string,
  ): Promise<Contact | undefined> {
    try {
      const contactRepository = getRepository(ContactEntity);
      const contact = await contactRepository.findOne({
        where: { email },
      });
      return contact || undefined;
    } catch (error) {
      console.error("Error retrieving contact by email:", error);
      throw error;
    }
  },

  create: async function (contact: Contact) {
    try {
      const contactRepository = getRepository(ContactEntity);
      await contactRepository.insert(contact);
    } catch (error) {
      console.error("Error saving contact:", error);
      throw error;
    }
  },

  updateLinkedId: async function (contactId: number, parentId: number) {
    try {
      const contactRepository = getRepository(ContactEntity);
      await contactRepository.update(
        { id: contactId },
        {
          linkPrecedence: linkPrecedenceConstant.secondary,
          linkedId: parentId,
          updatedAt: new Date(),
        },
      );
    } catch (error) {
      console.error("Error saving contact:", error);
      throw error;
    }
  },

  updateManyLinkedIds: async function (linkedId: number, newLinkedId: number) {
    try {
      const contactRepository = getRepository(ContactEntity);
      await contactRepository.update(
        { linkedId: linkedId },
        {
          linkedId: newLinkedId,
          updatedAt: new Date(),
        },
      );
    } catch (error) {
      console.error("Error saving contact:", error);
      throw error;
    }
  },

  getAllLinkedToId: async function (id: number): Promise<Contact[]> {
    try {
      const contactRepository = getRepository(ContactEntity);
      const contacts = await contactRepository.find({
        where: [{ id: id }, { linkedId: id }],
      });
      return contacts;
    } catch (error) {
      console.error("Error retrieving contact by id:", error);
      throw error;
    }
  },
};
