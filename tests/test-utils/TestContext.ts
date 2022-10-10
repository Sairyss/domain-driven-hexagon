/**
 * Used for setting a context data in cucumber tests
 */
export class TestContext<Context> {
  context: Context; // test specific context
  latestResponse: unknown; // get a latest response
  latestRequestDto: unknown; // set a request dto to send

  constructor() {
    this.context = {} as any;
  }
}
