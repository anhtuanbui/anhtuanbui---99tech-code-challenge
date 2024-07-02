var sum_to_n_a = function (n) {
  // use for loop
  var sum = 0;
  for (let i = 1; i <= n; i++) {
    sum += i;
  }
  return sum;
};

var sum_to_n_b = function (n) {
  // use recursion
  if (n === 1) return 1;
  return n + sum_to_n_b(n - 1);
};

var sum_to_n_c = function (n) {
  // use Gauss's formula
  return (n * (n + 1)) / 2;
};

console.log(sum_to_n_a(10));
console.log(sum_to_n_b(10));
console.log(sum_to_n_c(10));
