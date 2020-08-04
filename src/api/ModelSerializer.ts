import {DeviceInfo} from '../data/DeviceInfo';

const miMapping = {
  model: 'model',
  type: 'type',
  pv: 'pv',
  cpv: 'cpv',
  mid: 'mid',
  setFanDirection: 's_fdir',
  fanRateSteps: 'frate_steps',
  fanSilentMode: 'en_frate_silent',
  fanRateAuto: 'en_frate_auto',
  weeklyTimer: 'en_scdltmr',
  hotMaximumLimitLow: 'hmlmt_l',
  hotMaximumLimitHigh: 'hmlmt_h',
  coldMaximumLimitLow: 'cmlmt_l',
  coldMaximumLimitHigh: 'cmlmt_h',
};

export const deserialize = (serialized: {
  [key: string]: string;
}): DeviceInfo => {
  const ds: DeviceInfo = {
    model: serialized[miMapping.model],
    type: serialized[miMapping.type],
    mid: serialized[miMapping.mid],
    hotMaximumLimitHigh: parseInt(serialized[miMapping.hotMaximumLimitHigh]),
    hotMaximumLimitLow: parseInt(serialized[miMapping.hotMaximumLimitLow]),
    coldMaximumLimitHigh: parseInt(serialized[miMapping.coldMaximumLimitHigh]),
    coldMaximumLimitLow: parseInt(serialized[miMapping.coldMaximumLimitLow]),
  };
  return ds;
};
