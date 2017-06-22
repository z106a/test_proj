const util = require('util');
const phrases = { "Hello": "Привет", "world": "мир" };

function PhraseError(message) {
  this.message = message;
  Error.captureStackTrace(this, PhraseError);
}
util.inherits(PhraseError, Error);
PhraseError.prototype.name = 'PhraseError';

function HttpError(status, message) {
  this.status = status;
  this.message = message;
  Error.captureStackTrace(this, HttpError);

}
util.inherits(HttpError, Error);
HttpError.prototype.name = 'HttpError';

getPhrase = (name) => {
  if(!phrases[name]) {
    throw new PhraseError("No such phrase: " +name); // HTTP 500
  }
  return phrases[name];
}

makePage = (url) => {
  if (url != 'index.html') {
    throw new HttpError(404, "No such page."); // HTTP 404
  }
  return util.format("%s, %s!", getPhrase("Hello"), getPhrase("world"));
}

try {
  var page = makePage('index.html');
  console.log(page);
} catch (e) {
  if (e instanceof HttpError) {
    console.log(e.status, e.message, e.stack);
  } else {
    console.error("Ошибка %s\n сообщение: %s\n стек: %s", e.name, e.message, e.stack);
  }
}
