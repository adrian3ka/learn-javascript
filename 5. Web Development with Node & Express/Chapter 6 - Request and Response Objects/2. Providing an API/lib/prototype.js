String.prototype.TitleCase = function () {
  var temp = this.toLowerCase().split(' ');
  for (var i = 0; i < temp.length; i++) {
    temp[i] = temp[i].charAt(0).toUpperCase() + temp[i].slice(1); 
  }
  return temp.join(' ');
}
