import {Data, Config, Mapping} from './Data';
import merge = require('lodash.merge');

export enum FanDirectionValue {
  No_Motion = 'no_motion',
  V_Wings = 'vertical_wings',
  H_Wings = 'horizontal_wings',
  HV_Wings = 'horizontal_and_vertical_wings',
}

export class FanDirection extends Data {
  constructor(config?: Config) {
    const mapping: Mapping = {};
    mapping[FanDirectionValue.No_Motion] = '0';
    mapping[FanDirectionValue.V_Wings] = '1';
    mapping[FanDirectionValue.H_Wings] = '2';
    mapping[FanDirectionValue.HV_Wings] = '3';
    const classConfig = merge({mapping}, config);
    super(classConfig);
  }
}
