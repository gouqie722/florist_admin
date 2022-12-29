const mongoose = require('mongoose');
const { updateIfCurrentPlugin } = require('mongoose-update-if-current');
mongoose.plugin(updateIfCurrentPlugin);
mongoose.connect('mongodb://localhost/local', { });
mongoose.connection.on('open', () => {
  console.log('连接已打开');
});