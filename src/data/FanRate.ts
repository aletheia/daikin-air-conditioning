import {Data, Config, Mapping} from './Data';
import merge = require('lodash.merge');

export enum FanRateValue {
  Auto = 'A',
  Silence = 'B',
  Level_01 = 'level_01',
  Level_02 = 'level_02',
  Level_03 = 'level_03',
  Level_04 = 'level_04',
  Level_05 = 'level_05',
}

export class FanRate extends Data {
  constructor(config?: Config) {
    const mapping: Mapping = {};
    mapping[FanRateValue.Auto] = 'A';
    mapping[FanRateValue.Silence] = 'B';
    mapping[FanRateValue.Level_01] = '3';
    mapping[FanRateValue.Level_02] = '4';
    mapping[FanRateValue.Level_03] = '5';
    mapping[FanRateValue.Level_04] = '6';
    mapping[FanRateValue.Level_05] = '7';
    const classConfig = merge({mapping}, config);
    super(classConfig);
  }
}
