const getFile = async (item: any, path: string) => new Promise(resolve => {
  item.file((file: any) => {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      return resolve({
        file,
        src: e.target.result,
        path: path.split('/').join(''),
      });
    };
    reader.readAsDataURL(file);
  });
});

export default getFile;
