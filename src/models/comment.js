export default class Comment {
  constructor(data) {
    const {id, author, comment, date, emotion} = data;

    this.id = id;
    this.author = author;
    this.comment = comment;
    this.date = new Date(date);
    this.emotion = emotion;
  }

  toRAW() {
    return {
      'comment': this.comment,
      'date': this.date,
      'emotion': this.emotion,
    };
  }

  static parseComment(data) {
    return new Comment(data);
  }

  static parseComments(data) {
    return data.map(Comment.parseComment);
  }

  static clone(data) {
    return new Comment(data.toRAW());
  }
}
