import React from "react";
import PropTypes from "prop-types";

class Loader extends React.Component {
  static propTypes = {
    message: PropTypes.string,
  };
  static defaultProps = {
    message: "",
  };

  render() {
    return (
      <div className="Loader">
        <div className="lds-dual-ring"></div>
        {this.props.message !== "" ? (
          <h4 className="Loader__message">{this.props.message}</h4>
        ) : null}
      </div>
    );
  }
  loading;
}

export default Loader;
