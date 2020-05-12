import React from "react";
import { connect } from "react-redux";

// import { actions } from "../actions";

import "./Overlay.css";

const Overlay = () => {
    return (
        <div className="Overlay">
            <div className="Overlay-content">
                <div style={{
                    position: "absolute",
                    left: "1550px",
                    top: "250px",
                    backgroundColor: "red",
                    textAlign: "center",
                }}>
                    This is the Overlay!
                </div>
            </div>
        </div>
    );
}

const mapStateToProps = (state, ownProps) => ({
});

const mapDispatchToProps = (dispatch, ownProps) => ({
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Overlay);

