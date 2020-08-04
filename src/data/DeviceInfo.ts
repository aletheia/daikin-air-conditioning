export interface BasicInfo {
  type?: string;
  subType?: string;
  region?: string;
  name?: string;
  communicationMethod?: string;
  port?: string;
  userId?: string;
  userPassword?: string;
  macAddress?: string;
  version?: string;
}
export interface ModelInfo {
  model?: string;
  type?: string;
  mid?: string;
  setFanDirection?: string;
  fanRateSteps?: string;
  fanSilentMode?: string;
  fanRateAuto?: string;
  weeklyTimer?: string;
  hotMaximumLimitLow?: number;
  hotMaximumLimitHigh?: number;
  coldMaximumLimitLow?: number;
  coldMaximumLimitHigh?: number;
}

export interface SensorInfo {
  homeTemperature?: number;
  outsideTemperature?: number;
  homeHumidity?: number;
  error?: boolean;
}

export interface DeviceInfo extends BasicInfo, ModelInfo, SensorInfo {}
