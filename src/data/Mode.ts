import {Data, Config, Mapping} from './Data';
import merge = require('lodash.merge');

export enum ModeValue {
  Auto = 'auto',
  Dehumidificator = 'dehumidifactor',
  Cold = 'cold',
  Hot = 'hot',
  Fan = 'fan',
}

export class Mode extends Data {
  constructor(config?: Config) {
    const mapping: Mapping = {};
    mapping[ModeValue.Auto] = '1';
    mapping[ModeValue.Dehumidificator] = '2';
    mapping[ModeValue.Cold] = '3';
    mapping[ModeValue.Hot] = '4';
    mapping[ModeValue.Fan] = '5';
    const classConfig = merge({mapping}, config);
    super(classConfig);
  }
}
