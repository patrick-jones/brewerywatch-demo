import React from 'react';

// https://reactrocket.com/post/turn-your-hocs-into-render-prop-components/
const RenderProp = ({children, ...props}) => children(props);

export default RenderProp;
