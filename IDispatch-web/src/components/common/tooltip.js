import React, { Component } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

const Tooltipper = ({ children, tooltip}) => (
    <OverlayTrigger overlay={<Tooltip id="idtooltip">{tooltip}</Tooltip>} placement="top" delayShow={300} delayHide={150} >
        <span>{children}</span>
    </OverlayTrigger>
);

export default Tooltipper;