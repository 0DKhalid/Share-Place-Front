import React, { useRef, useState, useEffect } from 'react';

import './ImageUpload.css';
import Button from '../Button/Button';

const ImageUpload = props => {
  const [file, setFile] = useState();
  const [prevViewUrl, setPrevViewUrl] = useState();
  const [isValid, setIsValid] = useState(false);
  const filePickerRef = useRef();
  const pickImageHandler = () => {
    filePickerRef.current.click();
  };

  useEffect(() => {
    if (!file) {
      return;
    }

    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPrevViewUrl(fileReader.result);
    };
    fileReader.readAsDataURL(file);
  }, [file]);
  const onFilePickerHandler = event => {
    let filePikced;
    let isFileValid = isValid;
    if (event.target.files && event.target.files.length === 1) {
      filePikced = event.target.files[0];
      setFile(filePikced);
      setIsValid(true);
      isFileValid = true;
    } else {
      setIsValid(false);
      isFileValid = false;
    }
    // console.log(props.id, filePikced, isFileValid);
    props.onInput(props.id, filePikced, isFileValid);
  };
  return (
    <div className='form-control'>
      <input
        id={props.id}
        style={{ display: 'none' }}
        type='file'
        accept='.jpg,.png, .jpeg'
        ref={filePickerRef}
        onChange={onFilePickerHandler}
      />
      <div className={`image-upload ${props.center && 'center'}`}>
        <div className='image-upload__preview'>
          {prevViewUrl && <img src={prevViewUrl} alt='Preview' />}
          {!prevViewUrl && <p>Please Pick an Image</p>}
        </div>
        <div>
          <Button type='button' onClick={pickImageHandler}>
            Pick Image
          </Button>
        </div>
      </div>
      {!isValid && <p style={{ color: 'red' }}>{props.errorText}</p>}
    </div>
  );
};

export default ImageUpload;
