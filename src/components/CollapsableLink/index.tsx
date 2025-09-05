import React, { useContext, useEffect, useState } from 'react';
import { Button, Icon } from '@trussworks/react-uswds';
import classNames from 'classnames';

import { PrintPDFContext } from 'contexts/PrintPDFContext';

import './index.scss';

type CollapsableLinkProps = {
  id: string;
  className?: string;
  childClassName?: string;
  toggleClassName?: string;
  children: React.ReactNode;
  label: string;
  closeLabel?: string;
  styleLeftBar?: boolean;
  eyeIcon?: boolean;
  iconPosition?: 'left' | 'right';
  startOpen?: boolean;
  showDescription?: (show: boolean) => void;
  labelPosition?: 'top' | 'bottom';
  expandOnExport?: boolean;
  setParentOpen?: (isOpen: boolean) => void;
  horizontalCaret?: boolean;
};

const CollapsableLink = ({
  id,
  className,
  childClassName,
  toggleClassName,
  children,
  label,
  closeLabel,
  styleLeftBar = true,
  eyeIcon,
  iconPosition,
  startOpen = false,
  showDescription,
  labelPosition = 'top',
  expandOnExport = false,
  setParentOpen,
  horizontalCaret = false
}: CollapsableLinkProps) => {
  // TODO: should this state instead be held in the parent and passed in as prop?
  // Followup: if the state should remain here, how do we test the component when it's open?
  // That is, how do we initialize this component and set isOpen to true?
  const [isOpen, setOpen] = useState(startOpen);

  // State used to revert to toggle state before overridden by pdf export/context
  const [isOpenPrePrint, setOpenPrePrint] = useState(startOpen);

  const { isPrintPDF } = useContext(PrintPDFContext);

  useEffect(() => {
    if (expandOnExport) {
      if (isPrintPDF) {
        setOpen(isPrintPDF);
      } else {
        setOpen(isOpenPrePrint);
      }
    }
  }, [isPrintPDF, expandOnExport, isOpenPrePrint]);

  const renderEyeIcon = () => {
    return isOpen ? (
      <Icon.VisibilityOff
        className="mint-collapsable-link__eye-icon margin-right-05"
        aria-label="visibility off"
      />
    ) : (
      <Icon.Visibility
        className="mint-collapsable-link__eye-icon margin-right-05"
        aria-label="visibility on"
      />
    );
  };

  const OpenCaret = horizontalCaret ? (
    <Icon.NavigateNext className="margin-right-05" aria-label="next" />
  ) : (
    <Icon.ExpandMore className="margin-right-05" aria-label="expand" />
  );

  const DownCaret = horizontalCaret ? (
    <Icon.ExpandMore className="margin-right-05" aria-label="expand" />
  ) : (
    <Icon.ExpandLess className="margin-right-05" aria-label="collapse" />
  );

  const renderCaret = () => {
    return isOpen ? DownCaret : OpenCaret;
  };

  const expandIcon = eyeIcon ? renderEyeIcon() : renderCaret();
  const selectedLabel = isOpen ? closeLabel || label : label;

  const collapseButton: React.ReactNode = (
    <Button
      type="button"
      onClick={() => {
        setOpen(!isOpen);
        if (setParentOpen) setParentOpen(!isOpen);
        setOpenPrePrint(!isOpenPrePrint);
        if (showDescription) showDescription(!isOpen);
      }}
      aria-expanded={isOpen}
      aria-controls={id}
      className={classNames('mint-no-print', toggleClassName)}
      unstyled
      data-testid={id}
    >
      {iconPosition === 'left' ? selectedLabel : expandIcon}
      {iconPosition === 'left' ? expandIcon : selectedLabel}
    </Button>
  );
  return (
    <div className={classNames(className)}>
      {labelPosition === 'top' && collapseButton}
      {isOpen && (
        <div
          id={id}
          data-testid={id || 'collapsable-link'}
          className={classNames(
            childClassName,
            labelPosition === 'top' ? 'padding-bottom-0' : '',
            isPrintPDF ? 'padding-top-0' : '',
            styleLeftBar
              ? 'mint-collapsable-link__content'
              : 'mint-collapsable-link__content-no-bar'
          )}
        >
          {children}
        </div>
      )}
      {labelPosition === 'bottom' && collapseButton}
    </div>
  );
};

export default CollapsableLink;
