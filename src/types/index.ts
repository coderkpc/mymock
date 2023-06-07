export enum NUMBER_TYPE {
    int,
    float,
}
export interface ParsedArguments {
    type: string;
    params: {
        [key: string]: any;
    };
}

export type MockOptions =
    | {
          type: 'object';
          properties: {
              [key: string]: string | MockOptions;
          };
      }
    | {
          type: 'array';
          params: {
              generator: Function | string;
              length: number;
          };
      };
