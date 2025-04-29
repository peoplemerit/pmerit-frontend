import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import axios from 'axios';

registerPlugin(FilePondPluginImagePreview, FilePondPluginFileValidateType);

function FileUpload() {
  const handleProcess = async (fieldName, file, metadata, load, error, progress, abort) => {
    const formData = new FormData();
    formData.append('file', file, file.name);

    let endpoint = '/api/image';
    const ext = file.name.split('.').pop().toLowerCase();
    if (['mp3', 'wav', 'ogg', 'm4a'].includes(ext)) {
      endpoint = '/api/audio';
    }

    try {
      const response = await axios.post(`https://pmerit-backend.onrender.com${endpoint}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (e) => {
          progress(true, e.loaded, e.total);
        },
      });
      console.log('Server response:', response.data);
      load(response.data.response);
    } catch (err) {
      console.error(err);
      error('Upload failed');
    }
  };

  return (
    <div className="file-upload-container">
      <h2>Upload Image or Audio</h2>
      <FilePond
        name="file"
        allowMultiple={false}
        server={{ process: handleProcess }}
        acceptedFileTypes={['image/*', 'audio/*']}
        labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
      />
    </div>
  );
}

export default FileUpload;
