import React from 'react';
import PropTypes from 'prop-types';
import './Button.css';

/**
 * Simple Button component matching the test expectations
 */
export default function Button({ children, variant = 'primary', size = 'md', disabled = false, onClick, className = '', ...rest }) {
  const baseClass = 'btn';
  const variantClass = `btn-${variant}`;
  const sizeClass = `btn-${size}`;
  const disabledClass = disabled ? 'btn-disabled' : '';

  return (
    <button
      className={[baseClass, variantClass, sizeClass, disabledClass, className].filter(Boolean).join(' ')}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
}

Button.propTypes = {
  children: PropTypes.node,
  variant: PropTypes.oneOf(['primary', 'secondary', 'danger']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  className: PropTypes.string,
};

Button.defaultProps = {
  children: null,
  variant: 'primary',
  size: 'md',
  disabled: false,
  onClick: undefined,
  className: '',
};
