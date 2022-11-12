export class Task {
  constructor(
    public name: string,
    public status: string,
    public comments: string[],
    public createdDate: Date,
    public updatedAt: Date,
    public _id: string,
    public archivedDate: string
  ) {}
}