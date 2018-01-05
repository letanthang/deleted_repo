import React from 'react';
import StatusText from './StatusText';
import Utils from '../libs/Utils';

const OrderStatusText = ({ order, style }) => {
  const DisplayStatus = Utils.getDisplayStatus(order);
  const StatusColor = Utils.getDisplayStatusColor(order);
  return (
    <StatusText text={DisplayStatus} colorTheme={StatusColor} style={style} />
  );
};

export default OrderStatusText;
