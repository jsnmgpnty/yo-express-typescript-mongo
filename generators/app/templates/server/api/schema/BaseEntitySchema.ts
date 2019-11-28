import * as mongoose from 'mongoose';

const BaseEntitySchema: mongoose.Schema = new mongoose.Schema({
  createdBy: String,
  createdDate: Date,
  modifiedBy: String,
  modifiedDate: Date,
});

BaseEntitySchema.pre('save', function(next) {
  const now = new Date();
  if (!this.get('createdDate')) {
    this.set('createdDate', now);
  }

  if (!this.get('modifiedDate')) {
    this.set('modifiedDate', now);
  }

  next();
});

export { BaseEntitySchema };
