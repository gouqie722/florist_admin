const mongoose = require('mongoose');
const { updateIfCurrentPlugin } = require('mongoose-update-if-current');
const autoIncrement = require('mongoose-auto-increment-fix');
mongoose.plugin(updateIfCurrentPlugin);
mongoose.connect('mongodb://localhost/local', { });
autoIncrement.initialize(mongoose.connection);

mongoose.connection.on('open', () => {
  console.log('连接已打开');
});