import { sp } from '@pnp/sp';
import { IFormData } from './IFormProps';

// FormService.ts
export const submitForm = async (formData: IFormData) => {
  try {
    const fileItem = await sp.web.lists.getByTitle('BackOfficeV0').rootFolder.files.add(formData.file!.name, formData.file!, true);
    const fileUrl = fileItem.data.ServerRelativeUrl;

    const list = sp.web.lists.getByTitle('BackOfficeV1');
    await list.items.add({
      offre_title: formData.offre_title, 
      short_description: formData.short_description, 
      deadline: formData.deadline.toISOString(),
      city: formData.city, 
      fileType: formData.fileType, 
      fileUrl: fileUrl,
      fileName: formData.file ? formData.file.name : '',
      category: formData.category ,
      link: formData.link 

    });
  } catch (error) {
    console.error('Error submitting form:', error);
    throw new Error('An error occurred while submitting the form. Please try again.');
  }
};

export const getFormData = async (): Promise<IFormData[]> => {
  try {
    const list = sp.web.lists.getByTitle('BackOfficeV1');
    const items = await list.items.orderBy('Id', false).select('Id', 'offre_title', 'short_description', 'deadline', 'city', 'fileType', 'fileUrl', 'fileName', 'category','link' ).get();
    return items.map((item: any) => ({
      id: item.Id,
      offre_title: item.offre_title,
      short_description: item.short_description,
      deadline: new Date(item.deadline),
      city: item.city,
      fileType: item.fileType,
      file: null,
      fileUrl: item.fileUrl,
      fileName: item.fileName,
      category: item.category ,
      link: item.link 

    }));
  } catch (error) {
    console.error('Error fetching form data:', error);
    throw new Error('An error occurred while fetching form data. Please try again.');
  }
};

export const updateFormEntry = async (id: number, formData: IFormData) => {
  try {
    const list = sp.web.lists.getByTitle('BackOfficeV1');
    await list.items.getById(id).update({
      offre_title: formData.offre_title, 
      short_description: formData.short_description, 
      deadline: formData.deadline.toISOString(), 
      city: formData.city, 
      fileType: formData.fileType,
      category: formData.category ,
      link: formData.link

    });
  } catch (error) {
    console.error('Error updating form entry:', error);
    throw new Error('An error occurred while updating the form entry. Please try again.');
  }
};

export const deleteFormEntry = async (id: number) => {
  try {
    const list = sp.web.lists.getByTitle('BackOfficeV1');
    await list.items.getById(id).delete();
  } catch (error) {
    console.error('Error deleting form entry:', error);
    throw new Error('An error occurred while deleting the form entry. Please try again.');
  }
};
