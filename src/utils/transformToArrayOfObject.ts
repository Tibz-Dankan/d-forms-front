export const transformToArrayOfObjects = (dataObject: any) => {
  const keys = Object.keys(dataObject);

  const transformedData = keys.map((key) => {
    const result: any = {};
    result[key] = dataObject[key];
    return result;
  });

  return transformedData;
};
