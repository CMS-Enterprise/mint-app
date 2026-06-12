import React, { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import classnames from 'classnames';

type FileUploadProps = {
  id: string;
  name: string;
  accept?: string;
  multiple?: boolean;
  /** When provided with `multiple`, preview is driven by the parent. */
  files?: File[];
  showFileTypeIcons?: boolean;
  disabled?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: () => void;
  ariaDescribedBy?: string;
  inputProps: React.ComponentProps<'input'>;
};

const FileUpload = (props: FileUploadProps) => {
  const {
    id,
    name,
    accept,
    multiple = false,
    files,
    showFileTypeIcons = true,
    disabled = false,
    onChange,
    onBlur,
    inputProps
  } = props;
  const { t } = useTranslation('documentsMisc');
  const [file, setFile] = useState<File>();
  const [error, setError] = useState(false);
  const [inputKey, setInputKey] = useState(0);

  const isControlledMultiple = multiple && files !== undefined;

  const getPreviewFiles = (): File[] => {
    if (isControlledMultiple) {
      return files;
    }

    if (file) {
      return [file];
    }

    return [];
  };

  const previewFiles = getPreviewFiles();
  const hasFiles = previewFiles.length > 0;

  const filesSelectedLabel =
    previewFiles.length === 1
      ? t('oneFileSelected')
      : t('filesSelected', { count: previewFiles.length });

  const fileInputWrapper = classnames(
    'easi-file-upload',
    'usa-file-input',
    'maxw-full',
    {
      'usa-file-input--disabled': disabled
    }
  );
  const targetWrapperClasses = classnames('usa-file-input__target', {
    'has-invalid-file': error
  });
  const instructionsClasses = classnames('usa-file-input__instructions', {
    'display-none': hasFiles
  });

  const isFileTypeValid = (localFile: File) => {
    if (!accept) {
      return true;
    }
    let isFileTypeAcceptable = false;
    const acceptedFileTypes = accept.split(',');
    acceptedFileTypes.forEach(fileType => {
      if (
        localFile.name.indexOf(fileType) > 0 ||
        localFile.type.includes(fileType.replace(/\*/g, ''))
      ) {
        isFileTypeAcceptable = true;
      }
    });
    return isFileTypeAcceptable;
  };

  const areAllFilesValid = (selectedFiles: FileList) =>
    Array.from(selectedFiles).every(isFileTypeValid);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e?.target?.files || e.target.files.length === 0) {
      return;
    }

    if (!areAllFilesValid(e.target.files)) {
      setError(true);
      if (!isControlledMultiple) {
        setFile(undefined);
      }
      return;
    }

    setError(false);

    if (!isControlledMultiple) {
      setFile(e.target.files[0]);
    } else {
      setInputKey(previous => previous + 1);
    }

    onChange(e);
  };

  const getDescriptionText = () => {
    if (!hasFiles) {
      return 'Select a file';
    }

    if (isControlledMultiple) {
      return filesSelectedLabel;
    }

    return `File ${file?.name} selected`;
  };

  return (
    <div
      className={fileInputWrapper}
      aria-disabled={disabled}
      data-testid="file-upload-wrapper"
    >
      <div className={targetWrapperClasses}>
        {hasFiles && isControlledMultiple && (
          <div className="usa-file-input__preview-heading">
            {filesSelectedLabel}
            <span className="usa-file-input__choose">{t('changeFiles')}</span>
          </div>
        )}
        {hasFiles && !isControlledMultiple && (
          <div className="usa-file-input__preview-heading">
            {t('selectedFile')}
            <span className="usa-file-input__choose">{t('changeFile')}</span>
          </div>
        )}
        {hasFiles && isControlledMultiple && (
          <div role="alert" aria-live="assertive" className="sr-only">
            {filesSelectedLabel}
          </div>
        )}
        {hasFiles && !isControlledMultiple && file && (
          <div role="alert" aria-live="assertive" className="sr-only">
            <Trans i18nKey="documents:fileSelected">
              indexZero {file.name} indexTwo
            </Trans>
          </div>
        )}
        <div className={instructionsClasses} aria-hidden>
          <span className="usa-file-input__drag-text">{t('dragFile')}</span>
          <span className="usa-file-input__choose">
            {' '}
            {t('chooseFromFolder')}
          </span>
        </div>
        {previewFiles.map(previewFile => (
          <div
            key={`${previewFile.name}-${previewFile.lastModified}-${previewFile.size}`}
            className="usa-file-input__preview padding-105 font-body-xs line-height-sans-1"
            aria-hidden
          >
            {showFileTypeIcons && <FileTypeIcon fileName={previewFile.name} />}
            {previewFile.name}
          </div>
        ))}
        <div className="usa-file-input__box" />
        {error && (
          <div
            className="usa-file-input__accepted-files-message"
            data-testid="file-upload-input-error"
          >
            {t('notValid')}
          </div>
        )}
        <input
          key={isControlledMultiple ? inputKey : undefined}
          id={id}
          className="usa-file-input__input"
          type="file"
          name={name}
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          aria-describedby="FileUpload-Description"
          onChange={handleChange}
          onBlur={onBlur}
          data-testid="file-upload-input"
          {...inputProps}
        />
      </div>
      <div id="FileUpload-Description" className="sr-only">
        {getDescriptionText()}
      </div>
    </div>
  );
};

const FileTypeIcon = (props: { fileName: string }) => {
  const { fileName } = props;
  const SPACER_GIF =
    'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
  const iconClasses = ['usa-file-input__preview-image'];
  if (fileName.indexOf('.pdf') > 0) {
    iconClasses.push('usa-file-input__preview-image--pdf');
  } else if (fileName.indexOf('.doc') > 0 || fileName.indexOf('.pages') > 0) {
    iconClasses.push('usa-file-input__preview-image--word');
  } else if (fileName.indexOf('.xls') > 0 || fileName.indexOf('.numbers') > 0) {
    iconClasses.push('usa-file-input__preview-image--excel');
  } else if (fileName.indexOf('.mov') > 0 || fileName.indexOf('.mp4') > 0) {
    iconClasses.push('usa-file-input__preview-image--video');
  } else {
    iconClasses.push('usa-file-input__preview-image--generic');
  }

  return (
    <img
      src={SPACER_GIF}
      alt=""
      className={iconClasses.join(' ')}
      aria-hidden
    />
  );
};

export default FileUpload;
