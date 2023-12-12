interface Data {}

interface Props {
  applicationForm: string;
  category: string;
  updateAt: string;
  data: Data;
}

interface StorageData {
  applicationForm: string;
  updateAt: string;
  categories: any;
}

export const saveFormDataToStorage = (props: Props) => {
  const storageData = localStorage.getItem(props.applicationForm);

  const applicationFormData =
    storageData && (JSON.parse(storageData) as StorageData);

  //When storage is empty
  if (!applicationFormData) {
    const data = {} as StorageData;
    data.applicationForm = props.applicationForm;
    data.updateAt = props.updateAt;
    data.categories = {};
    data.categories[`${props.category}`] = props.data;
    localStorage.setItem(props.applicationForm, JSON.stringify(data));
    return;
  }

  //When storage is having data
  applicationFormData.updateAt = props.updateAt;
  applicationFormData.categories[`${props.category}`] = props.data;
  localStorage.setItem(
    props.applicationForm,
    JSON.stringify(applicationFormData)
  );
};

interface getDataProps {
  applicationForm: string;
  category: string;
}
export const getDataFromStorage = (props: getDataProps) => {
  const storageData = localStorage.getItem(props.applicationForm);

  if (!storageData) return null;

  const applicationFormData =
    storageData && (JSON.parse(storageData) as StorageData);

  if (!applicationFormData) return null;

  return applicationFormData.categories[`${props.category}`];
};
