export type ScalarValue = string | number | boolean | null;

export type AmpRow = Record<string, ScalarValue>;

export type AmpRowset = AmpRow[];

export type AmpValue = ScalarValue | AmpRowset | AmpRow;

export type SubscriberAttributes = Record<string, ScalarValue>;

export interface DataExtension {
  name: string;
  rows: AmpRow[];
}

export interface EvalContext {
  variables: Map<string, AmpValue>;
  subscriberAttributes: SubscriberAttributes;
  dataExtensions: DataExtension[];
  outputBuffer: string[];
}

export interface AmpError {
  message: string;
  line?: number;
}