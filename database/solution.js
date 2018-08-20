const mongoose = require('mongoose'),
      Schema = mongoose.Schema;

const solutionSchema = new Schema({
  body: { type: String, required: isBodyString },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  comments: [ { type: Schema.Types.ObjectId, ref: 'Comment' } ],
  upvotes: [ { type: Schema.Types.ObjectId, ref: 'User' } ],
  created: { type: Date, required: true },
  updated: { type: Date, required: true }
});

// hack to permit empty solution body
function isBodyString () {
    return typeof this.body === 'string'? false : true
}

solutionSchema.pre('validate', function(next) {
  const now = new Date();
  if (!this.created) this.created = now;
  if (!this.updated) this.updated = now;
  next();
});

const Solution = mongoose.model('Solution', solutionSchema);
module.exports = Solution;
