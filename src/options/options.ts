const defaultOptions: ValidatorOptionsFinal = {
  email: 'name@example.org',
  sender: 'sender@example.org',
  helloName: 'localhost',

  validateRegex: true,
  validateMx: true,

  validateTypo: false,
  additionalTopLevelDomains: [],

  validateDisposable: true,
  includeDisposableDomains: [],

  validateSMTP: true,
}

type Options = {
  validateRegex: boolean
  validateMx: boolean
  validateTypo: boolean
  validateDisposable: boolean
  validateSMTP: boolean
}

type MailCheckOptions = {
  additionalTopLevelDomains?: string[]
}

type SMTPOptions = {
  sender: string
  helloName: string
  additionalTopLevelDomains: string[]
}

type DisposableOptions = {
  includeDisposableDomains?: string[]
}

export type ValidatorOptions = Partial<Options> & { email: string } & Partial<MailCheckOptions> &
  Partial<SMTPOptions> &
  Partial<DisposableOptions>
type ValidatorOptionsFinal = Options & { email: string } & MailCheckOptions & SMTPOptions & DisposableOptions

export function getOptions(emailOrOptions: string | ValidatorOptions): ValidatorOptionsFinal {
  let options: ValidatorOptionsFinal = defaultOptions

  if (typeof emailOrOptions === 'string') {
    options = { ...options, email: emailOrOptions }
  } else {
    options = { ...options, ...emailOrOptions }
  }
  return options
}
