var vegetables = ['parsnip', 'potato'];
var moreVegs = ['celery', 'beetroot'];

// Merge the second array into the first one
// Equivalent to vegetables.push('celery', 'beetroot');
Array.prototype.push.apply(vegetables, moreVegs);

console.log(vegetables); // ['parsnip', 'potato', 'celery', 'beetroot']


var sports = ['soccer', 'baseball'];
var total = sports.push({sport1:'football', sport2: 'swimming', sports:[]});

console.log(sports); // ['soccer', 'baseball', 'football', 'swimming']
console.log(total);  // 4