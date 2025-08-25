// Util for downloading files from external URL
import axios from 'axios';

type DownloadDocumentType = {
  fileType: string;
  fileName: string;
  downloadURL: string;
};

// Util for on demand download of file
const downloadFile = ({
  fileType,
  fileName,
  downloadURL
}: DownloadDocumentType) => {
  return downloadDocumentFromURL(downloadURL, fileName, fileType).then(() => {
    return downloadURL;
  });
};

// Axios download of file from url
const downloadDocumentFromURL = (
  downloadURL: string,
  fileName: string,
  fileType: string
) => {
  return axios
    .request({
      url: downloadURL,
      responseType: 'blob',
      method: 'GET'
    })
    .then(response => {
      const blob = new Blob([response.data], { type: fileType });
      downloadBlob(fileName, blob);
    });
};

export default downloadFile;

export function downloadBlob(filename: string, blob: Blob) {
  // This approach to downloading files works fine in the tests I've done in Chrome
  // with PDF files that are < 100kB. For larger files we might need to
  // instead redirect the browser to a URL that returns the file. That
  // approach is complicated by using JWTs for auth.
  //
  // TODO test this in various browsers. Some reports say this might not work
  // properly in Firefox and that firing a MouseEvent is required instead.
  const blobUrl = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = blobUrl;
  link.download = filename;

  // This downloads the file to the user's machine.
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
