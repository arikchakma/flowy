export enum HandleId {
  StartSource = 'START_SOURCE',
  LogTarget = 'LOG_TARGET',

  RequestSuccessSource = 'REQUEST_SUCCESS_SOURCE',
  RequestFailureSource = 'REQUEST_FAILURE_SOURCE',
  RequestTarget = 'REQUEST_TARGET',
  RequestHeadersTarget = 'REQUEST_HEADERS_TARGET',
  RequestBodyTarget = 'REQUEST_BODY_TARGET',

  SelectSource = 'SELECT_SOURCE',
  SelectTarget = 'SELECT_TARGET',

  RepeatSource = 'REPEAT_SOURCE',
  RepeatTarget = 'REPEAT_TARGET',

  StringSource = 'STRING_SOURCE',

  NumberSource = 'NUMBER_SOURCE',

  BooleanSource = 'BOOLEAN_SOURCE',

  DelaySource = 'DELAY_SOURCE',
  DelayTarget = 'DELAY_TARGET',

  RecordSource = 'RECORD_SOURCE',

  VariableTarget = 'VARIABLE_TARGET',
  VariableSource = 'VARIABLE_SOURCE',
}
