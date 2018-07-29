import React from 'react';
import StatusText from './StatusText';
import Utils from '../libs/Utils';

const OrderStatusText = ({ order, style }) => {
  const displayStatus = Utils.getDisplayStatus(order);
  const { isUpdated, willSucceeded } = order;
  const alert = !isUpdated && willSucceeded !== undefined
  const StatusColor = Utils.getDisplayStatusColor(order);
  return (
    <StatusText text={displayStatus} colorTheme={StatusColor} style={style} alert={alert} />
  );
};

export default OrderStatusText;
