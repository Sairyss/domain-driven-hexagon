export class DeleteUserCommand {
  constructor(props: DeleteUserCommand) {
    this.userId = props.userId;
  }

  readonly userId: string;
}
