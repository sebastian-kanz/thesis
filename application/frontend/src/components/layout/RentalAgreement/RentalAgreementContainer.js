import React from 'react';
import Container from '@material-ui/core/Container';
import RentalAgreement from './RentalAgreement';


export class RentalAgreementContainer extends React.Component {
  state = {

  };

  tick() {
    this.setState(prevState => ({
      seconds: prevState.seconds + 1
    }));
  }

  componentDidMount() {
    this.interval = setInterval(() => this.tick(), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    return(
      <Container>
        <RentalAgreement contractState="Pending"/>
        <RentalAgreement contractState="Active"/>
        <RentalAgreement contractState="Terminated"/>
      </Container>
    );
  }

}

export default RentalAgreementContainer;
