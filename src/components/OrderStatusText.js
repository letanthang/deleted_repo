import React from 'react';
import StatusText from './StatusText';
import Utils from '../libs/Utils';

const OrderStatusText = ({ order, style }) => {
  const { status, alert } = Utils.getStatus(order);
  const StatusColor = Utils.getDisplayStatusColor(order);
  return (
    <StatusText text={status} colorTheme={StatusColor} style={style} alert={alert} />
  );
};

export default OrderStatusText;
