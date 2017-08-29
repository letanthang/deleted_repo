import React from 'react';
import StatusText from './StatusText';
import Utils from '../libs/Utils';

const OrderStatusText = ({ CurrentStatus, PickDeliveryType }) => {
  const DisplayStatus = Utils.getDisplayStatus(CurrentStatus, PickDeliveryType);
  const StatusColor = Utils.getDisplayStatusColor(CurrentStatus, PickDeliveryType);
  return (
    <StatusText text={DisplayStatus} colorTheme={StatusColor} />
  );
};

export default OrderStatusText;
