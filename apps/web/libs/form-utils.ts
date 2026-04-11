type DirtyFields = Record<string, boolean>;
type RFHFormData = Record<string, any>;

const getEditedFields = (
  dirtyFields: DirtyFields,
  formData: RFHFormData
): Partial<RFHFormData> => {
  const editedFields: Partial<RFHFormData> = {};

  for (const key in dirtyFields) {
    if (dirtyFields[key]) {
      editedFields[key] = formData[key];
    }
  }

  return editedFields;
};

export { getEditedFields };
