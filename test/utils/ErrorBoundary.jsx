// https://enzymejs.github.io/enzyme/docs/api/ShallowWrapper/simulateError.html

import React from 'react'

function Something() {
  // this is just a placeholder
  return null;
}

export class ErrorBoundary extends React.Component {
  static getDerivedStateFromError(error) {
    return {
      hasError: true,
    };
  }

  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error, info) {
    const { spy } = this.props;
    spy(error, info);
  }

  render() {
    const { children } = this.props;
    const { hasError } = this.state;
    return (
      <React.Fragment>
        {hasError ? 'Error' : children}
      </React.Fragment>
    );
  }
}
