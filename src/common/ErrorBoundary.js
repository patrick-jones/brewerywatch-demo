import React from 'react';
import {Button, Card, CardActions, CardTitle, FontIcon} from 'react-md';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error, info) {
    // Display fallback UI
    this.setState({ hasError: true });
    // You can also log the error to an error reporting service
    console.log(error, info);
  }

  handleRetry = () => {
    this.setState({hasError: false});
  };

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <Card className='md-block-centered'>
          <CardTitle
            title='The UI did not draw correctly'
            subtitle='This is probably a bug ☹'
            avatar={<FontIcon>mood_bad</FontIcon>}
            className='md-text--error'
          />
          <CardActions>
            <Button flat onClick={this.handleRetry}>Retry</Button>
          </CardActions>
        </Card>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
