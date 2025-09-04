import React from 'react';
import { Button } from '@trussworks/react-uswds';
import { downloadMTODataAsExcel, downloadComprehensiveMTOExcel } from './util';

interface MTOExportButtonProps {
  data: any; // Your MTO data structure
  variant?: 'simple' | 'comprehensive';
  filename?: string;
  className?: string;
}

/**
 * Button component for exporting MTO data to Excel
 */
export const MTOExportButton: React.FC<MTOExportButtonProps> = ({
  data,
  variant = 'comprehensive',
  filename,
  className
}) => {
  const handleExport = () => {
    if (variant === 'simple') {
      downloadMTODataAsExcel(data, filename);
    } else {
      downloadComprehensiveMTOExcel(data, filename);
    }
  };

  return (
    <Button
      type="button"
      onClick={handleExport}
      className={className}
      data-testid="mto-export-button"
    >
      Export MTO Data to Excel
    </Button>
  );
};

export default MTOExportButton;
